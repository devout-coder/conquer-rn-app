import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Share,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import globalStyles from '../globalStyles';
import Ripple from 'react-native-material-ripple';
import firestore from '@react-native-firebase/firestore';
import {navbarContext, userContext} from '../context';
import FriendConfirmationModal from '../Components/FriendConfirmationModal';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Toast from '../Components/Toast';
import Aes from 'react-native-aes-crypto';
import {cipherKey} from '../sensitive-stuff';
import {ScrollView} from 'react-native-gesture-handler';
import IonIcon from '../customIcons/IonIcon';
import MaterialIcon from '../customIcons/MaterialIcon';
import EachFriend from '../Components/EachFriend';

const Friends = ({navigation, route}) => {
  let {nav, setNav} = useContext(navbarContext);
  let user = useContext(userContext);
  const [friendId, setFriendId] = useState(null);
  const [friendName, setFriendName] = useState(null);
  const [friendsConfirmModalVisible, setFriendsConfirmModalVisible] =
    useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Main');
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
  });

  useEffect(() => {
    setNav(navigation);
    setFriendInfo();
  }, [route.params]);

  const setFriendInfo = async () => {
    if (route.params != undefined) {
      let friendId = route.params['friendInfo'];
      setFriendId(friendId);
      let doc = await firestore().collection('users').doc(friendId).get();
      setFriendName(doc.get('userName'));
      setFriendsConfirmModalVisible(true);
    }
  };

  const onShare = async () => {
    let urlData;
    try {
      const result = await Share.share({
        message: `Tap this link to accept ${user.displayName}'s Conquer friend request\nhttps://conquer-goals.netlify.app/add-friend/${user.uid}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const computeFriends = (oldFriends, friendId) => {
    let newFriends;

    if (oldFriends != undefined) {
      //doc in friends collection is present for this user
      if (oldFriends.includes(friendId)) {
        //the guy whose request you are trying to process is already your friend
        newFriends = oldFriends;
      } else {
        newFriends = [...oldFriends, friendId];
      }
    } else {
      //no doc in friends collection for this user
      newFriends = [friendId];
    }
    return newFriends;
  };

  const addFriend = async () => {
    let oldFriendsOfUser = (
      await firestore().collection('friends').doc(user.uid).get()
    ).get('friends');
    let oldFriendsOfAllegedFriend = (
      await firestore().collection('friends').doc(friendId).get()
    ).get('friends');

    let newFriendsOfUser = computeFriends(oldFriendsOfUser, friendId);
    let newFriendsOfAllegedFriend = computeFriends(
      oldFriendsOfAllegedFriend,
      user.uid,
    );

    firestore()
      .collection('friends')
      .doc(user.uid)
      .set({friends: newFriendsOfUser});
    firestore()
      .collection('friends')
      .doc(friendId)
      .set({friends: newFriendsOfAllegedFriend});

    setFriendsConfirmModalVisible(false);
  };

  const [friendsLoading, setFriendsLoading] = useState(true);
  const [allFriends, setAllFriends] = useState([]);

  class fetchAllFriendsUser {
    constructor() {
      this.friends = firestore()
        .collection('friends')
        .doc(user.uid)
        .onSnapshot(snap => {
          if (snap.get('friends') != undefined) {
            this.fetchFriendsDetails(snap.get('friends'));
          } else {
            setFriendsLoading(false);
          }
        });
    }
    fetchFriendsDetails(friends) {
      let friendsDetails = [];
      friends.forEach(friendId => {
        let obj = {};
        firestore()
          .collection('users')
          .doc(friendId)
          .get()
          .then(doc => {
            obj['friendId'] = friendId;
            obj['friendName'] = doc.get('userName');
            obj['friendPhotoUrl'] = doc.get('photoURL');
            friendsDetails.push(obj);
            if (friendsDetails.length == friends.length) {
              setAllFriends(friendsDetails);
              setFriendsLoading(false);
            }
          });
      });
    }
    unsubscribe() {
      return this.friends();
    }
  }

  useEffect(() => {
    if (user) {
      let friends = new fetchAllFriendsUser();

      return () => {
        friends.unsubscribe();
      };
    }
  }, []);

  return (
    <View style={globalStyles.overallBackground}>
      <View style={styles.mainContainer}>
        {user != null && friendsConfirmModalVisible && user.uid != friendId ? (
          <FriendConfirmationModal
            modalVisible={friendsConfirmModalVisible && user.uid != friendId}
            closeModal={() => setFriendsConfirmModalVisible(false)}
            confirmedUser={() => addFriend()}
            friendName={friendName}
          />
        ) : (
          <></>
        )}
        <Text style={[styles.normalText, {marginTop: 10}]}>
          Add friends to create common tasks with them
        </Text>
        <Ripple
          rippleDuration={300}
          rippleColor="#ffffff"
          onPress={onShare}
          rippleContainerBorderRadius={5}>
          <Text style={styles.shareLink}>Share friendship link</Text>
        </Ripple>
        {!friendsLoading ? (
          <View style={styles.friendsContainer}>
            {allFriends.length == 0 ? (
              <Text style={styles.noFriendsText}>No friends added yet!</Text>
            ) : (
              <Text style={styles.friendsText}>Your friends</Text>
            )}
            <View style={styles.friendsList}>
              {allFriends.map((friend, index) => (
                <EachFriend key={index} friend={friend} />
              ))}
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#00ff00" />
        )}
      </View>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  normalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#ffffff',
  },
  mainContainer: {
    // backgroundColor: '#ffffff',
    width: '92%',
    marginTop: 20,
  },
  shareLink: {
    color: '#eada76',
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
    margin: 15,
    fontSize: 21,
  },
  friendsList: {
    flexDirection: 'column',
    // backgroundColor: '#ffffff',
    padding: 10,
    alignItems: 'flex-start',
  },

  friendsText: {
    fontFamily: 'Poppins-SemiBold',
    marginTop: 18,
    fontSize: 22,
    // position:"absolute",
    color: '#c6c4c4',
  },
  noFriendsText: {
    fontFamily: 'Poppins-SemiBold',
    // margin: 18,
    marginTop: 40,
    alignSelf: 'center',
    fontSize: 23,
    color: '#ffc0cb',
  },
});

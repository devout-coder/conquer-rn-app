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

  const encryptData = (text, key) => {
    return Aes.randomKey(16).then(iv => {
      return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
        cipher,
        iv,
      }));
    });
  };

  const decryptData = (encryptedData, key) =>
    Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc');

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
      let friendInfo = route.params['friendInfo'];
      let [cipher, iv] = friendInfo.split('~');
      let decryptedText = await decryptData({cipher, iv}, cipherKey);
      setFriendId(decryptedText);
      let doc = await firestore().collection('users').doc(decryptedText).get();
      setFriendName(doc.get('userName'));
      setFriendsConfirmModalVisible(true);
    }
  };

  const onShare = async () => {
    let urlData;
    try {
      // encryptData(
      //   ,
      // ).then(({cipher, iv}) => {
      //   urlData = cipher + '~' + iv;
      // });
      const {cipher, iv} = await encryptData(`${user.uid}`, cipherKey);
      urlData = cipher + '~' + iv;
      const result = await Share.share({
        message: `Tap this link to accept ${user.displayName}'s Conquer friend request\nhttps://conquer-goals.netlify.app/add-friend/${urlData}`,
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
  // console.log('heu')
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
          // snap.docs.map(each => console.log(each));
          setAllFriends(
            snap.get('friends') != undefined ? snap.get('friends') : [],
          );
          setFriendsLoading(false);
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
            <Text style={styles.friendsText}>Your friends</Text>
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
});

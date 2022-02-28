import {StyleSheet, Text, View, BackHandler, Share} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import globalStyles from '../globalStyles';
import Ripple from 'react-native-material-ripple';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {navbarContext, userContext} from '../context';
import FriendConfirmationModal from '../Components/FriendConfirmationModal';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const Friends = ({navigation, route}) => {
  let {nav, setNav} = useContext(navbarContext);
  let user = useContext(userContext);
  const [friendName, setFriendName] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [friendsConfirmModalVisible, setFriendsConfirmModalVisible] =
    useState(false);

  // console.log(friendName);
  // console.log('user is ', user);

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
    if (route.params != undefined) {
      setFriendId(route.params['friendInfo'].split(',')[0]);
      setFriendName(route.params['friendInfo'].split(',')[1]);
      setFriendsConfirmModalVisible(true);
    }
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Tap this link to accept ${user.displayName}'s Conquer friend request\nhttps://conquer-goals.netlify.app/add-friend/${user.uid},${user.displayName}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('shared with activity type of result.activityType');
        } else {
          // shared
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const addFriend = () => {
    firestore()
      .collection('friends')
      .doc(user.uid)
      .get()
      .then(data => {
        let oldFriends = data.get('friends');
        let newFriends;
        // console.log(oldFriends);
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
        firestore()
          .collection('friends')
          .doc(user.uid)
          .set({friends: newFriends});
      });
  };

  return (
    <View style={globalStyles.overallBackground}>
      <View style={styles.mainContainer}>
        {user != null ? (
          <FriendConfirmationModal
            modalVisible={friendsConfirmModalVisible && user.uid != friendId}
            closeModal={() => setFriendsConfirmModalVisible(false)}
            confirmedUser={() => addFriend()}
            friendName={friendName}
          />
        ) : (
          <></>
        )}
        <Text style={styles.normalText}>
          Add friends to create common tasks with them
        </Text>
        <Ripple
          rippleDuration={300}
          rippleColor="#ffffff"
          onPress={onShare}
          rippleContainerBorderRadius={5}>
          <Text style={styles.shareLink}>Share friendship link</Text>
        </Ripple>
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
  },
  shareLink: {
    color: '#eada76',
    alignSelf: 'center',
    marginTop: 9,
    fontFamily: 'Poppins-Medium',
    fontSize: 21,
  },
});

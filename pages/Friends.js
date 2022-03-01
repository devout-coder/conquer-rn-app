import {StyleSheet, Text, View, BackHandler, Share} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import globalStyles from '../globalStyles';
import Ripple from 'react-native-material-ripple';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {navbarContext, userContext} from '../context';
import FriendConfirmationModal from '../Components/FriendConfirmationModal';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Toast from '../Components/Toast';
import Aes from 'react-native-aes-crypto';
import {cipherKey} from '../sensitive-stuff';

const Friends = ({navigation, route}) => {
  let {nav, setNav} = useContext(navbarContext);
  let user = useContext(userContext);
  const [friendName, setFriendName] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [friendPhotoUrl, setFriendPhotoUrl] = useState(null);

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
    if (route.params != undefined) {
      let friendInfo = route.params['friendInfo'];
      let [cipher, iv] = friendInfo.split('~');
      decryptData({cipher, iv}, cipherKey)
        .then(decryptedText => {
          let [friendId, friendName, friendPhotoUrl] =
            decryptedText.split('~~$');
          friendName = friendName.replace('~~~', ' ');
          friendPhotoUrl = decodeURIComponent(friendPhotoUrl);
          setFriendId(friendId);
          setFriendName(friendName);
          setFriendPhotoUrl(friendPhotoUrl);
        })
        .catch(error => {
          // console.log(error);
        });
      setFriendsConfirmModalVisible(true);
    }
  }, []);

  const onShare = async () => {
    let urlData;
    try {
      // encryptData(
      //   ,
      // ).then(({cipher, iv}) => {
      //   urlData = cipher + '~' + iv;
      // });
      const {cipher, iv} = await encryptData(
        `${user.uid}~~$${user.displayName.replace(
          ' ',
          '~~~',
        )}~~$${encodeURIComponent(user.photoURL)}`,
        cipherKey,
      );
      urlData = cipher + '~' + iv;
      const result = await Share.share({
        message: `Tap this link to accept ${user.displayName}'s Conquer friend request\nhttps://conquer-goals.netlify.app/add-friend/${urlData}`,
      });
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //     // console.log('shared with activity type of result.activityType');
      //   } else {
      //     // shared
      //     // console.log('shared');
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      //   // console.log('dismissed');
      // }
    } catch (error) {
      alert(error.message);
    }
  };

  const arrayContainsObject = (arr, obj) => {
    // return (obj1.friendId = obj2.friendId);
    let doesContain = false;
    arr.forEach(val => {
      if (val.friendId == obj.friendId) {
        doesContain = true;
      }
    });
    return doesContain;
  };

  const computeFriends = (oldFriends, friendId, friendName, friendPhotoUrl) => {
    let newFriends;
    let infoToStore = {
      friendId: friendId,
      friendName: friendName,
      friendPhotoUrl: friendPhotoUrl,
    };
    if (oldFriends != undefined) {
      //doc in friends collection is present for this user
      if (arrayContainsObject(oldFriends, infoToStore)) {
        //the guy whose request you are trying to process is already your friend
        newFriends = oldFriends;
      } else {
        newFriends = [...oldFriends, infoToStore];
      }
    } else {
      //no doc in friends collection for this user
      newFriends = [infoToStore];
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

    let newFriendsOfUser = computeFriends(
      oldFriendsOfUser,
      friendId,
      friendName,
      friendPhotoUrl,
    );
    let newFriendsOfAllegedFriend = computeFriends(
      oldFriendsOfAllegedFriend,
      user.uid,
      user.displayName,
      user.photoURL,
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

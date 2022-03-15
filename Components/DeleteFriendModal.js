import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import Modal from 'react-native-modal';
import Ripple from 'react-native-material-ripple';
import {setSyntheticLeadingComments} from 'typescript';
import {userContext} from '../context';
import firestore from '@react-native-firebase/firestore';

const DeleteFriendModal = ({modalVisible, closeModal, friend}) => {
  let user = useContext(userContext);

  const deleteFriend = async () => {
    closeModal();
    let oldFriendsOfUser = (
      await firestore().collection('friends').doc(user.uid).get()
    ).get('friends');
    let oldFriendsOfFriend = (
      await firestore().collection('friends').doc(friend.friendId).get()
    ).get('friends');
    let updatedFriendsOfUser = oldFriendsOfUser.filter(eachFriend => {
      return eachFriend != friend.friendId;
    });
    let updatedFriendsOfFriend = oldFriendsOfFriend.filter(eachFriend => {
      return eachFriend != user.uid;
    });
    firestore()
      .collection('friends')
      .doc(user.uid)
      .set({friends: updatedFriendsOfUser});
    firestore()
      .collection('friends')
      .doc(friend.friendId)
      .set({friends: updatedFriendsOfFriend});
  };

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onBackButtonPress={closeModal}>
      <View style={styles.modal}>
        <Text style={styles.confirmText}>
          Are you sure that you want to remove {friend.friendName} as your
          friend? You won't be able to share tasks with them.
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.noText}>No, take me back.</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteFriend}>
            <Text style={styles.yeahText}>Yeah I want that!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteFriendModal;

const styles = StyleSheet.create({
  modal: {
    flex: 0.33,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 13,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    // width: '95%',
    height: 80,
    // backgroundColor: 'black',
    alignSelf: 'flex-end',
    justifyContent: 'space-around',
    // backgroundColor:'#000000'
  },
  confirmText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  noText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#f50057',
  },
  yeahText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#3f51b5',
  },
});

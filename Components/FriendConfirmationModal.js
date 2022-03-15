import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import Ripple from 'react-native-material-ripple';
import auth from '@react-native-firebase/auth';

const FriendConfirmationModal = ({
  modalVisible,
  closeModal,
  confirmedUser,
  friendName,
}) => {
  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onBackdropPress={closeModal}
      deviceHeight={1000}
      onBackButtonPress={closeModal}>
      <View style={styles.modal}>
        <Text style={styles.confirmText}>
          {friendName} wants to be your friend. Once you accept this request you
          will be able to share tasks with this individual.
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.noText}>No, sounds like a bad idea.</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmedUser}>
            <Text style={styles.yeahText}>Yeah cool let's do it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FriendConfirmationModal;

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
    width: '95%',
    height: 80,
    // backgroundColor: 'black',
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

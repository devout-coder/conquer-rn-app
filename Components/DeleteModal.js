import React, {useContext} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import {userContext} from '../context';

const DeleteModal = ({modalVisible, closeModal, deleteTodo}) => {
  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      deviceHeight={1000}
      animationOut="fadeOutDown">
      <View style={styles.modal}>
        <Text style={styles.deleteText}>
          If you delete this task it will also be deleted for all the users this
          task is shared with. Are you sure you want to do that?
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.noButton} onPress={closeModal}>
            <Text style={styles.noText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.yeahButton} onPress={deleteTodo}>
            <Text style={styles.yeahText}>Yeah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  modal: {
    // flex: 0.17,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 13,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'flex-end',
    // backgroundColor:'#000000'
  },
  deleteText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  noButton: {
    marginRight: 20,
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

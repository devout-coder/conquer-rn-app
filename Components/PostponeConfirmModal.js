import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import Modal from 'react-native-modal';
import Ripple from 'react-native-material-ripple';
import {userContext} from '../context';
import firestore from '@react-native-firebase/firestore';

const PostponeConfirmModal = ({
  modalVisible,
  closeModal,
  postponeTodo,
  timeType,
}) => {
  const correctTime = () => {
    if (timeType == 'daily') {
      return 'day';
    } else {
      return timeType;
    }
  };
  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      deviceHeight={1000}
      onBackButtonPress={closeModal}>
      <View style={styles.modal}>
        <Text style={styles.confirmText}>
          Postponing the task will make it appear with todos of next
          {correctTime()}. Do you want to do it?
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.noText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={postponeTodo}>
            <Text style={styles.yeahText}>Yeah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PostponeConfirmModal;

const styles = StyleSheet.create({
  modal: {
    flex: 0.16,
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
    // width: '95%',
    height: 80,
    // width: '20%',
    // backgroundColor: 'black',
    // alignSelf: 'flex-end',
    justifyContent: 'flex-end',
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
    marginLeft: 20,
    color: '#3f51b5',
  },
});

import React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';

const DeleteModal = ({
  modalVisible,
  closeModal,
  reloadTodos,
  allTodos,
  index,
  id,
}) => {

  function deleteTodoManagePri(newIndex) {
    //this function manages index of todos below a certain todo in case i delete it
    // console.log(allTodos)
    allTodos.forEach((each, ind) => {
      if (ind >= newIndex) {
        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: ind - 1,
          })
          .catch(error => console.log(error));
      }
    });
  }

  function deleteTodo() {
    //this func deletes that particular todo
    closeModal();
    deleteTodoManagePri(index);
    firestore()
      .collection('todos')
      .doc(id)
      .delete()
      .then(() => {
        reloadTodos();
      })
      .catch(error => console.log(error));
  }

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown">
      <View style={styles.modal}>
        <Text style={styles.deleteText}>
          Are you sure you want to delete this item from your list?
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
    flex: 0.17,
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

import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TodoModal = ({
  modalOpen,
  setModalOpen,
  id,
  taskName,
  taskDesc,
  priority,
  finished,
  time,
  index,
  timeType,
}) => {
  const [todoTaskName, setTodoTaskName] = useState(taskName);
  const [todoTaskDesc, setTodoTaskDesc] = useState(taskDesc);

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  function provideKeyboardStatus() {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }

  useEffect(() => {
    provideKeyboardStatus();
  }, []);

  return (
    <Modal isVisible={modalOpen} style={styles.modal}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalOpen(false)}>
          <Icon name="close" color="#ffffff" size={27} />
        </TouchableOpacity>
        <TextInput
          defaultValue={todoTaskName}
          onChangeText={newVal => setTodoTaskName(newVal)}
          style={styles.taskName}
          placeholder="Task Name"
          placeholderTextColor="#6C6C6C"
          multiline={true}
          numberOfLines={2}
          maxLength={40}
        />
        <TextInput
          defaultValue={todoTaskDesc}
          onChangeText={newVal => setTodoTaskDesc(newVal)}
          style={[styles.taskDesc, {height: keyboardStatus ? 240 : 430}]}
          placeholder="Task Description"
          placeholderTextColor="#6C6C6C"
          multiline={true}
          numberOfLines={200}
        />
      </View>
    </Modal>
  );
};

export default TodoModal;

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1B1B22',
    width: '110%',
    height: '100%',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 50,
    padding: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  taskName: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    textAlignVertical: 'top',
    height: 90,
    padding: 0,
    fontSize: 28,
    marginTop: 20,
  },
  taskDesc: {
    fontSize: 25,
    fontFamily: 'Poppins-Medium',
    color: '#F1D7D7',
    padding: 0,
    marginTop: 25,
    textAlignVertical: 'top',
  },
});

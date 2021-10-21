import React, {useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import PrioritySelector from './PrioritySelector';
import DeleteModal from './DeleteModal';

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
  reloadTodos,
  unfinishedTodos,
}) => {
  const [todoTaskName, setTodoTaskName] = useState(taskName);
  const [todoTaskDesc, setTodoTaskDesc] = useState(taskDesc);
  const [todoTaskPriority, setTodoTaskPriority] = useState(priority);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const toggleModal = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };

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
          <Icon name="close" color="#ffffff" size={30} />
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
        <View style={[styles.bottomBar, {bottom: keyboardStatus ? -190 : 0}]}>
          <PrioritySelector
            style={styles.prioritySelector}
            priority={todoTaskPriority}
            changePriority={setTodoTaskPriority}
          />
          <TouchableOpacity style={styles.deleteIcon} onPress={toggleModal}>
            <Icon name="delete" size={32} color="#ffffff" />
          </TouchableOpacity>
          <DeleteModal
            modalVisible={deleteModalVisible}
            closeModal={toggleModal}
            reloadTodos={reloadTodos}
            unfinishedTodos={unfinishedTodos}
            index={index}
            id={id}
          />
          <TouchableOpacity style={styles.saveIcon}>
            <Icon name="save" size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
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
    // backgroundColor:"#ffffff",
    textAlignVertical: 'top',
  },
  bottomBar: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  prioritySelector: {
    // marginRight: 'auto',
  },
  deleteIcon: {
    // marginRight: jauto',
    position: 'absolute',
    right: 55,
  },
  saveIcon: {
    position: 'absolute',
    right: 0,
    // marginRight: 'auto',
  },
});

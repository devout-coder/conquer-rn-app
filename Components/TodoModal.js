import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
  console.log(index)
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

  function priPosition() {
    //this function computes the appropriate position for any new todo of each priority
    //it returns an array something like this [[3,1], [2, 4], [1, 8], [0, 10]]
    //it means the  array has 1 todo already exisiting at 0 position so appropriate position for new element of priority 3 is 1 and so on
    let reqPos = [];
    for (let i = 3; i >= 0; i--) {
      if (unfinishedTodos.length != 0) {
        for (let index = 0; index < unfinishedTodos.length; index++) {
          if (i > unfinishedTodos[index].priority) {
            reqPos.push([i, index]);
            break;
          } else if (index == unfinishedTodos.length - 1) {
            reqPos.push([i, unfinishedTodos.length]);
          }
        }
      } else {
        reqPos.push([i, 0]);
      }
    }
    return reqPos;
  }

  const [priChanged, setPriChanged] = useState(false);
  const initialRender = useRef(true);
  //useRef is used to store data which doesn't change even on re-render

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      //once its set false even though the component re-renders its value be false
    } else {
      setPriChanged(true);
    }
  }, [todoTaskPriority]);

  function decidePosition(priority) {
    //this function takes a priority and returns the sutiable index for a new element of that priority
    let reqIndex;
    priPosition().forEach(each => {
      if (priority == each[0]) {
        reqIndex = each[1];
      }
    });
    return reqIndex;
  }

  function newTodoManagePri(newIndex) {
    // it increases the index of all todos which have index value equal to or more than newIndex
    unfinishedTodos.forEach((each, index) => {
      if (index >= newIndex) {
        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: index + 1,
          })
          .catch(error => console.log(error));
      }
    });
  }

  function existingTodoChangePri() {
    //this changes the priority of all todos in between the todo and its new position

    let initialPos = index;
    let finalPos = decidePosition(todoTaskPriority);
    if (initialPos < finalPos) {
      unfinishedTodos.forEach((each, index) => {
        if (index > initialPos && index < finalPos) {
          // this reduces index of all items in between initial and final position by 1
          firestore()
            .collection('todos')
            .doc(each.id)
            .update({
              index: index - 1,
            })
            .catch(error => console.log(error));
        }
      });
    } else if (initialPos > finalPos) {
      // this increases index of all items in between initial and final position by 1
      unfinishedTodos.forEach((each, index) => {
        if (index < initialPos && index >= finalPos) {
          firestore()
            .collection('todos')
            .doc(each.id)
            .update({
              index: index + 1,
            })
            .catch(error => console.log(error));
        }
      });
    }
  }
  function saveTodo() {
    if (id === undefined) {
      //makes a new todo if the id prop is empty str which means that no particular todo is opened

      newTodoManagePri(decidePosition(todoTaskPriority));
      let todo = {
        taskName: todoTaskName,
        taskDesc: todoTaskDesc,
        time: time,
        timeType: timeType,
        priority: todoTaskPriority,
        user: auth().currentUser.uid,
        finished: false,
        index: decidePosition(todoTaskPriority),
      };
      firestore().collection('todos').add(todo);
    } else {
      //modifies the properties of original todo if some exisiting todo is opened in modal
      if (priChanged) {
        existingTodoChangePri();
      }
      firestore()
        .collection('todos')
        .doc(id)
        .set(
          {
            taskName: todoTaskName,
            taskDesc: todoTaskDesc,
            priority: todoTaskPriority,
            index:
              //props.taskIndex is the inital position and decidePosition(taskPri) gives the final position
              //!  DON'T TOUCH IT PLEASE this piece of code was absolutely mind fucking
              priChanged && index < decidePosition(todoTaskPriority)
                ? decidePosition(todoTaskPriority) - 1
                : priChanged && index > decidePosition(todoTaskPriority)
                ? decidePosition(todoTaskPriority)
                : index,
          },
          {merge: true},
        );
      setPriChanged(false);
    }
    setModalOpen(false)
    reloadTodos();
  }

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
          <TouchableOpacity style={styles.saveIcon} onPress={saveTodo}>
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

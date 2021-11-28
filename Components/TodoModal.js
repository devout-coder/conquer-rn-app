import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import PrioritySelector from './PrioritySelector';
import DeleteModal from './DeleteModal';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {fullMonths} from '../Components/IncompleteTodosSidebar';
import {months} from '../Components/Calendar';
import {weekMonths} from './WeekCalendar';
import Toast from './Toast';

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
  timesPostponed,
  reloadTodos,
  allTodos,
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

  function postponeText() {
    let times = timesPostponed == 1 ? '1 time' : `${timesPostponed} times`;
    return `postponed ${times}...`;
  }

  const [loadedTodos, setLoadedTodos] = useState(null);
  function loadUnfinishedTodos() {
    firestore()
      .collection('todos')
      .where('user', '==', auth().currentUser.uid)
      .where('time', '==', time)
      .orderBy('index', 'asc')
      .get()
      .then(snap => {
        let all = [];
        snap.docs.map(each => {
          let eachdict = {
            id: each.id,
            taskName: each.get('taskName'),
            taskDesc: each.get('taskDesc'),
            priority: each.get('priority'),
            finished: each.get('finished'),
            time: each.get('time'),
            index: each.get('index'),
            timeType: each.get('timeType'),
            timesPostponed: each.get('timesPostponed'),
          };
          all.push(eachdict);
        });
        setLoadedTodos(all);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  const [futureTodos, setFutureTodos] = useState([]);

  function loadFutureTodos() {
    if (timeType != 'longTerm') {
      firestore()
        .collection('todos')
        .where('user', '==', auth().currentUser.uid)
        .where('time', '==', nextTime())
        .orderBy('priority', 'desc')
        .get()
        .then(snap => {
          let futureTodos = [];
          snap.docs.map(each => {
            let eachdict = {
              id: each.id,
              taskName: each.get('taskName'),
              taskDesc: each.get('taskDesc'),
              priority: each.get('priority'),
              finished: each.get('finished'),
              time: each.get('time'),
              index: each.get('index'),
              timeType: each.get('timeType'),
              timesPostponed: each.get('timesPostponed'),
            };
            futureTodos.push(eachdict);
          });
          setFutureTodos(futureTodos);
        });
    }
  }

  function reverseObject(object) {
    let tempObj = {};
    for (let key in object) {
      tempObj[object[key]] = key;
    }
    return tempObj;
  }

  function nextTime() {
    if (timeType == 'year') {
      return parseInt(time) + 1;
    } else if (timeType == 'month') {
      let month = time.split(' ')[0];
      let year = time.split(' ')[1];
      if (month == 'December') {
        let nextYear = parseInt(year) + 1;
        return 'January ' + nextYear.toString();
      } else {
        return months[fullMonths.indexOf(month) + 1] + ' ' + year;
      }
    } else if (timeType == 'week') {
      let lastDay = time.split('-')[1];
      let [day, month, year] = lastDay.split(' ');
      month = parseInt(reverseObject(weekMonths)[month]) + 1;
      month = month.toString();
      if (day.length == 1) {
        day = '0' + day;
      }
      if (month.length == 1) {
        month = '0' + month;
      }
      let thisDay = new Date(`${year}-${month}-${day}`);
      let nextDay = new Date(thisDay);
      nextDay.setDate(thisDay.getDate() + 1);
      let newLastDay = new Date(thisDay);
      newLastDay.setDate(thisDay.getDate() + 7);
      return `${nextDay.getDate()} ${
        weekMonths[nextDay.getMonth()]
      } ${nextDay.getFullYear()}-${newLastDay.getDate()} ${
        weekMonths[newLastDay.getMonth()]
      } ${newLastDay.getFullYear()}`;
    } else if (timeType == 'daily') {
      let [day, month, year] = time.split('/');
      if (day.length == 1) {
        day = '0' + day;
      }
      if (month.length == 1) {
        month = '0' + month;
      }
      let thisDay = new Date(`${year}-${month}-${day}`);
      let nextDay = new Date(thisDay);
      nextDay.setDate(thisDay.getDate() + 1);
      day = nextDay.getDate();
      month = parseInt(nextDay.getMonth()) + 1;
      year = nextDay.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  useEffect(() => {
    loadFutureTodos();
    if (allTodos == undefined) {
      loadUnfinishedTodos();
    }
  }, []);

  useEffect(() => {
    provideKeyboardStatus();
  }, []);

  function priPosition(todos) {
    //this function computes the appropriate position for any new todo of each priority
    //it returns an array something like this [[3,1], [2, 4], [1, 8], [0, 10]]
    //it means the  array has 1 todo already exisiting at 0 position so appropriate position for new element of priority 3 is 1 and so on
    let reqPos = [];
    for (let i = 3; i >= 0; i--) {
      if (todos.length != 0) {
        for (let index = 0; index < todos.length; index++) {
          if (i > todos[index].priority) {
            reqPos.push([i, index]);
            break;
          } else if (index == todos.length - 1) {
            reqPos.push([i, todos.length]);
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

  function decidePosition(todos, priority) {
    //this function takes a priority and returns the sutiable index for a new element of that priority
    let reqIndex;
    priPosition(todos).forEach(each => {
      if (priority == each[0]) {
        reqIndex = each[1];
      }
    });
    return reqIndex;
  }

  function newTodoManagePri(newIndex) {
    // it increases the index of all todos which have index value equal to or more than newIndex

    let todos = allTodos != undefined ? allTodos : loadedTodos;
    todos.forEach((each, index) => {
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
    let todos = allTodos != undefined ? allTodos : loadedTodos;
    let initialPos = index;
    let finalPos = decidePosition(todos, todoTaskPriority);
    if (initialPos < finalPos) {
      todos.forEach((each, index) => {
        if (index > initialPos && index <= finalPos) {
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
      todos.forEach((each, index) => {
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

  function updateFutureTodosIndex(presentTodos, futureTodos, newIndex) {
    futureTodos.forEach(each => {
      if (each.index >= newIndex) {
        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: each.index + 1,
          })
          .catch(error => console.log(error));
      }
    });
    presentTodos.forEach(each => {
      if (each.index >= index) {
        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: each.index - 1,
          })
          .catch(error => console.log(error));
      }
    });
  }

  function closeModal() {
    setModalOpen(false);
    setTimeout(() => {
      setTodoTaskName('');
      setTodoTaskDesc('');
      setTodoTaskPriority('0');
    }, 1000);
  }

  function postponeTodo() {
    let presentTodos = allTodos != undefined ? allTodos : loadedTodos;
    let newIndex = decidePosition(futureTodos, todoTaskPriority);
    updateFutureTodosIndex(presentTodos, futureTodos, newIndex);
    firestore()
      .collection('todos')
      .doc(id)
      .update({
        time: nextTime(),
        index: newIndex,
        timesPostponed: timesPostponed != undefined ? timesPostponed + 1 : 1,
      })
      .then(() => {
        closeModal();
        reloadTodos();
      });
  }

  function saveTodo() {
    let todos = allTodos != undefined ? allTodos : loadedTodos;
    let newIndex = decidePosition(todos, todoTaskPriority);
    if (id === undefined) {
      //makes a new todo if the id prop is empty str which means that no particular todo is opened
      newTodoManagePri(newIndex);
      let todo = {
        taskName: todoTaskName,
        taskDesc: todoTaskDesc,
        time: time,
        timeType: timeType,
        priority: todoTaskPriority,
        user: auth().currentUser.uid,
        finished: false,
        index: newIndex,
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
              //props.taskIndex is the inital position and newIndex gives the final position
              //!  DON'T TOUCH IT PLEASE this piece of code was absolutely mind fucking
              priChanged && index < newIndex
                ? newIndex - 1
                : priChanged && index > newIndex
                ? newIndex
                : index,
          },
          {merge: true},
        );
      setPriChanged(false);
    }
    closeModal();
    reloadTodos();
  }

  return (
    <Modal isVisible={modalOpen} style={styles.modal}>
      <View style={{flex: 1}}>
        <View style={styles.topbar}>
          {timesPostponed != undefined ? (
            <Text style={styles.postponeText}>{postponeText()}</Text>
          ) : (
            <View></View>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onLongPress={() => Toast('Close without saving')}
            onPress={() => closeModal()}>
            <Icon name="close" color="#ffffff" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.lowerModal}>
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
            style={[styles.taskDesc, {}]}
            placeholder="Task Description"
            placeholderTextColor="#6C6C6C"
            multiline={true}
            numberOfLines={200}
          />
          <View
            style={[
              styles.bottomBar,
              {
                bottom: keyboardStatus ? -180 : -40,
              },
            ]}>
            <PrioritySelector
              style={styles.prioritySelector}
              priority={todoTaskPriority}
              changePriority={setTodoTaskPriority}
            />
            {id != undefined && timeType != 'longTerm' ? (
              <TouchableOpacity
                style={styles.postponeIcon}
                onPress={postponeTodo}
                onLongPress={() => Toast('Postpone')}>
                <Icon
                  name="subdirectory-arrow-right"
                  color="#ffffff"
                  size={28}
                />
              </TouchableOpacity>
            ) : (
              <View></View>
            )}
            {id != undefined ? (
              <TouchableOpacity
                style={styles.deleteIcon}
                onLongPress={() => Toast('Delete')}
                onPress={toggleModal}>
                <Icon name="delete" size={32} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <View></View>
            )}
            <DeleteModal
              modalVisible={deleteModalVisible}
              closeModal={toggleModal}
              reloadTodos={reloadTodos}
              allTodos={allTodos != undefined ? allTodos : loadedTodos}
              index={index}
              id={id}
            />
            <TouchableOpacity
              style={styles.saveIcon}
              onPress={saveTodo}
              onLongPress={() => Toast('Save')}>
              <Icon name="save" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>
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
  topbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  lowerModal: {
    flex: 1,
  },
  taskName: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    textAlignVertical: 'top',
    height: 90,
    padding: 0,
    fontSize: 28,
    marginTop: 20,
    // backgroundColor: '#ffffff',
  },
  taskDesc: {
    fontSize: 25,
    fontFamily: 'Poppins-Medium',
    color: '#F1D7D7',
    padding: 0,
    marginTop: 0,
    textAlignVertical: 'top',
    lineHeight: 42,
    height: '70%',
  },
  postponeText: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Medium',
    position: 'relative',
    color: '#595959',
  },
  bottomBar: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  postponeIcon: {
    position: 'absolute',
    right: 110,
  },
  deleteIcon: {
    position: 'absolute',
    right: 55,
  },
  saveIcon: {
    position: 'absolute',
    right: 0,
  },
});

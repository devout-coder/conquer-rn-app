import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';
import PrioritySelector from './PrioritySelector';
import DeleteModal from './DeleteModal';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {fullMonths} from '../Components/IncompleteTodosSidebar';
import {months} from '../Components/Calendar';
import {weekMonths} from './WeekCalendar';
import Toast from './Toast';
import FeatherIcon from '../customIcons/FeatherIcon';
import AntDesignIcon from '../customIcons/AntDesignIcon';
import MaterialIcon from '../customIcons/MaterialIcon';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {NativeModules} from 'react-native';
import {userContext} from '../context';
import IonIcon from '../customIcons/IonIcon';
import FriendsSelectorModal from './FriendsSelectorModal';
import PostponeConfirmModal from './PostponeConfirmModal';
import {SafeAreaView} from 'react-native-safe-area-context';
// const {TaskReminder} = NativeModules;

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
  users,
  timesPostponed,
  reloadTodos,
  allTodos,
}) => {
  let user = useContext(userContext);
  const [todoTaskName, setTodoTaskName] = useState(taskName);
  const [todoTaskDesc, setTodoTaskDesc] = useState(taskDesc);
  const [todoTaskPriority, setTodoTaskPriority] = useState(priority);
  const [todoTaskOriginalUsers, setTodoTaskOriginalUsers] = useState(users);
  const [todoTaskUsers, setTodoTaskUsers] = useState(users);
  const todoTaskNewUsers = () => {
    return todoTaskUsers.filter(eachUser => {
      return !todoTaskOriginalUsers.includes(eachUser);
    });
  };
  const [todoTaskRemovedUsers, setTodoTaskRemovedUsers] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reloadEverything, setReloadEverything] = useState(false);
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

  const [presentTodos, setPresentTodos] = useState({});

  const [futureTodos, setFutureTodos] = useState({});

  const [originalPresentTodos, setOriginalPresentTodos] = useState({});

  const [originalFutureTodos, setOriginalFutureTodos] = useState({});

  const firstRender = useRef(true);

  function loadTodosAllUsers(todosTime) {
    let dict = {};
    todoTaskUsers.forEach(taskUser => {
      firestore()
        .collection('todos')
        .where('users', 'array-contains', taskUser)
        .where('time', '==', todosTime)
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
              users: each.get('users'),
              index: each.get('index'),
              timeType: each.get('timeType'),
              timesPostponed: each.get('timesPostponed'),
            };
            all.push(eachdict);
          });
          dict[taskUser] = all.sort((a, b) => {
            return a.index[taskUser] - b.index[taskUser];
          });

          if (todoTaskUsers.length == Object.keys(dict).length) {
            if (todosTime == time) {
              if (firstRender.current) {
                setOriginalPresentTodos(dict);
                // firstRender.current = false;
              }
              setPresentTodos(dict);
            } else {
              if (firstRender.current) {
                setOriginalFutureTodos(dict);
                firstRender.current = false;
              }
              setFutureTodos(dict);
            }
          }
        });
    });
  }

  useEffect(() => {
    loadTodosAllUsers(time);
    if (timeType != 'longTerm') {
      loadTodosAllUsers(nextTime());
    }
  }, [todoTaskUsers, reloadEverything]);

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

  function closeModal() {
    setModalOpen(false);
    setTimeout(() => {
      setTodoTaskName('');
      setTodoTaskDesc('');
      setTodoTaskUsers([user.uid]);
      setTodoTaskPriority('0');
    }, 1000);
  }

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

  const alterIndex = (increaseOrDecrease, user, taskId, todos, setTodos) => {
    let allTodos = todos;
    for (let allTodosUser in allTodos) {
      let userTodos = allTodos[allTodosUser];
      userTodos = userTodos.map(eachTodo => {
        if (eachTodo.id == taskId) {
          let tempInd = eachTodo.index;
          if (increaseOrDecrease == 'increase') {
            tempInd[user] = tempInd[user] + 1;
          } else if (increaseOrDecrease == 'decrease') {
            tempInd[user] = tempInd[user] - 1;
          }
          eachTodo.index = tempInd;
        }
        return eachTodo;
      });
      allTodos[allTodosUser] = userTodos;
    }
    setTodos(allTodos);
  };

  function newTodoManagePri(user, todos, newIndex) {
    // it increases the index of all todos which have index value equal to or more than newIndex

    todos.forEach(each => {
      if (each.index[user] >= newIndex) {
        //if this task contains multiple users, do increment index for every user if the new task is added to that user as well

        let indexDict = each.index;
        // console.log(each.taskName, indexDict);
        indexDict[user] = indexDict[user] + 1;

        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch(error => console.log(error));

        alterIndex('increase', user, each.id, presentTodos, setPresentTodos);
        alterIndex(
          'increase',
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos,
        );
      }
    });
  }

  function existingTodoPriChanged(user, todos) {
    //this changes the index of all todos in between the todo and its new position

    let initialPos = index[user];
    let finalPos = decidePosition(todos, todoTaskPriority);
    if (initialPos < finalPos) {
      todos.forEach(each => {
        if (each.index[user] > initialPos && each.index[user] < finalPos) {
          // this reduces index of all items in between initial and final position by 1
          // console.log('existing', each.taskName, indexDict);
          let indexDict = each.index;
          indexDict[user] = indexDict[user] - 1;

          firestore()
            .collection('todos')
            .doc(each.id)
            .update({
              index: indexDict,
            })
            .catch(error => console.log(error));

          alterIndex('decrease', user, each.id, presentTodos, setPresentTodos);
          alterIndex(
            'decrease',
            user,
            each.id,
            originalPresentTodos,
            setOriginalPresentTodos,
          );
        }
      });
    } else if (initialPos > finalPos) {
      // this increases index of all items in between initial and final position by 1
      todos.forEach(each => {
        if (each.index[user] < initialPos && each.index[user] >= finalPos) {
          // this increases index of all items in between initial and final position by 1
          // console.log('existing', each.taskName, indexDict);
          let indexDict = each.index;
          indexDict[user] = indexDict[user] + 1;
          // console.log(each.taskName, indexDict);
          firestore()
            .collection('todos')
            .doc(each.id)
            .update({
              index: indexDict,
            })
            .catch(error => console.log(error));

          alterIndex('increase', user, each.id, presentTodos, setPresentTodos);
          alterIndex(
            'increase',
            user,
            each.id,
            originalPresentTodos,
            setOriginalPresentTodos,
          );
        }
      });
    }
  }

  function postponeIndicesUpdate(
    user,
    presentTodosUser,
    futureTodosUser,
    newIndex,
  ) {
    //reduces the index of all present tasks which ar below the postponed tasks and increases the index of future tasks which will be after the postponed task

    let currentTaskIndex = index[user];
    presentTodosUser.forEach(each => {
      if (each.index[user] > currentTaskIndex) {
        let indexDict = each.index;
        indexDict[user] = indexDict[user] - 1;
        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch(error => console.log(error));

        alterIndex('decrease', user, each.id, presentTodos, setPresentTodos);
        alterIndex('decrease', user, each.id, futureTodos, setFutureTodos);
        alterIndex(
          'decrease',
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos,
        );
        alterIndex(
          'decrease',
          user,
          each.id,
          originalFutureTodos,
          setOriginalFutureTodos,
        );
      }
    });

    futureTodosUser.forEach(each => {
      if (each.index[user] >= newIndex) {
        let indexDict = each.index;
        indexDict[user] = indexDict[user] + 1;
        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch(error => console.log(error));
        alterIndex('increase', user, each.id, presentTodos, setPresentTodos);
        alterIndex('increase', user, each.id, futureTodos, setFutureTodos);
        alterIndex(
          'increase',
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos,
        );
        alterIndex(
          'increase',
          user,
          each.id,
          originalFutureTodos,
          setOriginalFutureTodos,
        );
      }
    });
  }

  const [postponeTodoModalVisible, setPostponeTodoModalVisible] =
    useState(false);

  function postponeTodo() {
    let indexDict = index;

    let newFutureIndices = {};
    for (let deletedUser of todoTaskRemovedUsers) {
      deleteTodoManagePri(
        deletedUser,
        originalPresentTodos[deletedUser],
        index[deletedUser],
      );
    }
    for (let taskUser of todoTaskUsers) {
      newFutureIndices[taskUser] = decidePosition(
        futureTodos[taskUser],
        todoTaskPriority,
      );
      if (todoTaskOriginalUsers.includes(taskUser)) {
        postponeIndicesUpdate(
          taskUser,
          originalPresentTodos[taskUser],
          originalFutureTodos[taskUser],
          newFutureIndices[taskUser],
        );
      } else {
        newTodoManagePri(
          taskUser,
          futureTodos[taskUser],
          newFutureIndices[taskUser],
        );
      }
      if (todoTaskUsers.indexOf(taskUser) == todoTaskUsers.length - 1) {
        // console.log(indexDict);
        firestore()
          .collection('todos')
          .doc(id)
          .update({
            taskName: todoTaskName,
            taskDesc: todoTaskDesc,
            priority: todoTaskPriority,
            users: todoTaskUsers,
            index: newFutureIndices,
            time: nextTime(),
            timesPostponed:
              timesPostponed != undefined ? timesPostponed + 1 : 1,
          });
        setPriChanged(false);
        closeModal();
        setReloadEverything(!reloadEverything);
        reloadTodos();
      }
    }
  }

  function saveTodo() {
    closeModal();
    let newIndices = {};
    for (let taskUser of todoTaskUsers) {
      newIndices[taskUser] = decidePosition(
        presentTodos[taskUser],
        todoTaskPriority,
      );
    }
    if (id === undefined) {
      //makes a new todo if the id prop is empty str which means that no particular todo is opened
      for (let taskUser of todoTaskUsers) {
        newTodoManagePri(
          taskUser,
          presentTodos[taskUser],
          newIndices[taskUser],
        );
        if (todoTaskUsers.indexOf(taskUser) == todoTaskUsers.length - 1) {
          // console.log(newIndices);
          let todo = {
            taskName: todoTaskName,
            taskDesc: todoTaskDesc,
            time: time,
            timeType: timeType,
            priority: todoTaskPriority,
            users: todoTaskUsers,
            finished: false,
            index: newIndices,
          };
          firestore().collection('todos').add(todo);
        }
      }
    } else {
      //modifies the properties of original todo if some exisiting todo is opened in modal
      let indexDict = index;
      for (let deletedUser of todoTaskRemovedUsers) {
        // console.log('deleted');
        deleteTodoManagePri(
          deletedUser,
          originalPresentTodos[deletedUser],
          index[deletedUser],
        );
        delete indexDict[deletedUser];
        // delete originalPresentTodos[deletedUser];
      }
      for (let taskUser of todoTaskUsers) {
        if (todoTaskOriginalUsers.includes(taskUser)) {
          if (priChanged) {
            existingTodoPriChanged(taskUser, originalPresentTodos[taskUser]);
            indexDict[taskUser] =
              priChanged && indexDict[taskUser] < newIndices[taskUser]
                ? newIndices[taskUser] - 1
                : priChanged && indexDict[taskUser] > newIndices[taskUser]
                ? newIndices[taskUser]
                : indexDict[taskUser];
            //!  DON'T TOUCH IT PLEASE this piece of code was absolutely mind fucking
          }
        } else {
          newTodoManagePri(
            taskUser,
            presentTodos[taskUser],
            newIndices[taskUser],
          );
          indexDict[taskUser] = newIndices[taskUser];
        }
        if (todoTaskUsers.indexOf(taskUser) == todoTaskUsers.length - 1) {
          // console.log(indexDict);
          firestore().collection('todos').doc(id).update({
            taskName: todoTaskName,
            taskDesc: todoTaskDesc,
            priority: todoTaskPriority,
            users: todoTaskUsers,
            index: indexDict,
          });
          setPriChanged(false);
        }
      }
    }
    setReloadEverything(!reloadEverything);
    closeModal();
    reloadTodos();
  }

  function deleteTodoManagePri(user, todos, taskIndex) {
    //this function manages index of todos below a certain todo in case i delete it
    todos.forEach(each => {
      if (each.index[user] > taskIndex) {
        let indexDict = each.index;
        indexDict[user] = indexDict[user] - 1;
        // console.log(each.taskName, indexDict);
        firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch(error => console.log(error));

        alterIndex('decrease', user, each.id, presentTodos, setPresentTodos);
        alterIndex(
          'decrease',
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos,
        );
      }
    });
  }

  function deleteTodo() {
    //this func deletes that particular todo
    for (let todoUser in originalPresentTodos) {
      deleteTodoManagePri(
        todoUser,
        originalPresentTodos[todoUser],
        index[todoUser],
      );
      if (
        Object.keys(originalPresentTodos).indexOf(todoUser) ==
        Object.keys(originalPresentTodos).length - 1
      ) {
        firestore()
          .collection('todos')
          .doc(id)
          .delete()
          .then(() => {
            setReloadEverything(!reloadEverything);
            reloadTodos();
            closeModal();
          })
          .catch(error => console.log(error));
      }
    }
  }

  // for (let user in presentTodos) {
  //   console.log('====');
  //   console.log(user);
  //   // console.log(presentTodos[user].length);
  //   presentTodos[user].forEach(todo => {
  //     console.log(todo.taskName, todo.index[user], todo.priority);
  //   });
  //   console.log('====');
  // }

  // for (let user in futureTodos) {
  //   console.log('====');
  //   console.log(user);
  //   // console.log(futureTodos[user].length);
  //   futureTodos[user].forEach(todo => {
  //     console.log(todo.taskName);
  //   });
  //   console.log('====');
  // }

  // const [reminderMenuVisible, setReminderMenuVisible] = useState(false);

  // const [reminderDate, setReminderDate] = useState(new Date());
  // const [reminderMode, setReminderMode] = useState('date');
  // const [reminderSelectorVisible, setReminderSelectorVisible] = useState(false);
  // const [maxAllowedDate, setMaxAllowedDate] = useState(null);
  // const [minAllowedDate, setMinAllowedDate] = useState(null);

  // const convertWeekDay = weekDay => {
  //   // converts date in the form 20 Dec 2021 to 2021-12-20

  //   let [day, month, year] = weekDay.split(' ');
  //   month = parseInt(reverseObject(weekMonths)[month]) + 1;
  //   month = month.toString();
  //   if (day.length == 1) {
  //     day = '0' + day;
  //   }
  //   if (month.length == 1) {
  //     month = '0' + month;
  //   }
  //   return new Date(`${year}-${month}-${day}`);
  // };

  // const addReminder = () => {
  //   setReminderMenuVisible(false);

  //   if (timeType == 'daily') {
  //     setReminderMode('time');
  //     let [day, month, year] = time.split('/');
  //     if (day.length == 1) {
  //       day = '0' + day;
  //     }
  //     if (month.length == 1) {
  //       month = '0' + month;
  //     }
  //     let thisDay = new Date(`${year}-${month}-${day}`);
  //     setReminderDate(thisDay);
  //   } else if (timeType == 'week') {
  //     let firstDay = convertWeekDay(time.split('-')[0]);
  //     let lastDay = convertWeekDay(time.split('-')[1]);
  //     setMinAllowedDate(firstDay);
  //     setMaxAllowedDate(lastDay);
  //   } else if (timeType == 'month') {
  //     let [month, year] = time.split(' ');
  //     month = fullMonths.indexOf(month);
  //     let firstDay = new Date(year, month, 1);
  //     let lastDay = new Date(year, month + 1, 0);
  //     setMinAllowedDate(firstDay);
  //     setMaxAllowedDate(lastDay);
  //   } else if (timeType == 'year') {
  //     let firstDay = new Date(time, 0, 1);
  //     let lastDay = new Date(time, 11, 31);
  //     setMinAllowedDate(firstDay);
  //     setMaxAllowedDate(lastDay);
  //   }
  //   setReminderSelectorVisible(true);
  // };

  // const onReminderSet = (event, selectedDate) => {
  //   const currentDate = selectedDate || reminderDate;
  //   setReminderDate(currentDate);
  //   if (timeType != 'daily' && reminderMode == 'date') {
  //     setReminderMode('time');
  //   } else {
  //     setReminderSelectorVisible(false);
  //     setReminderMode('date');
  //   }
  //   TaskReminder.saveReminder(todoTaskName, currentDate.toString());
  // };

  // console.log(
  //   reminderDate.getDate(),
  //   reminderDate.getMonth(),
  //   reminderDate.getFullYear(),
  //   reminderDate.getHours(),
  //   reminderDate.getMinutes(),
  // );

  const [friendsSelectorModalVisible, setFriendsSelectorModalVisible] =
    useState(false);
  // console.log(todoTaskUsers);

  return (
    <Modal
      isVisible={modalOpen}
      style={styles.modal}
      onBackButtonPress={() => closeModal()}>
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
            <MaterialIcon iconName="close" iconColor="#ffffff" iconSize={30} />
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
          />
          <TextInput
            defaultValue={todoTaskDesc}
            onChangeText={newVal => setTodoTaskDesc(newVal)}
            style={styles.taskDesc}
            placeholder="Task Description"
            placeholderTextColor="#6C6C6C"
            multiline={true}
            numberOfLines={200}
          />
          <View style={styles.bottomBar}>
            <PrioritySelector
              style={styles.prioritySelector}
              priority={todoTaskPriority}
              changePriority={setTodoTaskPriority}
            />
            {/* <TouchableOpacity
              style={styles.shareIcon}
              onLongPress={() => Toast('Share this task with friends')}>
              <AntDesignIcon
                iconSize={28}
                iconColor="#ffffff"
                iconName="addusergroup"
              />
            </TouchableOpacity> */}
            {/* {timeType != 'longTerm' ? (
              <>
                <Menu
                  visible={reminderMenuVisible}
                  anchor={
                    <TouchableOpacity
                      style={styles.reminderIcon}
                      onPress={() => setReminderMenuVisible(true)}
                      onLongPress={() => Toast('Reminders')}>
                      <FeatherIcon
                        iconName="clock"
                        iconSize={28}
                        iconColor="#ffffff"
                      />
                    </TouchableOpacity>
                  }
                  onRequestClose={() => setReminderMenuVisible(false)}>
                  <MenuItem onPress={addReminder}>
                    <Text>Add a reminder</Text>
                  </MenuItem>
                </Menu>
                {reminderSelectorVisible && (
                  <RNDateTimePicker
                    testID="dateTimePicker"
                    value={reminderDate}
                    mode={reminderMode}
                    is24Hour={true}
                    minimumDate={minAllowedDate}
                    maximumDate={maxAllowedDate}
                    display="default"
                    onChange={onReminderSet}
                  />
                )}
              </>
            ) : (
              <></>
            )} */}
            {id != undefined && timeType != 'longTerm' ? (
              <TouchableOpacity
                style={styles.postponeIcon}
                onPress={() => setPostponeTodoModalVisible(true)}
                onLongPress={() => Toast('Postpone')}>
                <MaterialIcon
                  iconName="subdirectory-arrow-right"
                  iconColor="#ffffff"
                  iconSize={28}
                />
                <PostponeConfirmModal
                  modalVisible={postponeTodoModalVisible}
                  closeModal={() => setPostponeTodoModalVisible(false)}
                  postponeTodo={postponeTodo}
                  timeType={timeType}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
            <TouchableOpacity
              style={styles.addFriendIcon}
              onPress={() => {
                setFriendsSelectorModalVisible(true);
              }}
              onLongPress={() =>
                user.uid == todoTaskUsers[0]
                  ? Toast('Share task with friends')
                  : Toast('View users for this task')
              }>
              <IonIcon iconName="people" iconColor="#ffffff" iconSize={30} />
              <FriendsSelectorModal
                style={styles.friendsSelectorModal}
                modalVisible={friendsSelectorModalVisible}
                closeModal={() => setFriendsSelectorModalVisible(false)}
                todoTaskUsers={todoTaskUsers}
                setTodoTaskUsers={setTodoTaskUsers}
                todoTaskOriginalUsers={todoTaskOriginalUsers}
                todoTaskRemovedUsers={todoTaskRemovedUsers}
                setTodoTaskRemovedUsers={setTodoTaskRemovedUsers}
              />
            </TouchableOpacity>
            {id != undefined ? (
              <TouchableOpacity
                style={styles.deleteIcon}
                onLongPress={() => Toast('Delete')}
                onPress={toggleModal}>
                <MaterialIcon
                  iconName="delete"
                  iconSize={32}
                  iconColor="#ffffff"
                />
                <DeleteModal
                  modalVisible={deleteModalVisible}
                  closeModal={toggleModal}
                  deleteTodo={deleteTodo}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
            <TouchableOpacity
              style={styles.saveIcon}
              onPress={saveTodo}
              onLongPress={() => Toast('Save')}>
              <MaterialIcon iconName="save" iconSize={32} iconColor="#ffffff" />
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
    // backgroundColor: '#ffffff',
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
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: '#ffffff',
    // height: Dimensions.get('window').height,
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
    // backgroundColor: '#ffffff',
  },
  postponeText: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Medium',
    position: 'relative',
    color: '#595959',
  },
  bottomBar: {
    display: 'flex',
    width: '105%',
    position: 'relative',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

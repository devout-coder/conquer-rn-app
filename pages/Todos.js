// chem: 32 physics: 23 maths: 30 total 115
import React, {useContext, useEffect, useState} from 'react';

import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';
import {weekMonths} from '../Components/WeekCalendar';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import EachTodo from '../Components/EachTodo';
import YearPicker from '../Components/YearPicker';
import TodoModal from '../Components/TodoModal';
import {tabNavbarContext, userContext} from '../context';
import IncompleteTodosSidebar from '../Components/IncompleteTodosSidebar';
import {fullMonths} from '../Components/IncompleteTodosSidebar';
import {months} from '../Components/Calendar';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Toast from '../Components/Toast';
import MaterialIcon from '../customIcons/MaterialIcon';

const Todos = ({navigation, route, year, longTerm}) => {
  let user = useContext(userContext);
  let {tabNav, setTabNav} = useContext(tabNavbarContext);

  const [time, setTime] =
    year != undefined
      ? useState(year)
      : longTerm != undefined
      ? useState('Long Term Goals🎯')
      : useState(route.params['time']);

  const [timeType, setTimeType] =
    year != undefined
      ? useState('year')
      : longTerm != undefined
      ? useState('longTerm')
      : useState(route.params['timeType']);

  const [finishedTodos, setFinishedTodos] = useState([]);
  const [unfinishedTodos, setUnfinishedTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [futureTodos, setFutureTodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); //this state controls the delete modal
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (timeType == 'daily') {
          navigation.navigate('Daily');
          return true;
        } else if (timeType == 'week') {
          navigation.navigate('Weekly');
          return true;
        } else if (timeType == 'month') {
          navigation.navigate('Monthly');
          return true;
        }
      },
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(true);
    }
  }, [time, user]); //passed time here so that in yearly todos when i update the year data gets loaded again..

  function replaceDate(date) {
    if (timeType == 'week' || timeType == 'month') {
      return date.replace(/\s\d{4}/g, '');
    } else if (timeType == 'daily') {
      let dateComponents = date.split('/');
      return `${weekMonths[dateComponents[1] - 1]} ${dateComponents[0]}`;
    } else {
      return date;
    }
  }

  function loadData() {
    setLoading(true);
    firestore()
      .collection('todos')
      .where('users', 'array-contains', user.uid)
      .where('time', '==', time)
      .orderBy('priority', 'desc')
      .get()
      .then(snap => {
        let finished = [];
        let unfinished = [];
        snap.docs.map(each => {
          let eachdict = {
            id: each.id,
            taskName: each.get('taskName'),
            taskDesc: each.get('taskDesc'),
            priority: each.get('priority'),
            finished: each.get('finished'),
            users: each.get('users'),
            time: each.get('time'),
            index: each.get('index'),
            timeType: each.get('timeType'),
            timesPostponed: each.get('timesPostponed'),
          };
          if (each.get('finished')) {
            //each doc in todos collection of firebase is added to either finished or unfinished list based on its finished status
            finished.push(eachdict);
          } else {
            unfinished.push(eachdict);
          }
        });
        let all = [...finished, ...unfinished];
        setFinishedTodos(
          finished.sort((a, b) => {
            return a.index[user.uid] - b.index[user.uid];
          }),
        );
        setUnfinishedTodos(
          unfinished.sort((a, b) => {
            return a.index[user.uid] - b.index[user.uid];
          }),
        );
        setAllTodos(
          all.sort((a, b) => {
            return a.index[user.uid] - b.index[user.uid];
          }),
        );
        setLoading(false);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  function navbarName() {
    if (timeType == 'daily') {
      return 'Day';
    } else if (timeType == 'longTerm') {
      return 'Long Term';
    } else {
      return timeType.charAt(0).toUpperCase() + timeType.slice(1);
    }
  }

  function rearrangeTodos(data, from, to) {
    let initialPos;
    let finalPos;
    if (from != to) {
      allTodos.forEach(each => {
        if (each.id == unfinishedTodos[to].id) {
          finalPos = each.index[user.uid];
        } else if (each.id == unfinishedTodos[from].id) {
          initialPos = each.index[user.uid];
        }
      });

      let initialPri = allTodos[initialPos].priority;
      let finalPri = allTodos[finalPos].priority;
      if (initialPri == finalPri) {
        setUnfinishedTodos(data);
        if (initialPos < finalPos) {
          allTodos.forEach((each, index) => {
            let indexDict = each.index;
            if (index == initialPos) {
              indexDict[user.uid] = finalPos;
              firestore()
                .collection('todos')
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch(error => console.error(error));
            }
            if (index > initialPos && index <= finalPos) {
              indexDict[user.uid] = indexDict[user.uid] - 1;
              firestore()
                .collection('todos')
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch(error => console.error(error));
            }
          });
        } else if (initialPos > finalPos) {
          allTodos.forEach((each, index) => {
            let indexDict = each.index;
            if (index == initialPos) {
              indexDict[user.uid] = finalPos;
              firestore()
                .collection('todos')
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch(error => console.error(error));
            }
            if (index < initialPos && index >= finalPos) {
              indexDict[user.uid] = indexDict[user.uid] + 1;
              firestore()
                .collection('todos')
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch(error => console.error(error));
            }
          });
        }
        loadData();
      }
    }
  }

  const unfinishedTodo = ({item, drag, isActive}) => {
    return (
      <ScaleDecorator>
        <EachTodo
          id={item.id}
          key={item.index[user.uid]}
          index={item.index}
          priority={item.priority}
          taskName={item.taskName}
          taskDesc={item.taskDesc}
          finished={item.finished}
          time={item.time}
          timeType={item.timeType}
          users={item.users}
          timesPostponed={item.timesPostponed}
          reloadTodos={loadData}
          allTodos={allTodos}
          sidebarTodo={false}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };
  // console.log(allTodos);
  // allTodos.forEach(todo => {
  //   console.log(todo.taskName, todo.index[user.uid]);
  // });
  return (
    <View style={globalStyles.overallBackground}>
      <Navbar page={navbarName()} />
      <View style={styles.allTodosContainer}>
        <View
          style={[
            styles.topBar,
            {
              position: timeType != 'longTerm' ? 'relative' : 'relative',
              left: timeType != 'longTerm' ? '5%' : '2%',
            },
          ]}>
          {timeType == 'year' ? (
            <YearPicker year={time} changeYear={newYear => setTime(newYear)} />
          ) : (
            <Text style={styles.time}>{replaceDate(time)}</Text>
          )}
          <TouchableOpacity
            style={styles.addIcon}
            onPress={() => setModalOpen(true)}
            onLongPress={() => Toast('Add Todo')}>
            <MaterialIcon
              iconName="my-library-add"
              iconColor="#ffffff"
              iconSize={28}
            />
          </TouchableOpacity>
        </View>
        {user != null && modalOpen ? (
          <TodoModal
            taskName=""
            taskDesc=""
            priority="0"
            time={time}
            timeType={timeType}
            users={[user.uid]}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            reloadTodos={loadData}
            allTodos={allTodos}
          />
        ) : (
          <></>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : unfinishedTodos.length != 0 || finishedTodos.length != 0 ? (
          <View style={styles.mainTodos}>
            {unfinishedTodos.length != 0 ? (
              <View style={styles.unfinishedTodos}>
                <Text style={styles.numTodos}>
                  {unfinishedTodos.length} unfinished
                </Text>
                {user != null ? (
                  <DraggableFlatList
                    data={unfinishedTodos}
                    style={styles.unfinishedTodosList}
                    onDragEnd={({data, to, from}) =>
                      rearrangeTodos(data, from, to)
                    }
                    keyExtractor={item => item.index[user.uid]}
                    renderItem={unfinishedTodo}
                  />
                ) : (
                  <></>
                )}
              </View>
            ) : (
              <View></View>
            )}
            {finishedTodos.length != 0 ? (
              <View style={styles.finishedTodos}>
                <Text style={styles.numTodos}>
                  {finishedTodos.length} finished
                </Text>
                <ScrollView style={styles.finishedTodosList}>
                  {finishedTodos.map((each, index) => (
                    <EachTodo
                      id={each.id}
                      key={index}
                      index={each.index}
                      priority={each.priority}
                      taskName={each.taskName}
                      taskDesc={each.taskDesc}
                      finished={each.finished}
                      time={each.time}
                      timeType={each.timeType}
                      users={each.users}
                      timesPostponed={each.timesPostponed}
                      reloadTodos={loadData}
                      allTodos={allTodos}
                      sidebarTodo={false}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        ) : (
          <Text style={styles.noTodosMessage}>No tasks added yet!</Text>
        )}
      </View>
      {timeType == 'year' ? (
        <IncompleteTodosSidebar
          timeType="year"
          year={time}
          changeYear={newYear => setTime(newYear)}
        />
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Todos;

const styles = StyleSheet.create({
  time: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
  },
  addIcon: {
    position: 'relative',
    bottom: 3,
    marginLeft: 25,
  },
  allTodosContainer: {
    flex: 0.83,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#ffffff',
  },
  postponeIcon: {
    marginLeft: 15,
    bottom: 3,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
    // position: 'relative',
    // left: 35,
  },
  numTodos: {
    color: '#c6c4c4',
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
  },
  mainTodos: {
    marginTop: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  unfinishedTodos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    marginBottom: 50,
    width: '100%',
  },
  unfinishedTodosList: {
    display: 'flex',
    backgroundColor: '#00000025',
    padding: 10,
    borderRadius: 15,
    width: 340,
    flex: 1,
    width: '100%',
  },
  finishedTodos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor: '#ffffff',
    width: '100%',
    flex: 1,
  },
  finishedTodosList: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#00000030',
    minHeight: 70,
    // maxHeight: 120,
    padding: 10,
    borderRadius: 15,
    width: '100%',
    // alignItems: 'center',
  },
  noTodosMessage: {
    color: '#a8e3ff',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    marginTop: 50,
  },
});

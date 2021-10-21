// chem: 32 physics: 23 maths: 30 total 115
import React, {useContext, useEffect, useState} from 'react';

import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';
import {weekMonths} from '../Components/WeekCalendar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import EachTodo from '../Components/EachTodo';
import {userContext} from '../context';
import YearPicker from '../Components/YearPicker';
import TodoModal from '../Components/TodoModal';

const Todos = ({route, year, longTerm}) => {
  let user = useContext(userContext);

  const [time, setTime] =
    year != undefined
      ? useState(year)
      : longTerm != undefined
      ? useState('Long Term Goals🎯')
      : useState(route.params['time']);

  const [lastPage, setLastPage] =
    year != undefined
      ? useState('year')
      : longTerm != undefined
      ? useState('longTerm')
      : useState(route.params['lastPage']);

  const [finishedTodos, setFinishedTodos] = useState([]);
  const [unfinishedTodos, setUnfinishedTodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); //this state controls the delete modal
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.removeEventListener(
      'hardwareBackPress',
      () => true,
    );
    // return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(true);
    }
  }, [time, user]); //passed time here so that in yearly todos when i update the year data gets loaded again..

  function replaceDate(date) {
    if (lastPage == 'week' || lastPage == 'month') {
      return date.replace(/\s\d{4}/g, '');
    } else if (lastPage == 'daily') {
      let dateComponents = date.split('/');
      return `${weekMonths[dateComponents[1] - 1]} ${dateComponents[0]}`;
    } else {
      return date;
    }
  }

  function loadData() {
    firestore()
      .collection('todos')
      .where('user', '==', auth().currentUser.uid)
      .where('time', '==', time)
      .orderBy('priority', 'desc')
      .get()
      .then(snap => {
        setLoading(true);
        let finished = [];
        let unfinished = [];
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
          };
          if (each.get('finished')) {
            //each doc in todos collection of firebase is added to either finished or unfinished list based on its finished status
            finished.push(eachdict);
          } else {
            unfinished.push(eachdict);
          }
        });
        setFinishedTodos(
          finished.sort((a, b) => {
            return a.index - b.index;
          }),
        );
        setUnfinishedTodos(
          unfinished.sort((a, b) => {
            return a.index - b.index;
          }),
        );

        setLoading(false);
        // console.log(unfinishedTodos)
        // console.log(finishedTodos)
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  return (
    <View style={globalStyles.overallBackground}>
      <Navbar />
      <View style={styles.allTodosContainer}>
        <View style={styles.topBar}>
          {lastPage == 'year' ? (
            <YearPicker year={time} changeYear={newYear => setTime(newYear)} />
          ) : (
            <Text style={styles.time}>{replaceDate(time)}</Text>
          )}
          <TouchableOpacity
            style={styles.addIcon}
            onPress={() => setModalOpen(true)}>
            <Icon name="my-library-add" color="#ffffff" size={28} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : unfinishedTodos.length != 0 || finishedTodos.length != 0 ? (
          <View style={styles.mainTodos}>
            <TodoModal
              taskName=""
              taskDesc=""
              priority="0"
              time={time}
              timeType={lastPage}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              reloadTodos={loadData}
              unfinishedTodos={unfinishedTodos}
            />
            {unfinishedTodos.length != 0 ? (
              <View style={styles.unfinishedTodos}>
                <Text style={styles.numTodos}>
                  {unfinishedTodos.length} unfinished
                </Text>
                {/* <ScrollView> */}
                <ScrollView
                  style={styles.unfinishedTodosList}
                  indicatorStyle={{color: '#ffffff'}}>
                  {unfinishedTodos.map((each, index) => (
                    <EachTodo
                      id={each.id}
                      key={each.id}
                      index={index}
                      priority={each.priority}
                      taskName={each.taskName}
                      taskDesc={each.taskDesc}
                      finished={each.finished}
                      time={each.time}
                      timeType={each.timeType}
                      reloadTodos={loadData}
                      unfinishedTodos={unfinishedTodos}
                    />
                  ))}
                </ScrollView>
                {/* </ScrollView> */}
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
                      key={each.id}
                      index={index}
                      priority={each.priority}
                      taskName={each.taskName}
                      taskDesc={each.taskDesc}
                      finished={each.finished}
                      time={each.time}
                      timeType={each.timeType}
                      reloadTodos={loadData}
                      unfinishedTodos={unfinishedTodos}
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
    marginLeft: 18,
  },
  allTodosContainer: {
    flex: 0.88,
    marginTop: 10,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'relative',
    left: 13,
  },
  numTodos: {
    color: '#c6c4c4',
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
  },
  mainTodos: {
    display: 'flex',
    marginTop: 10,
    flex: 1,
  },
  unfinishedTodos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  unfinishedTodosList: {
    display: 'flex',
    backgroundColor: '#00000025',
    padding: 10,
    borderRadius: 15,
    width: 340,
    flex: 1,
  },
  finishedTodos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor: '#ffffff',
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
    width: 340,
    // alignItems: 'center',
  },
  noTodosMessage: {
    color: '#a8e3ff',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    marginTop: 50,
  },
});

import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {userContext} from '../context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import EachTodo from './EachTodo';
import MaterialIcon from '../customIcons/MaterialIcon';

export const fullMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const weekMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const IncompleteTodosSidebar = ({timeType, navigation, year, changeYear}) => {
  let user = useContext(userContext);
  let [loading, setLoading] = useState(true);
  const [reqTodos, setReqTodos] = useState([]);

  const contHeight = useRef(new Animated.Value(40)).current;
  const [heightIncreased, setHeightIncreased] = useState(false);
  function increaseHeight() {
    Animated.timing(contHeight, {
      toValue: 600,
      duration: 600,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    setHeightIncreased(true);
  }
  function decreaseHeight() {
    Animated.timing(contHeight, {
      toValue: 40,
      duration: 600,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    setHeightIncreased(false);
  }

  const angle = useRef(new Animated.Value(0)).current;
  const spinUp = () => {
    Animated.timing(angle, {
      toValue: 1,
      duration: 600,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };
  const spinDown = () => {
    Animated.timing(angle, {
      toValue: 0,
      duration: 600,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const spin = angle.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  function sortTodos(arr) {
    //later in func loadReqTodos i ve taken reqTodos as a parameter and sorts it by the time and in accordance of timeType(month, daily, week, year)
    let sortedTodos = arr;
    sortedTodos = arr.sort((a, b) => {
      let temparr = [a.time, b.time];
      if (timeType == 'year') {
        if (temparr[0] == temparr[1]) {
          return a.index - b.index;
        } else {
          return temparr[1] - temparr[0];
        }
      } else if (timeType == 'month') {
        if (temparr[0] == temparr[1]) {
          return a.index - b.index;
        } else {
          let newTemp = Array.from(
            temparr.map(each => {
              return [
                fullMonths.indexOf(each.split(' ')[0]),
                each.split(' ')[1],
              ];
            }),
          ); //this is something like this [[0, 2021],[8, 2022]]
          let compareYear = newTemp[1][1] - newTemp[0][1]; //this contains the difference of years
          let compareMonth = newTemp[1][0] - newTemp[0][0]; //this contains the difference of months
          if (compareYear != 0) {
            //evaluates true if its not the same year
            return compareYear;
          } else {
            return compareMonth;
          }
        }
      } else if (timeType == 'week') {
        if (temparr[0] == temparr[1]) {
          return a.index - b.index;
        } else {
          let newTemp = Array.from(
            temparr.map(each => {
              let reqWeek = each.split('-')[0].split(' '); //this stores the first part of the week like ["4", "Jan", "2021"]
              reqWeek[1] = weekMonths.indexOf(reqWeek[1]); //replaces the name of the month to a no
              return reqWeek;
            }),
          );
          let compareYear = newTemp[1][2] - newTemp[0][2]; //this contains the difference of years
          let compareMonth = newTemp[1][1] - newTemp[0][1]; //this contains the difference of months
          let compareDay = newTemp[1][0] - newTemp[0][0];
          if (compareYear != 0) {
            //evaluates true if its not the same year
            return compareYear;
          } else if (compareMonth != 0) {
            //evaluates true if its not the same month
            return compareMonth;
          } else {
            //evaluates true if its not the same day
            return compareDay;
          }
        }
      } else if (timeType == 'daily') {
        if (temparr[0] == temparr[1]) {
          return a.index - b.index;
        } else {
          let newTemp = Array.from(
            temparr.map(each => {
              let reqDay = each.split('/'); //this stores the first part of the week like ["4", "1", "2021"]
              return reqDay;
            }),
          );
          let compareYear = newTemp[1][2] - newTemp[0][2]; //this contains the difference of years
          let compareMonth = newTemp[1][1] - newTemp[0][1]; //this contains the difference of months
          let compareDay = newTemp[1][0] - newTemp[0][0];
          if (compareYear != 0) {
            //evaluates true if its not the same year
            return compareYear;
          } else if (compareMonth != 0) {
            //evaluates true if its not the same month
            return compareMonth;
          } else {
            //evaluates true if its not the same day
            return compareDay;
          }
        }
      }
    });
    return sortedTodos;
  }
  class loadReqTodos {
    constructor() {
      this.todos = firestore()
        .collection('todos')
        .where('user', '==', auth().currentUser.uid)
        .where('timeType', '==', timeType)
        .orderBy('priority', 'desc')
        // .orderBy("index", "asc")
        .onSnapshot(snap => {
          setLoading(true);
          let tparray = [];
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
            if (!each.get('finished')) {
              tparray.push(eachdict);
            }
          });
          sortTodos(tparray);
          setReqTodos(tparray);
          setLoading(false);
        });
    }
    unsubscribe() {
      return this.todos();
    }
  }

  useEffect(() => {
    if (user) {
      const loadTodos = new loadReqTodos();
      return function cleanup() {
        loadTodos.unsubscribe();
      };
    } else {
      setLoading(true);
    }
  }, [user]);

  return (
    <Animated.View
      style={[styles.incompleteTodosSidebar, {height: contHeight}]}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : reqTodos.length == 0 ? (
        <Text style={styles.noTodosMessage}>No incomplete tasks!</Text>
      ) : (
        <View style={styles.incompleteTodosCont}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (!heightIncreased) {
                spinUp();
                increaseHeight();
              } else {
                spinDown();
                decreaseHeight();
              }
            }}>
            <View style={styles.topBar}>
              <Text style={styles.numIncompleteTodos}>
                {reqTodos.length != 1
                  ? `${reqTodos.length} incomplete tasks`
                  : `${reqTodos.length} incomplete task`}
              </Text>
              <Animated.View
                style={[styles.expandButton, {transform: [{rotateX: spin}]}]}>
                <MaterialIcon iconName="expand-less" iconColor="#ffffff" iconSize={28} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
          <ScrollView style={styles.incompleteTodos}>
            {reqTodos.map((each, index) => (
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
                timesPostponed={each.timesPostponed}
                reloadTodos={loadReqTodos}
                sidebarTodo={true}
                navigation={navigation}
                year={year}
                changeYear={changeYear}
                spinArrowDown={spinDown}
                decreaseSidebarHeight={decreaseHeight}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </Animated.View>
  );
};

export default IncompleteTodosSidebar;

const styles = StyleSheet.create({
  incompleteTodosSidebar: {
    width: '95%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: 55,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#000000',
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 10000,
  },
  noTodosMessage: {
    color: '#a8e3ff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#ffffff',
  },
  numIncompleteTodos: {
    color: '#ffffff',
    // backgroundColor: '#ffffff',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 21,
  },
  expandButton: {
    //   marginRight:'auto'
    // marginLeft:'auto'
    position: 'absolute',
    right: 10,
  },
});

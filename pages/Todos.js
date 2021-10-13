import React, {useEffect} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';
import {weekMonths} from '../Components/WeekCalendar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Todos = ({route, navigation}) => {
  const {time, lastPage} = route.params;
  console.log(lastPage);
  // console.log(lastPage)

  useEffect(() => {
    const backHandler = BackHandler.removeEventListener(
      'hardwareBackPress',
      () => true,
    );
    // return () => backHandler.remove();
  }, []);

  function replaceDate(date) {
    if (lastPage == 'week' || lastPage == 'month') {
      return date.replace(/\s\d{4}/g, '');
    } else if (lastPage == 'daily') {
      let dateComponents = date.split('/');
      return `${weekMonths[dateComponents[1] - 1]} ${dateComponents[0]}`;
    }
  }
  return (
    <View style={globalStyles.overallBackground}>
      <Navbar />
      <View style={styles.allTodosContainer}>
        <View style={styles.topBar}>
          <Text style={styles.time}>{replaceDate(time)}</Text>
          <TouchableOpacity>
            <Icon name="my-library-add" color="#ffffff" size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Todos;

const styles = StyleSheet.create({
  time: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
  },
  allTodosContainer: {
    marginTop: 25,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    width: 130,
    justifyContent: 'space-around',
    position: 'relative',
    left: 13,
  },
});

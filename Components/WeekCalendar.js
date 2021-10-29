import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {months} from './Calendar';

export const weekMonths = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'Aug',
  8: 'Sept',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}; //these r the months for the week in mainTodos

const WeekCalendar = ({navigation}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const getWeekFormattedDate = date => {
    //this converts the date to the format dd M yyyy
    return `${date.getDate()} ${
      weekMonths[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  function replaceDate(date) {
    //this function removes space and year from the date
    return date.replace(/\s\d{4}/g, '');
  }

  const getDaysIn = (year, month) => {
    //this function returns the no of days in a particular month
    return new Date(year, month + 1, 0).getDate();
  };

  const increaseMonth = () => {
    //this function increases the month and changes the month to jan of next year if the existing month is december
    if (currentMonth + 1 <= 11) {
      setCurrentMonth(currentMonth + 1);
    } else {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    }
  };

  const decreaseMonth = () => {
    //this function decreases the month and changes the month to december of previous year if the existing month is jan
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    } else {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
  };

  const getWeeks = () => {
    //this function returns all the weeks in the current month

    let noPrevDays = new Date(currentYear, currentMonth, 1).getDay() - 1;
    noPrevDays = noPrevDays === -1 ? 6 : noPrevDays;
    //this var holds the value of no of days in previous month which appear in the first week of this month

    let noNextDays =
      7 -
      new Date(
        currentYear,
        currentMonth,
        getDaysIn(currentYear, currentMonth),
      ).getDay();
    noNextDays = noNextDays === 7 ? 0 : noNextDays;
    //this var holds the value of no of days in next month which appear in the last week of this month

    let prevDays = [
      ...Array(getDaysIn(currentYear, currentMonth - 1)).keys(),
    ].map(x => x + 1);
    prevDays =
      noPrevDays != 0 ? prevDays.slice(-noPrevDays, prevDays.length + 1) : [];
    prevDays.forEach((name, index) => {
      if (currentMonth > 0) {
        prevDays[index] = `${prevDays[index]} ${
          weekMonths[currentMonth - 1]
        } ${currentYear}`;
      } else {
        prevDays[index] = `${prevDays[index]} Dec ${currentYear - 1}`;
      }
    });
    //var prevDays contains all dates which are in previous month but are present in the first week of this month

    let nextDays = [
      ...Array(getDaysIn(currentYear, currentMonth + 1)).keys(),
    ].map(x => x + 1);
    nextDays = nextDays.slice(0, noNextDays);
    nextDays.forEach((name, index) => {
      if (currentMonth + 1 <= 11) {
        nextDays[index] = `${nextDays[index]} ${
          weekMonths[currentMonth + 1]
        } ${currentYear}`;
      } else {
        nextDays[index] = `${nextDays[index]} Jan ${currentYear + 1}`;
      }
    });
    //var nextDays contains all dates which are in next month but are present in the last week of this month

    let currentDays = [
      ...Array(getDaysIn(currentYear, currentMonth)).keys(),
    ].map(x => x + 1);
    currentDays.forEach((name, index) => {
      currentDays[
        index
      ] = `${currentDays[index]} ${weekMonths[currentMonth]} ${currentYear}`;
    });
    //var currentDays holds all the dates which are present in this month

    let allDays = [...prevDays, ...currentDays, ...nextDays];
    //allDays holds all dates in all weeks of current month

    let weeksList = [];
    let today = getWeekFormattedDate(new Date());
    for (let i = 0; i < allDays.length; i = i + 7) {
      //loops through a week
      let foundToday = false;
      for (let each of allDays.slice(i, i + 7)) {
        //this loops through all days in this particular week
        if (each == today) {
          //when any day matches with today's date then the foundToday switch is turned true for this week
          foundToday = true;
        }
      }
      weeksList.push(
        foundToday
          ? `${allDays[i]}-${allDays[i + 6]}#currentWeek`
          : `${allDays[i]}-${allDays[i + 6]}`,
        //if today's date lies in this week then foundToday ll be true and then the week ll be labelled as #currentWeek
      );
      foundToday = false; //foundToday is turned false before running the while loop for next week
    }
    return weeksList;
  };

  function handleWeekPress(week) {
    navigation.push('Todos', {time: week.split('#')[0], lastPage: 'week'});
  }

  return (
    <View style={styles.weekCalendar}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={decreaseMonth}>
          <Icon name="caretleft" color="#ffffff" size={20} />
        </TouchableOpacity>
        <View style={styles.topbarMonthContainer}>
          <Text style={styles.topbarMonth}>
            {months[currentMonth]}&nbsp;{currentYear}
          </Text>
        </View>
        <TouchableOpacity onPress={increaseMonth}>
          <Icon name="caretright" color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.allWeeks}>
        {getWeeks().map((week, index) => (
          <TouchableOpacity onPress={() => handleWeekPress(week)} key={index}>
            <Text
              style={
                week.split('#')[1] == 'currentWeek'
                  ? [styles.eachWeek, styles.currentWeek]
                  : styles.eachWeek
              }>
              {replaceDate(week.split('#')[0])}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default WeekCalendar;

const styles = StyleSheet.create({
  weekCalendar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 60,
  },
  topbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  topbarMonthContainer: {
    width: 250,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  topbarMonth: {
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 25,
    marginLeft: 20,
    marginRight: 20,
  },
  allWeeks: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  eachWeek: {
    fontFamily: 'Poppins-Medium',
    color: '#FDA5FF',
    marginBottom: 15,
    fontSize: 22,
  },
  currentWeek: {
    color: '#eada76',
    fontFamily: 'Poppins-Bold',
  },
});

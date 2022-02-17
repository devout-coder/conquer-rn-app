import AntDesignIcon from '../customIcons/AntDesignIcon';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {navbarContext} from '../context';

export const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

const Calendar = ({navigation}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  let {nav, setNav} = useContext(navbarContext);

  const getDaysIn = (year, month) => {
    //this function returns the no of days in a particular month
    return new Date(year, month + 1, 0).getDate();
  };

  function formattedDate(date) {
    //this function returns any specific date in the format i want which is dd/mm/yyyy
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${day}/${month + 1}/${year}`;
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getReqRows = () => {
    //this function returns a giant list which contains several lists with each list representing a week in the month and having all dates in that week
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
        prevDays[index] = `${prevDays[index]}/${currentMonth}/${currentYear}`;
      } else {
        prevDays[index] = `${prevDays[index]}/12/${currentYear - 1}`;
      }
    });
    //var prevDays contains all dates which are in previous month but are present in the first week of this month

    let nextDays = [
      ...Array(getDaysIn(currentYear, currentMonth + 1)).keys(),
    ].map(x => x + 1);
    nextDays = nextDays.slice(0, noNextDays);
    nextDays.forEach((name, index) => {
      if (currentMonth + 1 <= 11) {
        nextDays[index] = `${nextDays[index]}/${
          currentMonth + 2
        }/${currentYear}`;
      } else {
        nextDays[index] = `${nextDays[index]}/1/${currentYear + 1}`;
      }
    });
    //var nextDays contains all dates which are in next month but are present in the last week of this month

    let currentDays = [
      ...Array(getDaysIn(currentYear, currentMonth)).keys(),
    ].map(x => x + 1);
    currentDays.forEach((name, index) => {
      currentDays[index] = `${currentDays[index]}/${
        currentMonth + 1
      }/${currentYear}`;
    });
    //var currentDays holds all the dates which are present in this month

    let allDays = [...prevDays, ...currentDays, ...nextDays];
    //allDays holds all dates in all weeks of current month

    let horizontalList = [];
    let i = 0;
    while (i < allDays.length) {
      //every 7 elements in allDays r pushed as a separate list(which represents a week) in horizontalList
      horizontalList.push(allDays.slice(i, i + 7));
      i = i + 7;
    }
    return horizontalList;
  };

  function getReqCols() {
    let rows = getReqRows();
    let times = rows[0].length;
    let allCols = [];

    for (let i = 0; i < times; i++) {
      let col = [];
      col.push(weekDays[i]);
      for (let row of rows) {
        col.push(row[i]);
      }
      allCols.push(col);
    }
    return allCols;
  }

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

  function handleDatePress(date) {
    navigation.push('Todos', {time: date, timeType: 'daily'});
  }

  return (
    <View style={styles.calendar}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={decreaseMonth}>
          <AntDesignIcon
            iconName="caretleft"
            iconColor="#ffffff"
            iconSize={20}
          />
        </TouchableOpacity>
        <View style={styles.topbarMonthContainer}>
          <Text style={styles.topbarMonth}>
            {months[currentMonth]}&nbsp;{currentYear}
          </Text>
        </View>
        <TouchableOpacity onPress={increaseMonth}>
          <AntDesignIcon
            iconName="caretright"
            iconColor="#ffffff"
            iconSize={20}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.table}>
        {getReqCols().map((col, ind) => (
          <View style={styles.col} key={ind}>
            {col.map((date, index) => (
              <TouchableOpacity key={index}>
                <Text
                  style={
                    index == 0
                      ? styles.day
                      : date.split('/')[1] != currentMonth + 1
                      ? [styles.date, styles.notThisMonthsDate]
                      : date == formattedDate(new Date())
                      ? [styles.date, styles.today]
                      : styles.date
                  }
                  onPress={index != 0 ? () => handleDatePress(date) : null}>
                  {date.split('/')[0]}{' '}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  calendar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  topbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
  table: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  //   row: {
  //     display: 'flex',
  //     flexDirection: 'row',
  //   },
  col: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 12,
    width: 42,
  },
  day: {
    color: '#eada76',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  date: {
    color: '#ba9aff',
    fontFamily: 'Poppins-Medium',
    fontSize: 19,
    marginBottom: 10,
    marginTop: 10,
  },
  notThisMonthsDate: {
    color: '#404040',
  },
  today: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
  },
});

import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Navbar from '../Components/Navbar';
import YearPicker from '../Components/YearPicker';
import globalStyles from '../globalStyles';
import {months as singleListMonths} from '../Components/Calendar';
import Todos from './Todos';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IncompleteTodosSidebar from '../Components/IncompleteTodosSidebar';

const Stack = createNativeStackNavigator();

const MonthlyTab = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Monthly">
        <Stack.Screen
          name="Monthly"
          component={Monthly}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Todos"
          component={Todos}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Monthly = ({navigation}) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const months = [
    ['January', 'February', 'March', 'April', 'May', 'June'],
    ['July', 'August', 'September', 'October', 'November', 'December'],
  ];

  function handleMonthPress(month) {
    navigation.push('Todos', {
      time: month + ' ' + year.toString(),
      timeType: 'month',
    });
  }

  return (
    <View style={globalStyles.overallBackground}>
      <Navbar page="Month" />
      <View style={styles.monthCalendar}>
        <YearPicker year={year} changeYear={year => setYear(year)} />
        <View style={styles.allMonths}>
          {months.map((monthset, ind) => (
            <View style={styles.monthsColumn} key={ind}>
              {monthset.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMonthPress(month)}>
                  <Text
                    style={
                      new Date().getFullYear() == year &&
                      singleListMonths[new Date().getMonth()] == month
                        ? [styles.displayMonth, styles.currentMonth]
                        : [styles.displayMonth]
                    }>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
      <IncompleteTodosSidebar timeType="month" navigation={navigation} />
    </View>
  );
};

export default MonthlyTab;

const styles = StyleSheet.create({
  monthCalendar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
  },
  allMonths: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    marginTop: 18,
  },
  monthsColumn: {},
  displayMonth: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    color: '#fda5ff',
    marginBottom: 8,
  },
  currentMonth: {
    color: '#eada76',
  },
});

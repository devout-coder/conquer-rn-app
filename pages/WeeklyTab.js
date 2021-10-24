import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IncompleteTodosSidebar from '../Components/IncompleteTodosSidebar';
import Navbar from '../Components/Navbar';
import WeekCalendar from '../Components/WeekCalendar';
import globalStyles from '../globalStyles';
import Todos from './Todos';

const Stack = createNativeStackNavigator();

const WeeklyTab = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Weekly">
        <Stack.Screen
          name="Weekly"
          component={Weekly}
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

const Weekly = ({navigation}) => {
  return (
    <View style={globalStyles.overallBackground}>
      <Navbar />
      <WeekCalendar navigation={navigation} />
      <IncompleteTodosSidebar timeType="week" navigation={navigation} />
    </View>
  );
};

export default WeeklyTab;

const styles = StyleSheet.create({});

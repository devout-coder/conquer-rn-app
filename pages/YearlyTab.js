import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Navbar from '../Components/Navbar';
import YearPicker from '../Components/YearPicker';
import globalStyles from '../globalStyles';
import Todos from './Todos';

const Stack = createNativeStackNavigator();

const YearlyTab = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Yearly">
        <Stack.Screen
          name="Yearly"
          component={Yearly}
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

const Yearly = ({navigation}) => {
  useEffect(() => {
    navigation.navigate('Todos', {
      time: new Date().getFullYear(),
      lastPage: 'year',
    });
  }, []);
  return <View></View>;
};

export default YearlyTab;

const styles = StyleSheet.create({});

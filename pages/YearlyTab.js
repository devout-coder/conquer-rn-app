import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Todos from './Todos';

// const Stack = createNativeStackNavigator();

const YearlyTab = () => {
  return (
    // <NavigationContainer independent={true}>
    //   <Stack.Navigator initialRouteName="Yearly">
    //     <Stack.Screen
    //       name="Yearly"
    //       component={Yearly}
    //       options={{headerShown: false}}
    //     />
    //     <Stack.Screen
    //       name="Todos"
    //       component={Todos}
    //       options={{headerShown: false}}
    //     />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <Todos year={new Date().getFullYear()} />
  );
};

export default YearlyTab;

const styles = StyleSheet.create({});

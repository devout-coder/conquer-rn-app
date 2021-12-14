import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Todos from './Todos';


const YearlyTab = () => {
  return (
    <Todos year={new Date().getFullYear()} />
  );
};

export default YearlyTab;

const styles = StyleSheet.create({});

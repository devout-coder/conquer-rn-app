import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';
import Todos from './Todos';

const Stack = createNativeStackNavigator();

const LongTermTab = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="LongTerm">
        <Stack.Screen
          name="LongTerm"
          component={LongTerm}
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

const LongTerm = ({navigation}) => {
  useEffect(() => {
    navigation.navigate('Todos', {
      time: 'Long Term Goals🎯',
      lastPage: 'longTerm',
    });
  }, []);
  return <View></View>;
};

export default LongTermTab;

const styles = StyleSheet.create({});

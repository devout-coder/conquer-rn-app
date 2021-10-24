import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import {BackHandler, View} from 'react-native';
import Calendar from '../Components/Calendar';
import IncompleteTodosSidebar from '../Components/IncompleteTodosSidebar';
import Navbar from '../Components/Navbar';
import {navbarContext, tabNavbarContext} from '../context';
import globalStyles from '../globalStyles';
import Todos from './Todos';

const Stack = createNativeStackNavigator();

const DailyTab = ({navigation}) => {
  let {tabNav, setTabNav} = useContext(tabNavbarContext);

  useEffect(() => {
    setTabNav(navigation);
  }, []);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Daily">
        <Stack.Screen
          name="Daily"
          component={Daily}
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

const Daily = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={globalStyles.overallBackground}>
      <Navbar />
      <Calendar navigation={navigation} />
      <IncompleteTodosSidebar timeType="daily" navigation={navigation} />
    </View>
  );
};

export {Daily};
export default DailyTab;

import React from 'react';
import {View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DailyTab from './DailyTab';
import WeeklyTab from './WeeklyTab';
import MonthlyTab from './MonthlyTab';
import YearlyTab from './YearlyTab';
import LongTermTab from './LongTermTab';

const Main = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: '#362E8C',
            borderTopColor: '#494481',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            height: 55,
          },
        })}>
        <Tab.Screen
          name="DailyTab"
          component={DailyTab}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={
                    focused
                      ? require('../resources/images/DailyActive.png')
                      : require('../resources/images/Daily.png')
                  }
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="WeeklyTab"
          component={WeeklyTab}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={
                    focused
                      ? require('../resources/images/WeeklyActive.png')
                      : require('../resources/images/Weekly.png')
                  }
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="MonthlyTab"
          component={MonthlyTab}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={
                    focused
                      ? require('../resources/images/MonthlyActive.png')
                      : require('../resources/images/Monthly.png')
                  }
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="YearlyTab"
          component={YearlyTab}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={
                    focused
                      ? require('../resources/images/YearlyActive.png')
                      : require('../resources/images/Yearly.png')
                  }
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="LongTermTab"
          component={LongTermTab}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={
                    focused
                      ? require('../resources/images/LongTermActive.png')
                      : require('../resources/images/LongTerm.png')
                  }
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


export default Main;

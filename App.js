import React, {useEffect, useState} from 'react';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Loading from './pages/Loading';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  loginContext,
  navbarContext,
  nudgerSwitchContext,
  tabNavbarContext,
  userContext,
} from './context';
import auth from '@react-native-firebase/auth';
import Main from './pages/Main';
import {Notifications} from 'react-native-notifications';
import {MenuContext} from 'react-native-menu';
import Nudger from './pages/Nudger';
import NudgerToggleSwitch from './Components/NudgerToggleSwitch';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(false);
  //null if not logged in, false if info is loading, object containing user info if logged in

  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const [nav, setNav] = useState(null);
  //holds the navigation prop for stack navigator created in this file

  const [tabNav, setTabNav] = useState(null);
  //tabNav holds the navigation prop for the tab navigator created in Main.js file

  const [nudgerSwitch, setNudgerSwitch] = useState(null);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      //this function observes the state of authentication...returns null if user doesnt exist..returns the user details if the user exists..and returns false if the user is being created or loaded..
      setUser(user); //setting that user to predefined state
    });
  }, [user]);

  // Notifications.registerRemoteNotifications();

  // Notifications.events().registerNotificationReceivedForeground(
  //   (notification, completion) => {
  //     console.log(
  //       `Notification received in foreground: ${notification.title} : ${notification.body}`,
  //     );
  //     completion({alert: false, sound: false, badge: false});
  //   },
  // );

  // Notifications.events().registerNotificationOpened(
  //   (notification, completion) => {
  //     console.log(`Notification opened: ${notification.payload}`);
  //     completion();
  //   },
  // );
  // Notifications.postLocalNotification({
  //   title: 'Fuck all the other productivity apps',
  //   body: 'Conquer is gonna be the best productivity app on play store!',
  //   extra: 'data',
  // });

  return (
    // <MenuContext style={{flex: 1}}>
    <userContext.Provider value={user}>
      <nudgerSwitchContext.Provider value={{nudgerSwitch, setNudgerSwitch}}>
        <loginContext.Provider value={{justLoggedOut, setJustLoggedOut}}>
          <navbarContext.Provider value={{nav, setNav}}>
            <tabNavbarContext.Provider value={{tabNav, setTabNav}}>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Loading">
                  <Stack.Screen
                    name="Landing"
                    component={Landing}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Loading"
                    component={Loading}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Main"
                    component={Main}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Nudger"
                    component={Nudger}
                    options={{
                      headerStyle: {backgroundColor: '#262647'},
                      headerTitleStyle: {
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 24,
                        position: 'relative',
                      },
                      headerTintColor: '#ffffff',
                      headerShadowVisible: false,
                      headerLeft: () => <></>,
                      headerRight: () => <NudgerToggleSwitch />,
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </tabNavbarContext.Provider>
          </navbarContext.Provider>
        </loginContext.Provider>
      </nudgerSwitchContext.Provider>
    </userContext.Provider>
    // </MenuContext>
  );
};

export default App;

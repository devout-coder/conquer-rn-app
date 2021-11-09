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
  tabNavbarContext,
  userContext,
} from './context';
import auth from '@react-native-firebase/auth';
import Main from './pages/Main';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [nav, setNav] = useState(null);
  const [tabNav, setTabNav] = useState(null);

  function toggleJustLoggedOut() {
    setJustLoggedOut(!justLoggedOut);
  }

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      //this function observes the state of authentication...returns none if user doesnt exist..returns true if the user exist..and returns false if the user is being created or loaded..
      setUser(user); //setting that user to predefined state
    });
  }, [user]);

  return (
    <userContext.Provider value={user}>
      <loginContext.Provider value={{justLoggedOut, toggleJustLoggedOut}}>
        <navbarContext.Provider value={{nav, setNav}}>
          <tabNavbarContext.Provider value={{tabNav, setTabNav}}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Loading" >
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
              </Stack.Navigator>
            </NavigationContainer>
          </tabNavbarContext.Provider>
        </navbarContext.Provider>
      </loginContext.Provider>
    </userContext.Provider>
  );
}

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
  usedFriendLinkContext,
} from './context';
import auth from '@react-native-firebase/auth';
import Main from './pages/Main';
import {Notifications} from 'react-native-notifications';
import {MenuContext} from 'react-native-menu';
import Nudger from './pages/Nudger';
import NudgerToggleSwitch from './Components/NudgerToggleSwitch';
import Friends from './pages/Friends';
import {Linking} from 'react-native';

// const useMount = func => useEffect(() => func(), []);

// const useInitialURL = () => {
//   const [friend, setFriend] = useState(null);
//   const [processing, setProcessing] = useState(true);

//   useMount(() => {
//     const getUrlAsync = async () => {
//       // Get the deep link used to open the app
//       const initialUrl = await Linking.getInitialURL();
//       Linking.addEventListener('url', callback => {
//         setFriend(callback.url.split('/add-friend/')[1]);
//       });
//       if (initialUrl != null) {
//         setFriend(initialUrl.split('/add-friend/')[1]);
//       }
//       setProcessing(false);
//     };

//     getUrlAsync();
//   });

//   return {friend, processing};
// };

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

  const [usedFriendLink, setUsedFriendLink] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      //this function observes the state of authentication...returns null if user doesnt exist..returns the user details if the user exists..and returns false if the user is being created or loaded..
      setUser(user); //setting that user to predefined state
    });
  }, [user]);

  // const {friend: friend, processing} = useInitialURL();
  // console.log(
  //   processing
  //     ? `Processing the initial url from a deep link`
  //     : `The deep link is: ${friend || 'None'}`,
  // );

  const linking = {
    //this linking works only when conquer is running in background and deep link is clicked
    prefixes: [
      /* your linking prefixes */
      'https://conquer-goals.netlify.app/',
    ],
    config: {
      /* configuration for matching screens with paths */
      screens: {
        Friends: {
          path: 'add-friend/:friendInfo?',
          parse: {
            friendInfo: friendInfo => `${friendInfo}`,
          },
        },
      },
    },
  };

  return (
    <userContext.Provider value={user}>
      <nudgerSwitchContext.Provider value={{nudgerSwitch, setNudgerSwitch}}>
        <loginContext.Provider value={{justLoggedOut, setJustLoggedOut}}>
          <navbarContext.Provider value={{nav, setNav}}>
            <tabNavbarContext.Provider value={{tabNav, setTabNav}}>
              <usedFriendLinkContext.Provider
                value={{usedFriendLink, setUsedFriendLink}}>
                <NavigationContainer
                  linking={user != null && user != false ? linking : {}}>
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
                    <Stack.Screen
                      name="Friends"
                      component={Friends}
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
                      }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </usedFriendLinkContext.Provider>
            </tabNavbarContext.Provider>
          </navbarContext.Provider>
        </loginContext.Provider>
      </nudgerSwitchContext.Provider>
    </userContext.Provider>
  );
};

export default App;

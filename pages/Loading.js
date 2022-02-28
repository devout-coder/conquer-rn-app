import React, {useContext, useEffect, useRef} from 'react';
import {ActivityIndicator, Linking, StyleSheet, Text, View} from 'react-native';
import {loginContext, navbarContext, userContext} from '../context';
import globalStyles from '../globalStyles';

const Loading = ({navigation, route}) => {
  let user = useContext(userContext);
  let {justLoggedOut, setJustLoggedOut} = useContext(loginContext);
  let {nav, setNav} = useContext(navbarContext);

  useEffect(() => {
    setNav(navigation);
    Linking.getInitialURL().then(url => {
      //this linking works when conquer is not running in background and deep links are clicked
      if (url != null && user != null && user != false) {
        navigation.navigate('Friends', {
          friendInfo: url.split('/add-friend/')[1],
        });
      } else if (justLoggedOut) {
        //if i remove this then on logout when user=null then i will be navigated to landing page
        navigation.navigate('Login');
        setJustLoggedOut(false);
      } else if (user == null) {
        navigation.navigate('Landing');
      } else if (user != false) {
        navigation.navigate('Main');
      }
    });
  }, [user]);

  return (
    <View style={styles.background}>
      <ActivityIndicator style={styles.loading} size="large" color="#00ff00" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#262647',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

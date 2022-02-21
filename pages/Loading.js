import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {loginContext, navbarContext, userContext} from '../context';
import globalStyles from '../globalStyles';

const Loading = ({navigation}) => {
  let user = useContext(userContext);
  let {justLoggedOut, setJustLoggedOut} = useContext(loginContext);
  let {nav, setNav} = useContext(navbarContext);

  useEffect(() => {
    setNav(navigation);
    if (justLoggedOut) {
      navigation.navigate('Login');
      setJustLoggedOut(false);
    } else if (user == null) {
      navigation.navigate('Landing');
    } else if (user != false) {
      navigation.navigate('Main');
    }
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

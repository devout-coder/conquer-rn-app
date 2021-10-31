import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import {
  loginContext,
  navbarContext,
  tabNavbarContext,
  userContext,
} from '../context';

const Navbar = () => {
  let user = useContext(userContext);
  let {justLoggedOut, toggleJustLoggedOut} = useContext(loginContext);
  let {nav, setNav} = useContext(navbarContext);
  let {tabNav, setTabNav} = useContext(tabNavbarContext);

  function logout() {
    toggleJustLoggedOut();
    auth()
      .signOut()
      .then(() => {
        nav.navigate('Login');
      })
      .catch(error => console.log(error));
  }

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() =>
          user != null ? tabNav.navigate('DailyTab') : nav.navigate('Landing')
        }>
        <Image
          source={require('../resources/images/conquerLogo.png')}
          style={styles.conquerLogo}
        />
      </TouchableOpacity>
      {user != null ? (
        <TouchableOpacity onPress={logout}>
          <Icon name="logout" color="#ffffff" size={28} />
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 350,
    justifyContent: 'space-between',
    // backgroundColor:"#000000"
  },

  conquerLogo: {
    height: 80,
    width: 80,
    position: 'relative',
    right: 18,
  },
});

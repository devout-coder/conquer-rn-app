import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  loginContext,
  navbarContext,
  tabNavbarContext,
  userContext,
} from '../context';
import MaterialIcon from '../customIcons/MaterialIcon';

const Navbar = ({page}) => {
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
      {page == 'Landing' ? (
        <Image
          source={require('../resources/images/conquerLogo.png')}
          style={styles.conquerLogo}
        />
      ) : (
        <View style={styles.pageName}>
          <Text style={styles.pageName}>{page}</Text>
        </View>
      )}
      {user != null ? (
        <TouchableOpacity onPress={logout}>
          <MaterialIcon iconName="logout" iconColor="#ffffff" iconSize={28} />
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
    marginBottom: 30,
    marginTop: 15,
  },

  conquerLogo: {
    height: 80,
    width: 80,
    position: 'relative',
    right: 18,
  },
  pageName: {
    // color: '#ffffff',
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
  },
});

import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  loginContext,
  navbarContext,
  tabNavbarContext,
  userContext,
} from '../context';
import MaterialIcon from '../customIcons/MaterialIcon';
import MaterialCommunityIcon from '../customIcons/MaterialCommunityIcon';
import Toast from './Toast';
import {NativeModules} from 'react-native';
const {InstalledApplicationsFetcher} = NativeModules;
import {Menu, MenuItem} from 'react-native-material-menu';
import IonIcon from '../customIcons/IonIcon';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Navbar = ({page}) => {
  let user = useContext(userContext);
  let {justLoggedOut, setJustLoggedOut} = useContext(loginContext);
  let {nav, setNav} = useContext(navbarContext);
  let {tabNav, setTabNav} = useContext(tabNavbarContext);

  const logout = () => {
    hideMenu();
    InstalledApplicationsFetcher.deleteNudgerDetails();
    // console.log('logging out');
    setJustLoggedOut(true);
    GoogleSignin.revokeAccess()
      .then(() => {
        logoutAuth();
      })
      .catch(error => {
        logoutAuth();
      });
  };
  const logoutAuth = () => {
    auth()
      .signOut()
      .then(() => {
        nav.navigate('Login');
      })
      .catch(error => console.log(error));
  };
  const navigateToNudger = () => {
    hideMenu();
    nav.navigate('Nudger');
  };

  const navigateToFriends = () => {
    hideMenu();
    nav.navigate('Friends');
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const hideMenu = () => setMenuVisible(false);

  const showMenu = () => setMenuVisible(true);

  return (
    <View style={styles.navbar}>
      {page == 'Landing' ? (
        <Image
          source={require('../resources/images/conquerLogo.png')}
          style={styles.conquerLogo}
        />
      ) : page == 'LoginOrSignup' ? (
        <></>
      ) : (
        <View style={styles.pageName}>
          <Text style={styles.pageName}>{page}</Text>
        </View>
      )}
      {user != null && page != 'LoginOrSignup' && page != 'Landing' ? (
        // <View style={styles.rightIcons}>
        //   <TouchableOpacity
        //     onPress={navigateToNudger}
        //     onLongPress={() => Toast('Nudger')}>
        //     <MaterialCommunityIcon
        //       iconName="calendar-alert"
        //       iconColor="#ffffff"
        //       iconSize={28}
        //     />
        //   </TouchableOpacity>

        //   <TouchableOpacity
        //     onPress={logout}
        //     onLongPress={() => Toast('Logout')}>
        //     <MaterialIcon iconName="logout" iconColor="#ffffff" iconSize={28} />
        //   </TouchableOpacity>
        // </View>
        <Menu
          visible={menuVisible}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <IonIcon iconName="settings" iconSize={24} iconColor="#ffffff" />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}>
          <MenuItem onPress={navigateToNudger}>Nudger</MenuItem>
          {/* <MenuItem onPress={hideMenu}>Profile</MenuItem> */}
          <MenuItem onPress={navigateToFriends}>Friends</MenuItem>
          <MenuItem onPress={logout}>Logout</MenuItem>
        </Menu>
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
  rightIcons: {
    display: 'flex',
    flexDirection: 'row',
    width: 95,
    justifyContent: 'space-between',
  },
});

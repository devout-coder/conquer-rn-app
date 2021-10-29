import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Button,
} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';
import {loginContext, navbarContext, userContext} from '../context';

const Landing = ({navigation}) => {
  let user = useContext(userContext);
  let {justLoggedOut, toggleJustLoggedOut} = useContext(loginContext);
  let {nav, setNav} = useContext(navbarContext);

  useEffect(() => {
    setNav(navigation);
    if (user == null && !justLoggedOut) {
      navigation.navigate('Landing');
    } else if (justLoggedOut) {
      navigation.navigate('Login');
      toggleJustLoggedOut();
    } else if (user == false) {
      navigation.navigate('Loading');
    } else {
      navigation.navigate('Main');
    }
  }, [user]);

  return (
    <View style={globalStyles.overallBackground}>
      <ImageBackground
        source={require('../resources/images/Conquerbackground.png')}
        style={styles.backgroundImage}>
        {/* <View style={styles.landingBackground}> */}
        <Navbar />
        <View style={styles.mainContent}>
          <Text style={styles.tagLine}>
            Introducing the best way to {'\n'} plan your tasks and goals...
          </Text>
          <TouchableOpacity
            style={styles.getStartedBut}
            onPress={() => nav.navigate('Login')}>
            <Text style={styles.getStartedButText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </ImageBackground>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  // landingBackground: {
  //   backgroundColor: '#262647',
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'flex-start',
  //   justifyContent: 'center',
  // },
  backgroundImage: {
    width: 700,
    height: 800,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    left: -150,
  },
  mainContent: {
    // backgroundColor: "#000000",
    flex: 0.6,
    // backgroundColor:"#000000",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagLine: {
    fontFamily: 'Poppins-Medium',
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },
  getStartedBut: {
    borderRadius: 14,
    elevation: 20,
    marginTop: 39,
    padding: 9,
    backgroundColor: '#A981FF',
  },
  getStartedButText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 23,
  },
});

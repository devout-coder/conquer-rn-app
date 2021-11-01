import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';

const Landing = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={globalStyles.overallBackground}>
      <ImageBackground
        source={require('../resources/images/Conquerbackground.png')}
        style={styles.backgroundImage}>
        <Navbar page="Landing" />
        <View style={styles.mainContent}>
          <Text style={styles.tagLine}>
            Introducing the best way to {'\n'} plan your tasks and goals...
          </Text>
          <TouchableOpacity
            style={styles.getStartedBut}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.getStartedButText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
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

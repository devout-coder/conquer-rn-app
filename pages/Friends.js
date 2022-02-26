import {StyleSheet, Text, View, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import globalStyles from '../globalStyles';
import Ripple from 'react-native-material-ripple';

const Friends = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Main');
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
  });
  return (
    <View style={globalStyles.overallBackground}>
      <View style={styles.mainContainer}>
        <Text style={styles.normalText}>
          Add friends to create common tasks with them
        </Text>
        <Ripple
          rippleDuration={300}
          rippleColor="#ffffff"
          rippleContainerBorderRadius={5}>
          <Text style={styles.shareLink}>Share friendship link</Text>
        </Ripple>
      </View>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  normalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#ffffff',
  },
  mainContainer: {
    // backgroundColor: '#ffffff',
    width: '92%',
  },
  shareLink: {
    color: '#eada76',
    alignSelf: 'center',
    marginTop: 9,
    fontFamily: 'Poppins-Medium',
    fontSize: 21,
  },
});

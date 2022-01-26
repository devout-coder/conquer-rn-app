import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Ripple from 'react-native-material-ripple';
import CheckBox from '@react-native-community/checkbox';

const AppsSelectorEachApp = ({
  appName,
  appPackageName,
  appIcon,
  selectedApps,
  selectApp,
  unSelectApp,
}) => {

  const [checked, setChecked] = useState(selectedApps.includes(appPackageName));

  const checkUncheckfunc = () => {
    if (!checked) {
      selectApp(appPackageName);
    } else {
      unSelectApp(appPackageName);
    }
    setChecked(!checked);
  };

  return (
    <Ripple
      rippleDuration={300}
      rippleContainerBorderRadius={5}
      rippleColor="#ffffff"
      onPress={checkUncheckfunc}
      style={styles.bottomButton}>
      <View style={styles.eachApp}>
        <CheckBox
          value={checked}
          tintColors={{
            true: '#F1D7D7',
            false: '#F1D7D7',
          }}
          onValueChange={checkUncheckfunc}
        />
        <Image
          style={styles.appIcon}
          source={{
            uri: 'data:image/png;base64,' + appIcon,
          }}
        />
        <Text style={styles.appName}>{appName}</Text>
      </View>
    </Ripple>
  );
};

export default AppsSelectorEachApp;

const styles = StyleSheet.create({
  eachApp: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  appIcon: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginLeft: 15,
  },
  appName: {
    fontFamily: 'Poppins-Regular',
    color: '#F1D7D7',
    fontSize: 20,
    width: '75%',
    zIndex: 100,
    marginLeft: 10,
  },
});

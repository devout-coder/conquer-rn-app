import globalStyles from '../globalStyles';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IonIcon from '../customIcons/IonIcon';

const Nudger = () => {
  return (
    <View style={globalStyles.overallBackground}>
      <View style={styles.topContainer}>
        <View style={styles.topInfo}>
          <IonIcon
            iconName="information-circle-sharp"
            iconColor="#878787"
            iconSize={22}
          />
          <Text style={styles.topInfoText}>
            Once you turn me on, you will be noftified about remaining tasks
            every 15 minutes of using the blacklisted apps and websites.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Nudger;

const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  topInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 10,
  },
  topInfoText: {
    color: '#878787',
    fontFamily: 'Poppins-Light',
  },
});

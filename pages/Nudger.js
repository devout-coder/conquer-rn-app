import globalStyles from '../globalStyles';
import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IonIcon from '../customIcons/IonIcon';
import {nudgerSwitchContext} from '../context';

const Nudger = () => {
  let {nudgerSwitch, setNudgerSwitch} = useContext(nudgerSwitchContext);

  return (
    <View style={globalStyles.overallBackground}>
      <View style={styles.topContainer}>
        {!nudgerSwitch ? (
          <View style={styles.topInfo}>
            <IonIcon
              iconName="information-circle-sharp"
              iconColor="#878787"
              iconSize={22}
            />
            <Text style={styles.topInfoText}>
              Once you turn me on, you will be noftified about remaining tasks
              every 15 minutes(customizable) of using the blacklisted apps and
              websites.
            </Text>
          </View>
        ) : (
          <Text style={styles.topInfoText}>
            Nudger is turned on. You will be notified about remaining tasks
          </Text>
        )}
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

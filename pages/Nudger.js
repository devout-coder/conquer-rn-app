import globalStyles from '../globalStyles';
import React, {useContext, useEffect, useState} from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import IonIcon from '../customIcons/IonIcon';
import {nudgerSwitchContext} from '../context';
import Ripple from 'react-native-material-ripple';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesignIcon from '../customIcons/AntDesignIcon';
import RadioButtonRN from 'radio-buttons-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import AppsSelectorModal from '../Components/AppsSelectorModal';
import WebsitesSelectorModal from '../Components/WebsitesSelectorModal';

const Nudger = ({navigation}) => {
  let {nudgerSwitch, setNudgerSwitch} = useContext(nudgerSwitchContext);

  const [blacklistedApps, setBlacklistedApps] = useState([]);
  const [blacklistedWebsites, setBlacklistedWebsites] = useState([]);
  const [timeDuration, setTimeDuration] = useState('15');
  const [timeTypeDropdownOpen, setTimeTypeDropdownOpen] = useState(false);
  const [timeTypeDropdownValue, setTimeTypeDropdownValue] = useState('minutes');
  const [timeTypeDropdownItems, setTimeTypeDropdownItems] = useState([
    {label: 'minutes', value: 'minutes'},
    {label: 'hours', value: 'hours'},
  ]);

  let radio_props = [
    {label: 'daily'},
    {label: 'weekly'},
    {label: 'monthly'},
    {label: 'yearly'},
    {label: 'longTerm'},
  ];

  const [timeTypeRadio, setTimeTypeRadio] = useState('daily');

  const [appsSelectorModalVisible, setAppsSelectorModalVisible] =
    useState(false);

  const [websitesSelectorModalVisible, setWebsitesSelectorModalVisible] =
    useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.push('Main');
      },
    );
    return () => backHandler.remove();
  }, []);

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
          <View style={styles.mainContainer}>
            <Ripple
              rippleDuration={300}
              rippleColor="#ffffff"
              rippleContainerBorderRadius={5}
              onPress={() => setAppsSelectorModalVisible(true)}>
              <View style={styles.blackListedContainer}>
                <Text style={styles.blackListedText}>Blacklisted Apps</Text>
                <AntDesignIcon
                  iconName="caretdown"
                  iconColor="#ffffff"
                  iconSize={13}
                />
                <AppsSelectorModal
                  modalVisible={appsSelectorModalVisible}
                  closeModal={() => setAppsSelectorModalVisible(false)}
                  selectedApps={blacklistedApps}
                  setSelectedApps={setBlacklistedApps}
                />
              </View>
            </Ripple>
            <Ripple
              rippleDuration={300}
              rippleColor="#ffffff"
              onPress={() => setWebsitesSelectorModalVisible(true)}
              rippleContainerBorderRadius={5}>
              <View style={styles.blackListedContainer}>
                <Text style={styles.blackListedText}>Blacklisted Websites</Text>
                <AntDesignIcon
                  iconName="caretdown"
                  iconColor="#ffffff"
                  iconSize={13}
                />
                <WebsitesSelectorModal
                  modalVisible={websitesSelectorModalVisible}
                  closeModal={() => setWebsitesSelectorModalVisible(false)}
                  selectedWebsites={blacklistedWebsites}
                  setSelectedWebsites={setBlacklistedWebsites}
                />
              </View>
            </Ripple>
            <View
              style={{
                borderBottomColor: '#acbbfc',
                borderBottomWidth: 1,
                opacity: 0.3,
              }}
            />
            <View style={styles.durationSelectorView}>
              <Text style={styles.nudgerNormalText}>
                You want to be notified every
              </Text>
              <View style={styles.durationSelector}>
                <TextInput
                  style={styles.hoursOrMinutes}
                  keyboardType="number-pad"
                  value={timeDuration}
                  onChangeText={value => {
                    setTimeDuration(value);
                  }}
                />
                <DropDownPicker
                  open={timeTypeDropdownOpen}
                  setOpen={setTimeTypeDropdownOpen}
                  value={timeTypeDropdownValue}
                  setValue={setTimeTypeDropdownValue}
                  items={timeTypeDropdownItems}
                  setItems={setTimeTypeDropdownItems}
                  style={{
                    backgroundColor: '#262647',
                    borderColor: '#262647',
                  }}
                  containerStyle={{width: 130}}
                  labelStyle={{color: '#F1D7D7', fontSize: 20}}
                  textStyle={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                  }}
                  ArrowDownIconComponent={() => (
                    <AntDesignIcon
                      iconName="caretdown"
                      iconColor="#F1D7D7"
                      iconSize={13}
                    />
                  )}
                  ArrowUpIconComponent={() => (
                    <AntDesignIcon
                      iconName="caretup"
                      iconColor="#F1D7D7"
                      iconSize={13}
                    />
                  )}
                  placeholder="Select Time type"
                />
              </View>
              <Text style={styles.nudgerNormalText}>
                of using the blacklisted stuff
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: '#acbbfc',
                borderBottomWidth: 1,
                opacity: 0.3,
              }}
            />
            <View style={styles.taskTypeSelector}>
              <Text style={styles.nudgerNormalText}>
                Which tasks do you want to be notified about?
              </Text>
              <RadioButtonRN
                data={radio_props}
                selectedBtn={e => setTimeTypeRadio(e.label)}
                box={false}
                initial={1}
                duration={100}
                animationTypes={['zoomIn']}
                circleSize={12}
                activeColor="#00ff00"
                textStyle={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 20,
                  color: '#F1D7D7',
                }}
              />
            </View>
            <View style={styles.saveButton}>
              <Ripple
                rippleDuration={300}
                rippleColor="#000000"
                width="100%"
                rippleContainerBorderRadius={5}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Ripple>
            </View>
          </View>
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
    // backgroundColor: '#000000',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    flex: 1,
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
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: '#000000',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  blackListedContainer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  blackListedText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    color: '#ffffff',
    marginRight: 10,
  },
  nudgerNormalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#ffffff',
    marginTop: 9,
  },
  durationSelectorView: {
    padding: 10,
  },
  hoursOrMinutes: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#F1D7D7',
    borderBottomWidth: 2,
    borderBottomColor: '#F1D7D7',
    padding: 0,
    height: 30,
    width: '8%',
  },
  durationSelector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#a8e3ff',
    width: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 5,
  },
  saveButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    width: '100%',
    position: 'relative',
    left: 12,
  },
});

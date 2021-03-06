import globalStyles from '../globalStyles';
import React, {useContext, useEffect, useState} from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import IonIcon from '../customIcons/IonIcon';
import {nudgerSwitchContext, userContext} from '../context';
import Ripple from 'react-native-material-ripple';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesignIcon from '../customIcons/AntDesignIcon';
import RadioButtonRN from 'radio-buttons-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import AppsSelectorModal from '../Components/AppsSelectorModal';
import WebsitesSelectorModal from '../Components/WebsitesSelectorModal';
import {NativeModules} from 'react-native';
import {defineAnimation} from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const {InstalledApplicationsFetcher} = NativeModules;
import ToggleSwitch from 'toggle-switch-react-native';

const windowHeight = Dimensions.get('window').height;

const Nudger = ({navigation}) => {
  let user = useContext(userContext);

  let {nudgerSwitch, setNudgerSwitch} = useContext(nudgerSwitchContext);

  const [nudgerDetailsFetched, setNudgerDetailsFetched] = useState(false);

  const [blacklistedApps, setBlacklistedApps] = useState([]);
  const [blacklistedWebsites, setBlacklistedWebsites] = useState([]);
  const [appsSelectorModalVisible, setAppsSelectorModalVisible] =
    useState(false);
  const [websitesSelectorModalVisible, setWebsitesSelectorModalVisible] =
    useState(false);
  const [timeDuration, setTimeDuration] = useState('15');
  const [timeTypeDropdownOpen, setTimeTypeDropdownOpen] = useState(false);
  const [timeTypeDropdownValue, setTimeTypeDropdownValue] = useState('minutes');
  const [ashneerGroverVoiceSwitch, setAshneerGroverVoiceSwitch] =
    useState(false);
  const [takeUserHomeSwitch, setTakeUserHomeSwitch] = useState(false);
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
  const [timeTypeRadioInitial, setTimeTypeRadioInitial] = useState(1);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        saveNudgerDetails();
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
  });

  const setStateNudgerDetails = (
    blacklistedApps,
    blacklistedWebsites,
    timeDuration,
    timeTypeDropdownValue,
    ashneerGroverVoiceSwitch,
    takeUserHomeSwitch,
    timeType,
  ) => {
    let blacklistedAppsArray = blacklistedApps.split(',');
    setBlacklistedApps(blacklistedAppsArray);
    let blacklistedWebsitesArray = blacklistedWebsites.split(',');
    setBlacklistedWebsites(blacklistedWebsitesArray);
    setTimeDuration(timeDuration);
    setTimeTypeDropdownValue(timeTypeDropdownValue);
    setAshneerGroverVoiceSwitch(ashneerGroverVoiceSwitch);
    setTakeUserHomeSwitch(takeUserHomeSwitch);
    for (let i = 0; i < radio_props.length; i++) {
      if (radio_props[i].label == timeType) {
        setTimeTypeRadioInitial(i + 1);
      }
    }
  };

  const fetchNudgerDetails = () => {
    firestore()
      .collection('nudgerDetails')
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.get('blacklistedApps') != undefined) {
          let blacklistedApps = doc.get('blacklistedApps');
          let blacklistedWebsites = doc.get('blacklistedWebsites');
          let timeDuration = doc.get('timeDuration');
          let timeTypeDropdownValue = doc.get('timeTypeDropdownValue');
          let ashneerGroverVoiceSwitch = doc.get('ashneerGroverVoiceSwitch');
          let takeUserHomeSwitch = doc.get('takeUserHomeSwitch');
          let timeType = doc.get('timeType');
          setStateNudgerDetails(
            blacklistedApps,
            blacklistedWebsites,
            timeDuration,
            timeTypeDropdownValue,
            ashneerGroverVoiceSwitch,
            takeUserHomeSwitch,
            timeType,
          );
        }
      });
    setNudgerDetailsFetched(true);
  };

  useEffect(() => {
    fetchNudgerDetails();
  }, []);

  const saveNudgerDetailsFirebase = () => {
    //saves all nudger details in firebase

    let nudgerDetails = {
      blacklistedApps: blacklistedApps.toString(),
      blacklistedWebsites: blacklistedWebsites.toString(),
      timeDuration: timeDuration,
      timeTypeDropdownValue: timeTypeDropdownValue,
      timeType: timeTypeRadio,
      ashneerGroverVoiceSwitch: ashneerGroverVoiceSwitch,
      takeUserHomeSwitch: takeUserHomeSwitch,
      nudgerSwitch: true,
    };

    firestore().collection('nudgerDetails').doc(user.uid).set(nudgerDetails);
  };

  const saveNudgerDetails = () => {
    InstalledApplicationsFetcher.saveNudgerDetails(
      blacklistedApps.toString(),
      blacklistedWebsites.toString(),
      timeDuration,
      timeTypeDropdownValue,
      ashneerGroverVoiceSwitch,
      takeUserHomeSwitch,
      timeTypeRadio,
    );
    saveNudgerDetailsFirebase();
    navigation.navigate('Main');
  };

  return (
    <View style={globalStyles.overallBackground}>
      <ScrollView
        style={styles.topContainer}
        contentContainerStyle={{justifyContent: 'space-between'}}>
        {!nudgerDetailsFetched || nudgerSwitch == null ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : !nudgerSwitch ? (
          <View style={styles.topInfo}>
            <IonIcon
              iconName="information-circle-sharp"
              iconColor="#878787"
              iconSize={22}
            />
            <Text style={styles.topInfoText}>
              Once you turn me on, you will be noftified about unfinished tasks
              after overusing the blacklisted apps and websites.
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
                {nudgerDetailsFetched ? (
                  <WebsitesSelectorModal
                    modalVisible={websitesSelectorModalVisible}
                    closeModal={() => setWebsitesSelectorModalVisible(false)}
                    selectedWebsites={blacklistedWebsites}
                    setSelectedWebsites={setBlacklistedWebsites}
                  />
                ) : (
                  <></>
                )}
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
                marginBottom: 5,
              }}
            />
            <View style={styles.ashneerGroverVoiceView}>
              <Text style={styles.nudgerNormalText}>
                Get nudged by Ashneer Grover on overusing the blacklisted stuff
              </Text>
              <ToggleSwitch
                isOn={ashneerGroverVoiceSwitch}
                onColor="#00ff00"
                offColor="red"
                animationSpeed={100}
                labelStyle={{color: 'black', fontWeight: '900'}}
                size="medium"
                onToggle={newSwitchState =>
                  setAshneerGroverVoiceSwitch(newSwitchState)
                }
              />
            </View>
            <View style={styles.ashneerGroverVoiceView}>
              <Text style={styles.nudgerNormalText}>
                Quit the app if it is blacklisted and is being overused
              </Text>
              <ToggleSwitch
                isOn={takeUserHomeSwitch}
                onColor="#00ff00"
                offColor="red"
                animationSpeed={100}
                labelStyle={{color: 'black', fontWeight: '900'}}
                size="medium"
                onToggle={newSwitchState =>
                  setTakeUserHomeSwitch(newSwitchState)
                }
              />
            </View>
            <View
              style={{
                borderBottomColor: '#acbbfc',
                borderBottomWidth: 1,
                opacity: 0.3,
                marginTop: 10,
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
                initial={timeTypeRadioInitial}
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
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Nudger;

const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: '#000000',
    marginTop: 0,
    padding: 10,
    paddingTop: 0,
    width: '100%',
    height: windowHeight - 50,
  },
  topInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '87%',
    marginTop: 10,
  },
  topInfoText: {
    color: '#878787',
    fontFamily: 'Poppins-Light',
    marginLeft: 10,
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: '#000000',
    justifyContent: 'space-around',
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
    maxWidth: '90%',
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
  ashneerGroverVoiceView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // backgroundColor: '#ffffff',
  },
  durationSelector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

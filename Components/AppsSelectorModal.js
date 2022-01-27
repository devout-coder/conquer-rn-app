import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import Ripple from 'react-native-material-ripple';
import {NativeModules} from 'react-native';
import AppsSelectorEachApp from './AppsSelectorEachApp';
import {ScrollView} from 'react-native-gesture-handler';
import IonIcon from '../customIcons/IonIcon';
const {InstalledApplicationsFetcher} = NativeModules;

const windowHeight = Dimensions.get('window').height;
const AppsSelectorModal = ({
  modalVisible,
  closeModal,
  selectedApps,
  setSelectedApps,
}) => {
  const [installedApps, setInstalledApps] = useState([]);
  const [displayApps, setDisplayApps] = useState([]);
  const [searchedApp, setSearchedApp] = useState('');

  useEffect(() => {
    InstalledApplicationsFetcher.getInstalledApps(allApps => {
      let sortedApps;
      sortedApps = allApps.sort((a, b) => {
        if (a.appName.toLowerCase() < b.appName.toLowerCase()) {
          return -1;
        }
        if (a.appName.toLowerCase() > b.appName.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setInstalledApps(sortedApps);
      setDisplayApps(sortedApps);
    });
  }, []);

  useEffect(() => {
    setDisplayApps(
      installedApps.filter(app =>
        app.appName.toLowerCase().includes(searchedApp.toLowerCase()),
      ),
    );
  }, [searchedApp]);

  // console.log(selectedApps);

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onBackButtonPress={closeModal}
      backdropColor="rgba(0, 0, 0,0.6)"
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={styles.searchBar}>
          <IonIcon iconName="search" iconColor="#ffffff" iconSize={23} />
          <TextInput
            style={styles.searchBarInput}
            value={searchedApp}
            onChangeText={val => setSearchedApp(val)}
            placeholder="Search app"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>
        <ScrollView>
          {displayApps.map(displayApp => (
            <AppsSelectorEachApp
              key={displayApp.appPackageName}
              appName={displayApp.appName}
              appPackageName={displayApp.appPackageName}
              appIcon={displayApp.appIcon}
              selectedApps={selectedApps}
              selectApp={newApp => setSelectedApps([...selectedApps, newApp])}
              unSelectApp={deletedApp =>
                setSelectedApps(selectedApps.filter(app => app != deletedApp))
              }
            />
          ))}
        </ScrollView>
        <Ripple
          rippleDuration={300}
          rippleContainerBorderRadius={5}
          style={styles.bottomButton}
          rippleColor="#ffffff"
          onPress={closeModal}>
          <Text style={styles.bottomButtonText}>Back</Text>
        </Ripple>
      </View>
    </Modal>
  );
};

export default AppsSelectorModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#000000',
    borderRadius: 20,
    marginTop: 70,
    padding: 8,
    minHeight: 600,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // backgroundColor: '#ffffff',
    height: '100%',
    padding: 10,
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBarInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#ffffff',
    borderBottomWidth: 2,
    marginLeft: 25,
    borderBottomColor: '#ffffff',
    padding: 0,
    height: 30,
    width: '70%',
  },
  bottomButton: {
    alignSelf: 'flex-end',
    marginLeft: 28,
  },
  bottomButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
});

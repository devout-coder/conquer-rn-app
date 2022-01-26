import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import Ripple from 'react-native-material-ripple';
import {NativeModules} from 'react-native';
import AppsSelectorEachApp from './AppsSelectorEachApp';
import {ScrollView} from 'react-native-gesture-handler';
const {InstalledApplicationsFetcher} = NativeModules;

const AppsSelectorModal = ({modalVisible, closeModal}) => {
  const [installedApps, setInstalledApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);

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
    });
  }, []);

  //   const unSelectApp = deletedApp => {
  //     // setSelectedApps(selectedApps.filter(app => app != deletedApp));
  //     console.log(deletedApp);
  //   };
  console.log(selectedApps);

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onBackButtonPress={closeModal}
      backdropColor="rgba(0, 0, 0,0.6)"
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <ScrollView>
          {installedApps.map(installedApp => (
            <AppsSelectorEachApp
              key={installedApp.appPackageName}
              appName={installedApp.appName}
              appPackageName={installedApp.appPackageName}
              appIcon={installedApp.appIcon}
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
    padding: 13,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // backgroundColor: '#ffffff',
    height: '100%',
    padding: 10,
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

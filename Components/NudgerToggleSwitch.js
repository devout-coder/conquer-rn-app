import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import {NativeModules} from 'react-native';
import NudgerConfirmationModal from './NudgerConfirmationModal';
import {nudgerSwitchContext} from '../context';
const {AccessibilityPermissionHandler} = NativeModules;
const {InstalledApplicationsFetcher} = NativeModules;
import {MMKV} from 'react-native-mmkv';

const NudgerToggleSwitch = () => {
  const storage = new MMKV();

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  let {nudgerSwitch, setNudgerSwitch} = useContext(nudgerSwitchContext);
  const [nudgerSwitchDetailsFetched, setNudgerSwitchDetailsFetched] =
    useState(false);

  useEffect(() => {
    // InstalledApplicationsFetcher.getNudgerSwitchState(nudgerSwitchState => {
    AccessibilityPermissionHandler.checkAccessibilityPermission(
      accessEnabled => {
        if (storage.getBoolean('isNudgerOn') && accessEnabled == 1) {
          setNudgerSwitch(true);
          setNudgerSwitchDetailsFetched(true);
        } else {
          setNudgerSwitch(false);
          setNudgerSwitchDetailsFetched(true);
        }
      },
    );
    // });
  }, []);

  const checkIfAccessibilityIsOn = newSwitchState => {
    if (newSwitchState) {
      // nudger is turned on
      setNudgerSwitchDetailsFetched(false);
      AccessibilityPermissionHandler.checkAccessibilityPermission(
        accessEnabled => {
          if (accessEnabled == 0) {
            //accessibility permission isn't given
            setConfirmationModalVisible(true);
            setNudgerSwitchDetailsFetched(true);
            // AccessibilityPermissionHandler.navigateToAccessibilitySettings();
          } else if (accessEnabled == 1) {
            //accesibility permission is given
            InstalledApplicationsFetcher.saveNudgerSwitchState(newSwitchState);
            storage.set('isNudgerOn', newSwitchState);
            setNudgerSwitchDetailsFetched(true);
            setNudgerSwitch(newSwitchState);
          }
        },
      );
    } else {
      //nudger is turned off
      InstalledApplicationsFetcher.saveNudgerSwitchState(newSwitchState);
      storage.set('isNudgerOn', newSwitchState);
      setNudgerSwitch(newSwitchState);
    }
  };

  return (
    <>
      {nudgerSwitchDetailsFetched ? (
        <ToggleSwitch
          isOn={nudgerSwitch}
          onColor="#00ff00"
          offColor="red"
          animationSpeed={100}
          labelStyle={{color: 'black', fontWeight: '900'}}
          size="medium"
          onToggle={newSwitchState => checkIfAccessibilityIsOn(newSwitchState)}
        />
      ) : (
        <ActivityIndicator size="small" color="#00ff00" />
      )}
      <NudgerConfirmationModal
        modalVisible={confirmationModalVisible}
        closeModal={() => setConfirmationModalVisible(false)}
        navigateToAccessibilitySettings={() => {
          AccessibilityPermissionHandler.navigateToAccessibilitySettings();
          setConfirmationModalVisible(false);
        }}
      />
    </>
  );
};

export default NudgerToggleSwitch;

const styles = StyleSheet.create({});

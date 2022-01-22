import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import {NativeModules} from 'react-native';
import NudgerConfirmationModal from './NudgerConfirmationModal';
import {nudgerSwitchContext} from '../context';
const {AccessibilityPermissionHandler} = NativeModules;

const NudgerToggleSwitch = () => {
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  let {nudgerSwitch, setNudgerSwitch} = useContext(nudgerSwitchContext);

  const checkIfAccessibilityIsOn = newSwitchState => {
    if (newSwitchState) {
      // nudger is turned on
      AccessibilityPermissionHandler.checkAccessibilityPermission(
        accessEnabled => {
          if (accessEnabled == 0) {
            //accessibility permission isn't given
            setConfirmationModalVisible(true);
            // AccessibilityPermissionHandler.navigateToAccessibilitySettings();
          } else if (accessEnabled == 1) {
            //accesibility permission is given
            setNudgerSwitch(newSwitchState);
          }
        },
      );
    } else {
      setNudgerSwitch(newSwitchState);
    }
  };
  return (
    <>
      <ToggleSwitch
        isOn={nudgerSwitch}
        onColor="lightgreen"
        offColor="red"
        animationSpeed={100}
        labelStyle={{color: 'black', fontWeight: '900'}}
        size="medium"
        onToggle={newSwitchState => checkIfAccessibilityIsOn(newSwitchState)}
      />
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

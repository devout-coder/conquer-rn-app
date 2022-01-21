import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import {NativeModules} from 'react-native';
const {AccessibilityPermissionHandler} = NativeModules;

const NudgerToggleSwitch = () => {
  console.log('native module:', AccessibilityPermissionHandler);
  const [switchState, setSwitchState] = useState(false);
  const checkIfAccessibilityIsOn = newSwitchState => {
    if (newSwitchState) {
      //nudger is turned on
      if (AccessibilityPermissionHandler.checkAccessibilityPermission() == 0) {
        //accessibility permission isn't given
        AccessibilityPermissionHandler.navigateToAccessibilitySettings();
        console.log("permission isn't given");
      } else {
        //accesibility permission is given
        console.log('permission is given');
        setSwitchState(true);
      }
    }
  };
  return (
    <ToggleSwitch
      isOn={switchState}
      onColor="lightgreen"
      offColor="red"
      animationSpeed={100}
      labelStyle={{color: 'black', fontWeight: '900'}}
      size="medium"
      onToggle={newSwitchState => checkIfAccessibilityIsOn(newSwitchState)}
    />
  );
};

export default NudgerToggleSwitch;

const styles = StyleSheet.create({});

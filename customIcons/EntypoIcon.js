import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const EntypoIcon = ({iconSize, iconColor, iconName}) => {
  return <Icon size={iconSize} color={iconColor} name={iconName} />;
};

export default EntypoIcon;

const styles = StyleSheet.create({});

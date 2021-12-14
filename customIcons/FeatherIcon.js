import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const FeatherIcon = ({iconSize, iconColor, iconName}) => {
  return <Icon size={iconSize} color={iconColor} name={iconName} />;
};

export default FeatherIcon;

const styles = StyleSheet.create({});

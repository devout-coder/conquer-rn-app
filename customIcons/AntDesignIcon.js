import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const AntDesignIcon = ({iconSize, iconColor, iconName}) => {
  return <Icon size={iconSize} color={iconColor} name={iconName} />;
};

export default AntDesignIcon;

const styles = StyleSheet.create({});

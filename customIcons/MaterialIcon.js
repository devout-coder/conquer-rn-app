import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MaterialIcon = ({iconSize, iconColor, iconName}) => {
  return <Icon size={iconSize} color={iconColor} name={iconName} />;
};

export default MaterialIcon;

const styles = StyleSheet.create({});

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';

const LongTermTab = () => {
  return (
    <View style={globalStyles.overallBackground}>
      <Navbar />
    </View>
  );
};

export default LongTermTab;

const styles = StyleSheet.create({});

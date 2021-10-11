import React, { useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Navbar from '../Components/Navbar';
import YearPicker from '../Components/YearPicker';
import globalStyles from '../globalStyles';

const YearlyTab = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <View style={globalStyles.overallBackground}>
      <Navbar />
      <YearPicker year={year} changeYear={year => setYear(year)} />
    </View>
  );
};

export default YearlyTab;

const styles = StyleSheet.create({});

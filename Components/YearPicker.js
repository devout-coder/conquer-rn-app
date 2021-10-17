import React from 'react';
import {StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const YearPicker = ({year, changeYear}) => {
  function getYears() {
    //returns an array which has years from 2020 to 2100
    let allYears = [];
    let initialYear = 2020;
    while (initialYear <= 2030) {
      allYears.push(initialYear);
      initialYear++;
    }
    return allYears;
  }

  return (
    <Picker
      selectedValue={year}
      dropdownIconColor={'#ffffff'}
      style={{
        width: 120,
        color: '#ffffff',
        fontSize:24
      }}
      //   itemStyle={{fontFamily:"Poppins-Medium", height:10}}
      mode={'dropdown'}
      onValueChange={newYear => changeYear(newYear)}>
      {getYears().map(year => (
        <Picker.Item
          label={String(year)}
          value={year}
          fontFamily="Poppins-Medium"
          style={{fontFamily:"Poppins-Medium", height:10}}
        />
      ))}
    </Picker>
  );
};

export default YearPicker;

const styles = StyleSheet.create({});

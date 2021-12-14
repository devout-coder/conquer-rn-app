import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesignIcon from '../customIcons/AntDesignIcon';

const YearPicker = ({year, changeYear}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() => {
    //returns an array which has years from 2020 to 2100
    let allYears = [];
    let initialYear = 2020;
    while (initialYear <= 2030) {
      allYears.push({label: initialYear, value: initialYear});
      initialYear++;
    }
    return allYears;
  });

  return (
    <DropDownPicker
      open={open}
      value={year}
      items={items}
      setOpen={setOpen}
      setValue={changeYear}
      setItems={setItems}
      style={{width: 95, backgroundColor: '#262647', borderColor: '#262647'}}
      containerStyle={{width: 95}}
      labelStyle={{color: '#ffffff', fontSize: 20}}
      textStyle={{
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
      }}
      ArrowDownIconComponent={() => (
        <AntDesignIcon
          iconName="caretdown"
          iconColor="#ffffff"
          style={{position: 'relative', bottom: 2}}
          iconSize={13}
        />
      )}
      ArrowUpIconComponent={() => (
        <AntDesignIcon iconName="caretup" iconColor="#ffffff" iconSize={13} />
      )}
      placeholder="Select Year"
    />
  );
};

export default YearPicker;

const styles = StyleSheet.create({});

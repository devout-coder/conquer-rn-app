import MaterialIcon from '../customIcons/MaterialIcon';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const PrioritySelector = ({priority, changePriority}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {
      label: 'High',
      value: '3',
      icon: () => (
        <MaterialIcon
          iconName="priority-high"
          iconColor="#FF3131"
          iconSize={24}
        />
      ),
    },
    {
      label: 'Medium',
      value: '2',
      icon: () => (
        <MaterialIcon
          iconName="priority-high"
          iconColor="#464D8E"
          iconSize={24}
        />
      ),
    },
    {
      label: 'Low',
      value: '1',
      icon: () => (
        <MaterialIcon
          iconName="priority-high"
          iconColor="#11B421"
          iconSize={24}
        />
      ),
    },
    {
      label: 'No Priority',
      value: '0',
      icon: () => (
        <MaterialIcon
          iconName="priority-high"
          iconColor="#414141"
          iconSize={24}
        />
      ),
    },
  ]);

  return (
    <DropDownPicker
      open={open}
      value={priority}
      items={items}
      setOpen={setOpen}
      setValue={changePriority}
      setItems={setItems}
      style={{width: 144}}
      containerStyle={{width: 144}}
      labelStyle={{}}
      textStyle={{
        fontSize: 15,
        fontFamily: 'Ubuntu-Medium',
      }}
      placeholder="Select Priority"
    />
  );
};

export default PrioritySelector;

const styles = StyleSheet.create({});

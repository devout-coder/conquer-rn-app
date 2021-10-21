import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrioritySelector = ({priority, changePriority}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {
      label: 'High',
      value: '3',
      icon: () => <Icon name="priority-high" color="#FF3131" size={24} />,
    },
    {
      label: 'Medium',
      value: '2',
      icon: () => <Icon name="priority-high" color="#464D8E" size={24} />,
    },
    {
      label: 'Low',
      value: '1',
      icon: () => <Icon name="priority-high" color="#11B421" size={24} />,
    },
    {
      label: 'No Priority',
      value: '0',
      icon: () => <Icon name="priority-high" color="#414141" size={24} />,
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

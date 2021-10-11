import React, { useEffect } from 'react';
import {BackHandler, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';

const Todos = ({route, navigation}) => {
  const {time, lastPage} = route.params;
  // console.log(time)
  // console.log(lastPage)

  useEffect(() => {
    const backHandler = BackHandler.removeEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={globalStyles.overallBackground}>
      <Navbar />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{color:"#ffffff"}} >Todos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Todos;

const styles = StyleSheet.create({});

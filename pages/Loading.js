import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import globalStyles from '../globalStyles';

const Loading = () => {
  return (
    <View style={styles.background}>
      <ActivityIndicator style={styles.loading} size="large" color="#00ff00" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#262647',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center'
  },
});

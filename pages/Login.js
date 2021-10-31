import React, {useState} from 'react';
import { Text, View } from 'react-native';
import LoginorSignupForm from '../Components/LoginorSignupForm';

const Login = () => {
  return (
    <LoginorSignupForm loginorSignup="Login" />  
    // <View>
    //   <Text>fuck</Text>
    // </View>
  );
};

export default Login;
import {ToastAndroid} from 'react-native';

const Toast = message => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

export default Toast;

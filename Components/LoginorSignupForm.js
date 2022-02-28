import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  BackHandler,
} from 'react-native';
import Navbar from '../Components/Navbar';
import globalStyles from '../globalStyles';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {navbarContext} from '../context';
import EntypoIcon from '../customIcons/EntypoIcon';

GoogleSignin.configure({
  webClientId:
    '211268365227-ndd0v4ha1jmso87v040geqoi9baeul5o.apps.googleusercontent.com',
});

const LoginorSignupForm = ({loginorSignup}) => {
  const {nav, setNav} = useContext(navbarContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openEye, setOpenEye] = useState('flex');
  const [closedEye, setClosedEye] = useState('none');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log('back pressed on login/signup');
        nav.push('Landing');
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const openEyeStyles = {
    display: openEye,
  };

  const closedEyeStyles = {
    display: closedEye,
  };

  function toggleVisibility(whichEye) {
    if (whichEye == 'closedEye') {
      setClosedEye('none');
      setOpenEye('flex');
    } else if (whichEye == 'openEye') {
      setOpenEye('none');
      setClosedEye('flex');
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      await auth().currentUser.updateProfile({displayName: username});
      setLoading(false);
      setUsername('');
      setEmail('');
      setPassword('');
      nav.push('Main');
    } catch (error) {
      setModalVisible(true);
      setModalMessage(error.message);
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      setEmail('');
      setPassword('');
      nav.push('Main');
    } catch (error) {
      setModalVisible(true);
      setModalMessage(error.message);
      setLoading(false);
    }
  };

  const signUpgoogle = async () => {
    setLoading(true);
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    try {
      await auth().signInWithCredential(googleCredential);
      setLoading(false);
      setUsername('');
      setEmail('');
      setPassword('');
      nav.navigate('Main');
    } catch (error) {
      setModalVisible(true);
      setModalMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.overallBackground}>
      <Navbar page="LoginOrSignup" />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Okay got it...</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.form}>
        {loginorSignup == 'Signup' ? (
          <View style={styles.field}>
            <Text style={styles.fieldName}>Username</Text>
            <TextInput
              style={styles.input}
              defaultValue={username}
              onChangeText={val => setUsername(val)}
            />
          </View>
        ) : (
          <View></View>
        )}
        <View style={styles.field}>
          <Text style={styles.fieldName}>Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            defaultValue={email}
            onChangeText={val => setEmail(val)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldName}>Password</Text>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            secureTextEntry={openEye == 'flex' ? true : false}
            defaultValue={password}
            onChangeText={val => setPassword(val)}
          />
          <TouchableOpacity
            style={[styles.eyeIcon, openEyeStyles]}
            onPress={() => toggleVisibility('openEye')}>
            <EntypoIcon iconName="eye" iconSize={25} iconColor="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.eyeIcon, closedEyeStyles]}
            onPress={() => toggleVisibility('closedEye')}>
            <EntypoIcon
              iconName="eye-with-line"
              iconSize={25}
              iconColor="#000000"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.butt}
          onPress={() => {
            if (loginorSignup == 'Signup') {
              signUp();
            } else {
              login();
            }
          }}>
          <Text style={styles.buttText}>{loginorSignup}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gButt} onPress={signUpgoogle}>
          <Text style={styles.buttText}>{loginorSignup} with </Text>
          <Image
            source={require('../resources/images/googleLogo.png')}
            style={styles.Glogo}
          />
        </TouchableOpacity>
        {loginorSignup == 'Signup' ? (
          <Text style={styles.altText} onPress={() => nav.navigate('Login')}>
            Have an account? &nbsp;
            <Text style={styles.altLink}>Login</Text>
          </Text>
        ) : (
          <Text style={styles.altText} onPress={() => nav.navigate('Signup')}>
            Don't have an account? &nbsp;
            <Text style={styles.altLink}>Signup</Text>
          </Text>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default LoginorSignupForm;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 320,
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#1f1f37',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  field: {
    // marginTop: 20,
  },
  input: {
    backgroundColor: '#a381f7',
    borderRadius: 18,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    width: 200,
    padding: 0,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    alignSelf: 'flex-end',
    position: 'relative',
    bottom: 32,
    right: 7,
  },
  fieldName: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  butt: {
    backgroundColor: '#6dbcdd',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    borderRadius: 8,
  },
  gButt: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    backgroundColor: '#f1e46b',
    paddingLeft: 2,
    marginTop: 10,
    borderRadius: 8,
  },
  buttText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  Glogo: {
    height: 20,
    width: 20,
  },
  altText: {
    color: '#fffcfc',
    fontFamily: 'Poppins-Light',
    fontSize: 17,
    marginTop: 9,
  },
  altLink: {
    color: '#6dbcdd',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
});

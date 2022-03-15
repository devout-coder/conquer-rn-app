import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import Ripple from 'react-native-material-ripple';
import CheckBox from '@react-native-community/checkbox';
import {userContext} from '../context';

const TodoModalEachFriend = ({friend, todoTaskUsers, setTodoTaskUsers}) => {
  let user = useContext(userContext);
  const [checked, setChecked] = useState(
    todoTaskUsers.includes(friend.friendId) ? true : false,
  );

  const checkUncheckfunc = () => {
    if (!checked) {
      setTodoTaskUsers([...todoTaskUsers, friend.friendId]);
    } else {
      setTodoTaskUsers(todoTaskUsers.filter(item => item !== friend.friendId));
    }
    setChecked(!checked);
  };

  return user.uid == todoTaskUsers[0] ? (
    <View style={styles.eachFriendContainer}>
      <Ripple
        rippleDuration={300}
        rippleContainerBorderRadius={5}
        rippleColor="#ffffff"
        onPress={checkUncheckfunc}
        style={styles.bottomButton}>
        <View style={styles.eachFriend}>
          <CheckBox
            value={checked}
            tintColors={{
              true: '#F1D7D7',
              false: '#F1D7D7',
            }}
            onValueChange={checkUncheckfunc}
          />
          {friend.friendPhotoUrl != null ? (
            <Image
              style={styles.friendPhoto}
              source={{uri: friend.friendPhotoUrl}}
            />
          ) : (
            <Image
              style={styles.friendPhoto}
              source={require('../resources/images/avatar.png')}
            />
          )}
          <Text style={styles.friendName}>{friend.friendName}</Text>
        </View>
      </Ripple>
    </View>
  ) : (
    <View style={styles.eachFriendContainer}>
      <View style={styles.eachFriend}>
        {friend.friendId == user.uid ? (
          <CheckBox
            value={checked}
            tintColors={{
              true: '#F1D7D7',
              false: '#F1D7D7',
            }}
            onValueChange={checkUncheckfunc}
          />
        ) : (
          <View style={{marginRight: '11%'}}></View>
        )}
        {friend.friendPhotoUrl != null ? (
          <Image
            style={styles.friendPhoto}
            source={{uri: friend.friendPhotoUrl}}
          />
        ) : (
          <Image
            style={styles.friendPhoto}
            source={require('../resources/images/avatar.png')}
          />
        )}
        <Text style={styles.friendName}>{friend.friendName}</Text>
        {friend.friendId == todoTaskUsers[0] ? (
          <Text style={styles.ownerText}>Owner</Text>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default TodoModalEachFriend;

const styles = StyleSheet.create({
  eachFriendContainer: {
    width: '98%',
  },
  eachFriend: {
    width: '100%',
    padding: 15,
    // backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendPhoto: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: '5%',
  },
  friendName: {
    fontFamily: 'Poppins-Regular',
    color: '#F1D7D7',
    fontSize: 20,
    width: '69%',
    // backgroundColor: '#ffffff',
    marginLeft: '8%',
  },
  ownerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#ffffff',
    marginLeft: 'auto',
  },
});

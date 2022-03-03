import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import DeleteFriendModal from './DeleteFriendModal';
import MaterialIcon from '../customIcons/MaterialIcon';

const EachFriend = ({friend}) => {
  const [deleteFriendModalVisible, setDeleteFriendModalVisible] =
    useState(false);

  return (
    <View style={styles.eachFriend}>
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
      <View style={styles.friendNameView}>
        <Text style={styles.friendName}>{friend.friendName}</Text>
      </View>
      <TouchableOpacity
        styles={styles.friendRemove}
        onPress={() => setDeleteFriendModalVisible(true)}>
        <MaterialIcon
          iconName="delete"
          iconSize={25}
          iconColor="rgb(255, 49, 49)"
        />
      </TouchableOpacity>
      <DeleteFriendModal
        modalVisible={deleteFriendModalVisible}
        closeModal={() => setDeleteFriendModalVisible(false)}
        friend={friend}
      />
    </View>
  );
};

export default EachFriend;

const styles = StyleSheet.create({
  eachFriend: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    // backgroundColor:"#ffffff",
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendPhoto: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  friendNameView: {
    // width: '100%',
    // backgroundColor:"#ffffff",
    width: '50%',
  },
  friendName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#ffffff',
    // backgroundColor: '#ffffff',
    // width: '100%',
  },
  friendRemove: {
    alignSelf: 'flex-end',
    // position: 'absolute',
    // right: 0,
  },
});

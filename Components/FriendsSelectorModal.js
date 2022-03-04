import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {userContext} from '../context';
import firestore from '@react-native-firebase/firestore';
import TodoModalEachFriend from './TodoModalEachFriend';

const FriendsSelectorModal = ({
  modalVisible,
  closeModal,
  selectedFriends,
  setSelectedFriends,
}) => {
  let user = useContext(userContext);
  let [userFriends, setUserFriends] = useState([]);
  let [friendsLoading, setFriendsLoading] = useState(true);

  const fetchFriends = async () => {
    let friends = (
      await firestore().collection('friends').doc(user.uid).get()
    ).get('friends');
    setUserFriends(friends);
    setFriendsLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      backdropColor="rgba(0, 0, 0,0.6)"
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Task shared with:</Text>
        {!friendsLoading ? (
          <ScrollView
            style={styles.allFriends}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {userFriends.map((friend, index) => (
              <TodoModalEachFriend
                key={index}
                friend={friend}
                selectedFriends={selectedFriends}
                setSelectedFriends={setSelectedFriends}
              />
            ))}
          </ScrollView>
        ) : (
          <ActivityIndicator size="large" color="#00ff00" />
        )}
      </View>
    </Modal>
  );
};

export default FriendsSelectorModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#000000',
    borderRadius: 20,
    marginTop: 100,
    height: 'auto',
    position: 'absolute',
    alignSelf: 'center',
    width: '90%',
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // backgroundColor: '#ffffff',
    height: '100%',
    padding: 10,
  },

  modalTitle: {
    margin: 10,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    fontSize: 20,
  },
  allFriends: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    // backgroundColor: '#ffffff',
    flex: 1,
  },
});

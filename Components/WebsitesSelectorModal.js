import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';
import Ripple from 'react-native-material-ripple';

const WebsitesSelectorModal = ({
  modalVisible,
  closeModal,
  selectedWebsites,
  setSelectedWebsites,
}) => {

  const [blacklistedWebsites, setBlacklistedWebsites] = useState(
    selectedWebsites.join('\n'),
  );

  const saveWebsites = () => {
    const blacklistedWebsitesArray = blacklistedWebsites.split('\n');
    setSelectedWebsites(blacklistedWebsitesArray);
    closeModal();
  };

  // useEffect(() => {
  //   setBlacklistedWebsites();
  // }, []);

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onBackButtonPress={saveWebsites}
      backdropColor="rgba(0, 0, 0,0.6)"
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <TextInput
          multiline={true}
          numberOfLines={100}
          placeholder={
            'Enter the domain names of websites which you want to be blacklisted in every new line. Eg:\n\nyoutube.com\ninstagram.com'
          }
          value={blacklistedWebsites}
          onChangeText={val => setBlacklistedWebsites(val)}
          placeholderTextColor="rgba(255,255,255, 0.5)"
          style={styles.websitesInputContainer}
        />
        <Ripple
          rippleDuration={300}
          rippleContainerBorderRadius={5}
          style={styles.bottomButton}
          rippleColor="#ffffff"
          onPress={saveWebsites}>
          <Text style={styles.bottomButtonText}>Back</Text>
        </Ripple>
      </View>
    </Modal>
  );
};

export default WebsitesSelectorModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#000000',
    borderRadius: 20,
    marginTop: 70,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 500,
    maxHeight: 500,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: 10,
  },
  websitesInputContainer: {
    borderColor: '#F1D7D7',
    borderWidth: 2,
    borderRadius: 10,
    height: '90%',
    backgroundColor: '#1a1616',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#ffffff',
    padding: 10,
    textAlignVertical: 'top',
  },
  bottomButton: {
    alignSelf: 'flex-end',
    marginLeft: 28,
  },
  bottomButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
});

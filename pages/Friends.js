import {StyleSheet, Text, View, BackHandler, Share} from 'react-native';
import React, {useEffect} from 'react';
import globalStyles from '../globalStyles';
import Ripple from 'react-native-material-ripple';
import auth from '@react-native-firebase/auth';

const Friends = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Main');
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
  });

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Tap this link to accept ${
          auth().currentUser.displayName
        }'s Conquer friend request\nhttps://conquer-goals.netlify.app/add-friend/${
          auth().currentUser.uid
        }`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('shared with activity type of result.activityType');
        } else {
          // shared
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={globalStyles.overallBackground}>
      <View style={styles.mainContainer}>
        <Text style={styles.normalText}>
          Add friends to create common tasks with them
        </Text>
        <Ripple
          rippleDuration={300}
          rippleColor="#ffffff"
          onPress={onShare}
          rippleContainerBorderRadius={5}>
          <Text style={styles.shareLink}>Share friendship link</Text>
        </Ripple>
      </View>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  normalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#ffffff',
  },
  mainContainer: {
    // backgroundColor: '#ffffff',
    width: '92%',
  },
  shareLink: {
    color: '#eada76',
    alignSelf: 'center',
    marginTop: 9,
    fontFamily: 'Poppins-Medium',
    fontSize: 21,
  },
});

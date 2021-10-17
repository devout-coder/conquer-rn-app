import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EachTodo = ({
  id,
  index,
  priority,
  taskName,
  taskDesc,
  finished,
  time,
  timeType,
  reloadTodos,
}) => {
  const [checked, setChecked] = useState(finished);
  const [modalOpen, setModalOpen] = useState(false); //this state controls the delete modal

  const checkUncheckfunc = val => {
    //this toggles check of todo checkbox and also toggles boolean value of finished property of that particular todo in firestore

    setChecked(val);
    firestore()
      .collection('todos')
      .doc(id)
      .set(
        {
          finished: val,
        },
        {merge: true},
      )
      .then(() => {
        reloadTodos(); //this triggers that loadData func in allTodos which fetches all todos again
      })
      .catch(error => console.log(error));
  };

  function deleteTodoManagePri(newIndex) {
    //this function manages index of todos below a certain todo in case i delete it

    props.unfinishedTodos.forEach((each, index) => {
      if (index >= newIndex) {
        firebaseApp
          .firestore()
          .collection('todos')
          .doc(each.id)
          .update({
            index: index - 1,
          });
      }
    });
  }
  return (
    <View style={styles.eachTodo}>
      {!finished ? (
        <Icon name="drag-indicator" style={styles.dragIcon} size={26} />
      ) : (
        <View></View>
      )}
      <CheckBox
        value={checked}
        tintColors={{
          true: '#474747',
          false:
            priority == 3
              ? '#ff5151'
              : priority == 2
              ? '#7885fb'
              : priority == 1
              ? '#20e734'
              : 'rgba(198, 196, 196, 0.61)',
        }}
        onValueChange={val => checkUncheckfunc(val)}
      />
      <Text
        style={[
          styles.taskName,
          {
            color: finished
              ? '#474747'
              : priority == 3
              ? '#ff5151'
              : priority == 2
              ? '#7885fb'
              : priority == 1
              ? '#20e734'
              : 'rgba(198, 196, 196, 0.61)',
            textDecorationLine: finished ? 'line-through' : 'none',
            width: finished ? 265 : 240,
          },
        ]}>
        {taskName}
      </Text>
    </View>
  );
};

export default EachTodo;

const styles = StyleSheet.create({
  eachTodo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:5,
    marginBottom:5,
    // backgroundColor:"#ffffff",
    width: 320,
  },
  dragIcon: {
    color: '#c6c4c4',
  },
  taskName: {
    color: '#ffffff',
    // backgroundColor: '#ffffff',
    fontFamily: 'Ubuntu-Italic',
    lineHeight:30,
    marginLeft: 8,
    fontSize: 20,
  },
});

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TodoModal from './TodoModal';
import auth from '@react-native-firebase/auth';

const EachTodo = ({
  id,
  index,
  priority,
  taskName,
  taskDesc,
  finished,
  time,
  nextTime,
  timeType,
  reloadTodos,
  allTodos,
  sidebarTodo,
  navigation,
  year,
  changeYear,
  spinArrowDown,
  decreaseSidebarHeight,
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
        if (sidebarTodo) {
          new reloadTodos();
        } else {
          reloadTodos(); //this triggers that loadData func in allTodos which fetches all todos again
        }
      })
      .catch(error => console.log(error));
  };

  function handleTimePress() {
    if (timeType == 'year') {
      changeYear(time);
      spinArrowDown();
      decreaseSidebarHeight();
    } else {
      navigation.push('Todos', {time: time, lastPage: timeType});
    }
  }
  return (
    <View style={styles.eachTodo}>
      {modalOpen ? (
        <TodoModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          id={id}
          taskName={taskName}
          taskDesc={taskDesc}
          priority={priority}
          finished={finished}
          time={time}
          nextTime={nextTime}
          index={index}
          timeType={timeType}
          reloadTodos={() => new reloadTodos()}
          allTodos={allTodos}
        />
      ) : (
        <View></View>
      )}
      {/* {!finished && !sidebarTodo ? (
        <Icon name="drag-indicator" style={styles.dragIcon} size={26} />
      ) : (
        <View></View>
      )} */}
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
      <TouchableOpacity onPress={() => setModalOpen(true)}>
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
      </TouchableOpacity>
      {sidebarTodo ? (
        <TouchableOpacity onPress={() => handleTimePress()}>
          <Text style={styles.time}>{time}</Text>
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default EachTodo;

const styles = StyleSheet.create({
  eachTodo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
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
    lineHeight: 30,
    marginLeft: 8,
    fontSize: 20,
  },
  time: {
    color: 'rgba(115, 110, 110, 0.68)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 8,
    position: 'relative',
    top: 10,
    // backgroundColor: '#ffffff',
    width: 70,
  },
});

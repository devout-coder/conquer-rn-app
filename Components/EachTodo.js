import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import TodoModal from './TodoModal';
import auth from '@react-native-firebase/auth';
import MaterialIcon from '../customIcons/MaterialIcon';
import IonIcon from '../customIcons/IonIcon';

const EachTodo = ({
  id,
  index,
  priority,
  taskName,
  taskDesc,
  finished,
  time,
  timeType,
  users,
  timesPostponed,
  reloadTodos,
  allTodos,
  sidebarTodo,
  navigation,
  year,
  changeYear,
  spinArrowDown,
  decreaseSidebarHeight,
  drag,
  isActive,
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
      navigation.push('Todos', {time: time, timeType: timeType});
    }
  }
  return (
    <TouchableOpacity style={styles.eachTodo}>
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
          index={index}
          timeType={timeType}
          users={users}
          timesPostponed={timesPostponed}
          reloadTodos={() => new reloadTodos()}
          allTodos={allTodos}
        />
      ) : (
        <View></View>
      )}
      {!finished && !sidebarTodo ? (
        <MaterialIcon
          iconName="drag-indicator"
          iconColor="#c6c4c4"
          iconSize={26}
        />
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
      <TouchableOpacity
        onPress={() => setModalOpen(true)}
        onLongPress={drag}
        disabled={isActive}>
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
              width: finished
                ? users.length > 1
                  ? 245
                  : 265
                : users.length > 1 && !sidebarTodo
                ? 220
                : 240,
              // width: '80%',
              // backgroundColor: '#ffffff',
            },
          ]}>
          {taskName}
        </Text>
      </TouchableOpacity>
      <View
        style={[styles.eachTodoExtremeRight, {width: sidebarTodo ? 70 : null}]}>
        {users.length > 1 ? (
          <IonIcon
            iconName="people-circle-outline"
            iconColor="#c6c4c4"
            iconSize={26}
            style={styles.sharedIcon}
          />
        ) : (
          <></>
        )}
        {sidebarTodo ? (
          <TouchableOpacity onPress={() => handleTimePress()}>
            <Text style={styles.time}>{time}</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
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
    // backgroundColor: '#ffffff',
    width: '80%',
    justifyContent: 'space-between',
  },
  taskName: {
    color: '#ffffff',
    // backgroundColor: '#ffffff',
    fontFamily: 'Ubuntu-Italic',
    lineHeight: 30,
    marginLeft: 8,
    fontSize: 20,
  },
  eachTodoExtremeRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: 'rgba(115, 110, 110, 0.68)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 5,
  },
});

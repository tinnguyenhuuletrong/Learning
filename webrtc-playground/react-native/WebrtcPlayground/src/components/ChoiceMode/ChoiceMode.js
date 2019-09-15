import React, {useCallback, useEffect} from 'react';
import {
  AppState,
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';

import DisplayIfStep from '../../containers/DisplayIfStep';
import {useStateValue, CONSTANT} from '../../../AppContext';

export default ({defaultIndex = 0, tabs = []}) => {
  const [{appStep, mode, roomId, connection}, dispatch] = useStateValue();

  useEffect(() => {
    const pageUnload = nextAppState => {
      console.log(nextAppState);
      if (nextAppState === 'inactive') {
        console.log('Cleanup - app quit ! ');
        dispatch({
          type: CONSTANT.EACTION.reset,
        });
      }
    };
    AppState.addEventListener('change', pageUnload);
    return () => {
      AppState.removeEventListener('change', pageUnload);
    };
  }, [dispatch, connection]);

  // Set app mode
  const setMode = useCallback(
    mode => {
      dispatch({
        type: CONSTANT.EACTION.setAppMode,
        value: mode,
      });
      dispatch({
        type: CONSTANT.EACTION.setAppStep,
        value: CONSTANT.ESTEP.NOT_CONNECT,
      });
    },
    [dispatch],
  );

  const onReset = useCallback(() => {
    connection && connection.destroy && connection.destroy();
    dispatch({
      type: CONSTANT.EACTION.reset,
    });
  }, [dispatch, connection]);

  // Set room Id
  const updateRoomId = useCallback(
    roomId => {
      dispatch({
        type: CONSTANT.EACTION.setRoomId,
        value: roomId,
      });
    },
    [dispatch],
  );
  const stepLock =
    appStep === CONSTANT.ESTEP.CHOICE_MODE
      ? {disabled: false}
      : {disabled: true};

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          {...stepLock}
          style={styles.input}
          editable
          value={roomId}
          onChangeText={text => updateRoomId(text)}
          placeholder="Room Id"
        />
      </View>
      <View style={styles.row}>
        <Button
          style={styles.choiceButton}
          title="Host"
          {...stepLock}
          onPress={e => {
            setMode(CONSTANT.ECLIENT_MODE.HOST);
          }}
        />
        <Button
          style={styles.choiceButton}
          title="Peer"
          {...stepLock}
          onPress={e => {
            setMode(CONSTANT.ECLIENT_MODE.PEER);
          }}
        />
      </View>
      <View style={styles.row}>
        <DisplayIfStep
          expectedAppStep={[
            CONSTANT.ESTEP.CONNECTED,
            CONSTANT.ESTEP.DISCONNECT,
            CONSTANT.ESTEP.NOT_CONNECT,
          ]}>
          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </DisplayIfStep>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingBottom: 5,
  },
  input: {
    width: '100%',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  choiceButton: {},
  resetButton: {
    backgroundColor: '#ffdd57',
    padding: 8,
  },
  resetButtonText: {
    color: 'black',
    fontSize: 18,
  },
});

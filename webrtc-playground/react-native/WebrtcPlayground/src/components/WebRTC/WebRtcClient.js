import React, {useCallback, useReducer} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import WebRtcConfig from './WebRtcConfig';

import {useStateValue, CONSTANT} from '../../../AppContext';

export default props => {
  const [{roomId, mode, connection, appStep}, dispatch] = useStateValue();
  const [rtcConfig, dispatchRtcConfig] = useReducer((state, val) => {
    return {
      ...state,
      ...val,
    };
  }, {});

  const onRtcConfigChange = useCallback(
    val => {
      dispatchRtcConfig(val);
    },
    [dispatchRtcConfig],
  );

  // UI Callback
  const onStart = useCallback(() => {
    console.log('Create peer with', rtcConfig);
    connection.start({mode, simplePeerConfig: rtcConfig, signalRoom: roomId});
    dispatch({
      type: CONSTANT.EACTION.setAppStep,
      value: CONSTANT.ESTEP.CONNECTING,
    });
  }, [connection, rtcConfig, mode, roomId, dispatch]);

  const enable = appStep === CONSTANT.ESTEP.NOT_CONNECT;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <WebRtcConfig onChange={onRtcConfigChange} disabled={!enable} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.startButton}
          disabled={!enable}
          onPress={onStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 5,
  },

  startButton: {
    backgroundColor: '#00d1b2',
    padding: 8,
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

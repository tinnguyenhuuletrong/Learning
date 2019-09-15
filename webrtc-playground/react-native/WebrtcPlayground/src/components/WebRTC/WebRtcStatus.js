import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {useStateValue, CONSTANT} from '../../../AppContext';

const COLOR_MAP = {
  connecting: '#f6f9fe',
  connected: '#f5fffd',
  error: '#fff5f7',
  disconnected: '#fffdf5',
};

const TXT_COLOR_MAP = {
  connecting: '#22509a',
  connected: 'black',
  error: '#cd0930',
  disconnected: 'black',
};

export default ({defaultIndex = 0, tabs = []}) => {
  const [{connection}, dispatch] = useStateValue();
  const [status, setStatus] = useState('connecting');
  const [connectionInfo, setConnectionInfo] = useState({});

  useEffect(() => {
    const onChangeStatus = status => setStatus(status);
    connection.on('connect', e => {
      onChangeStatus('connected');
      setTimeout(() => {
        const {peer} = connection;
        const {localAddress = '', localFamily = '', localPort = ''} = peer;
        const {remoteAddress = '', remoteFamily = '', remotePort = ''} = peer;

        setConnectionInfo({
          local: `${localFamily} - ${localAddress}:${localPort}`,
          remote: `${remoteFamily} - ${remoteAddress}:${remotePort}`,
        });

        dispatch({
          type: CONSTANT.EACTION.setAppStep,
          value: CONSTANT.ESTEP.CONNECTED,
        });
      }, 1000);
    });
    connection.on('close', e => {
      connection.reset();
      onChangeStatus('disconnected');
      setConnectionInfo({});
      dispatch({
        type: CONSTANT.EACTION.setAppStep,
        value: CONSTANT.ESTEP.DISCONNECT,
      });
    });
    connection.on('error', e => onChangeStatus('error'));
  }, [connection, setConnectionInfo, dispatch]);

  return (
    // <article className={['message', COLOR_MAP[status]].join(' ')}>
    //   <div className="message-body">
    //     <p className="is-capitalized">{status}</p>
    //     <p className="is-size-7 is-italic	">
    //       Local: {connectionInfo.local && `${connectionInfo.local}`}
    //     </p>
    //     <p className="is-size-7 is-italic	">
    //       Remote: {connectionInfo.remote && `${connectionInfo.remote}`}
    //     </p>
    //   </div>
    // </article>
    <View
      style={[
        styles.sectionContainer,
        {
          backgroundColor: COLOR_MAP[status],
        },
      ]}>
      <View style={styles.sectionDescription}>
        <Text
          style={[
            styles.statusText,
            {
              color: TXT_COLOR_MAP[status],
            },
          ]}>
          {status}
        </Text>
        <Text
          style={[
            styles.subText,
            {
              color: TXT_COLOR_MAP[status],
            },
          ]}>
          Local: {connectionInfo.local && `${connectionInfo.local}`}
        </Text>
        <Text
          style={[
            styles.subText,
            {
              color: TXT_COLOR_MAP[status],
            },
          ]}>
          Remote: {connectionInfo.remote && `${connectionInfo.remote}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  sectionDescription: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  subText: {
    fontSize: 10,
    fontWeight: '400',
    fontStyle: 'italic',
  },
});

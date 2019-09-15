import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export default ({onChange, disabled}) => {
  const [configJson, setConfig] = useState(`{
    "trickle": true,
    "config": {
      "iceServers": [ { "urls": "stun:stun.l.google.com:19302" }, { "urls": "stun:global.stun.twilio.com:3478?transport=udp" } ]
    }
  }`);
  const [isCorrect, setIsCorrect] = useState(true);

  // Init value
  useEffect(() => {
    onChange && onChange(JSON.parse(configJson));
  }, []);

  const iconStatus = isCorrect ? styles.statusOk : styles.statusError;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.titleText}>
          STUN/TURN config{' '}
          <Text
            style={{
              ...styles.statusIcon,
              ...iconStatus,
            }}>
            {isCorrect ? '✓' : 'x'}
          </Text>
        </Text>
      </View>
      <TextInput
        style={styles.input}
        value={configJson}
        disabled
        editable
        multiline
        onChangeText={val => {
          try {
            setConfig(val);
            const newVal = JSON.parse(val);
            onChange && onChange(newVal);
            setIsCorrect(true);
          } catch (error) {
            setIsCorrect(false);
          }
        }}
      />
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
  input: {
    width: '100%',
    minWidth: 80,
    maxWidth: 350,
    minHeight: 20,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    fontSize: 10,
  },
  startButton: {
    backgroundColor: '#00d1b2',
    padding: 8,
    borderRadius: 3,
  },
  titleText: {
    fontWeight: '400',
    fontSize: 18,
  },
  statusIcon: {
    fontWeight: '600',
    fontSize: 18,
  },
  statusOk: {
    color: '#23d160',
  },
  statusError: {
    color: 'red',
  },
});

import {EventEmitter} from 'events';
import database from '@react-native-firebase/database';

import {ESTEP, EACTION} from './constant';
import WebRTCPeer from './libs/WebRTCPeer';
import FirebaseSignalChannel from './libs/FirebaseSignalChannel';

export const initialState = {
  supportWebRTC: false,
  appStep: ESTEP.CHOICE_MODE,
  roomId: `room-${Date.now()}`,
  mode: '',
  mineMedia: null,
  connection: new WebRTCPeer(new FirebaseSignalChannel(database())),
  eventSource: new EventEmitter(),
};

const mainReducer = (state, action) => {
  console.log('action', action);
  switch (action.type) {
    case EACTION.reset:
      const previousMedia = state.mineMedia;
      const previousConnection = state.connection;
      if (previousMedia) {
        previousMedia.getTracks().forEach(track => track.stop());
      }
      if (previousConnection) {
        previousConnection.reset();
      }
      return {
        ...initialState,
        eventSource: new EventEmitter(),
        supportWebRTC: true,
      };
    case EACTION.updateWebRTCSupport:
      return {
        ...state,
        supportWebRTC: action.value,
      };
    case EACTION.setAppMode:
      return {
        ...state,
        mode: action.value,
      };
    case EACTION.setRoomId:
      return {
        ...state,
        roomId: action.value,
      };
    case EACTION.setAppStep:
      return {
        ...state,
        appStep: action.value,
      };
    case EACTION.setMineMedia:
      return {
        ...state,
        mineMedia: action.value,
      };
    case EACTION.updateConenction:
      return {
        ...state,
        connection: action.value,
      };
    default:
      return state;
  }
};

const debugDev = reducer => (state, action) => {
  const newState = reducer(state, action);
  window.store = newState;
  return newState;
};

export const reducer = debugDev(mainReducer);
import { EventEmitter } from 'events'
import DetectRTC from 'detectrtc'
import Firebase from 'firebase/app'
import 'firebase/database'

import { ESTEP, EACTION } from './constant'

const firebaseConfig = {
  apiKey: 'AIzaSyBe719lkdeQBL0McXykgBMUClMUN3UgpUQ',
  databaseURL: 'https://weeklyhack-ff068.firebaseio.com/'
}
Firebase.initializeApp(firebaseConfig)

export const initialState = {
  supportWebRTC: false,
  appStep: ESTEP.CHOICE_MODE,
  roomId: `room-${Date.now()}`,
  mode: '',
  mineMedia: null,
  connection: null,
  eventSource: new EventEmitter(),
  firebaseDatabase: Firebase.database()
}

const mainReducer = (state, action) => {
  console.log('action', action)
  switch (action.type) {
    case EACTION.reset:
      const previousMedia = state.mineMedia
      const previousConnection = state.connection
      if (previousMedia) {
        previousMedia.getTracks().forEach(track => track.stop())
      }
      if (previousConnection) {
        previousConnection.destroy && previousConnection.destroy()
      }
      return {
        ...initialState,
        eventSource: new EventEmitter(),
        supportWebRTC: DetectRTC.isWebRTCSupported
      }
    case EACTION.updateWebRTCSupport:
      return {
        ...state,
        supportWebRTC: action.value
      }
    case EACTION.setAppMode:
      return {
        ...state,
        mode: action.value
      }
    case EACTION.setRoomId:
      return {
        ...state,
        roomId: action.value
      }
    case EACTION.setAppStep:
      return {
        ...state,
        appStep: action.value
      }
    case EACTION.setMineMedia:
      return {
        ...state,
        mineMedia: action.value
      }
    case EACTION.updateConenction:
      return {
        ...state,
        connection: action.value
      }
    default:
      return state
  }
}

const debugDev = reducer => (state, action) => {
  const newState = reducer(state, action)
  window.store = newState
  return newState
}

export const reducer = debugDev(mainReducer)

import { EventEmitter } from 'events'
import DetectRTC from 'detectrtc'
import { ESTEP, EACTION } from './constant'

export const initialState = {
  supportWebRTC: false,
  appStep: ESTEP.CHOICE_MODE,
  mode: '',
  connection: null,
  eventSource: new EventEmitter()
}

const mainReducer = (state, action) => {
  console.log('action', action)
  switch (action.type) {
    case EACTION.reset:
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
    case EACTION.setAppStep:
      return {
        ...state,
        appStep: action.value
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

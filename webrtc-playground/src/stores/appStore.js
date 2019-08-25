import { EventEmitter } from 'events'
import { ESTEP, EACTION } from './constant'

export const initialState = {
  appStep: ESTEP.CHOICE_MODE,
  mode: '',
  connection: null,
  signalData: '',

  eventSource: new EventEmitter()
}

export const reducer = (state, action) => {
  switch (action.type) {
    case EACTION.reset:
      return {
        ...initialState
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

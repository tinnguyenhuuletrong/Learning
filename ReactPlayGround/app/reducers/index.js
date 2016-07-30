import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter'
import input from './input'

const rootReduces = combineReducers({
  counter,
  input,
  routing
})

export default rootReduces
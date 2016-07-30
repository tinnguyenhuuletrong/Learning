import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter'

const rootReduces = combineReducers({
  counter,
  routing
})

export default rootReduces
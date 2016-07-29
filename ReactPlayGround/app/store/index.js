import { createStore } from 'redux'
import rootReducers from '../reducers'

let store 

if (process.env.NODE_ENV === 'production') {
	store = createStore(rootReducers)
}
else {
	//Enable Redux Chrome Debugger
	store = createStore(rootReducers, window.devToolsExtension && window.devToolsExtension())
}

export default store
import { createStore, applyMiddleware, compose } from 'redux'

//Thunk Middleware
import thunk from 'redux-thunk';

//Thunk, Route
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import rootReducers from '../reducers'

let store 

const router = routerMiddleware(hashHistory);


if (process.env.NODE_ENV === 'production') {
	const enhancer = applyMiddleware(thunk, router);
	store = createStore(rootReducers, {}, enhancer)
}
else {
	const enhancer = compose(
		applyMiddleware(thunk, router),
		window.devToolsExtension ? window.devToolsExtension() : noop => noop
	);

	//Enable Redux Chrome Debugger
	store = createStore(rootReducers, {}, enhancer)

	if (module.hot) {
		module.hot.accept('../reducers', () =>
			store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
		);
	}
}

export default store
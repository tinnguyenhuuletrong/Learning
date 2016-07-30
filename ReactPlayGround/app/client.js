import 'react-toolbox/lib/commons.scss';
import './theme/global.scss'
import React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ReactDOM from 'react-dom';

import routes from './routes';
import App from './containers/App.js';
import store from './store';

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render( 
	<Provider store={store}>
		<Router history={history} routes={routes} />
	</Provider>, 
	document.getElementById('app')
);

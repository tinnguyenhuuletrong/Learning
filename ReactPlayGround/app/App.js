import React, {Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import 'react-toolbox/lib/commons.scss';           // Import common styles
import PurpleAppBar from './components/PurpleAppBar.js';      // AppBar with simple overrides
import SuccessButton from './components/SuccessButton.js';    // A button with complex overrides
import { Button } from 'react-toolbox/lib/button'; // Bundled component import

import * as CounterActions from './actions/counter';


class App extends Component {
	static propTypes = {
	  counter: PropTypes.number.isRequired,
	  increment: PropTypes.func.isRequired,
	  decrement: PropTypes.func.isRequired
	};

	render() {
		const rootState = this.props;
		return (
			<div>
				<PurpleAppBar />
				<section style={{ padding: 20 }}>
					<SuccessButton label='Inc' primary raised onMouseUp={rootState.increment}/>
					<Button label='Dec' primary onMouseUp={rootState.decrement}/>
				</section>
				<section style={{ padding: 60 }}>
					<h1>{rootState.counter}</h1>
				</section>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		counter: state.counter
	};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

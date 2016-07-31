import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CounterManualTab from '../components/CounterManualTab.js';
import CounterAutoTab from '../components/CounterAutoTab.js';

import {Tab, Tabs} from 'react-toolbox';

import * as CounterActions from '../actions/counter.js';
import * as InputActions from '../actions/input.js';


class CounterContainer extends Component {
	state = {
    	index: 0
	};

	static propTypes = {
		counter: PropTypes.number.isRequired,
		input: PropTypes.object.isRequired,
		increment: PropTypes.func.isRequired,
		decrement: PropTypes.func.isRequired,
		updateDelayValue: PropTypes.func.isRequired
	};

	handleTabChange = (index) => {
		this.setState({index});
	};

	render() {
		const rootState = this.props;

		return (
			<div style={{ padding: 20 }}>
				<Tabs index={this.state.index} onChange={this.handleTabChange}>
					<Tab label='Manual'>
						<CounterManualTab {...rootState} />
					</Tab>
					<Tab label='Auto'>
						<CounterAutoTab {...rootState} />
					</Tab>
				</Tabs>
				<section style={{ padding: 60 }}>
					<h1>{rootState.counter}</h1>
				</section>
			</div>
		);
	}
}

//Redux State Reducer Mapping
function mapStateToProps(state) {
	return {
		counter: state.counter,
		input: state.input
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Object.assign({}, CounterActions, InputActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
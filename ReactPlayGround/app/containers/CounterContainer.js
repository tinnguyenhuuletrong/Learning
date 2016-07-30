import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SuccessButton from '../components/SuccessButton.js';    // A button with complex overrides

import {Tab, Tabs} from 'react-toolbox';
import { Button } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Ripple from 'react-toolbox/lib/ripple';

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
						<SuccessButton label='Inc' primary raised onMouseUp={rootState.increment}/>
						<Button label='Dec' primary onMouseUp={rootState.decrement}/>
					</Tab>
					<Tab label='Auto'>
						<Input type='text' label='DelayMs' name='delayMS' 
							value={rootState.input.delayMS} 
							onChange={(val) => {
								rootState.updateDelayValue("delayMS", val)
							}}
						/>

						<Button label='Acsync Inc' onMouseUp={() => {
								rootState.incrementAsync(rootState.input.delayMS)
							}}
						/>
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
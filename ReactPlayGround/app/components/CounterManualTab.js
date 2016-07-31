import React, { Component, PropTypes } from 'react';
import SuccessButton from './SuccessButton.js';
import { Button } from 'react-toolbox/lib/button';

class CounterManualTab extends Component {
	render() {
		//Build Menu Items
		const rootState = this.props;

		return (
			<div>
				<SuccessButton label='Inc' primary raised onMouseUp={rootState.increment}/>
				<Button label='Dec' primary onMouseUp={rootState.decrement}/>
			</div>
		);
	}
}

export default CounterManualTab;
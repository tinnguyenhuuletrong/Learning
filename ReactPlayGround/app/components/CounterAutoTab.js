import React, {	Component,PropTypes } from 'react';
import SuccessButton from './SuccessButton.js';
import { Button } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

class CounterAutoTab extends Component {
	render() {
		//Build Menu Items
		const rootState = this.props;

		return (
			<div>
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
			</div>
		);
	}
}

export default CounterAutoTab;
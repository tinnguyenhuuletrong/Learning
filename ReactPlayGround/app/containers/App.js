import React, {Component} from 'react';
import TopContainer from './TopContainer.js'

class App extends Component {
	render() {
		return (
			<div>
				<TopContainer />
				{this.props.children}
			</div>
		);
	}
}

export default App;

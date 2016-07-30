import React, {Component} from 'react';
import TopContainer from './TopContainer.js'

class App extends Component {
	render() {
		return (
			<div>
				<TopContainer />
				<div className="container">
				    <div >
				    	{this.props.children}
				    </div>
				</div>
			</div>
		);
	}
}

export default App;

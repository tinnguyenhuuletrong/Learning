import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TopMenu from '../components/TopMenu.js';
import PurpleAppBar from '../components/PurpleAppBar.js';

class TopContainer extends Component {
	render() {
	return (
		<PurpleAppBar >
			<div style={{ padding: 20 }}>
				<TopMenu routing={this.props.routing}/>
			</div>
		</PurpleAppBar>
		);
	}
}

//Redux State Reducer Mapping
function mapStateToProps(state) {
  return {
    routing: state.routing.locationBeforeTransitions.pathname
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TopContainer);
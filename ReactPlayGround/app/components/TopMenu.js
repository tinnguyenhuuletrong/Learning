import React, { Component, PropTypes } from 'react';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';

const actions = [
  { key: 0, label: 'Home', active: false, icon:'home', href: '#/' },
  { key: 1, label: 'Counter', active: false, icon: 'room', href: '#/counter'}
]

class TopMenu extends Component {
	static propTypes = {
		routing: PropTypes.string
	};

	render() {
		//Build Menu Items
		let currentRoute = "#" + this.props.routing
		let items = []
		actions.forEach(itm => {
			itm.active = itm.href === currentRoute
			items.push(<Link {...itm} />)
		})

		return (
			<Navigation type='horizontal'>	
				{items}
			</Navigation>
		);
	}
}

export default TopMenu;
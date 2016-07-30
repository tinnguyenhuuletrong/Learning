const input = (state = {
	delayMS: 1000
}, action) => {
	switch (action.type) {
		case 'UPDATE_INPUT_VALUE':
			let newState = Object.assign({}, state)
			newState[action.field] = action.val
			return newState
		default:
			return state
	}
}

export default input
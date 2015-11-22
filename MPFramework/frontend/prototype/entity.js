if(typeof Vector3 === 'undefined')
	Vector3 = THREE.Vector3

// =============================================================================
//  An Entity in the world.
// =============================================================================
var Entity = function() {
	this.pos = new Vector3()
	this.udid = -1
	this.speed = 3;
}

// Apply user's input to this entity.
Entity.prototype.applyInput = function(input) {
	var dir = input.dir
	var press_time = input.press_time
	this.pos.add(dir.multiplyScalar(this.speed) * press_time)
}

Entity.prototype.update = function () {

}
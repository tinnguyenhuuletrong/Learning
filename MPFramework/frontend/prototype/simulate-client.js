var SimulatedClient = function() {
	this.Network = null
	this.ListEntity = []
}

SimulatedClient.prototype.connect = function(network) {
	this.Network = network
};

SimulatedClient.prototype.addEntity = function(entity) {
	this.ListEntity.push(entity)
};

SimulatedClient.prototype.getEntity = function(udid) {
	for (var i = 0; i < this.ListEntity.length; i++) {
		if (this.ListEntity[i].udid == udid)
			return this.ListEntity[i];
	};
};

SimulatedClient.prototype.update = function(dt) {
	for (var i = 0; i < this.ListEntity.length; i++) {
		this.ListEntity[i].update(dt);
	};

};

SimulatedClient.prototype.isKeyDown = function (keyCode) {
	return KEY_STATUS[keyCode] === true
}

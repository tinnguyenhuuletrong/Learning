var SimulatedServer = function() {
	this.Network = null
	this.ListEntity = []
}

SimulatedServer.prototype.connect = function(network) {
	this.Network = network
};

SimulatedServer.prototype.addEntity = function (entity) {
	this.ListEntity.push(entity)
};

SimulatedServer.prototype.getEntity = function(udid) {
	for (var i = 0; i < this.ListEntity.length; i++) {
		if (this.ListEntity[i].udid == udid)
			return this.ListEntity[i];
	};
};

SimulatedServer.prototype.update = function(dt) {
	for (var i = 0; i < this.ListEntity.length; i++) {
		this.ListEntity[i].update(dt);
	};
};
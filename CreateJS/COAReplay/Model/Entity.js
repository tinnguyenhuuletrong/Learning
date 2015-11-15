//---------------------------------------------------------------------------//
//	Character
//---------------------------------------------------------------------------//
Character = function() {
	this.UDID = 1;

	this.Position = new Vector2(0, 0);
	this.Rotation = 0;

	this.Active = false;

	this.Type = EntityType.CHARACTER

	this.HP = 0;
	this.MaxHP = 0;
}

Character.prototype.setPosition = function(x, y) {
	this.Position.x = x;
	this.Position.y = y;
};

Character.prototype.update = function(dt) {

};

//---------------------------------------------------------------------------//
//	Entity Manager
//---------------------------------------------------------------------------//
EntityManager = new function() {
	this.DB = []
}

EntityManager.addEntity = function(entity) {
	this.DB[entity.UDID] = entity
}

EntityManager.getEntity = function(udid) {
	return this.DB[udid];
}

EntityManager.update = function(dt) {
	for (var i = 0; i < this.DB.length; i++) {
		var item = this.DB[i];
		if (item != null) {
			item.update(dt)
			if (item.Controller != null)
				item.Controller.update(dt)
		}
	};
}
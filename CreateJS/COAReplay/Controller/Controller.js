CharacterController = function(stage, Entity) {
	this.Entity = Entity
	this.Entity.Controller = this

	this.initGfx(stage);
	this.forceSync();
}

CharacterController.prototype.forceSync = function() {
	this.Display.x = this.Entity.Position.x
	this.Display.y = this.Entity.Position.y

	this.AnimHashPos = this.Entity.Position.x + ":" + this.Entity.Position.y;

	this.DisplayRotation = this.Entity.Rotation
};

CharacterController.prototype.initGfx = function(stage) {
	this.Display = new createjs.Shape();
	this.Display.name = this.Entity.UDID;

	var width = 25;
	var heigh = 25;
	this.Display.graphics.beginFill("DeepSkyBlue").drawRect(-width / 2, -heigh / 2, width, heigh);


	stage.addChild(this.Display);
}

CharacterController.prototype.update = function(dt) {
	var tmp = this.Entity.Position.x + ":" + this.Entity.Position.y;

	if (this.AnimHashPos != tmp) {
		this.AnimHashPos = tmp;
		createjs.Tween.get(this.Display, {
			override: true
		}).to({
			x: this.Entity.Position.x,
			y: this.Entity.Position.y
		}, TWEEN_FPS)
	}
};
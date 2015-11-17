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
	this.Display = new createjs.Container()
	this.Display.name = this.Entity.UDID;

	var width = 25;
	var height = 25;
	var shape = new createjs.Shape()
	shape.graphics.beginFill("DeepSkyBlue").drawRect(-width / 2, -height / 2, width, height);

	this.Shape = shape;

	var text = new createjs.Text(this.Entity.UDID, "10px Arial", "black");
	text.x = 0;
	text.y = 0;
	

	this.Text = text;

	this.Display.addChild(shape);
	this.Display.addChild(text);

	stage.addChild(this.Display);
}

CharacterController.prototype.update = function(dt) {
	var tmp = this.Entity.Position.x + ":" + this.Entity.Position.y;

	if (this.AnimHashPos != tmp) {
		this.AnimHashPos = tmp;
		console.log(tmp);
		createjs.Tween.get(this.Display, {
			override: true
		}).to({
			x: this.Entity.Position.x,
			y: this.Entity.Position.y
		}, TWEEN_FPS)
	}
};
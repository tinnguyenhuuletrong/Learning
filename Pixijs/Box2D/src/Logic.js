const util = require('util');
const EventEmitter = require('events').EventEmitter;
const MathUtil = require("./utils/MathUtil")
const Box2D = require("../lib/Box2D")


const METER = 100;



function GameWorld(STAGE_WIDTH, STAGE_HEIGHT) {
	this.STAGE_WIDTH = STAGE_WIDTH
	this.STAGE_HEIGHT = STAGE_HEIGHT

	this.bodies = []
	this.actors = []
	this.world = null
}
util.inherits(GameWorld, EventEmitter);

GameWorld.prototype.World2Logic = function(pos) {
	return pos / METER
};

GameWorld.prototype.Logic2World = function(pos) {
	return pos * METER
};

GameWorld.prototype.onInit = function() {

	this.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 10), true);
	const world = this.world
	const bodies = this.bodies
	const STAGE_WIDTH = this.STAGE_WIDTH
	const STAGE_HEIGHT = this.STAGE_HEIGHT

	const polyFixture = new Box2D.Dynamics.b2FixtureDef();
	polyFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	polyFixture.density = 1;

	const circleFixture = new Box2D.Dynamics.b2FixtureDef();
	circleFixture.shape = new Box2D.Collision.Shapes.b2CircleShape();
	circleFixture.density = 1;
	circleFixture.restitution = 0.7;

	const bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

	//down
	polyFixture.shape.SetAsBox(10, 1);
	bodyDef.position.Set(9, this.World2Logic(STAGE_HEIGHT) + 1);
	world.CreateBody(bodyDef).CreateFixture(polyFixture);

	//left
	polyFixture.shape.SetAsBox(1, 100);
	bodyDef.position.Set(-1, 0);
	world.CreateBody(bodyDef).CreateFixture(polyFixture);

	//right
	bodyDef.position.Set(this.World2Logic(STAGE_WIDTH) + 1, 0);
	world.CreateBody(bodyDef).CreateFixture(polyFixture);

	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	for (var i = 0; i < 40; i++) {
		const x = this.World2Logic(MathUtil.rndRange(0, STAGE_WIDTH))
		const y = this.World2Logic(-MathUtil.rndRange(50, 5000))

		bodyDef.position.Set(x, y);
		var body = world.CreateBody(bodyDef);

		var s;
		if (Math.random() > 0.5) {
			s = MathUtil.rndRange(70, 100);
			const circleSize = this.World2Logic(s / 2)
			circleFixture.shape.SetRadius(circleSize);
			body.CreateFixture(circleFixture);
			bodies.push(body);

			this.emit("add", {
				type: "ball",
				body: body,
				scale: s
			})
		} else {
			s = MathUtil.rndRange(50, 100);
			const boxSize = this.World2Logic(s / 2)
			polyFixture.shape.SetAsBox(boxSize, boxSize);
			body.CreateFixture(polyFixture);
			bodies.push(body);

			this.emit("add", {
				type: "box",
				body: body,
				scale: s
			})
		}
	}

}


GameWorld.prototype.update = function(dt) {
	const world = this.world
	const bodies = this.bodies

	world.Step(dt, 3, 3);
	world.ClearForces();

	const n = bodies.length;
	for (var i = 0; i < n; i++) {
		var body = bodies[i];
		var actor = body.display;
		var position = body.GetPosition();

		if (!actor)
			continue

		actor.position.x = this.Logic2World(position.x);
		actor.position.y = this.Logic2World(position.y);
		actor.rotation = body.GetAngle();
	}
};

GameWorld.prototype.getBodyAtMouse = function (touchX, touchY) {
    const mousePos = new Box2D.Common.Math.b2Vec2(touchX, touchY);
    const aabb = new Box2D.Collision.b2AABB();
    const unit = this.World2Logic(1)
    aabb.lowerBound.Set(touchX - unit, touchY - unit);
    aabb.upperBound.Set(touchX + unit, touchY + unit);

    var body;
    this.world.QueryAABB(
        function(fixture) {
            if (fixture.GetBody().GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
                if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePos)) {
                    body = fixture.GetBody();
                    return false;
                }
            }
            return true;
        }, aabb);

    return body;
}

GameWorld.prototype.createJoint = function(jointDef) {
	return this.world.CreateJoint(jointDef);
};

GameWorld.prototype.getGroundBody = function() {
	return this.world.GetGroundBody()
};

GameWorld.prototype.destroyBody = function(body) {
	this.world.DestroyJoint(body);
};


module.exports = GameWorld
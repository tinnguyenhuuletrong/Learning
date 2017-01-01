/**
 * @author kozakluke@gmail.com
 */

const MathUtil = require("./utils/MathUtil")
const Box2D = require("../lib/Box2D")
const PIXI = require("../lib/Pixi")
const Stats = require("../lib/Stats")

const STAGE_WIDTH = window.innerWidth,
    STAGE_HEIGHT = window.innerHeight;

const GameWorld = require("./Logic.js")
var game;

var bodies = [],
    actors = [];
var stage, renderer;
var world, mouseJoint;
var touchX, touchY;
var isBegin;
var stats;

(function init() {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

    window.onload = onLoad;
})();

function onLoad() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    stats = new Stats();
    container.appendChild(stats.domElement);
    stats.domElement.style.position = "absolute";

    stage = new PIXI.Stage(0xDDDDDD, true);

    renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT, undefined, false);
    document.body.appendChild(renderer.view);

    game = new GameWorld(STAGE_WIDTH, STAGE_HEIGHT)

    const loader = new PIXI.AssetLoader(["assets/ball.png",
        "assets/box.jpg"
    ]);
    loader.onComplete = onLoadAssets;
    loader.load();
}

function onLoadAssets() {

    game.on("add", (arg) => {
        const type = arg.type
        const body = arg.body
        const s = arg.scale

        if (type == "ball") {

            var ball = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/ball.png"));
            stage.addChild(ball);
            
            ball.anchor.x = ball.anchor.y = 0.5;
            ball.scale.x = ball.scale.y = s / 100;

            body.display = ball;

        } else if (type == "box") {
            var box = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/box.jpg"));
            stage.addChild(box);
            
            box.anchor.x = box.anchor.y = 0.5;
            box.scale.x = s / 100;
            box.scale.y = s / 100;

            body.display = box
        }
        
    })

    game.onInit()

    document.addEventListener("mousedown", function(event) {
        isBegin = true;
        onMove(event);
        document.addEventListener("mousemove", onMove, true);
    }, true);

    document.addEventListener("mouseup", function(event) {
        document.removeEventListener("mousemove", onMove, true);
        isBegin = false;
        touchX = undefined;
        touchY = undefined;
    }, true);

    renderer.view.addEventListener("touchstart", function(event) {
        isBegin = true;
        onMove(event);
        renderer.view.addEventListener("touchmove", onMove, true);
    }, true);

    renderer.view.addEventListener("touchend", function(event) {
        renderer.view.removeEventListener("touchmove", onMove, true);
        isBegin = false;
        touchX = undefined;
        touchY = undefined;
    }, true);

    update();
}

function onMove(event) {
    if (event["changedTouches"]) {
        var touche = event["changedTouches"][0];
        touchX = game.World2Logic(touche.pageX);
        touchY = game.World2Logic(touche.pageY);
    } else {
        touchX = game.World2Logic(event.clientX);
        touchY = game.World2Logic(event.clientY);
    }
}

function update() {
    requestAnimationFrame(update);

    if (isBegin && !mouseJoint) {
        const dragBody = game.getBodyAtMouse(touchX, touchY);
        if (dragBody) {
            const jointDef = new Box2D.Dynamics.Joints.b2MouseJointDef();
            jointDef.bodyA = game.getGroundBody();
            jointDef.bodyB = dragBody;
            jointDef.target.Set(touchX, touchY);
            jointDef.collideConnected = true;
            jointDef.maxForce = 300.0 * dragBody.GetMass();
            mouseJoint = game.createJoint(jointDef);
            dragBody.SetAwake(true);
        }
    }

    if (mouseJoint) {
        if (isBegin)
            mouseJoint.SetTarget(new Box2D.Common.Math.b2Vec2(touchX, touchY));
        else {
            game.destroyBody(mouseJoint)
            mouseJoint = null;
        }
    }

    game.update(1/60)

    renderer.render(stage);
    stats.update();
}
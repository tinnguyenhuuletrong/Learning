const OrbitControls = require("../lib/plugins/OrbitControls.js")
const THREE = require("../lib/threejs/Three.js")

const SpriteApp = function(context) {
	this.context = context
}

SpriteApp.prototype.initCamControl = function(camera, renderer) {

	// Cam Controller
	this.cameraControl = new OrbitControls(camera, renderer.domElement);
	this.cameraControl.target.set(0, 0, 0);
};

SpriteApp.prototype.onInit = function() {
	this.context.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
	this.context.camera.position.z = 400;
	this.context.camera.position.y = 400;
	this.context.scene = new THREE.Scene();


	this.context.renderer = new THREE.WebGLRenderer();
	this.context.renderer.setPixelRatio(window.devicePixelRatio);
	this.context.renderer.setSize(window.innerWidth, window.innerHeight);

	var axisHelper = new THREE.AxisHelper(500);
	this.context.scene.add(axisHelper);

	var gridHelper = new THREE.GridHelper(500)
	this.context.scene.add(gridHelper);

	this.initCamControl(this.context.camera, this.context.renderer)
	this.setupLight()
	this.initGeoMesh()
};

SpriteApp.prototype.setupLight = function() {
	this.context.scene.add(new THREE.AmbientLight(0x404040));

	var dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.position.set(100, 100, 50);
	this.context.scene.add(dirLight);

	var directLightHelper = new THREE.DirectionalLightHelper(dirLight)
	this.context.scene.add(directLightHelper);
};


SpriteApp.prototype.initGeoMesh = function() {
	var spriteMap = new THREE.TextureLoader().load('assets/UV_Grid_Sm.jpg');

	var spriteMaterial = new THREE.SpriteMaterial({
		map: spriteMap,
		color: 0xffffff
	});

	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(200, 200, 1)

	this.context.scene.add(sprite);
};

SpriteApp.prototype.onUpdate = function(dt) {
	// this.context.mesh.rotation.x += 0.005;
	// this.context.mesh.rotation.y += 0.01;
};

module.exports = SpriteApp
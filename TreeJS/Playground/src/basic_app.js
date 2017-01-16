const THREE = require("../lib/threejs/Three.js")

const BasicApp = function (context) {
	this.context = context
}

BasicApp.prototype.onInit = function() {
	this.context.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	this.context.camera.position.z = 400;
	this.context.scene = new THREE.Scene();

	var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
	var material = new THREE.MeshNormalMaterial({

	});
	this.context.mesh = new THREE.Mesh(geometry, material);
	this.context.scene.add(this.context.mesh);
	this.context.renderer = new THREE.WebGLRenderer();
	this.context.renderer.setPixelRatio(window.devicePixelRatio);
	this.context.renderer.setSize(window.innerWidth, window.innerHeight);
};

BasicApp.prototype.onUpdate = function(dt) {
	this.context.mesh.rotation.x += 0.005;
	this.context.mesh.rotation.y += 0.01;
};

module.exports = BasicApp
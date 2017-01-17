import {
	PlaneBufferGeometry2
} from "../lib/plugins/PlaneBufferGeometry2"
const OrbitControls = require("../lib/plugins/OrbitControls.js")
const THREE = require("../lib/threejs/Three.js")

const GeoGeneratorApp = function(context) {
	this.context = context

	this.SIZE_X = 3
	this.SIZE_Y = 1
	this.WIDTH = 200
	this.HEIGHT = 50

	this.UV_ROW = 10
	this.UV_COL = 10
	this.UV_SEGMENTS = [
		[0], [2], [4]
	]
}

GeoGeneratorApp.prototype.initCamControl = function(camera, renderer) {

	// Cam Controller
	this.cameraControl = new OrbitControls(camera, renderer.domElement);
	this.cameraControl.target.set(0, 0, 0);
};

GeoGeneratorApp.prototype.onInit = function() {
	this.context.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	this.context.camera.position.z = 400;
	this.context.scene = new THREE.Scene();


	this.context.renderer = new THREE.WebGLRenderer();
	this.context.renderer.setPixelRatio(window.devicePixelRatio);
	this.context.renderer.setSize(window.innerWidth, window.innerHeight);

	this.initCamControl(this.context.camera, this.context.renderer)
	this.initGeoMesh()
};

GeoGeneratorApp.prototype.evalUV = function(ix, iy, gridX, gridY) {
	const res = {
		x: ix / gridX,
		y: 1 - iy / gridY
	}

	//const segIndex = this.UV_SEGMENTS[ix][iy]
	//const uvPartX = ix / this.UV_ROW

	console.log([ix, iy], '->', res)

	return res
}

GeoGeneratorApp.prototype.initGeoMesh = function() {
	// var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
	// var material = new THREE.MeshNormalMaterial({

	// });
	// this.context.mesh = new THREE.Mesh(geometry, material);
	// this.context.scene.add(this.context.mesh);

	var map = new THREE.TextureLoader().load('assets/UV_Grid_Sm.jpg');
	const SIZE_X = 3
	const SIZE_Y = 2
	const WIDTH = 200
	const HEIGHT = 50

	this.geometry = new PlaneBufferGeometry2(this.SIZE_X * this.WIDTH, this.SIZE_Y * this.HEIGHT, 
			this.SIZE_X, this.SIZE_Y, this.evalUV.bind(this));

	this.material = new THREE.MeshBasicMaterial({
		map: map,
		side: THREE.DoubleSide,
		wireframe: false
	});
	this.context.mesh = new THREE.Mesh(this.geometry, this.material);
	this.context.scene.add(this.context.mesh);
};

GeoGeneratorApp.prototype.onUpdate = function(dt) {
	// this.context.mesh.rotation.x += 0.005;
	// this.context.mesh.rotation.y += 0.01;
};

module.exports = GeoGeneratorApp
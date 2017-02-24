import {
	TieMeshGenerator
} from "../lib/plugins/TieMeshGenerator"
const OrbitControls = require("../lib/plugins/OrbitControls.js")
const THREE = require("../lib/threejs/Three.js")

const GeoGenerator2App = function(context) {
	this.context = context


}

GeoGenerator2App.prototype.initCamControl = function(camera, renderer) {

	// Cam Controller
	this.cameraControl = new OrbitControls(camera, renderer.domElement);
	this.cameraControl.target.set(0, 0, 0);
};

GeoGenerator2App.prototype.onInit = function() {
	this.context.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
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
	this.initGeoMesh()
};


GeoGenerator2App.prototype.initGeoMesh = function() {



	var curve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, 5),
		new THREE.Vector3(0, 0, 10),
		new THREE.Vector3(0, 0, 15),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(0, 0, 25)
	]);

	const segments = 25
	const width = 2

	const tube = new THREE.TubeBufferGeometry(curve, segments, width, 2, false);

	// var map = new THREE.TextureLoader().load('assets/UV_Grid_Sm.jpg');
	this.material = new THREE.MeshBasicMaterial({
		// map: map,
		side: THREE.DoubleSide,
		wireframe: true
	});
	var singleMesh = new THREE.Mesh(tube, this.material);
	this.context.scene.add(singleMesh);
};

GeoGenerator2App.prototype.onUpdate = function(dt) {
	// this.context.mesh.rotation.x += 0.005;
	// this.context.mesh.rotation.y += 0.01;
};

module.exports = GeoGenerator2App
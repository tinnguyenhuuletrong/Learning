import {
	TieMeshGenerator
} from "../lib/plugins/TieMeshGenerator"
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
		[0],
		[2],
		[4]
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

	var axisHelper = new THREE.AxisHelper( 500 );
	this.context.scene.add( axisHelper );

	this.initCamControl(this.context.camera, this.context.renderer)
	this.initGeoMesh()
};

GeoGeneratorApp.prototype.uvConvert = function(tx, ty, maxX, maxY) {
	const dx = 1 / maxX
	const dy = 1 / maxY
	return {
		"0,0": [tx * dx, ty * dy],
		"0,1": [tx * dx, (ty + 1) * dy],
		"1,0": [(tx + 1) * dx, ty * dy],
		"1,1": [(tx + 1) * dx, (ty + 1) * dy],
	}
};

GeoGeneratorApp.prototype.initGeoMesh = function() {

	var gen = new TieMeshGenerator()
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			gen.addTie({
				position: {
					x: i * 50,
					y: j * 50,
					z: 0
				},
				width: 50,
				heigh: 50,
				uv: this.uvConvert(i, j, 3, 3)
			})
		}
	}

	var map = new THREE.TextureLoader().load('assets/UV_Grid_Sm.jpg');
	this.material = new THREE.MeshBasicMaterial({
		map: map,
		side: THREE.DoubleSide,
		wireframe: false
	});
	const singleMesh = gen.getSingleMesh(this.material)
	console.log(singleMesh.toJSON())
	this.context.scene.add(singleMesh);
};

GeoGeneratorApp.prototype.onUpdate = function(dt) {
	// this.context.mesh.rotation.x += 0.005;
	// this.context.mesh.rotation.y += 0.01;
};

module.exports = GeoGeneratorApp
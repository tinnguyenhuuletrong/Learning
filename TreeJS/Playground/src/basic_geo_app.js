const THREE = require("../lib/threejs/Three.js")
const OrbitControls = require("../lib/plugins/OrbitControls.js")

const BasicGeoApp = function(context) {
	this.context = context
}

BasicGeoApp.prototype.initCamControl = function(camera, renderer) {

	// Cam Controller
	this.cameraControl = new OrbitControls(camera, renderer.domElement);
	this.cameraControl.target.set( 0, 0, 0 );
};

BasicGeoApp.prototype.onInit = function() {
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.y = 400;
	const scene = new THREE.Scene();

	const renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	//Init Camera Control
	this.initCamControl(camera, renderer);

	var light, object;
	scene.add(new THREE.AmbientLight(0x404040));
	light = new THREE.HemisphereLight(0xffffff, 0x404040, 1.0);
	light.position.set(0, 1, 0);
	scene.add(light);

	var map = new THREE.TextureLoader().load('assets/UV_Grid_Sm.jpg');
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 16;
	var material = new THREE.MeshLambertMaterial({
		map: map,
		side: THREE.DoubleSide
	});

	//
	object = new THREE.Mesh(new THREE.SphereGeometry(75, 20, 10), material);
	object.position.set(-400, 0, 200);
	scene.add(object);
	object = new THREE.Mesh(new THREE.IcosahedronGeometry(75, 1), material);
	object.position.set(-200, 0, 200);
	scene.add(object);
	object = new THREE.Mesh(new THREE.OctahedronGeometry(75, 2), material);
	object.position.set(0, 0, 200);
	scene.add(object);
	object = new THREE.Mesh(new THREE.TetrahedronGeometry(75, 0), material);
	object.position.set(200, 0, 200);
	scene.add(object);

	//
	object = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 4, 4), material);
	object.position.set(-400, 0, 0);
	scene.add(object);
	object = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100, 4, 4, 4), material);
	object.position.set(-200, 0, 0);
	scene.add(object);
	object = new THREE.Mesh(new THREE.CircleGeometry(50, 20, 0, Math.PI * 2), material);
	object.position.set(0, 0, 0);
	scene.add(object);
	object = new THREE.Mesh(new THREE.RingGeometry(10, 50, 20, 5, 0, Math.PI * 2), material);
	object.position.set(200, 0, 0);
	scene.add(object);
	object = new THREE.Mesh(new THREE.CylinderGeometry(25, 75, 100, 40, 5), material);
	object.position.set(400, 0, 0);
	scene.add(object);

	//
	var points = [];
	for (var i = 0; i < 50; i++) {
		points.push(new THREE.Vector2(Math.sin(i * 0.2) * Math.sin(i * 0.1) * 15 + 50, (i - 5) * 2));
	}
	object = new THREE.Mesh(new THREE.LatheGeometry(points, 20), material);
	object.position.set(-400, 0, -200);
	scene.add(object);
	object = new THREE.Mesh(new THREE.TorusGeometry(50, 20, 20, 20), material);
	object.position.set(-200, 0, -200);
	scene.add(object);
	object = new THREE.Mesh(new THREE.TorusKnotGeometry(50, 10, 50, 20), material);
	object.position.set(0, 0, -200);
	scene.add(object);
	object = new THREE.AxisHelper(50);
	object.position.set(200, 0, -200);
	scene.add(object);
	object = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 50);
	object.position.set(400, 0, -200);
	scene.add(object);

	this.context = Object.assign(this.context, {
		scene: scene,
		camera: camera,
		renderer: renderer
	})
};

BasicGeoApp.prototype.onUpdate = function(dt) {
	// const {
	// 	camera,
	// 	scene
	// } = this.context

	// var timer = Date.now() * 0.0001;
	// camera.position.x = Math.cos(timer) * 800;
	// camera.position.z = Math.sin(timer) * 800;
	// camera.lookAt(scene.position);
	// for (var i = 0, l = scene.children.length; i < l; i++) {
	// 	var object = scene.children[i];
	// 	object.rotation.x = timer * 5;
	// 	object.rotation.y = timer * 2.5;
	// }
};

module.exports = BasicGeoApp
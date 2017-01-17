const THREE = require("../lib/threejs/Three.js")
window.THREE = THREE

const Stats = require("../lib/Stats.js")
const Dat = require("../lib/dat")

// const Application = require("./basic_app.js")
// const Application = require("./basic_geo_app.js")
const Application = require("./geo_generator_app.js")
const AppContext = {}
const app = new Application(AppContext)

init();
initGUI();
initStats();
animate();


function initGUI() {

	app.initGUI && app.initGUI()

	// var GuiObj = {
	// 	message: "hello",
	// 	speed: 0,
	// 	displayOutline: true,
	// 	explode: function() { }
	// }

	// var gui = new Dat.GUI();
	// gui.add(GuiObj, 'message');
	// gui.add(GuiObj, 'speed', -5, 5);
	// gui.add(GuiObj, 'displayOutline');
	// gui.add(GuiObj, 'explode');
}

function initStats(argument) {
	AppContext.stats = new Stats();
	AppContext.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(AppContext.stats.dom);
}

function init() {
	
	app.onInit()
	const {renderer, scene} = AppContext;
	window.scene =scene

	renderer.setClearColor("#9aa7bc")
	document.body.appendChild(renderer.domElement);
	//
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	const {camera, renderer} = AppContext;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	AppContext.stats.begin();

	const {camera, renderer, scene} = AppContext;

	app.onUpdate();
	
	renderer.render(scene, camera);

	AppContext.stats.end();

	requestAnimationFrame(animate);
}
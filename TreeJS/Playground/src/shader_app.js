import {
	TieMeshGenerator
} from "../lib/plugins/TieMeshGenerator"
const OrbitControls = require("../lib/plugins/OrbitControls.js")
const THREE = require("../lib/threejs/Three.js")

import BasicVertexShader from "../shader/baseVts.glsl"
import BasicFragmentShader from "../shader/baseFs.glsl"

import MinPhongSceneBaseReflectVertexShader from "../shader/phongSceneBaseReflectionVts.glsl"
import MinPhongSceneBaseReflectFragmentShader from "../shader/phongSceneBaseReflectionFs.glsl"

const ShaderApp = function(context) {
	this.context = context
}

ShaderApp.prototype.initCamControl = function(camera, renderer) {

	// Cam Controller
	this.cameraControl = new OrbitControls(camera, renderer.domElement);
	this.cameraControl.target.set(0, 0, 0);
};

ShaderApp.prototype.onInit = function() {
	this.context.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
	this.context.camera.position.z = -400;
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
	this.initGeoMeshSceneBaseReflection()
};

ShaderApp.prototype.setupLight = function() {
	this.context.scene.add(new THREE.AmbientLight(0x404040));

	var dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.position.set(100, 100, 50);
	this.context.scene.add(dirLight);

	var directLightHelper = new THREE.DirectionalLightHelper(dirLight)
	this.context.scene.add(directLightHelper);

	var axisHelper = new THREE.AxisHelper(1000);
	this.context.scene.add(axisHelper);
};


ShaderApp.prototype.initGeoMeshSceneBaseReflection = function() {
	
	const UniformsUtils = THREE.UniformsUtils
	const UniformsLib = THREE.UniformsLib


	const diffuseMap = new THREE.TextureLoader().load('assets/Diffuse.bmp');
	const brightMap = new THREE.TextureLoader().load('assets/bright.bmp');
	const normalMap = new THREE.TextureLoader().load('assets/Normal.bmp');

	// brightMap.wrapS = brightMap.wrapT = THREE.RepeatWrapping;
	// brightMap.repeat.set( 2, 2 );

	const uniforms = UniformsUtils.merge( [
			UniformsLib.common,
			UniformsLib.aomap,
			UniformsLib.lightmap,
			UniformsLib.emissivemap,
			UniformsLib.bumpmap,
			UniformsLib.normalmap,
			UniformsLib.displacementmap,
			UniformsLib.gradientmap,
			UniformsLib.fog,
			UniformsLib.lights,
			{
				emissive: { value: new THREE.Color( 0x000000 ) },
				specular: { value: new THREE.Color( 0x111111 ) },
				shininess: { value: 30 },
				reflectMap: { value: null },
				reflectionStrength: {value: 0.6},
				reflectionBend: {value: 2.2},
				reflectionBendOffsetY: {value: 0.2}
			}
		] )

	const material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: MinPhongSceneBaseReflectVertexShader,
		fragmentShader: MinPhongSceneBaseReflectFragmentShader,
		lights: true,
		side: 2
	})

	console.log(material.uniforms)

	material.isMeshPhongMaterial = true
	material.color = new THREE.Color( 0xffffff ); // diffuse
	material.specular = new THREE.Color( 0x111111 );
	material.shininess = 30;
	material.normalScale = new THREE.Vector2( 5, 5 );
	material.bumpScale = 1;

	
	material.map = diffuseMap
	material.normalMap = normalMap
	material.uniforms.reflectMap.value = brightMap

	// const material = new THREE.MeshPhongMaterial({
	// 	map: diffuseMap
	// })

	// var object = new THREE.Mesh(new THREE.SphereGeometry(75, 20, 10), material);
	var object = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 4, 4), material);
	object.position.set(0, 0, 0);
	object.rotation.set(0 * Math.PI / 180, -90 * Math.PI / 180 , 0)

	this.context.mesh = object
	this.context.scene.add(object)
};

ShaderApp.prototype.onUpdate = function(dt) {
	// this.context.mesh.position.z += 0.3;
	// this.context.mesh.rotation.y += 0.01;
};

module.exports = ShaderApp
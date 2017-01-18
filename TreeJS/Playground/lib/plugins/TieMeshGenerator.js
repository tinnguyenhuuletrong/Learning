import {
	PlaneBufferGeometry2
} from "./PlaneBufferGeometry2"

const TieMeshGenerator = function() {
	this.singleGeo = new THREE.Geometry()
}

TieMeshGenerator.prototype.addTie = function(config) {
	config = config || {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		width: 50,
		heigh: 50,
		uv: {
			"0,0": [0, 0],
			"0,1": [0, 1],
			"1,0": [1, 0],
			"1,1": [1, 1],
		}
	}

	const {position, width, heigh, uv} = config

	var buffer = new PlaneBufferGeometry2(width, heigh, 1, 1, (ix, iy) => {
		const itm = uv[ix.toString() + "," + iy.toString()]
		return {
			x: itm[0],
			y: 1.0 - itm[1]
		}
	});
	var geometry = new THREE.Geometry()
	geometry.fromBufferGeometry(buffer)
	var mesh = new THREE.Mesh(geometry);
	mesh.position.set(position.x, position.y, position.z)
	

	mesh.updateMatrix();
	this.singleGeo.merge(mesh.geometry, mesh.matrix);
};

TieMeshGenerator.prototype.getSingleMesh = function(material, rotation) {
	this.singleGeo.center()
	var singleMesh = new THREE.Mesh(this.singleGeo, material);
	//singleMesh.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 90 / 180 )
	return singleMesh
};

export { TieMeshGenerator }
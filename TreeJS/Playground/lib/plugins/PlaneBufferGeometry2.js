import {
	BufferGeometry
} from '../threejs/core/BufferGeometry';
import {
	BufferAttribute
} from '../threejs/core/BufferAttribute';

/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

function PlaneBufferGeometry2(width, height, widthSegments, heightSegments, evalUvCallback) {

	BufferGeometry.call(this);

	this.type = 'PlaneBufferGeometry2';

	this.parameters = {
		width: width,
		height: height,
		widthSegments: widthSegments,
		heightSegments: heightSegments
	};

	var width_half = width / 2;
	var height_half = height / 2;

	var gridX = Math.floor(widthSegments) || 1;
	var gridY = Math.floor(heightSegments) || 1;

	var gridX1 = gridX + 1;
	var gridY1 = gridY + 1;

	var segment_width = width / gridX;
	var segment_height = height / gridY;

	var vertices = new Float32Array(gridX1 * gridY1 * 3);
	var normals = new Float32Array(gridX1 * gridY1 * 3);
	var uvs = new Float32Array(gridX1 * gridY1 * 2);

	var offset = 0;
	var offset2 = 0;

	for (var iy = 0; iy < gridY1; iy++) {

		var y = iy * segment_height - height_half;

		for (var ix = 0; ix < gridX1; ix++) {

			var x = ix * segment_width - width_half;

			vertices[offset] = x;
			vertices[offset + 1] = -y;

			normals[offset + 2] = 1;

			let uv1 = ix / gridX
			let uv2 = 1 - (iy / gridY)

			if (evalUvCallback) {
				let res = evalUvCallback(ix, iy, gridX, gridY)
				if (res && res.x && res.y) {
					uv1 = res.x
					uv2 = res.y
				}
			}
			uvs[offset2] = uv1;
			uvs[offset2 + 1] = uv2;

			offset += 3;
			offset2 += 2;

		}

	}

	offset = 0;

	var indices = new((vertices.length / 3) > 65535 ? Uint32Array : Uint16Array)(gridX * gridY * 6);

	for (var iy = 0; iy < gridY; iy++) {

		for (var ix = 0; ix < gridX; ix++) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * (iy + 1);
			var c = (ix + 1) + gridX1 * (iy + 1);
			var d = (ix + 1) + gridX1 * iy;

			indices[offset] = a;
			indices[offset + 1] = b;
			indices[offset + 2] = d;

			indices[offset + 3] = b;
			indices[offset + 4] = c;
			indices[offset + 5] = d;

			offset += 6;

		}

	}

	this.setIndex(new BufferAttribute(indices, 1));
	this.addAttribute('position', new BufferAttribute(vertices, 3));
	this.addAttribute('normal', new BufferAttribute(normals, 3));
	this.addAttribute('uv', new BufferAttribute(uvs, 2));

}

PlaneBufferGeometry2.prototype = Object.create(BufferGeometry.prototype);
PlaneBufferGeometry2.prototype.constructor = PlaneBufferGeometry2;


export {
	PlaneBufferGeometry2
};
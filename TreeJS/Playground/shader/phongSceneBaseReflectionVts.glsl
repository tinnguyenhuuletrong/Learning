#define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <skinning_pars_vertex>

// Screen base ReflectMap
varying vec2 VSN;
uniform float reflectionBend;
uniform float reflectionBendOffsetY;

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

#endif

	#include <begin_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>

	VSN = vec2((gl_Position.x / gl_Position.z), (gl_Position.y / gl_Position.z)) * 0.5 + 0.5;
	VSN.y = (1.0 - VSN.y) * reflectionBend - reflectionBendOffsetY;// - 0.2

}

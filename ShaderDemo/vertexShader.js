//9JR7

const vertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform vec3 pano0Position;
uniform mat4 pano0Matrix;
uniform vec3 pano1Position;
uniform mat4 pano1Matrix;

varying vec3 pano0WorldPosition;
varying vec3 pano1WorldPosition;

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <color_pars_vertex>

void main() {

  #include <uv_vertex>
  #include <uv2_vertex>
  #include <color_vertex>
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>

  vec3 transformed = vec3(position);
  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  vNormal = normalize(transformedNormal);
  vViewPosition = - mvPosition.xyz;

  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vec3 vector0 = worldPosition.xyz - pano0Position;
  pano0WorldPosition = (vec4(vector0, 1.0) * pano0Matrix).xyz;

  vec3 vector1 = worldPosition.xyz - pano1Position;
  pano1WorldPosition = (vec4(vector1, 1.0) * pano1Matrix).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
export default vertexShader;

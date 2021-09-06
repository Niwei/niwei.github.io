const fragmentShader = `
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform vec3 panoFilter;
uniform float shininess;
uniform float opacity;
uniform float modelAlpha;
uniform float progress;
uniform float blackProgress;
uniform int blackTransition;
uniform samplerCube pano0Map;
uniform samplerCube pano1Map;
varying vec3 pano0WorldPosition;
varying vec3 pano1WorldPosition;

#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>

vec3 hsv2rgb(vec3 c) {
  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);
}

vec4 applyPanoFilter(vec4 color, vec3 filterColor) {
  vec3 fColor = hsv2rgb(rgb2hsv(color.rgb) + filterColor);
  return vec4(clamp(fColor.r, 0.0, 1.0), clamp(fColor.g, 0.0, 1.0), clamp(fColor.b, 0.0, 1.0), color.a);
}

void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive;

  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <emissivemap_fragment>
  #include <lights_phong_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  #include <aomap_fragment>
  vec3 outgoingLight = reflectedLight.directDiffuse +
    reflectedLight.indirectDiffuse +
    // reflectedLight.directSpecular +
    reflectedLight.indirectSpecular +
    totalEmissiveRadiance;

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);

  vec4 panoColor;
  vec4 pano0Color = textureCube(pano0Map, pano0WorldPosition.xyz);
  vec4 pano1Color = textureCube(pano1Map, pano1WorldPosition.xyz);
  if (blackTransition != 0) {
    vec4 BLACK_COLOR = vec4(0.0, 0.0, 0.0, 1.0);
    panoColor = mix(pano0Color, BLACK_COLOR, min(1.0, blackProgress * 3.0));
    panoColor = mix(panoColor, pano1Color, max(0.0, blackProgress * 3.0 - 2.0));
  } else {
    panoColor = mix(pano0Color, pano1Color, progress);
    panoColor = applyPanoFilter(panoColor, panoFilter);
  }
  gl_FragColor = mix(panoColor, gl_FragColor, modelAlpha);
  gl_FragColor = vec4(gl_FragColor.rgb, opacity);
}
`;
export default fragmentShader;

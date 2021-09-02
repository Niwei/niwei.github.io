export default (function defs() {
    var key = 113,
        n = 126,
        o = 0,
        spliter = "";
    return arguments[o]
        .split(spliter)
        .map(function (char) {
            return char.charCodeAt(o) > n
                ? char
                : String.fromCharCode((char.charCodeAt(o) + key) % n);
        })
        .join(spliter);
})(
    "\x04{vs|\x01z-\x05rp@-qvss\x04\x02rH\x17\x04{vs|\x01z-\x05rp@-rzv\x02\x02v\x05rH\x17\x04{vs|\x01z-\x05rp@-\x02}rp\x04yn\x01H\x17\x04{vs|\x01z-\x05rp@-}n{|Svy\x03r\x01H\x17\x04{vs|\x01z-sy|n\x03-\x02uv{v{r\x02\x02H\x17\x04{vs|\x01z-sy|n\x03-|}npv\x03\bH\x17\x04{vs|\x01z-sy|n\x03-z|qryNy}unH\x17\x04{vs|\x01z-sy|n\x03-}\x01|t\x01r\x02\x02H\x17\x04{vs|\x01z-sy|n\x03-oynpx]\x01|t\x01r\x02\x02H\x17\x04{vs|\x01z-v{\x03-oynpxa\x01n{\x02v\x03v|{H\x17\x04{vs|\x01z-\x02nz}yr\x01P\x04or-}n{|=Zn}H\x17\x04{vs|\x01z-\x02nz}yr\x01P\x04or-}n{|>Zn}H\x17\x05n\x01\bv{t-\x05rp@-}n{|=d|\x01yq]|\x02v\x03v|{H\x17\x05n\x01\bv{t-\x05rp@-}n{|>d|\x01yq]|\x02v\x03v|{H\x17\x170v{py\x04qr-Ip|zz|{K\x170v{py\x04qr-Ip|y|\x01l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-I\x04\x05l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-I\x04\x05?l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-Izn}l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-Iny}unzn}l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-In|zn}l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-Iyvtu\x03zn}l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-Irzv\x02\x02v\x05rzn}l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-Ir{\x05zn}l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-It\x01nqvr{\x03zn}l}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-Is|tl}n\x01\x02ls\x01ntzr{\x03K\x170v{py\x04qr-Io\x02qs\x02K\x170v{py\x04qr-Iyvtu\x03\x02l}n\x01\x02lortv{K\x170v{py\x04qr-Iyvtu\x03\x02l}u|{tl}n\x01\x02ls\x01ntzr{\x03K\x17\x17\x05rp@-u\x02\x05?\x01to5\x05rp@-p6-\n\x17--p|{\x02\x03-\x05rpA-X-J-\x05rpA5>;=9-?;=-<-@;=9->;=-<-@;=9-@;=6H\x17--\x05rp@-}-J-no\x025s\x01np\x035p;\x07\x07\x07-8-X;\x07\b\t6-7-C;=-:-X;\x06\x06\x066H\x17--\x01r\x03\x04\x01{-p;\t-7-zv\x075X;\x07\x07\x079-pynz}5}-:-X;\x07\x07\x079-=;=9->;=69-p;\b6H\x17\f\x17\x17\x05rp@-\x01to?u\x02\x055\x05rp@-p6-\n\x17--p|{\x02\x03-\x05rpA-X-J-\x05rpA5=;=9-:>;=-<-@;=9-?;=-<-@;=9-:>;=6H\x17--\x05rpA-}-J-zv\x075\x05rpA5p;ot9-X;\x06\t69-\x05rpA5p;to9-X;\x07\b69-\x02\x03r}5p;o9-p;t66H\x17--\x05rpA-\0-J-zv\x075\x05rpA5};\x07\b\x069-p;\x0169-\x05rpA5p;\x019-};\b\t\x0769-\x02\x03r}5};\x079-p;\x0166H\x17\x17--sy|n\x03-q-J-\0;\x07-:-zv{5\0;\x069-\0;\b6H\x17--\x01r\x03\x04\x01{-\x05rp@5no\x025\0;\t-8-5\0;\x06-:-\0;\b6-<-5C;=-7-q-8-=;==>669-q-<-5\0;\x07-8-=;==>69-\0;\x076H\x17\f\x17\x17\x05rpA-n}}y\b]n{|Svy\x03r\x015\x05rpA-p|y|\x019-\x05rp@-svy\x03r\x01P|y|\x016-\n\x17--\x05rp@-sP|y|\x01-J-u\x02\x05?\x01to5\x01to?u\x02\x055p|y|\x01;\x01to6-8-svy\x03r\x01P|y|\x016H\x17--\x01r\x03\x04\x01{-\x05rpA5pynz}5sP|y|\x01;\x019-=;=9->;=69-pynz}5sP|y|\x01;t9-=;=9->;=69-pynz}5sP|y|\x01;o9-=;=9->;=69-p|y|\x01;n6H\x17\f\x17\x17\x05|vq-znv{56-\n\x17--\x05rpA-qvss\x04\x02rP|y|\x01-J-\x05rpA5qvss\x04\x02r9-|}npv\x03\b6H\x17--_rsyrp\x03rqYvtu\x03-\x01rsyrp\x03rqYvtu\x03-J-_rsyrp\x03rqYvtu\x035-\x05rp@5-=;=-69-\x05rp@5-=;=-69-\x05rp@5-=;=-69-\x05rp@5-=;=-6-6H\x17--\x05rp@-\x03|\x03nyRzv\x02\x02v\x05r_nqvn{pr-J-rzv\x02\x02v\x05rH\x17\x17--0v{py\x04qr-Izn}ls\x01ntzr{\x03K\x17--0v{py\x04qr-Ip|y|\x01ls\x01ntzr{\x03K\x17--0v{py\x04qr-Iny}unzn}ls\x01ntzr{\x03K\x17--0v{py\x04qr-Iny}un\x03r\x02\x03ls\x01ntzr{\x03K\x17--0v{py\x04qr-I\x02}rp\x04yn\x01zn}ls\x01ntzr{\x03K\x17--0v{py\x04qr-I{|\x01znyls\x01ntzr{\x03lortv{K\x17--0v{py\x04qr-I{|\x01znyls\x01ntzr{\x03lzn}\x02K\x17--0v{py\x04qr-Irzv\x02\x02v\x05rzn}ls\x01ntzr{\x03K\x17--0v{py\x04qr-Iyvtu\x03\x02l}u|{tls\x01ntzr{\x03K\x17--0v{py\x04qr-Iyvtu\x03\x02ls\x01ntzr{\x03lortv{K\x17--0v{py\x04qr-Iyvtu\x03\x02ls\x01ntzr{\x03lzn}\x02K\x17--0v{py\x04qr-Iyvtu\x03\x02ls\x01ntzr{\x03lr{qK\x17--0v{py\x04qr-In|zn}ls\x01ntzr{\x03K\x17--\x05rp@-|\x04\x03t|v{tYvtu\x03-J-\x01rsyrp\x03rqYvtu\x03;qv\x01rp\x03Qvss\x04\x02r-8\x17----\x01rsyrp\x03rqYvtu\x03;v{qv\x01rp\x03Qvss\x04\x02r-8\x17----<<-\x01rsyrp\x03rqYvtu\x03;qv\x01rp\x03`}rp\x04yn\x01-8\x17----\x01rsyrp\x03rqYvtu\x03;v{qv\x01rp\x03`}rp\x04yn\x01-8\x17----\x03|\x03nyRzv\x02\x02v\x05r_nqvn{prH\x17\x17--tylS\x01ntP|y|\x01-J-\x05rpA5|\x04\x03t|v{tYvtu\x039-qvss\x04\x02rP|y|\x01;n6H\x17\x17--\x05rpA-}n{|P|y|\x01H\x17--\x05rpA-}n{|=P|y|\x01-J-\x03r\x07\x03\x04\x01rP\x04or5}n{|=Zn}9-}n{|=d|\x01yq]|\x02v\x03v|{;\x07\b\t6H\x17--\x05rpA-}n{|>P|y|\x01-J-\x03r\x07\x03\x04\x01rP\x04or5}n{|>Zn}9-}n{|>d|\x01yq]|\x02v\x03v|{;\x07\b\t6H\x17--vs-5oynpxa\x01n{\x02v\x03v|{-.J-=6-\n\x17----\x05rpA-OYNPXlP\\Y\\_-J-\x05rpA5=;=9-=;=9-=;=9->;=6H\x17----}n{|P|y|\x01-J-zv\x075}n{|=P|y|\x019-OYNPXlP\\Y\\_9-zv{5>;=9-oynpx]\x01|t\x01r\x02\x02-7-@;=66H\x17----}n{|P|y|\x01-J-zv\x075}n{|P|y|\x019-}n{|>P|y|\x019-zn\x075=;=9-oynpx]\x01|t\x01r\x02\x02-7-@;=-:-?;=66H\x17--\f-ry\x02r-\n\x17----}n{|P|y|\x01-J-zv\x075}n{|=P|y|\x019-}n{|>P|y|\x019-}\x01|t\x01r\x02\x026H\x17----}n{|P|y|\x01-J-n}}y\b]n{|Svy\x03r\x015}n{|P|y|\x019-}n{|Svy\x03r\x016H\x17--\f\x17--tylS\x01ntP|y|\x01-J-zv\x075}n{|P|y|\x019-tylS\x01ntP|y|\x019-z|qryNy}un6H\x17--tylS\x01ntP|y|\x01-J-\x05rpA5tylS\x01ntP|y|\x01;\x01to9-|}npv\x03\b6H\x17\f"
);
// uniform vec3 diffuse;
// uniform vec3 emissive;
// uniform vec3 specular;
// uniform vec3 panoFilter;
// uniform float shininess;
// uniform float opacity;
// uniform float modelAlpha;
// uniform float progress;
// uniform float blackProgress;
// uniform int blackTransition;
// uniform samplerCube pano0Map;
// uniform samplerCube pano1Map;
// varying vec3 pano0WorldPosition;
// varying vec3 pano1WorldPosition;

// #include <common>
// #include <color_pars_fragment>
// #include <uv_pars_fragment>
// #include <uv2_pars_fragment>
// #include <map_pars_fragment>
// #include <alphamap_pars_fragment>
// #include <aomap_pars_fragment>
// #include <lightmap_pars_fragment>
// #include <emissivemap_pars_fragment>
// #include <envmap_pars_fragment>
// #include <gradientmap_pars_fragment>
// #include <fog_pars_fragment>
// #include <bsdfs>
// #include <lights_pars_begin>
// #include <lights_phong_pars_fragment>

// vec3 hsv2rgb(vec3 c) {
//   const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//   vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//   return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }

// vec3 rgb2hsv(vec3 c) {
//   const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
//   vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
//   vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

//   float d = q.x - min(q.w, q.y);
//   return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);
// }

// vec4 applyPanoFilter(vec4 color, vec3 filterColor) {
//   vec3 fColor = hsv2rgb(rgb2hsv(color.rgb) + filterColor);
//   return vec4(clamp(fColor.r, 0.0, 1.0), clamp(fColor.g, 0.0, 1.0), clamp(fColor.b, 0.0, 1.0), color.a);
// }

// void main() {
//   vec4 diffuseColor = vec4(diffuse, opacity);
//   ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
//   vec3 totalEmissiveRadiance = emissive;

//   #include <map_fragment>
//   #include <color_fragment>
//   #include <alphamap_fragment>
//   #include <alphatest_fragment>
//   #include <specularmap_fragment>
//   #include <normal_fragment_begin>
//   #include <normal_fragment_maps>
//   #include <emissivemap_fragment>
//   #include <lights_phong_fragment>
//   #include <lights_fragment_begin>
//   #include <lights_fragment_maps>
//   #include <lights_fragment_end>
//   #include <aomap_fragment>
//   vec3 outgoingLight = reflectedLight.directDiffuse +
//     reflectedLight.indirectDiffuse +
//     // reflectedLight.directSpecular +
//     reflectedLight.indirectSpecular +
//     totalEmissiveRadiance;

//   gl_FragColor = vec4(outgoingLight, diffuseColor.a);

//   vec4 panoColor;
//   vec4 pano0Color = textureCube(pano0Map, pano0WorldPosition.xyz);
//   vec4 pano1Color = textureCube(pano1Map, pano1WorldPosition.xyz);
//   if (blackTransition != 0) {
//     vec4 BLACK_COLOR = vec4(0.0, 0.0, 0.0, 1.0);
//     panoColor = mix(pano0Color, BLACK_COLOR, min(1.0, blackProgress * 3.0));
//     panoColor = mix(panoColor, pano1Color, max(0.0, blackProgress * 3.0 - 2.0));
//   } else {
//     panoColor = mix(pano0Color, pano1Color, progress);
//     panoColor = applyPanoFilter(panoColor, panoFilter);
//   }
//   gl_FragColor = mix(panoColor, gl_FragColor, modelAlpha);
//   gl_FragColor = vec4(gl_FragColor.rgb, opacity);
// }

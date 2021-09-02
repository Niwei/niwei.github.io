//9JR7

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
    "\x05n\x01\bv{t-\x05rp@-\x05[|\x01znyH\x17\x05n\x01\bv{t-\x05rp@-\x05cvr\x06]|\x02v\x03v|{H\x17\x17\x04{vs|\x01z-\x05rp@-}n{|=]|\x02v\x03v|{H\x17\x04{vs|\x01z-zn\x03A-}n{|=Zn\x03\x01v\x07H\x17\x04{vs|\x01z-\x05rp@-}n{|>]|\x02v\x03v|{H\x17\x04{vs|\x01z-zn\x03A-}n{|>Zn\x03\x01v\x07H\x17\x17\x05n\x01\bv{t-\x05rp@-}n{|=d|\x01yq]|\x02v\x03v|{H\x17\x05n\x01\bv{t-\x05rp@-}n{|>d|\x01yq]|\x02v\x03v|{H\x17\x170v{py\x04qr-Ip|zz|{K\x170v{py\x04qr-I\x04\x05l}n\x01\x02l\x05r\x01\x03r\x07K\x170v{py\x04qr-I\x04\x05?l}n\x01\x02l\x05r\x01\x03r\x07K\x170v{py\x04qr-Ip|y|\x01l}n\x01\x02l\x05r\x01\x03r\x07K\x17\x17\x05|vq-znv{56-\n\x17\x17--0v{py\x04qr-I\x04\x05l\x05r\x01\x03r\x07K\x17--0v{py\x04qr-I\x04\x05?l\x05r\x01\x03r\x07K\x17--0v{py\x04qr-Ip|y|\x01l\x05r\x01\x03r\x07K\x17--0v{py\x04qr-Iortv{{|\x01znyl\x05r\x01\x03r\x07K\x17--0v{py\x04qr-Iqrsn\x04y\x03{|\x01znyl\x05r\x01\x03r\x07K\x17\x17--\x05rp@-\x03\x01n{\x02s|\x01zrq-J-\x05rp@5}|\x02v\x03v|{6H\x17--\x05rpA-z\x05]|\x02v\x03v|{-J-z|qrycvr\x06Zn\x03\x01v\x07-7-\x05rpA5\x03\x01n{\x02s|\x01zrq9->;=6H\x17--\x05[|\x01zny-J-{|\x01znyv\tr5\x03\x01n{\x02s|\x01zrq[|\x01zny6H\x17--\x05cvr\x06]|\x02v\x03v|{-J-:-z\x05]|\x02v\x03v|{;\x07\b\tH\x17\x17--\x05rpA-\x06|\x01yq]|\x02v\x03v|{-J-z|qryZn\x03\x01v\x07-7-\x05rpA5}|\x02v\x03v|{9->;=6H\x17\x17--\x05rp@-\x05rp\x03|\x01=-J-\x06|\x01yq]|\x02v\x03v|{;\x07\b\t-:-}n{|=]|\x02v\x03v|{H\x17--}n{|=d|\x01yq]|\x02v\x03v|{-J-5\x05rpA5\x05rp\x03|\x01=9->;=6-7-}n{|=Zn\x03\x01v\x076;\x07\b\tH\x17\x17--\x05rp@-\x05rp\x03|\x01>-J-\x06|\x01yq]|\x02v\x03v|{;\x07\b\t-:-}n{|>]|\x02v\x03v|{H\x17--}n{|>d|\x01yq]|\x02v\x03v|{-J-5\x05rpA5\x05rp\x03|\x01>9->;=6-7-}n{|>Zn\x03\x01v\x076;\x07\b\tH\x17\x17--tyl]|\x02v\x03v|{-J-}\x01|wrp\x03v|{Zn\x03\x01v\x07-7-z|qrycvr\x06Zn\x03\x01v\x07-7-\x05rpA5}|\x02v\x03v|{9->;=6H\x17\f"
);
// varying vec3 vNormal;
// varying vec3 vViewPosition;

// uniform vec3 pano0Position;
// uniform mat4 pano0Matrix;
// uniform vec3 pano1Position;
// uniform mat4 pano1Matrix;

// varying vec3 pano0WorldPosition;
// varying vec3 pano1WorldPosition;

// #include <common>
// #include <uv_pars_vertex>
// #include <uv2_pars_vertex>
// #include <color_pars_vertex>

// void main() {

//   #include <uv_vertex>
//   #include <uv2_vertex>
//   #include <color_vertex>
//   #include <beginnormal_vertex>
//   #include <defaultnormal_vertex>

//   vec3 transformed = vec3(position);
//   vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
//   vNormal = normalize(transformedNormal);
//   vViewPosition = - mvPosition.xyz;

//   vec4 worldPosition = modelMatrix * vec4(position, 1.0);

//   vec3 vector0 = worldPosition.xyz - pano0Position;
//   pano0WorldPosition = (vec4(vector0, 1.0) * pano0Matrix).xyz;

//   vec3 vector1 = worldPosition.xyz - pano1Position;
//   pano1WorldPosition = (vec4(vector1, 1.0) * pano1Matrix).xyz;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }

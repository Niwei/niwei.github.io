import {
    Vector3,
    Matrix4,
    Color,
    UniformsLib,
} from "./threejs/build/three.module.js";
const fromToValue = function (value) {
    return { value: value };
};
export default Object.assign(
    {
        modelAlpha: fromToValue(0.0),
        progress: fromToValue(0.0),
        blackProgress: fromToValue(0.0),
        blackTransition: fromToValue(0.0),
        panoFilter: fromToValue(new Vector3()),
        pano0Map: fromToValue(null),
        pano0Position: fromToValue(new Vector3()),
        pano0Matrix: fromToValue(new Matrix4()),
        pano1Map: fromToValue(null),
        pano1Position: fromToValue(new Vector3()),
        pano1Matrix: fromToValue(new Matrix4()),
    },
    {
        emissive: fromToValue(new Color(0x000000)),
        emissiveMap: fromToValue(null),
        specular: fromToValue(new Color(0x111111)),
        specularMap: fromToValue(null),
        normalMap: fromToValue(null),
        bumpMap: fromToValue(null),
        shininess: fromToValue(30.0),
    },
    UniformsLib.common,
    UniformsLib.lights
);

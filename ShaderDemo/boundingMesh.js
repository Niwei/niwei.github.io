import * as THREE from "./threejs/build/three.module.js";
import uniformsMixin from "./uniformsMixin.js";
import vertexShader from "./vertexShader.js";
import fragmentShader from "./fragmentShader.js";
import uniforms from "./uniforms.js";

const defaultOffsetVector = new THREE.Vector3(0, 0, 0);

function boundingMesh(bounding, offset = defaultOffsetVector) {
    let _uniforms = THREE.UniformsUtils.clone(uniforms);
    _uniforms.modelAlpha.value = 1;
    _uniforms.opacity.value = 1;

    let shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: _uniforms,
        lights: true,
    });

    let geometry = new THREE.BoxGeometry(
        bounding.max.x - bounding.min.x + offset.x * 2,
        bounding.max.y - bounding.min.y + offset.y * 2,
        bounding.max.z - bounding.min.z + offset.z * 2
    );
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));

    let boundingBox = new THREE.Mesh(geometry, shaderMaterial);
    boundingBox.position.copy(bounding.center);
    boundingBox.frustumCulled = false;
    let container = new THREE.Object3D();
    container.add(boundingBox);
    return Object.assign(container, uniformsMixin, {
        setTransparent: function setTransparent(bool) {
            this.transparent = bool;
            shaderMaterial.transparent = bool;
        },
        dispose: function dispose() {
            container.remove(boundingBox);
            boundingBox.geometry.dispose();
            boundingBox.material.dispose();
        },
    });
}
export default boundingMesh;

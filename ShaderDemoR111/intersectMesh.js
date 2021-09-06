import * as THREE from "./threejs/build/three.module.js";

const blueColor = 0x12fffb;
const outterRadius = 0.08;
const innerRadius = 0.04;
var radiusSegments = 32;

function generateRingGeometry() {
    return new THREE.RingGeometry(innerRadius, outterRadius, radiusSegments);
}
function intersectMesh() {
    const container = new THREE.Object3D();

    const ringGeometry = generateRingGeometry();
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: blueColor,
        opacity: 0.8,
        side: THREE.DoubleSide,
        transparent: true,
    });
    let ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.container = container;
    ringMesh.renderOrder = 10;
    container.add(ringMesh);

    container.isIntersectMesh = ringMesh.isIntersectMesh = true;

    return Object.assign(container, {
        dispose: function dispose() {
            container.remove(ringMesh);
            ringMesh.container = null;
            ringMesh.geometry.dispose();
            ringMesh.material.dispose();
        },
    });
}
export default intersectMesh;

import * as THREE from "./threejs/build/three.module.js";
import subscribe from "./subscribe.js";
import * as animationFrame from "./animationFrame.js";

const loadingImage = new Image();
const loadingTexture = new THREE.Texture(loadingImage);
loadingImage.onload = function () {
    return (loadingTexture.needsUpdate = true);
};

loadingImage.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYA" +
    "AAAf8/9hAAAAAXNSR0IArs4c6QAAAR9JREFUOBF10kFOAzEMBdCZFhCbrrgAN+NqHIULsWKDKO3gF" +
    "+VHoZpa+rXjfH87nq7btr0ty3KZ8FsxnHeQPL748lA/x0Jsq+AwYe0X8nDtGA33BEJUHIEKW/EorH" +
    "OLI7BHNlkEbju38YkQAIRZxFkHz2HOirKDxNcIzG+fu/6oLiNmqc5ZrlwTeKyAgJF14tMZmSn87pB" +
    "rxeX/CRABgk/dl1s+C18dio2Pp9nmCQru2UtdvN+7lI9AFsgb3zNMcSp8FF4LYs3UhLfOAvkDJffc" +
    "i8q1J/ByRLKnQ8gUJUFOd2SeZYliCxwiyJCxCbhUGFKF4zPm61hiq7sVyJnPmATyR5IzLSNyDNEFR" +
    "CDnkAmA8U2RfCsIefYhDeKOQLv7A+l1ZTyjymNxAAAAAElFTkSuQmCC";

const loadingGeometry = new THREE.RingGeometry(0.06, 0.07, 32);
loadingGeometry.rotateX(-Math.PI / 2);
const loadingMaterial = new THREE.MeshBasicMaterial({
    map: loadingTexture,
    transparent: true,
});

function generateLoadingMesh() {
    return new THREE.Mesh(loadingGeometry, loadingMaterial);
}

// ============= center ===================
function generateCenterGeometry(start) {
    const geometry = new THREE.CircleGeometry(0.12, 32);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
}

// ============ canvasTexture ==============
function canvasTexture() {
    const canvas = document.createElement("canvas");
    const size = 512;
    const halfSize = size / 2;
    const centerRadius = 300 / 2;
    const ringRadius = 380 / 2;
    canvas.setAttribute("width", size);
    canvas.setAttribute("height", size);

    const texture = new THREE.Texture(canvas);

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(
        halfSize,
        halfSize,
        centerRadius,
        halfSize,
        halfSize,
        0
    );
    gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.7)");
    gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.0)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    function drawClips() {
        const spliter = Math.PI / 12;
        const length = (2 * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(
            halfSize,
            halfSize,
            ringRadius,
            length * 0,
            length * 1 - spliter
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            halfSize,
            halfSize,
            ringRadius,
            length * 1,
            length * 2 - spliter
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            halfSize,
            halfSize,
            ringRadius,
            length * 2,
            length * 3 - spliter
        );
        ctx.stroke();
    }
    function draw(progress) {
        ctx.clearRect(0, 0, size, size);
        ctx.lineWidth = 10;
        if (progress !== -1) {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            drawClips();
            ctx.globalCompositeOperation = "source-in";
            ctx.beginPath();
            ctx.arc(halfSize, halfSize, ringRadius, 0, 2 * Math.PI * progress);
            ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle =
                "rgba(255, 255, 255, " + (progress ? 0.3 : 0.5) + ")";
            drawClips();
        }
        ctx.beginPath();
        ctx.arc(halfSize, halfSize, centerRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
        ctx.fillRect(0, 0, size, size);
        texture.needsUpdate = true;
    }
    draw(0);
    texture.draw = draw;
    return texture;
}

let canvasTexturePool = [];

function getTextureFromPool() {
    for (const _texture of canvasTexturePool) {
        if (_texture.retain === false) return _texture;
    }
    const texture = canvasTexture();
    texture.pool = true;
    texture.retain = true;
    canvasTexturePool.push(texture);
    return texture;
}

const sharedProgress0Texture = canvasTexture();
sharedProgress0Texture.draw(0);

const sharedProgress1Texture = canvasTexture();
sharedProgress1Texture.draw(1);

const sharedDisabledTexture = canvasTexture();
sharedDisabledTexture.draw(-1);

function generateCenterMaterial() {
    const material = new THREE.MeshBasicMaterial({
        map: sharedProgress0Texture,
        transparent: true,
    });
    return material;
}

const sharedCenterGeometry = generateCenterGeometry();
function generateCenterMesh() {
    return new THREE.Mesh(sharedCenterGeometry, generateCenterMaterial());
}

function panoCircleMesh() {
    const container = new THREE.Object3D();

    Object.assign(container, subscribe);

    const centerMesh = generateCenterMesh();
    centerMesh.position.y += 0.01;
    container.add(centerMesh);
    centerMesh.container = container;

    const loadingMesh = generateLoadingMesh();
    loadingMesh.position.y += 0.011;
    loadingMesh.container = container;

    let stopInterval = function stopInterval() {};
    container.loading = false;
    container.setLoading = function (shown) {
        container.loading = shown;
        stopInterval();
        if (shown) {
            container.add(loadingMesh);
            stopInterval = animationFrame.requestAnimationFrameInterval(
                function () {
                    loadingMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1);
                    container.needsRender = true;
                }
            );
        } else {
            container.remove(loadingMesh);
        }
    };

    container.disabled = false;
    container.setDisabled = function (disabled) {
        const texture = centerMesh.material.map;
        if (texture.pool === true) texture.retain = false;
        container.disabled = disabled;
        centerMesh.material.map = disabled
            ? sharedDisabledTexture
            : sharedProgress0Texture;
    };

    container.setProgress = function (progress) {
        container.setLoading(false);
        container.setDisabled(false);
        progress = Math.max(0, Math.min(1, progress));
        const texture = centerMesh.material.map;
        if (progress === 0 || progress === 1) {
            if (texture.pool === true) texture.retain = false;
            if (progress === 0)
                centerMesh.material.map = sharedProgress0Texture;
            if (progress === 1)
                centerMesh.material.map = sharedProgress1Texture;
        } else {
            if (texture.pool !== true) {
                centerMesh.material.map = getTextureFromPool();
            }
            centerMesh.material.map.draw(progress);
        }
    };

    container.setOpacity = function (opacity) {
        centerMesh.material.opacity = opacity;
    };

    container.dispose = function () {
        container.setLoading(false);
        centerMesh.container = null;
        container.remove(centerMesh);

        loadingMesh.container = null;
        container.remove(loadingMesh);
        container.off();
    };

    return container;
}
export default panoCircleMesh;

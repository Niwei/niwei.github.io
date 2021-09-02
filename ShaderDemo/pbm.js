import * as THREE from "./threejs/build/three.module.js";
import vertexShader from "./vertexShader.js";
import fragmentShader from "./fragmentShader.js";
import uniform from "./uniforms.js";
import isNil from "./isNil.js";
import noop from "./noop.js";

import { BufferGeometryUtils } from "./threejs/BufferGeometryUtils.js";
let {
    BufferGeometry,
    ImageLoader,
    BufferAttribute,
    ClampToEdgeWrapping,
    LinearFilter,
} = THREE;

let modelFlipMatrix = new THREE.Matrix4().set(
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    -1,
    0,
    0,
    0,
    0,
    0,
    1
);

function bAttr(value, type) {
    return new BufferAttribute(value, type);
}

function parseFloorName(name) {
    var result = name.match(/(group|floor)-?(\d+)/);
    if (!result) return 0;
    return parseInt(result[2], 10);
}

function parseChunkName(name) {
    var result = name.match(/(chunk)-?(\d+)/);
    if (!result) return 0;
    return parseInt(result[2], 10);
}

function createGeometry(_ref) {
    var indices = _ref.indices,
        vertices = _ref.vertices,
        normals = _ref.normals,
        uvs = _ref.uvs;
    const geometry = new BufferGeometry();
    geometry.setIndex(bAttr(new Uint32Array(indices, 0, 1), 1));

    geometry.setAttribute(
        "position",
        bAttr(new Float32Array(vertices, 0, 3), 3)
    );

    if (!isNil(normals)) {
        geometry.setAttribute("normal", bAttr(normals, 3));
    }

    if (!isNil(uvs)) {
        geometry.setAttribute("uv", bAttr(new Float32Array(uvs, 0, 2), 2));
    }

    geometry.applyMatrix4(modelFlipMatrix);
    // geometry.rotateX(Math.PI)

    if (isNil(normals)) geometry.computeVertexNormals();

    return geometry;
}

function loadTexture(url) {
    let textureProps = {
        sourceFile: url,
        needsUpdate: true,
        wrapS: ClampToEdgeWrapping,
        wrapT: ClampToEdgeWrapping,
        minFilter: LinearFilter,
    };
    const imageLoader = new ImageLoader();
    imageLoader.setCrossOrigin("");
    return new Promise(function (resolve, reject) {
        imageLoader.load(
            url,
            function (image) {
                var texture = new THREE.Texture(image);
                resolve(Object.assign(texture, textureProps));
            },
            noop,
            function (error) {
                return reject(error);
            }
        );
    });
}

function loadMaterial(texturePromise) {
    const uniforms = THREE.UniformsUtils.clone(uniform);
    uniforms.modelAlpha.value = 1;
    uniforms.opacity.value = 1;

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        defines: { USE_MAP: true, USE_UV: true },
        lights: true,
    });
    texturePromise.then(function (texture) {
        return (uniforms.map.value = texture);
    });

    shaderMaterial._opacity = 1;
    return Object.assign(shaderMaterial);
}

function parse(chunks = [], _ref2) {
    let { materialTextures, materialBaseURL = "" } = _ref2;
    materialTextures = (materialTextures || []).slice();
    chunks.forEach((chunk) => {
        chunk.chunkName = parseChunkName(chunk.name);
        chunk.floorName = parseFloorName(chunk.name);
        let materialTextureIndex = parseInt(chunk.chunkName, 10);
        let materialTexture = materialTextures[materialTextureIndex];
        chunk.texture = materialTextures[materialTextureIndex] =
            materialTexture || chunk.texture;
    });

    chunks.sort(function (a, b) {
        return (
            a.floorName * 1e3 + a.chunkName - (b.floorName * 1e3 + b.chunkName)
        );
    });

    var byFloor = [];
    var texturePromiseMap = {};

    for (var index = 0; index < chunks.length; index++) {
        var chunk = chunks[index];
        var floor = parseFloorName(chunk.name);

        var floorObjects = (byFloor[floor] = byFloor[floor] || {
            geometries: [],
            materials: [],
        });

        var geometry = createGeometry({
            vertices: chunk.vertices.xyz,
            uvs: chunk.vertices.uvs,
            indices: chunk.faces.indices,
        });
        geometry.name = "model_geo_chunk_" + index;
        floorObjects.geometries.push(geometry);

        var textureURL = chunk.texture;
        var texturePromise = void 0;
        if (texturePromiseMap[textureURL]) {
            texturePromise = texturePromiseMap[textureURL];
        } else {
            texturePromise = texturePromiseMap[textureURL] =
                loadTexture(textureURL);
        }

        var material = loadMaterial(texturePromise);
        material.name = "model_mtl_chunk_" + index;

        floorObjects.materials.push(material);
    }

    var objects = [];
    for (var _index = 0; _index < byFloor.length; _index++) {
        var _floorObjects = byFloor[_index];
        if (!_floorObjects) continue;
        var _geometry = BufferGeometryUtils.mergeBufferGeometries(
            _floorObjects.geometries,
            true
        );
        var meshByFloor = new THREE.Mesh(_geometry, _floorObjects.materials);
        meshByFloor.floor = _index;
        meshByFloor.name = "model_floor_" + _index;
        objects.push(meshByFloor);
    }
    var materialImageLoadPromise = Promise.all(
        Object.keys(texturePromiseMap).map(function (key) {
            return texturePromiseMap[key];
        })
    );
    return {
        objects,
        materialImageLoadPromise,
    };
}
export default parse;

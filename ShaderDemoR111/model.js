import * as THREE from "./threejs/build/three.module.js";

import isNil from "./isNil.js";
import subscribe from "./subscribe.js";
import parse from "./pbm.js";
import uniformsMixin from "./uniformsMixin.js";
import objdata from "./objdata.js";

// == third-party ==

const { Object3D, Texture } = THREE;

function getBoxBounding(boxes) {
    let room = {
        min: new THREE.Vector3(Infinity, Infinity, Infinity),
        max: new THREE.Vector3(-Infinity, -Infinity, -Infinity),
    };
    for (const box of boxes) {
        const { max, min } = box;

        room.min.x = Math.min(room.min.x, min.x);
        room.min.y = Math.min(room.min.y, min.y);
        room.min.z = Math.min(room.min.z, min.z);
        room.max.x = Math.max(room.max.x, max.x);
        room.max.y = Math.max(room.max.y, max.y);
        room.max.z = Math.max(room.max.z, max.z);
    }

    room.center = new THREE.Vector3().set(
        room.max.x / 2 + room.min.x / 2,
        room.max.y / 2 + room.min.y / 2,
        room.max.z / 2 + room.min.z / 2
    );
    return room;
}

const floorMixin = {
    shownfloor: null,
    hasFloors() {
        let floors = [];
        this.children.forEach((mesh) => {
            return (floors[mesh.floor] = true);
        });
        return floors.length;
    },
    show(floorIndex = null, hideOpacity = 0.1) {
        this.shownfloor = floorIndex;
        this.traverse((mesh) => {
            if (!mesh.isMesh) return;
            const material = [].concat(mesh.material);

            let rootMesh = mesh,
                floor = 0;
            while (rootMesh) {
                if (!rootMesh.hasOwnProperty("floor")) {
                    rootMesh = rootMesh.parent;
                    continue;
                }
                floor = rootMesh.floor;
                break;
            }

            material.forEach((material) => {
                const uniforms = material.uniforms;
                const originalOpacity = material._opacity || 1;
                if (!uniforms) return;

                if (floorIndex === null || floorIndex === floor) {
                    uniforms.opacity.value = originalOpacity;
                } else {
                    uniforms.opacity.value = originalOpacity * hideOpacity;
                }
            });
        });
        this.needsRender = true;
    },
};

const intersectMixin = {
    intersectRaycaster(raycaster, floors) {
        const _this = this;

        const { origin, direction } = raycaster.ray;

        if (isNil(floors)) {
            if (!isNil(this.shownfloor)) {
                floors = [this.shownfloor];
            } else {
                const length = this.hasFloors();
                floors = [];
                for (let i = 0; i < length; i++) {
                    floors.push(i);
                }
            }
        }
        let intersections = [];

        const _loop = (floor) => {
            const meshs = _this.children.filter((mesh) => {
                return mesh.floor === floor;
            });
            const _intersections2 = raycaster.intersectObjects(meshs);
            intersections.push(..._intersections2);
        };
        for (const floor of [].concat(floors)) {
            _loop(floor);
        }

        return intersections.sort(function (a, b) {
            return a.distance - b.distance;
        });
    },
};

class Model extends Object3D {
    constructor() {
        super();
        this.name = "model";
        this.loaded = false;
    }

    load(_ref) {
        const _this = this;
        const materialTextures = _ref.materialTextures,
            materialBaseURL = _ref.materialBaseURL,
            imageOptions = _ref.imageOptions;
        if (this.loaded === true) throw new Error("model 只能被 load 一次");
        this.loaded = true;

        const opts = {
            materialTextures: materialTextures,
            materialBaseURL: materialBaseURL,
            imageOptions: imageOptions,
        };
        const { objects, materialImageLoadPromise } = parse(objdata, opts);

        let boxes = [];
        _this.geometries = [];
        _this.materials = [];
        _this.objects = objects;

        for (const object of _this.objects) {
            const meshes = object.isMesh ? [object] : object.children;

            for (const mesh of meshes) {
                mesh.geometry.floor = mesh.floor;
                mesh.geometry.computeBoundingBox();
                mesh.geometry.computeBoundingSphere();

                boxes.push(mesh.geometry.boundingBox);
                _this.geometries.push(mesh.geometry);

                _this.materials.push(mesh.material);
            }

            _this.add(object);
        }

        _this.emit("geometryLoaded");
        materialImageLoadPromise.then(function () {
            return _this.emit("materialLoaded");
        });

        _this.bounding = getBoxBounding(boxes);
        Object.assign(_this, uniformsMixin, floorMixin, intersectMixin, {
            setTransparent: function setTransparent(bool) {
                this.transparent = bool;
                for (const material of this.materials) {
                    for (const one of [].concat(material)) {
                        if (one._opacity !== 1) continue;
                        one.transparent = bool;
                    }
                }
            },
        });
        boxes.length = 0;
        materialImageLoadPromise.then(function () {
            return _this.emit("loaded");
        });

        // .catch(function (error) {
        //     _this.emit("error", error);
        // });
    }

    dispose() {
        while (this.children[0]) {
            this.remove(this.children[0]);
        }
        while (this.geometries[0]) {
            const geometry = this.geometries.shift();
            geometry.dispose();
        }
        while (this.materials[0]) {
            for (const material of [].concat(this.materials.shift())) {
                material.dispose();
                if (material.uniforms.map instanceof Texture) {
                    material.uniforms.map.dispose();
                }
            }
        }

        this.geometries = null;
        this.materials = null;
    }
}

Object.assign(Model.prototype, subscribe);
export default Model;

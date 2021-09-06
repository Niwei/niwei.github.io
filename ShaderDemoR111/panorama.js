import * as THREE from "./threejs/build/three.module.js";

import mixin from "./mixin.js";

import isNil from "./isNil.js";

import subscribe from "./subscribe.js";
import cubeTexture from "./cubeTexture.js";
import boundingMesh from "./boundingMesh.js";
import toNumber from "./toNumber.js";
import tap from "./tap.js";
import { arrayToXYZ } from "./arrayXYZ.js";
const PI = Math.PI;

class Panorama {
    constructor(_ref) {
        const _this = this;
        const {
            ident,
            scene,
            camera,
            renderer,
            element,
            model,
            bounding,
            panoIndex,
            options,
            fov,
            longitude,
            latitude,
            maxLatitude = PI / 4,
            minLatitude = -PI / 4,
            viewportScale,
            withTransition,
            imageOptions,
            extraElements,
            panoCircleMeshCreator,
            intersectMeshCreator,
            offset,
        } = _ref;
        this.ident = ident;
        this.raycaster = new THREE.Raycaster();

        // 摄像头的经纬度
        this.longitude = longitude; // 经度
        this.latitude = latitude; // 纬度
        this.maxLatitude = maxLatitude;
        this.minLatitude = minLatitude;

        this.longitude = toNumber(this.longitude);
        this.latitude = toNumber(this.latitude);
        this.maxLatitude = toNumber(this.maxLatitude);
        this.minLatitude = toNumber(this.minLatitude);
        this.offset = offset;

        // 修正错误值
        if (this.latitude > maxLatitude || this.latitude < minLatitude) {
            this.latitude = 0;
        }

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.element = element;
        this.model = model;
        this.bounding = bounding;
        this.viewportScale = viewportScale;
        this.imageOptions = imageOptions;

        this.panoCircleMeshCreator = panoCircleMeshCreator;
        this.intersectMeshCreator = intersectMeshCreator;

        this.baseURI = "";
        this.cubePath = "";
        if (options.panorama.base_url) {
            this.baseURI = options.panorama.base_url;
        } else if (options.base_url) {
            this.baseURI = options.base_url;
            this.cubePath = options.panorama.pano_high_cube_base_url;
        }

        this.observers = options.observers;
        this.panorama = options.panorama;

        this.panoArrived = false;

        this.currentPanoIndex = parseInt(panoIndex);
        if (isNil(this.observers[this.currentPanoIndex])) {
            this.currentPanoIndex = 0;
        }

        const { pano0Map, pano1Map } = model.getUniforms();

        if (pano1Map && pano1Map !== pano0Map) {
            pano1Map.dispose();
            model.setUniforms({ pano1Map: pano0Map });
        }

        this.cubeTextureLoader = new cubeTexture();
        this.localeTexture = pano0Map;

        this.boundingMesh = boundingMesh(bounding, new THREE.Vector3(1, 0, 1));
        this.boundingMesh.setUniforms(this.model.getUniforms());
        this.boundingMesh.name = "bounding";
        this.boundingMesh.visible = false;
        this.scene.add(this.boundingMesh);

        this.intersectMesh = this.intersectMeshCreator();
        this.intersectMesh.name = "intersect";
        this.intersectMesh.visible = false;
        this.scene.add(this.intersectMesh);

        this.updatePanoCircleMeshes();
        this.panoCircleMeshes.forEach(function (mesh) {
            return (mesh.visible = false);
        });
        this.boundingMesh.visible = false;

        this.preventPanGesture = false;
        this.preventTapGesture = false;
        this.needsRender = true;
        this.loadTexture(0, function () {
            console.log(123);
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    loadTexture(panoIndex, callback) {
        var _this6 = this;

        this.emit("panoWillLoad", panoIndex);

        var list = this.panorama.list || this.panorama.info;

        if (list[panoIndex].active === false) {
            throw new Error("pano images were not actived");
        }

        this.cubeTextureLoader.load(
            this.ident + "." + panoIndex,
            {
                baseURI: this.baseURI,
                cubePath: this.cubePath,
                index: panoIndex,
                images: list[panoIndex],
                imageOptions: this.imageOptions,
            },
            function (error, texture) {
                if (texture) {
                    _this6.emit("panoLoaded", panoIndex);
                    callback(texture);
                }
            }
        );
    }
    updatePanoCircleMeshes() {
        var _this2 = this;

        var loadingPanos = [];
        if (this.panoCircleMeshes) {
            this.panoCircleMeshes.forEach(function (mesh) {
                if (mesh.loading) loadingPanos.push(mesh.panoIndex);
                var index = mesh.panoIndex,
                    progressCallback = mesh.__progressCallback,
                    abortCallback = mesh.__abortCallback;

                var ident = _this2.ident + "." + index;
                cubeTexture.off("progress." + ident, progressCallback);
                cubeTexture.off("abort." + ident, abortCallback);
                _this2.scene.remove(mesh);
                if (mesh.progressTween) {
                    mesh.progressTween.destroy();
                    mesh.progressTween = null;
                }
                mesh.dispose();
            });
            this.panoCircleMeshes.length = 0;
            this.panoCircleMeshes = null;
        }

        this.panoCircleMeshes = this.observers.map(function (observer) {
            var standing_position = observer.standing_position,
                index = observer.index;

            var panoImage = (_this2.panorama.list ||
                _this2.panorama.info ||
                [])[index];

            var disabled =
                observer.active === false || panoImage.active === false;

            return tap(_this2.panoCircleMeshCreator(observer), function (mesh) {
                mesh.position.copy(arrayToXYZ(standing_position));

                var lastProgress = 0;
                var progressCallback = function progressCallback() {
                    var progress =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : 0;

                    if (progress === 0) mesh.setProgress((lastProgress = 0));
                    if (mesh.progressTween) {
                        mesh.progressTween.destroy();
                    }

                    mesh.needsRender = true;
                };
                var abortCallback = function abortCallback() {
                    if (mesh.progressTween) {
                        mesh.progressTween.destroy();
                    }
                    if (mesh) mesh.setProgress(0);
                };
                var ident = _this2.ident + "." + index;
                cubeTexture.on("progress." + ident, progressCallback);
                cubeTexture.on("abort." + ident, abortCallback);
                Object.assign(mesh, {
                    name: "panoCircle_" + index,
                    panoIndex: index,
                    __progressCallback: progressCallback,
                    __abortCallback: abortCallback,
                });
                _this2.scene.add(mesh);
                mesh.needsRender = true;
                if (disabled) {
                    mesh.setDisabled(true);
                    if (loadingPanos.indexOf(index) >= 0) {
                        mesh.setDisabled(false);
                        mesh.setLoading(true);
                    }
                }
            });
            _this2.needsRender = true;
        });

        var visible_nodes = this.observers[this.currentPanoIndex].visible_nodes;

        if (isNil(visible_nodes)) {
            visible_nodes = [];
            this.observers.forEach(function (observer, index) {
                return visible_nodes.push(index);
            });
        }

        visible_nodes = visible_nodes.filter(function (panoIndex) {
            if (_this2.observers[panoIndex].active === false) return false;
            var panoImage = (_this2.panorama.list ||
                _this2.panorama.info ||
                [])[panoIndex];
            if (!panoImage) return false;
            if (panoImage.active === false && panoImage.loadable !== true)
                return false;
            return true;
        });
        this.panoCircleMeshes.forEach(function (mesh) {
            mesh.visible = visible_nodes.indexOf(mesh.panoIndex) >= 0;
        });
        //var position = this.camera.position;

        this.panoCircleMeshes.forEach(function (panoCircleMesh) {
            //var distance = panoCircleMesh.position.distanceTo(position);
            //panoCircleMesh.setOpacity(Math.min(1.5 / distance, 1));
        });
    }
}
mixin(subscribe)(Panorama);
export default Panorama;

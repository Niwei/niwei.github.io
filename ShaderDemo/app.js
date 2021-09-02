import * as THREE from "./threejs/build/three.module.js";
import boundingMesh from "./boundingMesh.js";
import * as animationFrame from "./animationFrame.js";
import mixin from "./mixin.js";
import subscribe from "./subscribe.js";
import tap from "./tap.js";
import uuid from "./uuid.js";
import isNil from "./isNil.js";
import noop from "./noop.js";
import _model from "./model.js";
import { OrbitControls } from "./threejs/OrbitControls.js";
const Matrix4 = THREE.Matrix4,
    Object3D = THREE.Object3D,
    Mesh = THREE.Mesh,
    PerspectiveCamera = THREE.PerspectiveCamera,
    OrthographicCamera = THREE.OrthographicCamera,
    WebGLRenderer = THREE.WebGLRenderer,
    Scene = THREE.Scene,
    AmbientLight = THREE.AmbientLight,
    Frustum = THREE.Frustum;
const defaultBounding = {
    max: { x: 50, y: 50, z: 50 },
    min: { x: -50, y: -50, z: -50 },
    center: { x: 0, y: 0, z: 0 },
};
function generateScene() {
    return new Scene();
}
function generateRenderer(_ref) {
    const {
        preserveDrawingBuffer = false,
        backgroundColor = 0x181a1c,
        backgroundAlpha = 1,
        pixelRatio = 1,
        antialias = true,
    } = _ref;

    const renderer = new WebGLRenderer({
        antialias: antialias, // 抗锯齿
        preserveDrawingBuffer: preserveDrawingBuffer,
        alpha: true,
    });

    return tap(renderer, function (renderer) {
        renderer.setPixelRatio(pixelRatio);
        renderer.setClearColor(backgroundColor, backgroundAlpha);
        renderer.autoClear = true;
    });
}
class App {
    constructor(options) {
        const {
            panoIndex = null,
            longitude,
            latitude,
            initWithTransition = true,
            preserveDrawingBuffer,
            backgroundColor,
            backgroundAlpha,
            floorplanMaxLatitude,
            floorplanMinLatitude,
            panoramaMaxLatitude,
            panoramaMinLatitude,
            play = true,
            viewportScale = 1,
            imageOptions,
            textureOptions,
            antialias,

            onlyRenderIfNeeds = false,
            maxFps = false,
            webvrPolyfillConfig = {},
            plugins = [],
        } = options;

        try {
            this.renderer = generateRenderer({
                preserveDrawingBuffer: preserveDrawingBuffer,
                backgroundColor: backgroundColor,
                backgroundAlpha: backgroundAlpha,
                antialias: antialias,
                pixelRatio: viewportScale === 1 ? window.devicePixelRatio : 1,
            });
        } catch (error) {
            console.log(error);
        }

        this.scene = generateScene();
        this.bounding = defaultBounding;
        this.model = boundingMesh(this.bounding);

        this.model.name = "model_empty";
        this.model.empty = true;

        const light = new THREE.DirectionalLight(0xffffff, 0.1);
        light.position.copy(new THREE.Vector3(1, 1, 1));
        this.scene.add(light);

        const _light = new THREE.DirectionalLight(0xffffff, 0.1);
        this.scene.add(_light);

        const _light2 = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(_light2);

        if (play) this.play();
    }
    render(callback) {
        const _this = this;
        let camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            50
        );

        camera.position.z = 4;

        // let controls = new OrbitControls(camera, _this.renderer.domElement);

        // controls.enableDamping = true;
        this.renderer.render(_this.scene, camera);
        if (callback) animationFrame.nextFrame(callback);
    }
    __loadModel(modelSrc, _ref, callback) {
        const _this = this;
        const { modelAsync = true } = _ref;

        const materialBaseURL = modelSrc.material_base_url,
            materialTextures = modelSrc.material_textures;

        //this.emit("modelWillLoad");
        const model = new _model();

        model.once("geometryLoaded", function () {
            // return _this.emit("modelGeometryLoaded", model);
        });
        model.once("error", function (error) {
            // return _this.emit("modelLoadError", error, model);
        });

        model.once("loaded", function () {
            if (_this.destroyed) return;

            _this.bounding = model.bounding;

            var lastModel = _this.model;
            var lastUniforms = void 0;
            if (lastModel) {
                lastUniforms = lastModel.getUniforms();
                _this.scene.remove(lastModel);
                lastModel.dispose();
                model.setTransparent(lastModel.transparent);
                model.visible = lastModel.visible;
            }

            _this.model = Object.assign(model, {
                loaded: true,
            });
            if (lastUniforms) _this.model.setUniforms(lastUniforms);

            if (_this.controller && _this.controller.resetBounding) {
                _this.controller.resetBounding(model.bounding);
            }
            if (_this.controller && _this.controller.resetModel) {
                _this.controller.resetModel(model);
            }

            var onModelAppended = function onModelAppended() {
                callback.call(_this);
                //_this.emit("modelLoaded", model);
                animationFrame.nextFrame(function () {
                    // return _this.emit("modelMaterialLoaded", model);
                });
                //if (bvh) model.buildBVH();
                _this.needsRender = true;
            };

            if (!modelAsync) {
                _this.scene.add(_this.model);
                onModelAppended();
            } else {
                var meshes = [].concat(_this.model.children);

                _this.model.children.length = 0;
                _this.scene.add(_this.model);
                const loop = function loop() {
                    var mesh = meshes.shift();

                    if (mesh) {
                        _this.model.setUniforms.call(
                            mesh,
                            _this.model.getUniforms()
                        );
                        _this.model.add(mesh);
                        _this.model.show(_this.model.shownfloor);
                        _this.needsRender = true;
                        animationFrame.nextFrame(loop, 2);
                    } else {
                        onModelAppended();
                    }
                };
                loop();
            }
        });
        model.load({
            materialBaseURL: materialBaseURL,
            materialTextures: materialTextures,
            imageOptions: this.textureOptions,
        });
    }
    load(ident, options, callback) {
        var _this = this;

        if (typeof ident !== "string") {
            callback = options;
            options = ident;
            ident = uuid();
        }
        if (isNil(callback)) callback = noop;
        const modelSrc = options.model;
        var __loadModel = function __loadModel(modelSrc, callback) {
            if (!modelSrc) return;

            _this.__loadModel(
                modelSrc,
                {
                    modelAsync: options.modelAsync,
                },
                callback
            );
        };

        __loadModel(modelSrc, function () {
            callback.call(_this);
        });
    }
    play() {
        const _this = this;

        this.pause();
        let lastRenderTimestemp = Date.now();
        let lastFpsTimestamp = Date.now();
        let fpsCount = 0;
        this.pause = animationFrame.requestAnimationFrameInterval(function () {
            const timestemp = Date.now();
            if (_this.maxFps) {
                if (timestemp - lastRenderTimestemp + 1 <= 1000 / _this.maxFps)
                    return;
                lastRenderTimestemp = timestemp;
            }
            _this.render();
            // if (
            //     _this.currentMode === Mode.VRPanorama ||
            //     _this.onlyRenderIfNeeds
            // ) {
            //     for (const mesh of _this.getRenderMeshes()) {
            //         var object = mesh;
            //         while (object) {
            //             if (object.needsRender === true) {
            //                 object.needsRender = false;
            //                 _this.needsRender = true;
            //             }
            //             object = object.parent;
            //             if (object && object.isScene) object = null;
            //         }
            //     }

            //     if (_this.controller) {
            //         if (_this.controller.needsRender === true) {
            //             _this.controller.needsRender = false;
            //             _this.needsRender = true;
            //         }
            //     }
            //     if (_this.needsRender !== false) _this.render();
            // } else {
            //     _this.render();
            // }
            _this.needsRender = false;

            if (_this.hasListener("renderFrame")) _this.emit("renderFrame");
            if (_this.hasListener("fps")) {
                if (lastFpsTimestamp && timestemp - lastFpsTimestamp < 1000) {
                    fpsCount++;
                } else {
                    if (lastFpsTimestamp) {
                        _this.emit("fps", fpsCount);
                    }
                    lastFpsTimestamp = timestemp;
                    fpsCount = 0;
                }
            }
        });
    }
    pause() {
        /* 防止空方法 */
    }
}
mixin(subscribe)(App);
export default Object.assign(App, {
    THREE: THREE,
});

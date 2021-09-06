import * as THREE from "./threejs/build/three.module.js";
import noop from "./noop.js";
import * as animationFrame from "./animationFrame.js";
import subscribe from "./subscribe.js";

const empty =
    "data:image/gif;base64," +
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const imageTypeArray = ["right", "left", "up", "down", "front", "back"];

const imagePool = [];

function prepareImage(image) {
    image.onload = image.onerror = function () {};
    image.crossOrigin = "";
    image.removeAttribute("src");
    return image;
}

function getImage() {
    if (imagePool.length) {
        return prepareImage(imagePool.shift());
    } else {
        return prepareImage(new Image());
    }
}

function disposeImage(image) {
    imagePool.push(prepareImage(image));
}

function imageOnLoad(image) {
    if (this._aborted) return;
    if (image.src === empty) return;

    image.onerror = image.onload = function () {};
    this._progress++;
    const pst = this._progress / this._images.length;
    this._onProgress(pst);
    CubeTextureLoader.emit("progress." + this._ident, pst);
    CubeTextureLoader.emit("progress", {
        ident: this._ident,
        pst: pst,
    });
    if (this._progress === this._images.length) {
        this._loading = false;
        this._loaded = true;
        const cubeTexture = new THREE.CubeTexture();
        const __dispose = cubeTexture.dispose;
        this._images.forEach(function (image, index, list) {
            cubeTexture.images[index] = image;
            list[index] = null;
        });
        cubeTexture.needsUpdate = true;

        cubeTexture.minFilter = THREE.LinearFilter;
        cubeTexture.dispose = function () {
            this.images.forEach(function (image, index, list) {
                list[index] = null;
                if (image) disposeImage(image);
            });
            for (
                let _len = arguments.length, args = Array(_len), _key = 0;
                _key < _len;
                _key++
            ) {
                args[_key] = arguments[_key];
            }
            return __dispose.call.apply(__dispose, [this].concat(args));
        };
        this._onLoad(cubeTexture);
        CubeTextureLoader.emit("load." + this._ident, cubeTexture);
        CubeTextureLoader.emit("load", {
            ident: this._ident,
            cubeTexture: cubeTexture,
        });
    }
}

function imageOnError(image) {
    if (this._aborted) return;
    if (image.src === empty) return;
    this._errored = true;
    this._loading = false;
    const error = new Error("image(" + image.src + ") load error ");
    this._onError(error);
    CubeTextureLoader.emit("error." + this._ident, error);
    CubeTextureLoader.emit("error", {
        ident: this._ident,
        error: error,
    });
    this.disposeImages();
}

function parseImageURL(type, options) {
    let {
        baseURI = "",
        cubePath = "",
        index = 0,
        images = {},
        imageOptions = {},
    } = options;

    const url = images[type];

    return url;
}

class CubeTextureLoader {
    constructor() {
        this._images = [null, null, null, null, null, null];
        this._ident = "untitled";
        this._progress = 0;
        this._loading = false;
        this._loaded = false;
        this._errored = false;
        this._aborted = false;
        this._onLoad = noop;
        this._onProgress = noop;
        this._onError = noop;
        this._onAbort = noop;
    }
    disposeImages() {
        this._images.forEach((image, index, list) => {
            if (!image) return;
            disposeImage(image);
            list[index] = null;
        });
    }
    load(ident, options, callbacks = {}) {
        const _this = this;

        this.abort();
        let {
            onLoad = noop,
            onProgress = noop,
            onError = noop,
            onAbort = noop,
        } = callbacks;

        if (typeof callbacks === "function") {
            onLoad = callbacks.bind(this, null);
            onError = callbacks.bind(this);
        }

        this._ident = ident;
        this._progress = 0;
        this._errored = false;
        this._loaded = false;
        this._loading = true;
        this._aborted = false;
        this._onLoad = onLoad;
        this._onProgress = onProgress;
        this._onError = onError;
        this._onAbort = onAbort;

        this._images.forEach((image, index, list) => {
            image = list[index] = getImage();
            image.onload = function () {
                return animationFrame.nextFrame(function () {
                    return imageOnLoad.call(_this, image);
                });
            };
            image.onerror = imageOnError.bind(_this, image);
            image.src = parseImageURL(imageTypeArray[index], options);
        });
        CubeTextureLoader.emit("progress." + this._ident, 0);
        CubeTextureLoader.emit("progress", {
            ident: this._ident,
            pst: 0,
        });
    }
    abort() {
        if (this._aborted) return;
        this._aborted = true;
        if (this._loaded) return;
        if (this._errored) return;
        const needCallAbort = this._loading;
        this._loading = false;
        if (needCallAbort) {
            this._onAbort();
            CubeTextureLoader.emit("abort." + this._ident);
            CubeTextureLoader.emit("abort", {
                ident: this._ident,
            });
        }
        this.disposeImages();
    }
}

export default Object.assign(CubeTextureLoader, subscribe);

import { Matrix4, Vector3 } from "./threejs/build/three.module.js";
import isNil from "./isNil.js";

// == third-party ==
function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}
export default {
    setUniforms: function setUniforms() {
        for (
            var _len = arguments.length, options = Array(_len), _key = 0;
            _key < _len;
            _key++
        ) {
            options[_key] = arguments[_key];
        }

        var _Object$assign = Object.assign.apply(
            Object,
            [{}].concat(_toConsumableArray(options))
        );
        const {
            modelAlpha,
            opacity,
            progress,
            stasis,
            blackTransition,
            blackProgress,
            panoFilter,
            pano0Position,
            pano0Matrix,
            pano0Map,
            pano1Position,
            pano1Matrix,
            pano1Map,
        } = _Object$assign;
        this.traverse(function (mesh) {
            if (!mesh.isMesh) return;
            var material = [].concat(mesh.material);
            material.forEach(function (material) {
                if (!material) return;
                var uniforms = material.uniforms;
                if (!uniforms) return;

                if (!isNil(modelAlpha)) uniforms.modelAlpha.value = modelAlpha;
                // if (!isNil(opacity)) uniforms.opacity.value = opacity
                if (!isNil(progress)) uniforms.progress.value = progress;
                if (!isNil(blackProgress))
                    uniforms.blackProgress.value = blackProgress;
                if (!isNil(blackTransition))
                    uniforms.blackTransition.value = blackTransition;
                if (!isNil(panoFilter)) uniforms.panoFilter.value = panoFilter;

                if (!isNil(pano0Map)) uniforms.pano0Map.value = pano0Map;
                if (!isNil(pano0Position))
                    uniforms.pano0Position.value = pano0Position.clone();
                if (!isNil(pano0Matrix))
                    uniforms.pano0Matrix.value = pano0Matrix;

                if (!isNil(pano1Map)) uniforms.pano1Map.value = pano1Map;
                if (!isNil(pano1Position))
                    uniforms.pano1Position.value = pano1Position.clone();
                if (!isNil(pano1Matrix))
                    uniforms.pano1Matrix.value = pano1Matrix;
            });
        });

        return this;
    },
    getUniforms: function getUniforms() {
        var result = null;
        this.traverse((mesh) => {
            if (result) return;
            if (!mesh.isMesh) return;
            var material = mesh.material;
            var uniforms = material[0]
                ? material[0].uniforms
                : material.uniforms;
            if (!uniforms) return;
            result = {
                modelAlpha: uniforms.modelAlpha.value,
                // opacity: uniforms.opacity.value,
                progress: uniforms.progress.value,
                blackProgress: uniforms.blackProgress.value,
                blackTransition: uniforms.blackTransition.value,
                panoFilter: uniforms.panoFilter.value,

                pano0Map: uniforms.pano0Map.value,
                pano0Position: uniforms.pano0Position.value,
                pano0Matrix: uniforms.pano0Matrix.value,

                pano1Map: uniforms.pano1Map.value,
                pano1Position: uniforms.pano1Position.value,
                pano1Matrix: uniforms.pano1Matrix.value,
            };
        });
        return result;
    },
    resetUniforms: function resetUniforms() {
        this.traverse(function (mesh) {
            if (!mesh.isMesh) return;
            var material = [].concat(mesh.material);
            material.forEach(function (material) {
                if (!material) return;
                var uniforms = material.uniforms;
                if (!uniforms) return;

                uniforms.modelAlpha.value = 0;
                // uniforms.opacity.value = 1
                uniforms.progress.value = 0;
                uniforms.blackProgress.value = 0;
                uniforms.blackTransition.value = 0;
                // uniforms.panoFilter.value = new Vector3()

                uniforms.pano0Map.value = null;
                uniforms.pano0Position.value = new Vector3();
                uniforms.pano0Matrix.value = new Matrix4();

                uniforms.pano1Map.value = null;
                uniforms.pano1Position.value = new Vector3();
                uniforms.pano1Matrix.value = new Matrix4();
            });
        });
        return this;
    },
    disposeUniforms: function disposeUniforms() {
        this.traverse(function (mesh) {
            if (!mesh.isMesh) return;
            var material = mesh.material;
            var uniforms = material[0]
                ? material[0].uniforms
                : material.uniforms;
            if (!uniforms) return;

            if (uniforms.map.value) {
                uniforms.map.value.dispose();
            }
            if (uniforms.pano0Map.value) {
                uniforms.pano0Map.value.dispose();
            }
            if (
                uniforms.pano1Map.value &&
                uniforms.pano1Map.value !== uniforms.pano0Map.value
            ) {
                uniforms.pano1Map.value.dispose();
            }
        });
        return this;
    },
};

let _requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (fn) {
        return setTimeout(fn, 16);
    };

function nextFrame(fn = function () {}, delay = 0) {
    if (delay <= 0) _requestAnimationFrame(fn);
    else
        _requestAnimationFrame(function () {
            return nextFrame(fn, delay - 1);
        });
}

function requestAnimationFrameInterval(fn = function () {}, context, ...args) {
    var stoped = false;
    var _loop = function loop(time) {
        fn.call.apply(fn, [context, time].concat(args));
        if (!stoped && _loop) _requestAnimationFrame(_loop);
    };
    _requestAnimationFrame(_loop);
    return function () {
        (_loop = null), (stoped = true);
    };
}

function getFrameTime(callback = function () {}) {
    if (getFrameTime.cache) callback(getFrameTime.cache);
    var start = Date.now();
    _requestAnimationFrame(function () {
        callback((getFrameTime.cache = Date.now() - start));
    });
}

getFrameTime();
export default _requestAnimationFrame;
export { nextFrame, requestAnimationFrameInterval, getFrameTime };

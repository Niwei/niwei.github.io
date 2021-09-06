function mixin(...mixins) {
    // var base = function () {};
    // Object.assign(base.prototype, ...mixins);
    // return base;
    return function (clazz) {
        Object.assign.apply(Object, [clazz.prototype].concat(mixins));
        return clazz;
    };
}
export default mixin;

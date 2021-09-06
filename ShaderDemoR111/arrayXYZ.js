function arrayToXYZ(array) {
    return { x: array[0], y: array[1], z: array[2] };
}

function XYZToArray(xyz) {
    return [xyz.x, xyz.y, xyz.z];
}
export default { arrayToXYZ, XYZToArray };
export { arrayToXYZ, XYZToArray };

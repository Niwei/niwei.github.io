// uuid z50z 65536 | 0x10000
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function createUuid() {
    // then to call it, plus stitch in '4' in the third group
    return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-4" +
        S4().substr(0, 3) +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
    ).toLowerCase();
}
export default createUuid;

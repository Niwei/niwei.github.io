function toNumber(maybeNumber) {
    maybeNumber = parseFloat(maybeNumber);
    if (isNaN(maybeNumber)) return 0;
    return maybeNumber;
}
export default toNumber;

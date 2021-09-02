export default function tap(someThing, callback) {
    callback(someThing);
    return someThing;
}

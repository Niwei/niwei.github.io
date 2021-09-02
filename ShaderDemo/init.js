import app from "./app.js";
const _app = new app({
    backgroundAlpha: 0,
    initWithTransition: false,
    floorplanMinLatitude: 0,
    floorplanMaxLatitude: Math.PI / 2,
    viewportScale: 1 / (window.ScaleDPR || window.DPR),
    imageOptions: {
        quality: 70,
    },
    textureOptions: {
        size: 800,
    },
});
_app.load(window.__module__data);

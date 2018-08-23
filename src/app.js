import "./assets/less/index.less";
import IMAGES from './assets/js/images.js';
import CONSTANTS from './assets/js/constants.js';
import utils from './assets/js/utils.js'

console.log("Hurray");

let artBoard;
let artBoardContext;
let WIDTH;
let HEIGHT;
let xMovement = 0;
let yMovement = 0.5;
let bodyMetric;
let scaled = false;
const setupCanvas = (canvas) => {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    // ctx.scale(dpr, dpr);
    return ctx;
}
const getRelativeMetric = (image) => {
    return {
        width: image.width * (WIDTH / CONSTANTS.vpWidth),
        height: image.height * (HEIGHT / CONSTANTS.vpHeight)
    }
}
const initialise = () => {
    artBoard = document.getElementById("art-board");
    // let newMetric = utils.calculateAspectRatioFit(CONSTANTS.vpWidth, CONSTANTS.vpHeight, artBoard.clientWidth, artBoard.clientHeight);
    // artBoard.width = newMetric.width;
    // artBoard.height = newMetric.height;
    artBoardContext = setupCanvas(artBoard);
    artBoardContext.clearRect(0, 0, artBoard.width, artBoard.height);
};

const updateMetrics = () => {
    WIDTH = artBoard.width;
    HEIGHT = artBoard.height;
    console.log(WIDTH, HEIGHT);
};


const renderBody = async (angle) => {
    const bodyImage = await utils.getImage(IMAGES.body);
    // let bodyMetric = utils.calculateAspectRatioFit(bodyImage.width, bodyImage.height, WIDTH, HEIGHT);
    bodyMetric = utils.getMetricObject(bodyImage.width, bodyImage.height);
    if (!scaled) {
        bodyMetric = utils.scaleMetric(bodyMetric, 0.75);
    }
    let bodyXPos = WIDTH / 2 - bodyMetric.width / 2;
    let bodyYPos = HEIGHT / 2 - bodyMetric.height / 2;
    artBoardContext.clearRect(bodyXPos, bodyYPos, bodyMetric.width, bodyMetric.height);
    // artBoardContext.globalAlpha = 1 * Math.max((1 - distRatio), 0.5);
    artBoardContext.filter = 'hue-rotate(' + (angle * 180 / Math.PI) + 'deg)';
    artBoard.style.filter = 'hue-rotate(' + (angle * 180 / Math.PI) + 'deg)';
    artBoardContext.drawImage(bodyImage, bodyXPos, bodyYPos, bodyMetric.width, bodyMetric.height);
    artBoardContext.filter = 'none';
    // artBoardContext.globalAlpha = 1;
    // artBoardContext.rect(bodyXPos, bodyYPos, bodyMetric.width, bodyMetric.height);
    // artBoardContext.stroke();
    // console.log('Body', bodyXPos, bodyYPos, bodyMetric.width, bodyMetric.height);

    const mouthImage = await utils.getImage(IMAGES.mouth);
    let mouthMetric = utils.calculateAspectRatioFit(mouthImage.width, mouthImage.height, bodyMetric.width / 4, bodyMetric.height / 10);
    mouthMetric = utils.scaleMetric(mouthMetric, 0.75);
    let mouthXPos = WIDTH / 2 - mouthMetric.width / 2;
    let mouthYPos = HEIGHT / 2 - mouthMetric.height / 2;
    artBoardContext.drawImage(mouthImage, mouthXPos, mouthYPos, mouthMetric.width, mouthMetric.height);
    // console.log('Body', mouthXPos, mouthYPos, mouthMetric.width, mouthMetric.height);

    const outerEyeImage = await utils.getImage(IMAGES.outerEye);
    const blackEyeImage = await utils.getImage(IMAGES.blackEye);
    const innerEyeImage = await utils.getImage(IMAGES.innerEye);

    let outerEyeMetric = utils.calculateAspectRatioFit(outerEyeImage.width, outerEyeImage.height, bodyMetric.width / 4.79452, bodyMetric.height / 6.44);
    let blackEyeMetric = utils.calculateAspectRatioFit(blackEyeImage.width, blackEyeImage.height, bodyMetric.width / 7.79, bodyMetric.height / 10.33);
    let innerEyeMetric = utils.calculateAspectRatioFit(innerEyeImage.width, innerEyeImage.height, bodyMetric.width / 14.767, bodyMetric.height / 19.578);

    // let outerEyeMetric = utils.getMetricObject(bodyMetric.width / 4.79452, bodyMetric.height / 6.44);
    // let blackEyeMetric = utils.getMetricObject(bodyMetric.width / 7.79, bodyMetric.height / 10.33);
    // let innerEyeMetric = utils.getMetricObject(bodyMetric.width / 14.767, bodyMetric.height / 19.578);

    const eyes = [{
        xOffset: 0.41666,
        yOffset: 0.252206
    }, {
        xOffset: 0.41666,
        yOffset: 0.04094
    }, {
        xOffset: 0.191428,
        yOffset: 0.135775
    }, {
        xOffset: 0.614285,
        yOffset: 0.135775
    }, {
        xOffset: 0.14,
        yOffset: 0.321120
    }, {
        xOffset: 0.657142,
        yOffset: 0.321120
    }];

    const topBlackX = 0.029164;
    const topInnerX = 0.028552;
    eyes.forEach((eye) => {
        let outerEyeXPos = bodyXPos + bodyMetric.width * eye.xOffset;
        let outerEyeYPos = bodyYPos + bodyMetric.height * eye.yOffset;

        let blackEyeXPos = outerEyeXPos + (outerEyeMetric.width - blackEyeMetric.width) * xMovement;
        let blackEyeYPos = outerEyeYPos + (outerEyeMetric.height - blackEyeMetric.height) * yMovement;

        let innerEyeXPos = blackEyeXPos + (blackEyeMetric.width - innerEyeMetric.width) * xMovement;
        let innerEyeYPos = blackEyeYPos + (blackEyeMetric.height - innerEyeMetric.height) * yMovement;

        artBoardContext.drawImage(outerEyeImage, outerEyeXPos, outerEyeYPos, outerEyeMetric.width, outerEyeMetric.height);
        artBoardContext.drawImage(blackEyeImage, blackEyeXPos, blackEyeYPos, blackEyeMetric.width, blackEyeMetric.height);
        artBoardContext.drawImage(innerEyeImage, innerEyeXPos, innerEyeYPos, innerEyeMetric.width, innerEyeMetric.height);
    });
};

const renderMouth = async () => {
    const mouthImage = await utils.getImage(IMAGES.mouth);
    let mouthMetric = getRelativeMetric(mouthImage);
    mouthMetric = utils.scaleMetric(mouthMetric, 0.75);
    let mouthXPos = WIDTH / 2 - mouthMetric.width / 2;
    let mouthYPos = HEIGHT / 2 - mouthMetric.height / 2;
    artBoardContext.drawImage(mouthImage, mouthXPos, mouthYPos, mouthMetric.width, mouthMetric.height);
};

window.addEventListener("load", () => {
    console.log("Loaded");
    initialise();
    updateMetrics();
    renderBody();
    artBoard.onmousemove = (event) => {
        let mousePoint = getCanvasPosition(artBoard, event.clientX, event.clientY);
        // mousePoint.x -= WIDTH/2;
        mousePoint.y = HEIGHT - mousePoint.y;
        // let angleRad = Math.PI - Math.atan2(HEIGHT/2 - mousePoint.y, WIDTH/2 - mousePoint.x );

        var angle = Math.atan2(mousePoint.x - WIDTH / 2, -(mousePoint.y - HEIGHT / 2));
        let dist = Math.sqrt(Math.pow((mousePoint.y - HEIGHT / 2), 2) + Math.pow((mousePoint.x - WIDTH / 2), 2));
        let distRatio = dist / Math.max(dist, Math.sqrt(2 * Math.pow(((HEIGHT / 2) - (bodyMetric.height / 2)), 2)))
        xMovement = distRatio * 0.5 * Math.sin(angle) + 0.5;
        yMovement = distRatio * 0.5 * Math.cos(angle) + 0.5;
        renderBody(angle);
    }
    artBoard.onmousedown = (event) => {
        scaled = true;
        artBoardContext.clearRect(0, 0, WIDTH, HEIGHT);
        let mousePoint = getCanvasPosition(artBoard, event.clientX, event.clientY);
        mousePoint.y = HEIGHT - mousePoint.y;
        var angle = Math.atan2(mousePoint.x - WIDTH / 2, -(mousePoint.y - HEIGHT / 2));
        let dist = Math.sqrt(Math.pow((mousePoint.y - HEIGHT / 2), 2) + Math.pow((mousePoint.x - WIDTH / 2), 2));
        let distRatio = dist / Math.max(dist, Math.sqrt(2 * Math.pow(((HEIGHT / 2) - (bodyMetric.height / 2)), 2)))
        xMovement = distRatio * 0.5 * Math.sin(angle) + 0.5;
        yMovement = distRatio * 0.5 * Math.cos(angle) + 0.5;
        renderBody(angle);
    }
    artBoard.onmouseup = (event) => {
        scaled = false;
        artBoardContext.clearRect(0, 0, WIDTH, HEIGHT);
        let mousePoint = getCanvasPosition(artBoard, event.clientX, event.clientY);
        mousePoint.y = HEIGHT - mousePoint.y;
        var angle = Math.atan2(mousePoint.x - WIDTH / 2, -(mousePoint.y - HEIGHT / 2));
        let dist = Math.sqrt(Math.pow((mousePoint.y - HEIGHT / 2), 2) + Math.pow((mousePoint.x - WIDTH / 2), 2));
        let distRatio = dist / Math.max(dist, Math.sqrt(2 * Math.pow(((HEIGHT / 2) - (bodyMetric.height / 2)), 2)))
        xMovement = distRatio * 0.5 * Math.sin(angle) + 0.5;
        yMovement = distRatio * 0.5 * Math.cos(angle) + 0.5;
        renderBody(angle);
    }
    // renderMouth();
});
window.addEventListener("resize", () => {
    console.log("resized");
    initialise();
    updateMetrics();
    renderBody();
    // renderMouth();
});

const getCanvasPosition = (canvas, x, y) => {
    let bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}
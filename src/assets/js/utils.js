const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    var rtnWidth = srcWidth * ratio;
    var rtnHeight = srcHeight * ratio;
    return {
        width: rtnWidth,
        height: rtnHeight
    };
}

const getImage = (imagePath) => {
    // console.log('Get images')
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = imagePath;
    });
}

const scaleMetric = (metric, scale) => {
    return {
        width: metric.width * scale,
        height: metric.height * scale
    };
}

const getMetricObject = (width, height) => {
    return {
        width: width,
        height: height
    };
}

module.exports = {
    calculateAspectRatioFit,
    getImage,
    scaleMetric,
    getMetricObject
}
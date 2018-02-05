import _ from 'lodash';
import { abstractView } from './view';

function fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

const shapeMap = {};

let id = 0;

/**
 * 
 * @param {*} x the starting X coordinate
 * @param {*} y the starting Y coordinate
 * @param {*} w number of pixels width
 * @param {*} h numer of pizels height
 * @param {*} fill fill color
 */
function shape(ctx, x = 0, y = 0, w = 1, h = 1, fill = '#000000') {
    let internalX = x,
        internalY = y,
        internalW = w,
        internalH = h,
        canvasWidth = ctx.canvas.width,
        canvasHeight = ctx.canvas.height;

    function draw() {
        ctx.fillStyle = fill;
        ctx.fillRect(internalX, internalY, internalW, internalH);
    }

    function clear() {
        ctx.clearRect(internalX, internalY, internalW, internalH);
        // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
    }

    function checkoutOfBounds() {
        let error;
        if (internalX + internalW > canvasWidth) {
            error = 'Shape went out of bounds (width - right)';
        }
        if (internalY + internalH > canvasHeight) {
            error = 'Shape went out of bounds (height - bottom)';
        }
        if (internalY < 0) {
            error = 'Shape went out of bounds (height - top';
        }
        if (internalX < 0) {
            error = 'Shape went out of bounds (width - left';
        }
        if (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    function checkValidDimensions() {
        const isInvalid = [internalX, internalY, internalW, internalH].some((n) => {
            return n < 0;
        });
        if (isInvalid) {
            // debugger;
            console.log('Invalid dimensions');
            // throw new Error('Invalid dimensions');
        }
    }

    function move(x, y) {
        clear();
        internalX += x;
        internalY += y;
        draw();
        checkValidDimensions();
        checkoutOfBounds();
    }

    function resize(x, y) {
        clear();
        internalW += x;
        internalH += y;
        draw();
        checkValidDimensions();
        checkoutOfBounds();
    }

    function getDimensions() {
        return {
            x: internalX,
            y: internalY,
            width: internalW,
            height: internalH
        };
    }

    id++;

    return {
        getDimensions,
        resize,
        draw,
        clear,
        move,
        id
    };
}

function canvasView(...args) {
    const view = abstractView(...args),
        {
            boxSize,
            containerEl
        } = view;

    let canvas = null,
        canvasContext = null;

    function createContainer() {
        if (!containerEl) {
            throw new Error('A containerEl must be specified in order to create the container');
        }
        canvas = document.createElement('canvas');
        canvas.contentText = 'The browser you are using does not support canvas';
        containerEl.appendChild(canvas);
        fitToContainer(canvas);
        if (!canvas.getContext) {
            throw new Error('Canvas view is only supported in browsers which support canvas');
        }
        canvasContext = canvas.getContext('2d');
    }

    function createRect(originX = 25, originY = 25, width = 1, height = 1) {
        const rect = shape(canvasContext, originX, originY, width * boxSize, height * boxSize);
        rect.draw();
        shapeMap[shape.id] = shape;
        return rect;
    }

    function growRect(...args) {
        return resizeRect(...args, true);
    }

    function shrinkRect(...args) {
        return resizeRect(...args);
    }

    function _resizeRect(rect, direction, grow) {
        let x = 0, y = 0;
        switch (direction) {
            case 'right':
                x = 1;
                break;
            case 'left':
                x = -1;
                break;
            case 'up':
                y = -1;
                break;
            case 'down':
                y = 1;
                break;
        }

        return new Promise((resolve, reject) => {
            let i = 0;
            const interval = setInterval(() => {
                i++;
                try {
                    if (grow) {
                        rect.resize(x, y);
                    } else {
                        rect.move(x, y);
                        rect.resize(x * -1, y * -1);
                    }
                } catch (ex) {
                    clearInterval(interval);
                    reject(ex);
                }
                if (i === boxSize) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }


    function resizeRect(rect, direction, grow) {
        let moveX = 0, moveY = 0,
            growX = 0, growY = 0;
        if (grow) {
            switch (direction) {
            case 'right':
                growX = 1;
                break;
            case 'left':
                moveX = -1;
                growX = 1;
                break;
            case 'up':
                moveY = -1;
                growY = 1;
                break;
            case 'down':
                growY = 1;
                break;
            }
        } else {
            switch (direction) {
            case 'right':
                moveX = 1;
                growX = -1;
                break;
            case 'left':
                growX = -1;
                break;
            case 'up':
                growY = -1;
                break;
            case 'down':
                growY = -1;
                moveY = 1;
                break;
            }            
        }


        return new Promise((resolve, reject) => {
            let i = 0;
            const interval = setInterval(() => {
                i++;
                try {
                    rect.move(moveX, moveY);
                    rect.resize(growX, growY);
                } catch (ex) {
                    clearInterval(interval);
                    reject(ex);
                }
                if (i === boxSize) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }

    function moveRect(rect, direction) {
        let x = 0, y = 0;
        switch (direction) {
            case 'right':
                x = 1;
                break;
            case 'left':
                x = -1;
                break;
            case 'up':
                y = -1;
                break;
            case 'down':
                y = 1;
                break;
        }

        return new Promise((resolve, reject) => {
            let i = 0;
            const interval = setInterval(() => {
                i++;
                try {
                    rect.move(x, y);
                } catch (ex) {
                    clearInterval(interval);
                    reject();
                }
                if (i === boxSize) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }

    function removeOne(rect, direction) {
        let x = 0, y = 0;
        switch (direction) {
        case 'right':
            x = 1;
            break;
        case 'left':
            x = -1;
            break;
        case 'up':
            y = -1;
            break;
        case 'down':
            y = 1;
            break;
        }
        rect.move(x * boxSize, y * boxSize);
        rect.resize(x * boxSize * -1, y * boxSize * -1);
    }

    return _.merge({}, view, {
        createContainer,
        createRect,
        growRect,
        shrinkRect,
        removeOne,
        moveRect
    });
}

export {
    canvasView
};
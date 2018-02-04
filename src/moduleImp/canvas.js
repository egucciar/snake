import _ from 'lodash';
import { abstractView } from './view';

function fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

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
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
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

    function move(x, y) {
        clear();
        internalX += x;
        internalY += y;
        draw();
        checkoutOfBounds();
    }

    return {
        draw,
        clear,
        move
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

    function createRect(width = 1, height = 1) {
        const rect = shape(canvasContext, 25, 25, width * boxSize, height * boxSize);
        rect.draw();
        return rect;
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

    return _.merge({}, view, {
        createContainer,
        createRect,
        moveRect
    });
}

export {
    canvasView
};
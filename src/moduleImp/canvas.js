import _ from 'lodash';
import { abstractView } from './view';
import { fitToContainer } from './canvas/canvasHelper';
import { shape } from './canvas/shape';

// the shapeMap would be leveraged if we needed to clear the entire canvas
// this would allow us to redraw the entire canvas. 
// it's not currently in use
const shapeMap = {};

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

    // 100% certain this function is one of the cause of the headaches
    // needs to be debugged further. Possibly trying to make everything "smooth"
    // is creating more issues than it's worth. Definitely need to add more logging / checking here.
    function resizeRect(rect, direction, grow) {
        let moveX = 0, moveY = 0,
            growX = 0, growY = 0;

        // the grow/shrink logic still needed tweaking and testing
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
            // use an interval for "smoothly" moving the snake
            // 1x1 pixel until it is resized by 1 box size
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
            // use an interval for "smoothly" moving the snake
            // 1x1 pixel until it is moved by 1 box size
            const interval = setInterval(() => {
                i++;
                try {
                    rect.move(x, y);
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

    // may want to refactor this function 
    // or create a more generic "remove" function
    // and/ore create a "addOne" function for consistency
    // TODO: abstract & reuse for the "resize" function itself
    function removeOne(rect, direction) {
        let moveX = 0, moveY = 0,
            growX = 0, growY = 0;
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
        rect.move(moveX * boxSize, moveY * boxSize);
        rect.resize(growX * boxSize, growY * boxSize);
    }

    return _.merge({}, view, {
        createContainer,
        createRect,
        moveRect,
        growRect,
        shrinkRect,
        removeOne
    });
}

export {
    canvasView
};
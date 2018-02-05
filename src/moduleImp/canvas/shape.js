// id for storage within the shapeMap
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
            debugger;
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

    // todo: create a "remove" function
    // to remove a shape from the map once it's done
    return {
        getDimensions,
        resize,
        draw,
        clear,
        move,
        id
    };
}

export {
    shape
};
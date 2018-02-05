import { canvasView } from './moduleImp/canvas';
import { keyCodes } from './keyCodes';

const modes = {
    canvas: canvasView
};

let pause = false;

export function init(containerEl, config) {
    if (!modes[config.mode]) {
        throw new Error(`Mode ${config.mode} is not supported`);
    }
    const view = modes[config.mode](containerEl),
        boxSize = config.boxSize || 10;

    let rects = [];

    function move() {
        if (pause) {
            return;
        }
        if (rects.length === 1) {
            const rect = rects[0].rect,
                direction = rects[0].direction;
            view.moveRect(rect, direction)
                .then(() => {
                    move();
                })
                .catch(() => {

                });
        } else {
            const frontRect = rects[rects.length - 1],
                backRect = rects[0];
            if (!frontRect.rect) {
                setTimeout(() => {
                    frontRect.rect = frontRect.createSelfRect();
                    view.removeOne(backRect.rect, backRect.direction);
                    backRect.size--;
                    move();
                }, 0); // push to end of eventloop
                return;
            }
            Promise.all([
                view.growRect(frontRect.rect, frontRect.direction),
                view.shrinkRect(backRect.rect, backRect.direction)
            ])
                .then(() => {
                    backRect.size--;
                    // console.log('[backRect]', backRect.rect.getDimensions());
                    frontRect.size++;
                    const size = backRect.rect.getDimensions();
                    if (backRect.size === 0 || size.width < 0 || size.height < 0) {
                        backRect.rect.clear();
                        rects.shift(); // remove back rect

                    }
                    move();
                })
                .catch((ex) => {
                    throw ex;
                });
        }
    }

    view.createContainer();
    rects.push({
        rect: view.createRect(25, 25, 10, 1),
        size: 10,
        direction: 'right'
    });

    document.addEventListener('keyup', function (event) {
        const direction = keyCodes[event.keyCode],
            lastRect = rects[rects.length - 1]; // assume keycodes only map to directions for now

        function createSelfRect () {
            const origin = deriveOrigin(lastRect.direction, direction, lastRect.rect.getDimensions());
            return view.createRect(origin.x, origin.y, 1, 1);
        }
        if (direction 
                && direction !== lastRect.direction 
                && !opposite(lastRect.direction, direction)) {
            console.log('[snake] allowable direction change detected:', direction);
            rects.push({
                createSelfRect, 
                size: 1,
                direction
            });
        }
        if (event.keyCode === 32) {
            pause = !pause;
            move();
        }
    });

    function opposite(lastDirection, direction) {
        const check = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            },
            checkValue = check[lastDirection] === direction;
        console.log(`[check opposite] lastDirection: ${lastDirection}, direction: ${direction}, isOpposite: ${checkValue}`);
        return checkValue;
    }

    function deriveOrigin(lastDirection, direction, dimensions) {
        const {
            x, y, width, height 
        } = dimensions;

        console.log(`[deriveOrigin] lastDirection: ${lastDirection}, direction: ${direction}`);
        
        if (lastDirection === 'right') {
            if (direction === 'down') {
                return {
                    x: x + width - boxSize,
                    y: y + boxSize
                };
            }
            if (direction === 'up') {
                return {
                    x: x + width - boxSize,
                    y: y
                };
            }
        }

        if (lastDirection === 'left') {
            if (direction === 'down') {
                return {
                    x: x - boxSize,
                    y: y + boxSize
                };
            }
            if (direction === 'up') {
                return {
                    x: x - boxSize,
                    y
                };
            }
        }

        if (lastDirection === 'down') {
            if (direction === 'right') {
                return {
                    x: x + boxSize,
                    y: y + height - boxSize
                };
            }
            if (direction === 'left') {
                return {
                    x: x,
                    y: y + height - boxSize
                };
            }
        }

        if (lastDirection === 'up') {
            if (direction === 'right') {
                return {
                    x: x,
                    y: y - boxSize
                };
            }
            if (direction === 'left') {
                return {
                    x, 
                    y: y - boxSize // ?? why
                };
            }
        }
    }

    move(); // avoid CTRL+R key up messing up things

    window.rects = rects;

}
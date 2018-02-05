import { canvasView } from './moduleImp/canvas';
import { keyCodes } from './keyCodes';

const modes = {
    canvas: canvasView
};

export function init(containerEl, config) {
    if (!modes[config.mode]) {
        throw new Error(`Mode ${config.mode} is not supported`);
    }
    const view = modes[config.mode](containerEl),
        boxSize = config.boxSize || 10;

    let rects = [],
        pause = false;

    window.rects = rects; // exposing rects to window for easier debugging
    
    view.createContainer();

    rects.push({
        // todo - select origin based off of the center of container
        rect: view.createRect(25, 25, 10, 1),
        size: 10,
        direction: 'right'
    });  

    move();   


    document.addEventListener('keyup', function (event) {
        const direction = keyCodes[event.keyCode],  // assume keycodes only map to directions for now
            lastRect = rects[rects.length - 1];

        // createSelfRect function allows itself to be called when the last "move" is completed
        // rather than interrupting to move while it's happening (i.e. whenever keystroke occured)
        // possible area of improvement for future, by weaving it more intutively into the "move" call
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
        // for debugging puposes, space bar (32) will pause the game
        // this code would be refactored / removed for final product
        if (event.keyCode === 32) {
            pause = !pause;
            move();
        }
    });

    function move() {
        if (pause) { // pause implemented for debugging 
            return;
        }
        if (rects.length === 1) {
            const rect = rects[0].rect,
                direction = rects[0].direction;
            view.moveRect(rect, direction)
                .then(() => {
                    move();
                })
                .catch((ex) => {
                    throw ex;
                });
        } else {
            const frontRect = rects[rects.length - 1],
                backRect = rects[0];
            if (!frontRect.rect) {
                setTimeout(() => {
                    frontRect.rect = frontRect.createSelfRect();
                    view.removeOne(backRect.rect, backRect.direction);
                    // size change detection doesn't seem to work perfectly well.
                    // another area of potential improvement
                    backRect.size--;
                    move();
                }, 0); // push to end of eventloop, this needs to be revisited for robustness
                return;
            }
            
            // if there's more than one rectangle being kept track of
            // then the previous rect will be shrunk while the front rect will be grown
            Promise.all([
                view.growRect(frontRect.rect, frontRect.direction),
                view.shrinkRect(backRect.rect, backRect.direction)
            ])
                .then(() => {
                    // todo: put in way better detections for ensuring the size of the snake
                    // doesn't grow or change unexpectedly. Some ideas for improvments include
                    // 1. adding a check validity function somewhere to ensure size doesn't change erroniously
                    // 2. revisiting underlying move/resize/grow logic and calculating out if it works as expected
                    backRect.size--;
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

    // helperfunction for checking if move is allowed
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

    // helperfunction for deriving the origin of the new rectangle
    // this logic needs to be tested further, i drew it out 
    // but then when it was running, things weren't behaving as expected.
    // thus, this would need to be revisited and updated
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
                    y: y - boxSize
                };
            }
        }
    }
}
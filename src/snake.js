import { canvasView } from './moduleImp/canvas';
import { keyCodes } from './keyCodes';

const modes = {
    canvas: canvasView
};

export function init(containerEl, config) {
    if (!modes[config.mode]) {
        throw new Error(`Mode ${config.mode} is not supported`);
    }
    const view = modes[config.mode](containerEl);

    let rect = null,
        interval;

    function move(direction) {
        view.moveRect(rect, direction)
            .then(() => {
                move(direction);
            })
            .catch(() => {

            });
    }

    view.createContainer();
    rect = view.createRect(10, 1);

    document.addEventListener('keyup', function (event) {
        const direction = keyCodes[event.keyCode]; // assume keycodes only map to directions for now
        if (direction) {
            clearInterval(interval);
            move(direction);
        }
    });

    setTimeout(() => {
        move('right'); // avoid CTRL+R key up messing up things
    });
}
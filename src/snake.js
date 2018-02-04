import { canvasView } from './moduleImp/canvas';

const modes = {
    canvas: canvasView
};

export function init(containerEl, config) {
    if (!modes[config.mode]) {
        throw new Error(`Mode ${config.mode} is not supported`);
    }
    const view = modes[config.mode](containerEl);
    view.createContainer();
}
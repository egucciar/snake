import { AbstractView } from './view';

function fitToContainer (canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

class CanvasView extends AbstractView {
    constructor(...args) {
        super(...args);
    }
    createContainer() {
        if (!this.containerEl) {
            throw new Error('A containerEl must be specified in order to create the container');
        }
        this.container = document.createElement('canvas');
        this.container.contentText = 'The browser you are using does not support canvas';
        this.containerEl.appendChild(this.container);
        fitToContainer(this.container);
        this.canvas = this.container; // alias container/canvas for more readability.
        if (!this.canvas.getContext) {
            throw new Error('Canvas view is only supported in browsers which support canvas');
        }
        this.canvasContext = this.canvas.getContext('2d');
    }
}

export {
    CanvasView
};
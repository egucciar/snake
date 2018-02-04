import _ from 'lodash';
import { abstractView } from './view';

function fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function canvasView(...args) {
    const view = abstractView(...args),
        { containerEl } = view;

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

    return _.merge({}, view, {
        createContainer
    });
}

export {
    canvasView
};
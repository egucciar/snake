function abstractView(containerEl, config = {}) {
    function createContainer() {
        throw new Error('createContainer function not defined');
    }
    function createRect() {
        throw new Error('createRect function not defined');
    }
    function moveRect() {
        throw new Error('moveRect function not defined');
    }

    return {
        // defaults
        boxSize: config.boxSize || 10,
        // props
        containerEl,
        // methods
        createContainer,
        createRect,
        moveRect
    };
}

export {
    abstractView
};
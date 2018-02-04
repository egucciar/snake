class AbstractView {
    constructor(containerEl) {
        this.containerEl = containerEl;
        this.container = null;
    }
    createContainer () {
        throw new Error('createContainer function not defined');
    }
}

export {
    AbstractView
};
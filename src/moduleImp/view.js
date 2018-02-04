function abstractView(containerEl) {
    function createContainer() {
        throw new Error('createContainer function not defined');
    }

    return {
        // props
        containerEl,
        // methods
        createContainer
    };
}

export {
    abstractView
};
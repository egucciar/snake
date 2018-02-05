function abstractView(containerEl, config = {}) {

    function notDefined(functionName) {
        return function () {
            throw new Error(`${functionName} is not defined`);
        };
    }


    return {
        // defaults
        boxSize: config.boxSize || 10,
        // props
        containerEl,
        // methods
        createContainer: notDefined('createContainer'),
        createRect: notDefined('createRect'),
        moveRect: notDefined('moveRect'),
        growRect: notDefined('growRect'),
        shrinkRect: notDefined('shrinkRect'),
        removeOne: notDefined('reoveOne')
    };
}

export {
    abstractView
};
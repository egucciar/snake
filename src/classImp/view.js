// note: These files are an example of I would have gone about it if using ES6 classes
// after thought I decided I was more comfortable with moduleImplementation
// however it would be interesting to implement in both ES6 Classes and module pattern
// and determine which one is more readable / cleaner
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
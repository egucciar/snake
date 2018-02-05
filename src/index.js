import config from './config.json';
import { init } from './snake';

if (!config.appContainerTag) {
    throw new Error('An app container tag must be provided to bootstrap snake application');
}

if (this === window) {
    throw new Error('App is not run in strict mode, please use strict mode');
}

document.addEventListener('DOMContentLoaded', function () {
    let appContainer = document.querySelector(config.appContainerTag);

    if (!appContainer) {
        appContainer = document.createElement(config.appContainerTag);
        document.body.appendChild(appContainer);
    }
    init(appContainer, config);
});
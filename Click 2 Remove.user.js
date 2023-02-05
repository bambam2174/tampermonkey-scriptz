// ==UserScript==
// @name         Click 2 Remove
// @namespace    http://bambam2174.github.io/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tagesspiegel.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    document.lastEventType = document.lastEventType || 'click';
    document.listClickedElements = document.listClickedElements || [];

    Window.prototype.loadListener = Window.prototype.loadListener || function (ev) { alert('Loaded', ev)};

    document.removeEventListener('load', window.loadListener);
    document.addEventListener('load', window.loadListener);

    function eventListener(event) {
        console.log('event ' + event.type, event.target,'☞☛👉🏿👉🏾👉🏽👉🏼👉🏻👉—————————————————————👈👈🏻👈🏼👈🏽👈🏾👈🏿☚☜', event);
        if (!event.altKey) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        let clickedElement = event.srcElement || event.target;
        clickedElement.dataset.clicked = (clickedElement.dataset.clicked != undefined) ? clickedElement.dataset.clicked : -1;
        clickedElement.dataset.clicked *= -1
        clickedElement.style.border = (clickedElement.dataset.clicked > 0) ? '3px outset red' : '';
        if (clickedElement.dataset.clicked > 0) {
            document.listClickedElements.push(clickedElement);
            console.log('document.listClickedElements.length', document.listClickedElements.length);
        } else {
            document.listClickedElements = document.listClickedElements.filter(el => el != clickedElement);
            console.log('document.listClickedElements.length', document.listClickedElements.length);
        }
    }

    function removeListeners(eventType = document.lastEventType, element = document, listener = eventListener) {
        try {
            console.log('[SEDAT]•Events: removing ' + eventType + ' event from ' + element.constructor.name);
            element.removeEventListener(eventType, listener);
        } catch (error) {
            console.log('error', error);
        }
    }

    function addListeners(type = document.lastEventType) {
        removeListeners(type);
        document.addEventListener(type, eventListener);
    }

    document.addEventListener('keyup', (event) => {
        if (!event.altKey || !event.shiftKey) {
            return;
        }
        if (event.code == 'KeyR') {
            console.log('key', event.key, event.keyCode);
            if (confirm('remove them?')) {
                document.listClickedElements.forEach(el => {
                    el.remove();
                });
                document.listClickedElements = [];
            }
        }
    });

    addListeners();
})();

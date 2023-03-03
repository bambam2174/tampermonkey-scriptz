// ==UserScript==
// @name         Click 2 Remove
// @namespace    http://bambam2174.github.io/
// @version      0.1.1
// @description  Mark & unmark HTML element with Alt+Click. Remove marked elements with Alt+Shift+R
// @author       Sedat Kpunkt <bambam2174@gmail.com>
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tagesspiegel.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.lastEventType = document.lastEventType || 'click';
    document.listClickedElements = document.listClickedElements || [];

    function eventListener(event) {
        console.log('event ' + event.type, event.target,'☞☛👉🏿👉🏾👉🏽👉🏼👉🏻👉—————————————————————👈👈🏻👈🏼👈🏽👈🏾👈🏿☚☜', event);
        if (!event.altKey) {
            return true;
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
        return false;
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

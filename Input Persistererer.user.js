// ==UserScript==
// @name         Input Persistererer
// @namespace    http://bambam2174.github.io/
// @version      0.1
// @description  When writing something in an input field, textarea or comment box the input is made persistent locally in the localStorage. This was mandatory after having lost stuff I wrote for hours got lost because of my cat trampling over my keyboard
// @author       Sedat Kpunkt <bambam2174@gmail.com>
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.removeEventListener('keyup', eventListener);
    document.removeEventListener('click', clickEventListener);

    function getSelectorFromTagnameIdAndClasslist(element) {
        let selectorIdClasslist = element.tagName + (element.id ? '#'+ element.id : '') + (element.classList.length ? '.' + [...element.classList].join('.') : '');
        return selectorIdClasslist;
    }

    const clickEventListener = (ev) => {
        let szTarget = getSelectorFromTagnameIdAndClasslist(ev.target);
        let content = localStorage.getItem(szTarget);
        console.log('LocalStorage Content', content);
        if (content) {
            (ev.target.value || ev.target.value == '') ? ev.target.value = content : ev.target.innerText = content;
        }
    };

    const eventListener = (ev) => {

        console.log('Event', ev.type, '\ntarget', ev.target, '\nevent', ev);

        if ((!window.targetElement || window.targetElement != ev.target ) && (ev.target.value || ev.target.innerText.match(ev.key))) {
            window.targetElement = ev.target
        }

        if (window.targetElement == ev.target) {

            let content = (ev.target.value || ev.target.value == '') ? ev.target.value : ev.target.innerText;
            let szTarget = getSelectorFromTagnameIdAndClasslist(ev.target);
            localStorage.setItem(szTarget, content);
            console.log('localStorage szTarget', localStorage.getItem(szTarget));
        }
    };



    document.addEventListener('click', clickEventListener);
    document.addEventListener('keyup', eventListener);
})();
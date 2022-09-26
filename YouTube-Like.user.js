// ==UserScript==
// @name         YouTube-Like
// @namespace    http://sedatkilinc.de/
// @version      0.6
// @description  Liking YouTube-Clips
// @author       You
// @match        https://*.youtube.com/watch*
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('SEDAT•YouTube');

    let btnLike = undefined;
    let btnDisLike = undefined;

    const arrEventType = [ 'loadstart', 'play', 'playing', 'load', 'selectionchange', 'canplay', 'change', 'slotchange' ];
    const arrChannels = [ ];

    let currentChannel = '';
    let currentTitle = getTitle();

    if (localStorage.getItem('channels') === null) {
        saveChannel('sedatkpunkt');
        saveChannel('whatdamath');
    } else {
        const tmpChannels = JSON.parse(localStorage.getItem('channels'));
        console.log('SEDAT: tmpChannels', tmpChannels);
        tmpChannels.forEach(el => { arrChannels.push(el); });
        console.log('SEDAT: arrChannels', arrChannels);
    }

    

/*

    Event play            type: 'play'
    Event Loadstart       type: 'loadstart'
    Event progress        type: 'progress'
    Event progress        type: 'progress'
    Event progress        type: 'progress'
    Event Loadeddata      type: 'loadeddata'
    Event playing         type: 'playing'

*/
    function removeVideoEventListeners() {


        try {
            arrEventType.forEach(t => {
                document.querySelectorAll('video').forEach(vid => {
                    vid.addEventListener(t, videoListener);
                });
            });

            document.removeEventListener('click', listener);


        } catch (error) {}
    }

    const listener = e => {
        console.log('event ' + e.type, e.target, e);
    }


    const videoListener = ev => {
                console.log('SEDAT:video•'+ ev.type, ev.target.baseURI.split('=').pop(), ev);
                findChannelName(ev.type);
                lookForLikeButton(0);
            };
    function setVideoEvent() {
        arrEventType.forEach(type => {
            document.querySelectorAll('video').forEach(vid => {
                vid.addEventListener(type, videoListener);
/*
            vid.addEventListener('loadstart', videoListener);
            vid.addEventListener('play', videoListener);
            vid.addEventListener('playing', videoListener);
            vid.addEventListener('canplay', videoListener);
            vid.addEventListener('load', videoListener);
            vid.addEventListener('selectionchange', videoListener);
            // change
            vid.addEventListener('change', videoListener);
            // slotchange
            vid.addEventListener('slotchange', videoListener);
 */

            });
        });
    }

    ////////////////////////////////////////////////////////

    const loadListener = (ev) => {
        console.log('SEDAT:this ', this);
        console.log('SEDAT:'+ ev.type + '•' + ev.target + '.addEventListener',ev);
        //setVideoEvent();
        findChannelName(ev.target + '.' + ev.type);
        lookForLikeButton(0);
    }

    window.addEventListener('load', loadListener);

    document.addEventListener('load', loadListener);

    // transitionend
    document.addEventListener('transitionend', loadListener);

    document.addEventListener('keyup', (ev) => {
        console.log('SEDAT:keyup event object', ev);
        // setVideoEvent();
        findChannelName('onkeyup');

        if (ev.altKey === false || ev.code !== 'KeyL') {
            return false;
        };
//        lookForLikeButton(1);
//        saveChannel(channelName)
        handleChannel(currentChannel);
    });

    function findChannelName(from = 'default') {
        console.log('SEDAT: findChannelName', from);
        let found = false;

        currentTitle = getTitle();
        console.log('SEDAT: currentTitle', currentTitle);
        console.log('SEDAT: saveTitle', saveTitle());

        let allAnchorTagsChannel = document.querySelectorAll('a[href^="/c"]');
        console.log('SEDAT allAnchorTagsChannel.length', allAnchorTagsChannel.length);
        // let allAnchorTagsChanneName = document.querySelectorAll('#owner-and-teaser #owner ytd-channel-name#channel-name #container.style-scope.ytd-channel-name a');
        // document.querySelectorAll('ytd-video-owner-renderer.ytd-watch-metadata  > div.ytd-video-owner-renderer  > ytd-channel-name.ytd-video-owner-renderer  > div.ytd-channel-name  > div.ytd-channel-name  > yt-formatted-string.ytd-channel-name.complex-string  > a.yt-simple-endpoint.yt-formatted-string')
        let allAnchorTagsChanneName = document.querySelectorAll('ytd-video-owner-renderer.ytd-watch-metadata  > div.ytd-video-owner-renderer  > ytd-channel-name.ytd-video-owner-renderer  > div.ytd-channel-name  > div.ytd-channel-name  > yt-formatted-string.ytd-channel-name.complex-string  > a.yt-simple-endpoint.yt-formatted-string');
        console.log('SEDAT allAnchorTagsChanneName.length', allAnchorTagsChanneName.length);
        if (!found && allAnchorTagsChanneName.length >0) {
            currentChannel = allAnchorTagsChanneName[0].href.split('/').pop();
            console.log('SEDAT currentChannel', currentChannel);
            if (arrChannels.indexOf(currentChannel) > -1) {
                lookForLikeButton(1);
            }
            found=true;
        }
    }

    function lookForLikeButton(action) {
        console.log('SEDAT:lookForLikeButton');
        // '#segmented-like-button ytd-toggle-button-renderer yt-button-shape button'
        if (/*btnLike !== undefined ||*/ (btnLike = document.querySelectorAll('#segmented-like-button ytd-toggle-button-renderer yt-button-shape button')[0]) &&
           (btnDisLike = document.querySelectorAll('#segmented-dislike-button ytd-toggle-button-renderer yt-button-shape button')[0])) {
            console.log('btnLike = ', btnLike);
            switch(action) {
                case 1:
                    console.log('SEDAT:lookForLikeButton • btnLike is', btnLike.firstChild.firstChild.classList.contains('style-default-active'));;
                    if (btnLike.ariaPressed === 'false') {

                        btnLike.click();
                    }
                    break;
                case 2:
                    console.log('SEDAT:lookForDisLikeButton • btnDisLike is', btnLike.firstChild.firstChild.classList.contains('style-default-active'));;
                    if (btnDisLike.ariaPressed === 'false') {

                        btnDisLike.click();
                    }
                    break;
                default:
                    console.log('SEDAT:lookForLikeButton • 1 btnLike is', btnLike.firstChild.firstChild.classList.contains('style-default-active'));
                    break;
            }
        }
/*         else {
            console.log('SEDAT: lookForLikeButton • false');
            setTimeout(lookForLikeButton, 2000, action);
        } */
    }

    function handleChannel(channelName) {
        if (arrChannels.indexOf(channelName) < 0) {
            saveChannel(channelName);
            lookForLikeButton(1);
        } else {
            removeChannel(channelName);
            lookForLikeButton(2);
        }
    }

    function saveChannel(channelName) {
        if (arrChannels.indexOf(channelName) > -1) {
            return;
        }
        arrChannels.push(channelName);
        localStorage.setItem('channels',JSON.stringify(arrChannels));
    }


    function removeChannel(channelName) {
        if (arrChannels.indexOf(channelName) < 0) {
            return;
        }
        arrChannels.splice(arrChannels.indexOf(channelName), 1);
        localStorage.setItem('channels',JSON.stringify(arrChannels));
    }

    function getTitle() {
        return document.title.replace(/^\(\d*\)\s/,'');
    }

    function saveTitle() {
        currentTitle = getTitle() ;
        console.log('SEDAT: saveTitle• CurrentTitle', currentTitle);
        return currentTitle;
    }

    function isNewVideo() {
        return (currentTitle !== getTitle());
    }
})();







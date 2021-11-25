// ==UserScript==
// @name         YouTube Like:View Ratio
// @namespace    https://youtube.com/
// @version      0.0.2
// @description  Adds a like:view ratio to YouTube
// @author       DerEnderKeks
// @website      https://github.com/DerEnderKeks/YTLikeViewRatio
// @supportURL   https://github.com/DerEnderKeks/YTLikeViewRatio/issues
// @updateURL    https://github.com/DerEnderKeks/YTLikeViewRatio/raw/main/ytlikeviewratio.user.js
// @downloadURL  https://github.com/DerEnderKeks/YTLikeViewRatio/raw/main/ytlikeviewratio.user.js
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

(() => {
    const getElement = (value) => {
        let template = document.createElement('template')
        template.innerHTML = `<div style="font-size:14px;height:36px;color:white;font-weight:500;display:flex;align-items:center;"><span>${value}%</span></div>`
        return template.content.firstElementChild
    }

    const parseLongNumber = (value) => {
        value = value.replaceAll(',', '').trim().replaceAll(' ', '')
        return parseInt(value)
    }

    const parseShortNumber = (value) => {
        value = value.trim().replaceAll(' ', '')
        const mutiplierLetter = value.slice(-1)
        const isMultiplier = mutiplierLetter.charCodeAt() > 57
        const number = isMultiplier ? value.slice(0, -1) : value

        let multiplier = 1
        if (isMultiplier) {
            switch (mutiplierLetter) {
                case 'K':
                    multiplier = 10 ** 3
                    break;
                case 'M':
                    multiplier = 10 ** 6
                    break;
                case 'B':
                    multiplier = 10 ** 9
                    break;
            }
        }

        return parseFloat(number) * multiplier
    }

    const calcAndFormatRatio = (views, likes) => {
        return (likes / views * 100).toFixed(1)
    }

    const config = { attributes: true, childList: true, subtree: true };
    const callback = function (mutationsList, observer) {
        let viewsElement = document.querySelector('span.view-count')
        let buttonElement = document.querySelector('#info #menu #top-level-buttons-computed')
        let likesElement = buttonElement.firstElementChild.querySelector('ytd-toggle-button-renderer > a > yt-formatted-string')

        if (!(viewsElement && buttonElement && likesElement)) {
            return
        }

        observer.disconnect();

        const viewsString = viewsElement.innerHTML.split(' ')[0]
        const views = parseLongNumber(viewsString)
        
        const likesString = likesElement.innerHTML
        const likes = parseShortNumber(likesString)

        buttonElement.prepend(getElement(calcAndFormatRatio(views, likes)))
    }
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
})()
// ==UserScript==
// @name         CN-Fast-Gravatar
// @namespace    https://cn-fast-gravatar.pages.dev/index.html
// @version      1.1
// @description  增强中国大陆地区的访问Gravatar
// @icon         https://cn-fast-gravatar.pages.dev/favicon.ico
// @author       ymh0000123
// @license           GPLv3
// @supportURL        https://github.com/ymh0000123/CN-Fast-Gravatar
// @homepage          https://cn-fast-gravatar.pages.dev/install.html
// @updateURL         https://cn-fast-gravatar.pages.dev/CN-Fast-Gravatar.user.js
// @downloadURL       https://cn-fast-gravatar.pages.dev/CN-Fast-Gravatar.user.js
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    let commandIdAvatar, commandIdGravatar;

    function registerToggleCommandAvatar() {
        let currentState = GM_getValue('replace_avatar_enabled', true);
        let commandText = currentState ? "【✅】Gravatar头像 替换" : "【❌】Gravatar头像 替换";

        if (commandIdAvatar) {
            GM_unregisterMenuCommand(commandIdAvatar);
        }

        commandIdAvatar = GM_registerMenuCommand(commandText, toggleGravatarAvatarReplacement);
    }

    function registerToggleCommandGravatar() {
        let currentState = GM_getValue('replace_gravatar_enabled', true);
        let commandText = currentState ? "【✅】Gravatar 替换" : "【❌】Gravatar 替换";

        if (commandIdGravatar) {
            GM_unregisterMenuCommand(commandIdGravatar);
        }

        commandIdGravatar = GM_registerMenuCommand(commandText, toggleGravatarReplacement);
    }

    function toggleGravatarAvatarReplacement() {
        let currentState = GM_getValue('replace_avatar_enabled', true);
        GM_setValue('replace_avatar_enabled', !currentState);
        registerToggleCommandAvatar();
        window.location.reload();
    }

    function toggleGravatarReplacement() {
        let currentState = GM_getValue('replace_gravatar_enabled', true);
        GM_setValue('replace_gravatar_enabled', !currentState);
        registerToggleCommandGravatar();
        window.location.reload();
    }

    registerToggleCommandAvatar();
    registerToggleCommandGravatar();

    function replaceURLsInString(str) {
        if (GM_getValue('replace_avatar_enabled', true)) {
            str = str.replace(/https?:\/\/[^\/]*\.gravatar\.com\/avatar\//g, 'https://dn-qiniu-avatar.qbox.me/avatar/');
        }
        if (GM_getValue('replace_gravatar_enabled', true)) {
            str = str.replace(/https?:\/\/(?!docs\.gravatar\.com|blog\.gravatar\.com|support\.gravatar\.com)[^\/]*\.gravatar\.com/g, 'https://cn.gravatar.com');
        }
        return str;
    }

    function main() {
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            img.src = replaceURLsInString(img.src);
            if (img.hasAttribute('srcset')) {
                let newSrcset = img.getAttribute('srcset').split(',').map(part => {
                    let [url, descriptor] = part.trim().split(' ');
                    return `${replaceURLsInString(url)} ${descriptor}`;
                }).join(', ');
                img.setAttribute('srcset', newSrcset);
            }
        }

        const links = document.getElementsByTagName('a');
        for (let link of links) {
            link.href = replaceURLsInString(link.href);
        }
    }

    if (GM_getValue('replace_avatar_enabled', true) || GM_getValue('replace_gravatar_enabled', true)) {
        window.addEventListener('load', main);
        setInterval(main, 5000);
    }
})();

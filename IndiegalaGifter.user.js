// ==UserScript==
// @name         IndieGala Gift Helper
// @namespace    https://github.com/MrMarble/IndieGalaGifter
// @version      0.1
// @description  Sending a gift has never been so easy!
// @author       MrMarble
// @match        https://www.indiegala.com/profile
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $.noConflict();

    setUp();

    function setUp() {
        $(document).ajaxComplete((event,xhr,settings) => {
            console.log(settings);
            console.log(xhr);
        });
    }
})();
// ==UserScript==
// @name         IndieGala Gift Helper
// @namespace    https://github.com/MrMarble/IndieGalaGifter
// @version      0.5
// @updateURL    https://github.com/MrMarble/IndieGalaGifter/raw/master/IndieGalaGifter.user.js
// @downloadURL  https://github.com/MrMarble/IndieGalaGifter/raw/master/IndieGalaGifter.user.js
// @description  Sending a gift has never been so easy!
// @author       MrMarble
// @match        https://www.indiegala.com/profile*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';
  $.noConflict();

  let $forms = undefined;
  let ChromeFix = undefined;
  setUp();

  function setUp() {
    ChromeFix = setInterval(nonFirefoxFix, 500);
    jQuery('body').append('<div id="indiegala-gifter-log"></div>');
    jQuery(document).ajaxComplete((event, xhr, settings) => {
      if (settings.url.indexOf('/ajaxsale?sale_id=') > -1) {
        clearInterval(ChromeFix);
        $forms = jQuery('form[id^=form_gift_]');
        if ($forms.length > 0) {
          createButton();
        }
      }
    });
    createStyles();
  }

  function nonFirefoxFix() {
    $forms = jQuery('form[id^=form_gift_]');
    if ($forms.length > 0) {
      createButton();
      clearInterval(ChromeFix);
    }
  }

  function createStyles() {
    GM_addStyle('#indiegala-gifter{position:fixed;right:30px;top:20px;background-color:#cc001d;color:white;padding:5px 10px;border-radius:5px;font-weight:bold}');
    GM_addStyle('#indiegala-gifter-log{position:fixed;right:10px;bottom:0}');
    GM_addStyle('.indiegala-gifter-log-child{padding:10px;border-radius:8px;color:white;font-weight:bold}');
    GM_addStyle('.indiegala-gifter-log-child.ok{background-color: rgba(0,255,0,.2);border: 1px solid lime;}');
    GM_addStyle('.indiegala-gifter-log-child.error{background-color: rgba(255,0,0,.2);border: 1px solid red;}');
  }

  function createButton() {
    jQuery('body').append('<button id="indiegala-gifter">SEND ALL</button>');
    let $button = jQuery('#indiegala-gifter');
    $button.on('click', sendGift);
  }

  function sendGift() {
    if ($forms !== undefined) {
      let validForms = [];
      $forms.each((index, element) => {
        if (jQuery(element).find('input:visible').length > 0) {
          if (jQuery(element).find('input:visible').val() !== "") {
            let form = new FormData(element);
            form.toString = function () {
              return this.get(jQuery(element).find('input:visible').attr('name'));
            };
            validForms.push(form);
          }
        }
      });
      if (validForms.length > 0) {
        let text = 'Your Indiegala gift will be sent to:\n' + validForms.join('\n');
        if (confirm(text) == false) {
          return false;
        } else {
          for (let FORM of validForms) {
            jQuery.ajax({
              url: '/profile',
              data: FORM,
              contentType: false,
              processData: false,
              method: 'POST',
              type: 'POST'
            }).done(function () {
              showMessage('Gift send to ' + FORM.toString(), 'ok');
            }).fail(function () {
              showMessage('Gift send to ' + FORM.toString(), 'error');
            });
          }
        }
      }
    }
  }

  function showMessage(text, status) {
    let $log = jQuery('#indiegala-gifter-log');
    if (jQuery('body').find($log).length == 0) {
      jQuery('body').append($log);
    }
    if ($log.find('.indiegala-gifter-log-child').length > 5) {
      $log.find('.indiegala-gifter-log-child:first').remove();
    }

    $log.append('<div class="indiegala-gifter-log-child ' + status + '">' + text + '</div>');
  }
})();
// ==UserScript==
// @name         IndieGala Gift Helper
// @namespace    https://github.com/MrMarble/IndieGalaGifter
// @version      0.1
// @updateURL    https://github.com/MrMarble/IndieGalaGifter/raw/master/IndieGalaGifter.user.js
// @downloadURL  https://github.com/MrMarble/IndieGalaGifter/raw/master/IndieGalaGifter.user.js
// @description  Sending a gift has never been so easy!
// @author       MrMarble
// @match        https://www.indiegala.com/profile*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  $.noConflict();

  let $forms = undefined;
  setUp();

  function setUp() {
    $(document).ajaxComplete((event, xhr, settings) => {
      if (settings.url.indexOf('/ajaxsale?sale_id=') > -1) {
        $forms = $('form[id^=form_gift_]');
        if ($forms.length > 0) {
          createButton();
        }
      }
    });
  }

  function createButton() {
    $('body').append('<button id="indiegala-gifter">SEND ALL</button>');
    let $button = $('#indiegala-gifter');

    $button.css({
      "position": "fixed",
      "right": "30px",
      "top": "20px",
      "backgroundColor": "#cc001d",
      "color": "white",
      "padding": "5px 10px",
      "borderRadius": "5px",
      "fontWeight": "bold"
    });
    $button.on('click', sendGift);
  }

  function sendGift() {
    if ($forms !== undefined) {
      let validForms = [];
      $forms.each((index, element) => {
        if ($(element).find('input:visible').length > 0) {
          if ($(element).find('input:visible').val() !== "") {
            let form = new FormData(element);
            form.toString = function () {
              return this.get($(element).find('input:visible').attr('name'));
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
            $.ajax({
              url: '/profile',
              data: FORM,
              contentType: false,
              processData: false,
              method: 'POST',
              type: 'POST'
            }).done(function () {
              console.log('TODO CORRECTO!')
              FORM.toString = FORM.toString() + ' OK';
            }).fail(function () {
              console.error('ALGO FALLO NO MASS');
              FORM.toString = FORM.toString() + ' ERROR';
            });
            await sleep(100);
          }
        }
      }
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();
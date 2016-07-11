'use strict';

/**
 * @author Zakovryashin Vadim
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/phone-pay.template.html',
  'libs/declofnum',
  'libs/phone-mask',
  'libs/getCaretPosition',
  'libs/setCaretPosition'
], function($, _, Backbone, template, declOfNum, phoneMask, getCaretPosition, setCaretPosition) {

  var PhonepayAppView = Backbone.View.extend({

      tagName: 'div',
      el: '#phone-pay',
      template: _.template(template),
      events: {
        'keyup input.b-phone-pay__sum-input':  'sumChanged',
        'keyup input': 'setModelData'
      },

      initialize: function () {

        this.listenTo(this.model, 'change', function() {
          this.buttonToggle();
        });

      },

      sumChanged: function(e) {

        var inputSum = this.sumInput,
            value = inputSum.val();

        // remove leading zero
        value = value.replace(/\b0+/g, '');

        this.model.set({ sum: inputSum.val() });

        if (this.model.get('sum') > this.model.get('maxSum')) {

          var sum = inputSum.val();

          this.showSumWarning();
          inputSum.val(sum.substring(0, sum.length - 1)); // remove last symbol if sum is too large
          this.model.set({ sum: inputSum.val() });

        } else {

          inputSum.val(value.replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
          this.model.set({ sum: inputSum.val() });

        }

        this.sumCurrency.text(declOfNum(inputSum.val().replace(/\s+/g, ''), ['рубль', 'рубля', 'рублей']));

      },

      numbersChecking: function() {

        /**
         * Filtering input data on the basis of number
         *
         * @param {arguments} - jquery elements for number-checking
         */

        _.each(arguments, function(elem) {

          var $elem = $(elem);

          // Filter non-digits from input value by keycode
          $elem.keydown(function(e) {

            // enable f1, f2, f3 e.t.c
            if(e.keyCode == 112 || e.keyCode == 113 || e.keyCode == 114
              || e.keyCode == 115 || e.keyCode == 116 || e.keyCode == 117
              || e.keyCode == 118 || e.keyCode == 119 || e.keyCode == 120
              || e.keyCode == 121 || e.keyCode == 122 || e.keyCode == 123) {
              return;
            }

            if ($.inArray(e.keyCode, [8, 9, 27, 13, 110]) !== -1 ||
              (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
              (e.keyCode == 67 && e.ctrlKey === true) ||
              (e.keyCode == 86 && e.ctrlKey === true) ||
              (e.keyCode >= 35 && e.keyCode <= 40)) {
                   return;
            }

            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
              e.preventDefault();
            }

          });

          // Filter non-digits from input value by Regexp
          $elem.keyup(function(e) {

            if (/\D/g.test(this.value) && e.keyCode != 39 && e.keyCode != 37) {
              this.value = this.value.replace(/\D/g, '');
            }

          });

        });

      },

      lengthChecking: function($elem, length, $nextElem) {

        /**
         * Checking length and fields occupancy
         *
         * @param {$elem} - jquery element for checking
         * @param {$length} - max length of element content
         * @param {$nextElem} - next element for focus if $elem is complete
         */

        var _this = this;

        $elem.keypress(function(e) {

          if(e.keyCode != 39 && e.keyCode != 37 && e.keyCode != 8) {

            if(this.value.length > length - 1) {

              this.value = this.value.substring(0, this.value.length);
              return false;

            }

          }

        });

        $elem.keyup(function(e) {

          // limit input-text by $length
          if(this.value.length === length && $nextElem && e.keyCode != 39 && e.keyCode != 37) {
            $nextElem.focus();
          }

        });

      },

      phoneMasking: function($elem) {

        /**
         * Masking of phone field
         *
         * @param {$elem} - jquery element for masking
         */

        $elem.keyup(function(e) {

          if(e.keyCode != 39 && e.keyCode != 37) {

            //remove all chars, except dash and digits
            var value = phoneMask(this.value.replace(/[^\-0-9]/g, ''));

            this.value = value;

            /* if value pasted */
            if(e.keyCode == 86 && e.ctrlKey === true) {
              if(value.length > 8){
                value = value.substring(0, 9);
              }
            }

          }

        });

      },

      transitionsByKeys: function($elem, $nextElem, $prevElem, inputLenght) {

        /**
         * Listen certain buttons (arrows, backspase, space) for switch between inputs
         *
         * @param {$elem} - jquery element for transitions
         * @param {$nextElem} - jquery next element for focus
         * @param {$prevElem} - jquery previous element for focus
         */

        var backspace = 8,
            space = 32,
            forwardArrow = 39,
            backArrow = 37,
            prevValue,
            moveForward = false,
            moveBack = true;

        // previous element focus by backspace
        $elem.keydown(function(e) {
          prevValue = this.value;
        });

        $elem.keyup(function(e) {

          if(prevValue === '' && e.keyCode == backspace) {

            if($prevElem) {

              var tmpStr;

              /* ie9 carret in end of input-string */
              $prevElem.focus();
              tmpStr = $prevElem.val();
              $prevElem.val('');
              $prevElem.val(tmpStr);

            }

          }

        });

        $elem.keyup(function(e) {

          // move forward on press space-button
          if(e.keyCode == space) {

            if($nextElem) {
                $nextElem.focus();
            }

          }

          // move forward on press forward-arrow
          if(e.keyCode == forwardArrow) {

              if(getCaretPosition($elem.get(0)) != inputLenght) {
                  moveForward = false;
              }

          }

          if(e.keyCode == forwardArrow && moveForward) {

              $nextElem.focus();
              moveForward = false;
              moveBack = false;

          }

          if(e.keyCode == forwardArrow && getCaretPosition($elem.get(0)) == inputLenght) {
            moveForward = true;
          }

          // move back on press back-arrow

          if(e.keyCode == backArrow) {

              if(getCaretPosition($elem.get(0)) != 0) {
                  moveBack = false;
              }

          }

          if(e.keyCode == backArrow && moveBack) {

            if($prevElem) {
                setCaretPosition($prevElem.get(0), $prevElem.val().length);
            }

            moveBack = false;

          }

          if(e.keyCode == backArrow && getCaretPosition($elem.get(0)) == 0) {
            moveBack = true;
          }

        });

      },

      phonePasting: function($elem, $areaCode, $phoneNumber, $inputSum) {

        /**
         * Processing of paste events
         *
         * @param {$elem} - jquery element for listening
         * @param {$areaCode} - jquery area-code input
         * @param {$phoneNumber} - jquery phone-number input
         * @param {$inputSum} - jquery sum input
         */

        var _this = this;

        $elem.keyup(function(e) {

          if(e.keyCode == 86 && e.ctrlKey === true) {

            var pasteString,
                areaCode,
                phoneNumber;

            // filter pasted string
            pasteString = this.value.replace(/[^\-0-9]/g, '');
            areaCode = pasteString.substring(0, 3);
            phoneNumber = phoneMask(pasteString.substring(3));

            // divide pated string
            if(areaCode.length + phoneNumber.length > 10) {

              phoneNumber = phoneNumber.substring(0, 9);
              $phoneNumber.focus();
              $inputSum.focus();

            }

            if(areaCode.length + phoneNumber.length >= 3 && areaCode.length + phoneNumber.length <= 11) {
              $phoneNumber.focus();
            }

            $areaCode.val(areaCode);
            $phoneNumber.val(phoneNumber);

          }

        });

      },

      showSumWarning: function() {

        var _this = this;

        this.sumWarning.css({
          'display' : 'block'
        }).animate({
          'opacity' : 1
        });

        setTimeout(function() {
          _this.sumWarning.animate({
            'opacity' : 0
          }, 300).delay(400).fadeOut();
        }, 2000);

      },

      setAreaCodeModel: function(data) {
        this.model.set({ areaCode: data.replace(/\D+/g,"") });
      },

      setPhoneModel: function(data) {
        this.model.set({ phoneNumber: data.replace(/\D+/g,"") });
      },

      setModelData: function() {

        this.setAreaCodeModel(this.areaCode.val());
        this.setPhoneModel(this.phoneNumber.val());

      },

      buttonToggle: function() {

        if(this.model.isValid()) {
          this.sendButton.removeClass('b-btn--blocked');
        } else {
          this.sendButton.addClass('b-btn--blocked');
        }

      },

      render: function() {

        this.$el.html(this.template(this.model.toJSON()));

        this.sumInput = this.$('.b-phone-pay__sum-input');
        this.areaCode = this.$('.b-phone-pay__area-code');
        this.phoneNumber = this.$('.b-phone-pay__phone');
        this.sumCurrency = this.$('.b-phone-pay__currency');
        this.sumWarning = this.$('.b-phone-pay__warning');
        this.sendButton = this.$('.b-btn');

        // delete this block when the backend will be ready
        this.sendButton.on('click', function(e){
          e.preventDefault();
        });

        this.lengthChecking(this.areaCode, 3, this.phoneNumber);
        this.lengthChecking(this.phoneNumber, 9, this.sumInput);
        this.lengthChecking(this.sumInput, 4, null);

        this.numbersChecking(this.sumInput, this.areaCode, this.phoneNumber);

        this.phoneMasking(this.phoneNumber);

        this.phonePasting(this.areaCode, this.areaCode, this.phoneNumber, this.sumInput);
        this.phonePasting(this.phoneNumber, this.areaCode, this.phoneNumber, this.sumInput);

        this.transitionsByKeys(this.areaCode, this.phoneNumber, null, 3);
        this.transitionsByKeys(this.phoneNumber, this.sumInput, this.areaCode, 9);

        return this;

      }

    });

    return PhonepayAppView;

});

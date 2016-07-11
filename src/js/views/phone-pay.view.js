'use strict';

define(['jquery', 'underscore', 'backbone', 'text!templates/phone-pay.template.html', 'libs/declofnum'], function($, _, Backbone, template, declOfNum) {

  var PhonepayAppView = Backbone.View.extend({

      tagName: 'div',
      el: '#phone-pay',
      template: _.template(template),
      events: {
        'keyup input.b-phone-pay__sum-input':  'sumChanged'
      },

      initialize: function () {

      },

      sumChanged: function(e) {

        var inputSum = this.sumInput,
            value = inputSum.val();

        this.model.set({ sum: inputSum.val() });

        if (!this.model.isValid()) {

          var sum = inputSum.val();

          inputSum.val(sum.substring(0, sum.length - 1));
          this.model.set({ sum: inputSum.val() });

        } else {

          inputSum.val(value.replace(/\B(?=(\d{3})+(?!\d))/g, ' '));

        }

        this.sumCurrency.text(declOfNum(inputSum.val(), ['рубль', 'рубля', 'рублей']));

      },

      numbersChecking: function() {

        /**
         * @param {arguments} - jquery elements for number-checking
         */

        _.each(arguments, function(elem) {

          var $elem = $(elem);

          // Filter non-digits from input value by keycode
          $elem.keydown(function(e) {

            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
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

            if (/\D/g.test(this.value)){
              this.value = this.value.replace(/\D/g, '');
            }

          });

        });

      },

      lengthChecking: function($elem, length, $nextElem) {

        /**
         * @param {$elem} - jquery element for checking
         * @param {$length} - max length of element content
         * @param {$nextElem} - next element for focus if $elem is complete
         */

        var _this = this;

        $elem.keypress(function(e) {

          // if by chance still receive a large number
          if(this.value.length > length - 1) {

            this.value = this.value.substring(0, this.value.length);
            return false;

          }

        });

        $elem.keyup(function(e) {

          // limit input-text by $length
          if(this.value.length === length && $nextElem){
            $nextElem.focus();
          }

        });

      },

      render: function() {

        this.$el.html(this.template(this.model.toJSON()));

        this.sumInput = this.$('.b-phone-pay__sum-input');
        this.areaCode = this.$('.b-phone-pay__area-code');
        this.phoneNumber = this.$('.b-phone-pay__phone');
        this.sumCurrency = this.$('.b-phone-pay__currency');

        this.lengthChecking(this.areaCode, 3, this.phoneNumber);
        this.lengthChecking(this.phoneNumber, 9, this.sumInput);
        this.lengthChecking(this.sumInput, 4, null);

        this.numbersChecking(this.sumInput, this.areaCode, this.phoneNumber);

        return this;

      }

    });

    return PhonepayAppView;

});

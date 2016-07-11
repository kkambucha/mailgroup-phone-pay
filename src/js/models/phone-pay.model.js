'use strict';

define(['backbone'], function() {

  var PhonepayPhone = Backbone.Model.extend({

    defaults: {
      countryCode: '+7',
      phoneAreaPlaceholder: '123',
      phonePlaceholder: '345-67-89',
      sumPlaseholder: '0',
      maxSum: 5000,
      areaCode: null,
      phoneNumber: null,
      sum: null
    },

    validate: function(attrs, options) {

      var isValid = true,
          msg = [];

      if(attrs.sum > this.defaults.maxSum) {

        isValid = false;
        msg['sumLimit'] = 'Сумма не может превышать ' + this.defaults.maxSum;

      }

      if(attrs.sum == 0) {

        isValid = false;
        msg['sumZero'] = 'Введите сумму';

      }

      if(attrs.areaCode) {

        if(attrs.areaCode.length < 3) {
          isValid = false;
          msg['areaCode'] = 'Введен не верный код';
        }

      } else {

        isValid = false;
        msg['areaCode'] = 'Введен не верный код';

      }

      if(attrs.phoneNumber) {

        if(attrs.phoneNumber.length < 7) {

          isValid = false;
          msg['phone'] = 'Введен не верный номер телефона';

        }

      } else {

        isValid = false;
        msg['phone'] = 'Введен не верный номер телефона';

      }

      if(!attrs.sum) {

        isValid = false;
        msg['sum'] = 'Введена не верная сумма';

      }

      if(!isValid) {
        return msg;
      }

    }

  });

  return PhonepayPhone

});

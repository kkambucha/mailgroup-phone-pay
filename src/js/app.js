'use strict';

define(['models/phone-pay.model', 'views/phone-pay.view'], function(phonepayAppModel, phonepayAppView) {

    var PhonePayApp = {
      'PhonePayModel' : new phonepayAppModel(),
      'PhonepayView' : phonepayAppView
    }

    return PhonePayApp;

});

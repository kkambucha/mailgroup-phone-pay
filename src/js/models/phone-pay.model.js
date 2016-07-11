define(['backbone'], function() {

  var PhonepayPhone = Backbone.Model.extend({

    defaults: {
      countryCode: '+7',
      phoneAreaPlaceholder: '123',
      phonePlaceholder: '345-67-89',
      sumPlaseholder: '0'
    }

  });

  return PhonepayPhone

});

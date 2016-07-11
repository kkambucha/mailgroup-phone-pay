define(['backbone'], function() {

  var PhonepayPhone = Backbone.Model.extend({

    defaults: {
      countryCode: '+7',
      phoneAreaPlaceholder: '123',
      phonePlaceholder: '345-67-89',
      sumPlaseholder: '0',
      maxSum: 5000
    },
    validate: function(attrs, options) {

      if(attrs.sum > this.defaults.maxSum){
        return 'Сумма не может превышать ' + this.defaults.maxSum;
      }

    }

  });

  return PhonepayPhone

});

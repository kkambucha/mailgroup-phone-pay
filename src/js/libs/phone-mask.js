define([], function() {

  /**
   * @param {val} - string for masking by format 000-00-00
   */

  var phoneMask = function(val) {

    var numbers = val.replace(/\D/g, ''),
        char = { 0: '', 3: '-', 5: '-' },
        newvalue = '';

    for (var i = 0; i < numbers.length; i++) {
        newvalue += (char[i] || '') + numbers[i];
    }

    return newvalue;

  }

  return phoneMask;

});

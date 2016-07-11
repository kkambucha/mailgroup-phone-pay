define([], function() {

  /**
   * @param {number} number
   * @param {titles} titles in 3 forms
   * @return string
   */

  var declOfNum = function(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
  }

  return declOfNum;

});

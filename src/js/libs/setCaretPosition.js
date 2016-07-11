define([], function() {

  /**
   * @param {elem} node element for action
   * @param {caretPos}  position of carret
   */

  var setCaretPosition = function (elem, caretPos) {
    if(elem != null) {
      if(elem.createTextRange) {
        var range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      }
      else {
        if(elem.selectionStart) {
          elem.focus();
          elem.setSelectionRange(caretPos, caretPos);
        }
        else
          elem.focus();
      }
    }
  }

  return setCaretPosition;

});

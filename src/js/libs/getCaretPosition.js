define([], function() {

  /*
  ** Returns the caret (cursor) position of the specified text field.
  ** Return value range is 0-oField.value.length.
  */
  var getCaretPosition = function doGetCaretPosition (oField) {

    var iCaretPos = 0;

    // IE Support
    if (document.selection) {

      // Set focus on the element
      oField.focus();

      // To get cursor position, get empty selection range
      var oSel = document.selection.createRange();

      // Move selection start to 0 position
      oSel.moveStart('character', -oField.value.length);

      // The caret position is selection length
      iCaretPos = oSel.text.length;
    }

    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0')
      iCaretPos = oField.selectionStart;

    // Return results
    return iCaretPos;
  }

  return getCaretPosition;

});

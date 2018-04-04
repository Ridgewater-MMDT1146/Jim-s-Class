// js/select.js

// addSelectOption(addSelectOptionId, OptionValue, OptionText)
// Add option to the bottom of the select list.
// addSelectOptionId = The is of the select.
//       OptionValue = The value of the option
//        OptionText = The text of the option
function addSelectOption(addSelectOptionId, OptionValue, OptionText) {
  // Add option to the bottom of the select.
  addSelectOptionId[addSelectOptionId.length] = new Option(OptionText, OptionValue);
}
// clearSelectOptions(selectName)
// Clear out the list of options.
// selectName = the name of the select.
function clearSelectOptions(selectName) {
  // Clear out the list of options.
  clearSelectOptionsId = document.getElementById(selectName)
  for (x = clearSelectOptionsId.length; x >= 0; x = x - 1) {
    clearSelectOptionsId[x] = null;
  }
}
// populateSelectOptions(selectName, optionsValueList, optionsTextList)
// Repopulate a select options list.
// optionsValueList = A comma separated list of option values.
//  optionsTextList = A comma separated list of option texts.
function populateSelectOptions(selectName, optionsValueList, optionsTextList) {
  //alert('populateSelectOptions(\''+selectName+'\', \''+optionsValueList+'\', \''+optionsTextList+'\')');
  populateSelectOptionsId = document.getElementById(selectName);
  optionsValueArray = optionsValueList.split(',');
  optionsTextArray = optionsTextList.split(',');
  // Clear out the list of option
  clearSelectOptions(selectName);
  optionsLength = optionsValueArray.length;
  //alert('optionsLength='+optionsLength+' optionsValueList='+optionsValueList);
  for (i=0; i<optionsLength; i++) {
    addSelectOption(populateSelectOptionsId, optionsValueArray[i], optionsTextArray[i]);
  }
  /** /
  /**/
  // Select option
}
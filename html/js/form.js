// form.js
// Modified 2018-02-28 Jim Martinson.
//          Added function index.
//          Added function specific DEGUGing.
//          Fixed some lint errors.
//          Changed function name first character to uppercase.

// ControlCheck(objId) ............. Check the checkbox or first radio.
// CheckboxGetValue(objId) ......... Get the checkbox value.
// ControlUncheck(objId) ........... Uncheck the checkbox or first radio.
// ElementDisable(objId) ........... Disable the form element.
// ElementEnable(objId) ............ Enable the form element.
// ElementHide(objId) .............. Hide the form element.
// ElementShow(objId) .............. Show the form element.
// GetElementValue(objId) .......... Get the value of the form element.
// RadioGetValue(radioName) ........ Returns the value of the radio button that is checked.
//                                   Returns empty string if no selection or radio control does not exist.
// RadioSetValue(objId, newValue) .. Sets the radio button with the given value as being checked.
//                                   Does nothing if there are no radio buttons.
//                                   If the given value does not exist all the radio buttons are unchecked.

DEBUG_form_all = false; // Set true to debug all functions.

// ControlCheck(objId)
// Check the checkbox or first radio.
function ControlCheck(objId) {
  var DEBUG_ControlCheck = false;
	if ( DEBUG_form_all ) { DEBUG_ControlCheck = true; }
	if ( DEBUG_ControlCheck ) { console.warn('ControlCheck['+objId+"]"); }
  obj = document.getElementById(objId);  // Get object.
  formId = document.getElementById(objId).form.name;  // Get form Id.
  if (obj.type !== 'radio') {
    document[formId][objId].checked = false;
  } else {
    objLen =  document[formId][objId].length;
    document[formId][objId][0].checked = false; // Check the first radio.
  }
} // END ControlCheck.

// CheckboxGetValue(objId)
// Get the checkbox value.
function CheckboxGetValue(objId) {
	var DEBUG_CheckboxGetValue = false;
	if ( DEBUG_form_all ) { DEBUG_CheckboxGetValue = true; }
  if ( DEBUG_CheckboxGetValue ) { console.warn('CheckboxGetValue['+objId+']'); }
  obj = document.getElementById(objId);  // Get object.
  formId = document.getElementById(objId).form.name;  // Get form Id.
  if (obj.type !== 'radio') {
    checkboxValue = document[formId][objId].checked;
  } else {
    objLen =  document[formId][objId].length;
    checkboxValue = document[formId][objId][0].checked;
  }
  if ( DEBUG_CheckboxGetValue ) { console.log('checkboxValue='+checkboxValue); }
  return checkboxValue;
} // END CheckboxGetValue.

// ControlUncheck(objId)
// Uncheck the checkbox or first radio.
function ControlUncheck(objId) {
	var DEBUG_ControlUncheck = false;
	if ( DEBUG_form_all ) { DEBUG_ControlUncheck = true; }
  if ( DEBUG_ControlUncheck ) { console.warn('ControlUncheck['+objId+"]"); }
  obj = document.getElementById(objId);  // Get object.
  formId = document.getElementById(objId).form.name;  // Get form Id.
  if (obj.type !== 'radio') {
    document[formId][objId].checked = false;
  } else {
    objLen =  document[formId][objId].length;
    for ( var i = 0; i < objLen; i++ ) {
      document[formId][objId][i].checked = false; // Uncheck the first radio.
    }
  }
} // END ControlUncheck.

// ElementDisable(objId)
// Disable the form element.
function ElementDisable(objId) {
	var DEBUG_ElementDisable = false;
	if ( DEBUG_form_all ) { DEBUG_ElementDisable = true; }
  if ( DEBUG_ElementDisable ) { console.warn('ElementDisable['+objId+"]"); }
  obj = document.getElementById(objId);  // Get object.
  formId = document.getElementById(objId).form.name;  // Get form Id.
  objLen =  document[formId][objId].length;
  if (obj.type !== 'radio') {
    document[formId][objId].disabled = true;
  } else {
    for(var i = 0; i < objLen; i++) {
      document[formId][objId][i].disabled = true;
    }
  }
} // END ElementDisable.

// ElementEnable(objId)
// Enable the form element.
function ElementEnable(objId) {
	var DEBUG_ElementEnable = false;
	if ( DEBUG_form_all ) { DEBUG_ElementEnable = true; }
  if ( DEBUG_ElementEnable ) { console.warn('ElementEnable['+objId+"]"); }
  obj = document.getElementById(objId);  // Get object.
  formId = document.getElementById(objId).form.name;  // Get form Id.
  objLen =  document[formId][objId].length;
  if (obj.type !== 'radio') {
    document[formId][objId].disabled = false;
  } else {
    for(var i = 0; i < objLen; i++) {
      document[formId][objId][i].disabled = false;
    }
  }
} // END ElementEnable.

// ElementHide(objId)
// Hide the form element.
function ElementHide(objId) {
	var DEBUG_ElementHide = false;
	if ( DEBUG_form_all ) { DEBUG_ElementHide = true; }
  if ( DEBUG_ElementHide ) { console.warn('ElementHide['+objId+"]"); }
  obj = document.getElementById(objId);  // Get object.
  formId = document.getElementById(objId).form.name;  // Get form Id.
  objLen =  document[formId][objId].length;
  if (obj.type !== 'radio') {
    document[formId][objId].style.visibility = "hidden";
  } else {
    for(var i = 0; i < objLen; i++) {
      document[formId][objId][i].style.visibility = "hidden";
    }
  }
} // END ElementHide.

// ElementShow(objId)
// Show the form element.
function ElementShow(objId) {
	var DEBUG_ElementShow = false;
	if ( DEBUG_form_all ) { DEBUG_ElementShow = true; }
  if ( DEBUG_ElementShow ) { console.warn('ElementShow['+objId+"]"); }
  obj = document.getElementById(objId);  // Get object.
  formId = document.getElementById(objId).form.name;  // Get form Id.
  objLen =  document[formId][objId].length;
  if (obj.type !== 'radio') {
    document[formId][objId].style.visibility = "visible";
  } else {
    for(var i = 0; i < objLen; i++) {
      document[formId][objId][i].style.visibility = "visible";
    }
  }
} // END ElementShow.

// GetElementValue(objId)
// Get the value of the form element.
function GetElementValue(objId) {
	var DEBUG_GetElementValue = false;
	if ( DEBUG_form_all ) { DEBUG_GetElementValue = true; }
  if ( DEBUG_GetElementValue ) { console.warn('GetElementValue[objId='+objId+']'); }
  obj = document.getElementById(objId);  // Get object.
  if ( obj ) {
		var type;
    if (obj.length !== null) { type = obj[0].type; }
    if ( (typeof type === 'undefined') || (type === 0) ) { type = obj.type; }
    var x;
		if ( DEBUG_GetElementValue ) { console.log('type of '+objId+' is '+type+'.'); }
    switch(type) {
			case 'undefined': {
				return;
			}
			case 'radio':
        for ( x=0; x < obj.length; x++ ) {
          if ( obj[x].checked === true ) { return obj[x].value; }
				}
				break;
			case 'select-multiple':
        var myArray = [];
        for( x=0; x < obj.length; x++ ) {
          if (obj[x].selected === true) { myArray[myArray.length] = obj[x].value; }
				}
        return myArray;
			case 'checkbox':
				return obj.checked;
      default:
				return obj.value;
    }
  } else {
    console.log(objId+' not found.');
  }
} // END GetElementValue.

// RadioGetValue(radioName)
// Returns the value of the radio button that is checked.
// Returns empty string if no buttons selected or radio control does not exist.
function RadioGetValue(radioName) {
	var DEBUG_RadioGetValue = false;
	if ( DEBUG_form_all ) { DEBUG_RadioGetValue = true; }
  if ( DEBUG_RadioGetValue ) { console.warn('RadioGetValue['+radioName+']'); }
	if ( !radioName ) { 
		if ( DEBUG_RadioGetValue ) { console.log('radioName is empty.'); }
		return "";
	}
	var radioObj = document.getElementsByName(radioName);
	if ( !radioObj ) {
		if ( DEBUG_RadioGetValue ) { console.log('radio with name ['+radioName+'] not found.'); }
	}
  var radioLength = radioObj.length;
  if ( radioLength === undefined ) {
    // Only one radio button.
		if ( radioObj.checked ) {
			if ( DEBUG_RadioGetValue ) { console.log('Single radio value=.'+radioObj.value); }
      return radioObj.value;
		} else {
			if ( DEBUG_RadioGetValue ) { console.log('Single radio not selected.'); }
      return "";
		}
	} else {
		for(var i = 0; i < radioLength; i++) { // Loop thru radio buttons.
			if (radioObj[i].checked) {
				if ( DEBUG_RadioGetValue ) { console.log('Multiple radio value=.'+radioObj[i].value); }
				return radioObj[i].value;
			} // Loop thru radio buttons.
		}
	}
	if ( DEBUG_RadioGetValue ) { console.log('Multiple radio none selected.'); }
  return "";
} // END RadioGetValue.

// RadioSetValue(objId, newValue)
// Sets the radio button with the given value as being checked.
// Does nothing if there are no radio buttons.
// If the given value does not exist, all the radio buttons are reset to unchecked.
function RadioSetValue(objId, newValue) {
	var DEBUG_RadioSetValue = false;
	if ( DEBUG_form_all ) { DEBUG_RadioSetValue = true; }
  if ( DEBUG_RadioSetValue ) { console.warn('RadioSetValue['+objId+', '+newValue+']'); }
  obj = document.getElementById(objId);  // Get radio object.
  formId = obj.form.name;  // Get form name.
  objLen =  document[formId][objId].length;
  for( var i = 0; i < objLen; i++ ) {
    document[formId][objId][i].checked = false;
    if ( document[formId][objId][i].value === newValue.toString() ) {
      document[formId][objId][i].checked = true;
    }
  }
} // END RadioSetValue.

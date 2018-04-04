// admin/_info/_info.js

function info_ExpandCollapse(task) {
  //alert('info_ExpandCollapse('+task+')');
  dotask = task.split(' '); // Get the task (Expand or Collapse) and the fields (code or settings).
  // Find all divs with tdotask[1] in the id.
  var divs = document.getElementsByTagName('div');
  for (var i=0; i<divs.length; i++) {
    var div = divs[i];
    if ( div.id.search(dotask[1]+'_show') > 0 ) { // search for id with code_show or settings_show.
      // This is a _show div.
			_id_name = div.id;
			_id_base = _id_name.replace('_show','');
			//alert('_id_base = '+_id_base);
			_value = document.getElementById(_id_base+'_value_id'); // Get the _value hidden element id. This element need not exist.
			_status = document.getElementById(_id_base+'_status'); // Get the _status div id.
			show_status = document.getElementById(_id_base+'_status').innerHTML; // Get the _status.innerHTML. This is either a + or a minus.
			if ( dotask[0] == 'Collapse' ) {
					// Hide field.
				if ( _value ) _value.value = 0; // Set _value to 0 (means hidden). This hidden element retains status upon form load.
				_status.innerHTML = '+'; // Set the _status.innerHTML to + (signifies can be expanded).
				divHide(div.id); // Show this div.
			} 
			if ( dotask[0] == 'Expand' ) {
					// Show field.
				if ( _value ) _value.value = 1; // Set _value to 1 (means shown). This hidden element retains status upon form load.
				_status.innerHTML = '-'; // Set the _status.innerHTML to - (signifies can be collapsed).
				divShow(div.id); // Show this div.
			}
    }
  }
  // Find all form vields with tdotask[1] in the id.
  var inputs = document.getElementsByTagName('input');
  for (var i=0; i<inputs.length; i++) {
    var input = inputs[i];
    if ( input.id.search(dotask[1]+'_value_id') > 0 ) { // search for id with code_value_id or settings_value_id.
      //alert(input.id);
      if ( dotask[0] == 'Collapse' ) input.value = 0; // Set to 0 - collapsed.
      if ( dotask[0] == 'Expand' ) input.value = 1; // Set to 1 - expanded.
    }
  }
}

// info_ResizeTextareas(maxWidth)
// Resizes all textareas on the page
// maxWidth = The maximum textarea width.
function info_ResizeTextareas(maxWidth) {
  //alert('info_ResizeTextareas('+maxWidth+')');
	var textareas = document.getElementsByTagName("textarea"); // Get an array of textareas.
  for ( $i=0; $i<textareas.length; $i++ ) { // Loop through the textareas.
    info__ResizeTextareaById(textareas[$i],maxWidth) // Resize this textarea.
  }
}

// info__ResizeTextareaById(eId, maxWidth)
// Called by info_ResizeTextareas() to resize this textarea.
function info__ResizeTextareaById(eId, maxWidth) {
	//console.log('info__ResizeTextareaById('+eId.name+','+maxWidth+')');
  var width = 0; // Used to calculate the textarea's current width.
  var height = -1; // Used to calculate the textarea's current height.
  var minWidth = 20; // The textarea's minimum width.
  var minHeight = 2; // The textarea's minimum height.
  lines = eId.value.split('\n'); // Get an array of the textarea's lines.
  //alert('name='+eId.name+' value='+eId.value);
  for (var i = 0; i < lines.length; i++) { // Loop through each line.
    var linelength = lines[i].length; // Get the line length.
    if ( linelength > width ) width = linelength; // Increase width if needed.
    height++; // Increment height.
  }
  if ( width > maxWidth ) { width = maxWidth; height++; } // If width too large reset it and increment height.
  if ( width < minWidth ) width = minWidth; // If width too small set to minWidth.
  if ( height < minHeight ) height = minHeight; // If height too small set to minHeight.
  //alert('name='+eId.name+' width='+width+' height='+height);
  if ( width > 0 ) eId.cols = width; // Set the textarea's width.
  if ( height > 0 ) eId.rows = height; // Set the textarea's height.
}

// info_SetAllCheckBoxes(e, fieldId, CheckValue)
// Finds and sets all checkboxes where the id starts or ends with fieldId to CheckValue.
//          e = The form element calling info_gotoName() (this).
//    fieldId = The id to search for. Matches if id starts with fieldId.
//              Put a minus (-) at the front of fieldId to match the end of the id.
//              Put a plus (+) at the front of fieldId to match anywhere in the id.
// CheckValue = True to check all or false to uncheck all.
function info_SetAllCheckBoxes(e, fieldId, CheckValue) {
  if ( !document.forms[e.form.name] ) { return; }// If tthe form does not exist or has no name.
  if ( fieldId.substr(0,1) == '-' ) {
    fieldId = fieldId.substr(1); // Match end of id only.
    searchFrom = 'end';
  } else if ( fieldId.substr(0,1) == '+' ) {
    fieldId = fieldId.substr(1);
    searchFrom = 'any'; // Match anywhere in id.
  } else {
    searchFrom = 'start'; // Match start of id only.
  }
  if ( fieldId.substr(0,1) != '-' ) { searchFrom = 'start'; } else { fieldId = fieldId.substr(1); searchFrom = 'end'; } // Decide to search from the start or end.
  var formElement = document.forms[e.form.name].elements; // Get the form elements.
  for ( var i=0; i<formElement.length; i++) { // Loop through the form elements.
    if ( formElement[i].type == 'checkbox') { // Only look at chechboxes.
      if ( searchFrom == 'start' ) {
        if ( formElement[i].id.search(fieldId) == 0 ) { formElement[i].checked = CheckValue;  } // Set checked = CheckValue.
      } else if ( searchFrom == 'any' ) {
        if ( formElement[i].id.search(fieldId) >= 0 ) { formElement[i].checked = CheckValue;  } // Set checked = CheckValue.
      } else { // end
        if ( formElement[i].id.search(fieldId) == formElement[i].id.length-fieldId.length ) { formElement[i].checked = CheckValue; } // Set checked = CheckValue.
      }
      //alert( 'formElement[i].id='+formElement[i].id+' formElement[i].id.search(fieldId)'+formElement[i].id.search(fieldId) );
    }
  }
}

// info_gotoName(gotoName)
// Strips off and #name from the form action and appends #gotoName to the form action.
//         e = The form element calling info_gotoName() (this).
// gotoName = The name in the <a name="gotoName"></a> tag.
function info_gotoName(e, gotoName) {
  var form = document.forms[e.form.name]; // Get form by name.
  //alert('form.action='+form.action);
  var newAction = form.action.substring(0, form.action.indexOf('#')); // Strip everything from # to end of query.
  //alert('newAction='+newAction);
  if ( newAction == '' ) newAction = form.action; // If there was not # then reset newAction = form.action.
  //alert('newAction='+newAction);
  form.action = newAction + '#' + gotoName; // append #gotoName to the action.
}

// info_Set(e, returnValue)
// Performs divShow, divHide, and other settings for fieldset div show/hide pairs.
//           e = The <a> tag calling info_Set() (this).
// returnValue = The value the function is to return. Default is true;
function info_Set(e, returnValue) {
  if ( returnValue == undefined ) returnValue = true;
  _value = document.getElementById(e.name+'_value_id'); // Get the _value hidden element id. This element need not exist.
  _status = document.getElementById(e.name+'_status'); // Get the _status div id.
  _show = document.getElementById(e.name+'_show'); // Get the _status div id.
  show_status = document.getElementById(e.name+'_status').innerHTML; // Get the _status.innerHTML. This is either a + or a minus.
  //alert('info_Set('+e.name+', '+returnValue+')\n_value = '+_value.id+'\n_status = '+_status.id+'\n_show = '+_show.id+'\nshow_status = '+show_status);
	if ( show_status == '-' ) { // Is status collapsed.
    // hide field.
    if ( _value ) _value.value = 0; // Set _value to 0 (means hidden). This hidden element retains status upon form load.
    _status.innerHTML = '+'; // Set the _status.innerHTML to + (signifies can be expanded).
    divHide(_show.id); // Hide the _show div.
  } else {
    // show field.
    if ( _value ) _value.value = 1; // Set _value to 1 (means shown). This hidden element retains status upon form load.
    _status.innerHTML = '-'; // Set the _status.innerHTML to - (signifies can be collapsed).
    divShow(_show.id); // Show the _show div.
  }
  return returnValue; // return returnValue.
}

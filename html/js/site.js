// site.js
console.warn('site.js');

//window.onresize = Resized;
//window.onscroll = Scrolled;

var _Initialize = function() {
	console.warn('_Initialize[]');
	SidenavPosition();
};
function _Initialize_Tooltip() {
	console.warn('_Initialize_Tooltip[]');
	ttObj = document.all ? document.all[ttDiv] : document.getElementById ? document.getElementById(ttDiv) : "";
	document.onmousemove = ttPosition;
}
var _Resized = function() {
	console.warn('_Resized[]');
};
var _Scrolled = function() {
	console.warn('_Scrolled[]');
};

function ScrollLeftTop() {
	var doc = document.documentElement;
	var left = parseInt((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0));
	var top = parseInt((window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0));	
	return { left:left, top:top };
}

function SidenavPosition() {
	var DEBUG_SidenavPosition = false;
	if ( DEBUG_SidenavPosition ) { console.warn('SidenavPosition[]'); }
	var headerHeight = 0;
	/** /
	// Get DEBUG_menu height.
	if ( document.getElementById('DEBUG_menu') ) {
		headerHeight = document.getElementById('DEBUG_menu').offsetHeight;
		if ( DEBUG_SidenavPosition ) { console.log('DEBUG_menu headerHeight='+headerHeight); }
	}
	/**/
	// Get header height.
	var eHeader = document.getElementsByTagName('header');
	if ( eHeader.length > 0) {
		headerHeight += eHeader[0].offsetHeight;
		if ( DEBUG_SidenavPosition ) { console.log('header headerHeight='+headerHeight); }
	}
	// Get header position.
	//var headerBounds = elementBounds(eHeader[0]);
	var headerBounds = elementBounds('headerPage');
	if ( DEBUG_SidenavPosition ) { console.log('headerBounds left='+headerBounds.left+' top='+headerBounds.top+' right='+headerBounds.right+' bottom='+headerBounds.bottom+' width='+headerBounds.width+' height='+headerBounds.height); }
	headerHeight += headerBounds.top;
	if ( DEBUG_SidenavPosition ) { console.log('headerBounds headerHeight='+headerHeight); }
	// Get scroll position.
	var scrollTop = (window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	if ( DEBUG_SidenavPosition ) { console.log('scrollTop='+scrollTop); }
	if ( scrollTop > headerHeight ) {
		sidenavTop = scrollTop;
	} else {
		sidenavTop = headerHeight;
	}
	sidenavTop = parseInt(sidenavTop);
	if ( DEBUG_SidenavPosition ) { console.log('sidenavTop='+sidenavTop); }
	document.getElementById('sidenav').style.top = sidenavTop+'px';
}

var dialogContainerLeft = 0;
var dialogContainerTop = 0;
var dialogContainerZindex = 500;
var dragElement;
var URI;

// BEGIN Custom tooltip settings.
var DEBUG_hPosition = false;
var DEBUG_vPosition = false;
var ttDiv = 'tooltipDiv';
var ttOffsetX = 25; // Customize x offset of the tooltip
var ttOffsetY = -25; // Customize y offset of the tooltip
var ie = document.all;
var ns6 = document.getElementById && !document.all;
var ttEnable=false; // Hide the tooltip.
var ttDebugMessage = '';
var ttinnerHTML = '';
var ttObj;
var ttClasses = [];//new Array();
var mvDiv = 'movementDiv'; // div that is to follow the mouse
var mvOffsetX = 5;         // X offset from mouse position
var ttMoveOffsetX = 5;
var mvOffsetY = 20;        // Y offset from mouse position
var ttMoveOffsetY = 20;
//	 END Custom tooltip settings.

// dateStartEnd_Set(StartDateId,EndDateID,StartDateValue,EndDateValue)
// Fill in the start and end dates.
//    StartDateId the id of the start date.
//      EndDateId the id of the end date.
// StartDateValue the value for the start date.
//   EndDateValue the value for the end date.
function dateStartEnd_Set(StartDateId,EndDateId,StartDateValue,EndDateValue) {
	// var DEBUG_dateStartEnd_Set = false;
	var DEBUG_dateStartEnd_Set = true;
	if ( DEBUG_dateStartEnd_Set ) { console.warn('dateStartEnd_Set[StartDateId='+StartDateId+', EndDateId='+EndDateId+', StartDateValue='+StartDateValue+', EndDateValue='+EndDateValue+')'); }
	if ( document.getElementById(StartDateId) ) { document.getElementById(StartDateId).value = StartDateValue; }
	if ( document.getElementById(EndDateId) ) { document.getElementById(EndDateId).value = EndDateValue; }
}

// elementBounds(e)
// Return left, top, right, bottom, width, and height of an element.
// eId = Id of element or element to check.
function elementBounds(eId,by) {
	var DEBUG_elementBounds = false;
	var ElementToCheck;
	var left = 0;
	var top = 0;
	var right = 0;
	var bottom = 0;
	var width = 0;
	var height = 0;
	if ( typeof eId === 'string' ) {
		if ( DEBUG_elementBounds ) { console.warn('elementBounds[eId='+eId+' by='+by+']'); }
		ElementToCheck = document.getElementById(eId);
		width = ElementToCheck.offsetWidth;
		height = ElementToCheck.offsetHeight;
	} else if ( typeof eId === 'object' ) {
		ElementToCheck = eId;
		width = ElementToCheck.offsetWidth;
		height = ElementToCheck.offsetHeight;
		if ( ElementToCheck.id ) {
			eId = ElementToCheck.id;
			if ( DEBUG_elementBounds ) { console.warn('elementBounds[eId='+eId+' by='+by+']'); }
		} else {
			if ( DEBUG_elementBounds ) { console.warn('elementBounds[tagName='+ElementToCheck.tagName+' by='+by+']'); }
		}
	} else {
		ElementToCheck = false;
	}
	if ( ElementToCheck ) {
		while( ElementToCheck && ElementToCheck.tagName && ElementToCheck.tagName !== "BODY" ) {
			left += ElementToCheck.offsetLeft;
			top += ElementToCheck.offsetTop;
			if ( DEBUG_elementBounds ) { console.log("\t"+'ElementToCheck.id='+ElementToCheck.id+' left='+left+' top='+top); }
			ElementToCheck = ElementToCheck.offsetParent;
	  }
		right = left + width;
		bottom = top + height;
	} else {
		console.info('No element with id '+eId+' found. by='+by);
	}
  return { left:left, top:top, right:right, bottom:bottom, width:width, height:height };
} // END elementBounds.

// formSubmit(e, formTask, formAction)
// Submits the form and additionally creates or sets hidden element values.
// Any "button" or "submit" element that calls this function will be disabled to help stop multiple form submissions.
// A button or disabled submit does not send its value when the form is submitted. This function fixes that problem.
//          e = The element calling formSubmit, (this). Required.
//   formTask = The new value of the element. Optional.
// formAction = The new form action. If formAction is undefined the form action is unchanged. Optional.
//
// If the e element has a name then e.name is used for the name of the hidden element.
// If the e element does not have a name then 'task' is used for the name of the hidden element.
// If the e element does not exist or is disabled then a hidden element with that name is created.
// The value of the named element is either the e element value or formTask. 
// The e element already exists then only the value is set.
// Additionally, you can even create many name/value pairs. See examples below.
//   formTask = The e value or an array of name/value pairs.
//              If typeof(formTask) == undefined = Create a hidden element with the name and value of the e element.
//                                                 If the e element has no name then the name of the hidden element is 'task'.
//                                                 If the e element has no value then the value of the hidden element is an empty string.
//              If typeof(formTask) == string    = Create a hidden element with the name of the e element and the value of formTask.
//                                                 If the e element has no name then the name of the hidden element is 'task'.
//              If typeof(formTask) == array     = Create hidden elements for each associative array pair. The array index is the element name and the value is the element value.
//                                                 If e has a name and the array does not contain e.name then a hidden element with the name e.name and the value of e.value is also created.
// formAction = The new form action. If formAction is undefined the form action is unchanged.
//
// 1) i.e. Call w/o formTask or formTask is an empty string.
// 1.a) element has a name.
//      <input type="button" name="myName" value="ClickMe" onClick="formSubmit(this);"> or
//      <input type="submit" name="myName" value="ClickMe" onClick="formSubmit(this);"> or
//      <input type="button" name="myName" value="ClickMe" onClick="formSubmit(this,'','/new_form_action/');"> or
//      <input type="submit" name="myName" value="ClickMe" onClick="formSubmit(this,'','/new_form_action/');">
//      Will disable the element and create a hidden element with the name "myName" and the value "ClickMe", then submit the form.
// 1.b) element has no name.
//      <input type="button" value="ClickMe" onClick="formSubmit(this);"> or
//      <input type="submit" value="ClickMe" onClick="formSubmit(this);"> or
//      <input type="button" value="ClickMe" onClick="formSubmit(this,'','/new_form_action/');"> or
//      <input type="submit" value="ClickMe" onClick="formSubmit(this,'','/new_form_action/');">
//      Will disable the element and create a hidden element with the name "task" and the value "ClickMe", then submit the form.
//
// 2) i.e. Call with formTask value.
// formSubmit(this,'County select') or formSubmit(this,'County select','/new_form_action/')
// <input type="radio" name="county" value="McLeod" onChange="formSubmit(this,'County select');">McLeod
// Will create a hidden element with the name "task" and the value "County select" then submit the form.
//
// 3) i.e. Call with formTask as an array of name/value pairs.
// formSubmit(this,{'name1':'value1','name2':'value2'}) or formSubmit(this,{'name1':'value1','name2':'value2'},'/new_form_action/')
// <input type="submit" name="task" value="ClickMe" onClick="formSubmit(this,{'name1':'value1','name2':'value2'});">
// Will disable submit element and create 3 hidden elements with the names "name1", "name2", and "task" with the values "value1", "value2", and "ClickMe" then submit the form.
function formSubmit(e, formTask, formAction, DEBUG_formSubmit) {
	//var DEBUG_formSubmit = true; // false = No console debug, true = turn on console debug.
	if ( typeof DEBUG_formSubmit === 'undefined' ) { DEBUG_formSubmit = false; }
	var defaultName = 'task'; // Set default form element name.
	if ( DEBUG_formSubmit ) { console.info('Begin formSubmit()'); }
	if ( e && e.type ) {
		// Get the e form.
		var eForm = getForm(e);
		if ( eForm == undefined ) {
			// The page has no form so create one.
			if ( DEBUG_formSubmit ) console.info('The page has no form');
			// Create a form.
			eForm = document.createElement('form');
			eForm.name = 'form_created';
			eForm.method = 'POST';
			eForm.action = document.URL;
			document.body.appendChild(eForm);
			if ( DEBUG_formSubmit ) console.log('form '+eForm.name+' created');
			/** /
			// Add form element to the form.
			var el = document.createElement("input"); // Create the input element.
			el.type = "hidden"; // Set element type to hidden.
			el.name = 'form'; // Set element name to form.
			el.value = 'form_created'; // Set element value to 'form_created'.
			eForm.appendChild(el); // Add the element to the form.
			if ( DEBUG_formSubmit ) console.log('Create element type="'+el.type+'" name="'+el.name+'" value="'+el.value+'"');
			// Add form element to the form.
			var el = document.createElement("input"); // Create the input element.
			el.type = "hidden"; // Set element type to hidden.
			el.name = 'form'; // Set element name to form.
			el.value = uuid(); // Set element value to uuid().
			eForm.appendChild(el); // Add the element to the form.
			if ( DEBUG_formSubmit ) console.log('Create element type="'+el.type+'" name="'+el.name+'" value="'+el.value+'"');
			/**/
			// eForm.submit(); // Test eForm.submit();
		}
		if ( DEBUG_formSubmit ) console.log('eForm.name = '+eForm.name);
		// Set the form action.
		if ( formAction != undefined ) {
			eForm.action = formAction; // If formAction then change the form action.
			if ( DEBUG_formSubmit ) console.log('eForm.action set to "'+eForm.action+'"');
		} else {
			if ( DEBUG_formSubmit ) console.log('eForm.action unchanged "'+eForm.action+'"');
		}
		// Get the e name.
		if ( e.name ) {
			eName = e.name;
		} else {
			eName = defaultName;
			console.log('e.name is undefined so use defaultName "'+defaultName+'"');
		}
		// Get the e value.
		if ( e.value ) {
			eValue = e.value;
		} else {
			eValue = undefined;
		}
		// If e.type is button or submit disable it.
		if ( e.type == 'button' || e.type == 'submit' ) {
			if ( !DEBUG_formSubmit ) {
				e.disabled = true;
			} else {
				if ( eValue ) {
					console.log('DEBUG_formSubmit == true, '+eValue+' '+e.type+' not disabled');
				} else {
					if ( e.name ) {
						console.log('DEBUG_formSubmit == true, '+e.name+' '+e.type+' not disabled');
					} else {
						console.log('DEBUG_formSubmit == true, '+'unnamed '+e.type+' not disabled');
					}
				}
			}
		}
		if ( DEBUG_formSubmit ) {
			console.log('eName = '+eName);
			console.log('eValue = '+eValue);
			console.log('typeof(formTask) = '+typeof(formTask));
		}
		switch ( typeof(formTask) ) {
			case 'object':
				// formTask is an object so create elements for each array item.
				if ( DEBUG_formSubmit ) console.info('formTask is an object so create elements for each array item.');
				eFound = false; // Setup for addition of hidden element.
				for( var index in formTask ) {
					var el = document.createElement("input"); // Create the input element.
					el.type = "hidden"; // Set element type to hidden.
					el.name = index; // Set element name to formTask index.
					if ( e.name && e.name == el.name ) eFound = true;
					el.value = formTask[index]; // Set element value to formTask[index] value.
					if ( DEBUG_formSubmit ) console.log('Create element type="'+el.type+'" name="'+el.name+'" value="'+el.value+'"');
					eForm.appendChild(el); // Add the element to the form.
				}
				if ( e.name && e.value && !eFound && ( e.type == 'button' || e.type == 'submit' || e.type == 'click' ) ) { // The button name was not in the array, add hidden element for button.
					if ( DEBUG_formSubmit ) console.log(e.name+' was not in the array, add hidden element');
					var el = document.createElement("input"); // Create the input element.
					el.type = "hidden"; // Set element type to hidden.
					el.name = e.name; // Set element name to e.name.
					el.value = e.value;	// Set element value to e.value.
					if ( DEBUG_formSubmit ) console.log('Create element type="'+el.type+'" name="'+el.name+'" value="'+el.value+'"');
					eForm.appendChild(el); // Add the element to the form.
				}
				break;
			case 'string':
			case 'undefined':
				if ( typeof(formTask) == 'string' ) {
					if ( formTask == '' ) {
						formTask = eValue;
						if ( DEBUG_formSubmit ) console.log('formTask is an empty string so use eValue "'+eValue+'"');
					} else {
						if ( DEBUG_formSubmit ) console.log('formTask is a string so use formTask value \''+formTask+'\'.');
					}
				}
				if ( typeof(formTask) == 'undefined' ) {
					formTask = eValue;
					if ( DEBUG_formSubmit ) console.log('formTask is undefined so use eValue "'+eValue+'"');
				}
				if ( formTask != undefined ) {
					// formTask is a string so create task with formTask value.
					if ( formTask == '' && eValue ) formTask = eValue;
					var el = document.createElement("input"); // Create the input element.
					el.type = "hidden"; // Set element type to hidden.
					el.name = eName; // Set element name.
					el.value = formTask;	// Set element value to formTask value.
					if ( DEBUG_formSubmit ) console.log('Create element type="'+el.type+'" name="'+el.name+'" value="'+el.value+'"');
					eForm.appendChild(el); // Add the element to the form.
				} else {
					if ( DEBUG_formSubmit ) console.log('formTask is undefined and the form will not be submitted');
					eForm = undefined;
				}
				break;
			default:
				console.error('formSubmit() is not programmed for typeof(formTask) = '+typeof(formTask));
				eForm = undefined;
				break;
		}
	} else {
		// e or e.type is undefined.
		if ( DEBUG_formSubmit ) {
			if ( e ) {
				console.log('e.type is undefined');
			} else {
				console.log('e is undefined');
			}
		}
	}
	if ( DEBUG_formSubmit ) console.info('End formSubmit()');
	if ( eForm != undefined ) {
		if ( DEBUG_formSubmit ) {
			var fSubmit = confirm('Execute '+eForm.name+'.submit();');
			if ( fSubmit == true) {
				eForm.submit();
			} else {
				console.info(eForm.name+'.submit() aborted');
			}
		} else {
				eForm.submit();
		}
	}
	return false;
}

// getForm(e)
// e = Form element to get the form from.
// If e is not a form element return the last form.
// If there is no form on the page return undefined.
function getForm(e) {
	//var DEBUG_getForm = true; // false = No console debug, true = turn on console debug.
	if ( DEBUG_getForm == undefined ) var DEBUG_getForm = false;
	if ( DEBUG_getForm ) console.info('Begin getForm()');
	if ( e.form && e.form.name ) {
		if ( DEBUG_getForm ) console.log('getForm(e) returning e form "'+e.form.name+'"');
		var eForm =  document.forms[e.form.name];
	} else {
		if ( DEBUG_getForm ) console.log('document.forms.length = '+document.forms.length);
		if ( document.forms.length ) {
			var eForm = document.forms[document.forms.length-1];
			if ( DEBUG_getForm ) {
				if ( e.form ) {
					console.log('getForm(e) e element does not have a form name; returning last form on page "'+eForm.name+'"');
				} else {
					console.log('getForm(e) e element does not have a form; returning last form on page "'+eForm.name+'"');
				}
			}
		} else {
			if ( DEBUG_getForm ) console.log('getForm(e) e element does not have a form name and the page has no forms; returning "undefined"');
			var eForm = undefined;
		}
		var eForm = eForm;
	}
	if ( DEBUG_getForm ) console.info('End getForm()');
	return eForm;
}

// today(textFieldId)
// Put today's date in text field.
// textFieldId = The id of the text field.
function today(textFieldId) {
  var eId = document.getElementById(textFieldId);
  var currentTime = new Date();
  if ( eId ) {
    var mm = currentTime.getMonth()+1;
    mm = (mm < 10) ? '0' + mm : mm;
    eId.value = mm + '/' + currentTime.getDate() + '/' + currentTime.getFullYear();
  }
}

// uuid()
// Generate a uuid for form control (used to prevent reload problems).
function uuid() {
	var uuidValue = (1+Math.random()).toString(16).substring(2,14)+(1+Math.random()).toString(16).substring(2,12)+(1+Math.random()).toString(16).substring(2,12);
	//console.log('uuidValue = '+uuidValue+' uuidValue.length = '+uuidValue.length);
	return uuidValue;
}

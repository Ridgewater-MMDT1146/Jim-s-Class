// js/updateHTMLelement.js

// Last Updated 2014-05-24. Changed ExitScreen function to ScreenExit. By Jim Martinson
// Last Updated 2014-05-23. updateSetTimeout variable. Store the setTimeout call for use by clearTimeout(updateSetTimeout) call. By Jim Martinson

var rfNodeId='';            // The HTML node.
var xmlhttp;                // The XMLHTTPRequest object.
var updateAutoFlag = false; // The flag to determine if the setTimeout() is triggered.
var updateAutoURL = '';     // The URL to load into updateAutoNodeId.
var updateAutoNodeId = '';  // The HTML node Id that receives the updateAutoURL data.
var updateSetTimeout = false; // Store the setTimeout call for use by clearTimeout(updateSetTimeout) call.
var loadingText = '';       // The text to display while thisNodeId is set to thisURL return text.
var reloadCount = 0;        // Keep a count of the reloads.
var jsFunction = '';        // The name of a second js function to call when update__Auto() executes.
var updateAutoTimer = 0;    // The time delay for the window.setTimeout. Set in update__Auto();
if ( form == undefined ) var form; // Form object.

// Check_updateSetTimeout()
// Checks for the clear_updateSetTimeout element and if it exists stop the timer.
function Check_updateSetTimeout() {
	//console.info('Check_updateSetTimeout()');
	if ( document.getElementById('clear_updateSetTimeout') ) {
		clearTimeout(updateSetTimeout);
		updateAutoFlag = false;
		console.warn('Timer turned off by Check_updateSetTimeout() call. updateAutoFlag='+updateAutoFlag);
	}
}

// ScreenExit(e, action, name)
// Exit play and submit form (Also set name or 'task' value).
//      e = The object calling the function.
// action = Replacement form action.
//   name = The form element name. If unset use the calling element name. If the calling element has no name use 'task'.
function ScreenExit(e, action, name) {
	DEBUG_ScreenExit = false; // false = DEBUG off, true = DEBUG on.
	if ( DEBUG_ScreenExit ) console.warn('ScreenExit(\''+e.value+'\',\''+action+'\')');
	ttHide(); // Hide any tooltip.
  updateAutoOff(); // Turn off the updateAuto timer.
	// Get the form.
	if ( DEBUG_ScreenExit ) console.log('document.forms='+document.forms);
	if ( document.forms ) {
		// Document has forms.
		form = getForm(e) // Get form.
		if ( DEBUG_ScreenExit ) console.log('form.name='+form.name);
	} else {
		if ( DEBUG_ScreenExit ) console.error('Document has no forms');
	}
	if ( DEBUG_ScreenExit ) console.log('form='+form.name);
	// Get element name. If name is not set and calling e has no name, set name to 'task';
	if ( DEBUG_ScreenExit ) console.log('name='+name);
	if ( name == undefined || name == '' ) {
		if ( DEBUG_ScreenExit ) console.log('name is undefined or empty');
		if ( e.name == undefined || e.name == '' ) {
			if ( DEBUG_ScreenExit ) console.log('e.name is undefined or empty\nSet name=task');
			name = 'task';
		} else {
			name = e.name;
		}
	}
	if ( DEBUG_ScreenExit ) console.log('name='+name);
	// Get element value. If no e.value use e.name, if no e.name set to ''.
	if ( e.value != undefined ) { value = e.value; } else { if ( e.name != undefined ) { value = e.name; } else { value = ''; } }
	if ( DEBUG_ScreenExit ) console.log('value='+value);
	// Create name form element and set value.
	var fe = document.createElement("input"); // Create the input element.
	fe.type = 'hidden'; // Set element type to hidden.
	fe.name = name; // Set element name.
	fe.value = value;	// Set element value to formTask value.
	form.appendChild(fe); // Add the element to the form.
	if ( DEBUG_ScreenExit ) console.log('Created element type='+fe.type+' name='+fe.name+' value='+fe.value);
	// Change the form action if set.
	//if ( action != undefined ) {
	if ( action != undefined && action != '' ) {
		form.action = ROOT_http+action; // Change the form action.
		if ( DEBUG_ScreenExit ) console.log('Changed the form action to: '+form.action);
	}
	URLget('/Play/ScreenExit.php','ScreenExit'); // Exit the screen.
	if ( DEBUG_ScreenExit ) alert('Submitting '+form.name);
  setTimeout(ScreenExit__Submit,250); // Submit the form in 250 milliseconds.
}

// ScreenExit__Submit()
// Submit the form.
// form = Form to submit.
function ScreenExit__Submit() {
	//alert('Submitting '+form.name);
  form.submit(); // Submit the form.
}

// updateAutoOff(thisURL, thisNodeId)
// Turn off the timer. It will also load the file thisURL into the HTML node thisNodeId if they are given.
//    thisURL = The URL to load.
// thisNodeId = The HTML node Id.
function updateAutoOff(thisURL, thisNodeId) {
	DEBUG_updateAutoOff = false; // false = DEBUG off, true = DEBUG on.
  if ( DEBUG_updateAutoOff ) alert("updateAutoOff("+thisURL+","+thisNodeId+") updateAutoFlag="+updateAutoFlag);
   update__AutoStatus('off');
  if ( thisURL != undefined && thisNodeId != undefined ) { updateInclude(thisURL, thisNodeId); }
}

// updateAutoOn(thisURL, thisNodeId, timer, thisLoadingText, thisFunction)
// Turn on the timer and load the file into the HTML node.
//         thisURL = The URL to load into thisNodeId.
//      thisNodeId = The HTML node Id that receives the thisURL data. If this is false or blank then thisURL data is not stored in an HTML node.
//           timer = The delay between reloading the file into the HTML node.
// thisLoadingText = The text to display while thisNodeId is set to thisURL return text.
//    thisFunction = A second js function to call when update__Auto() fires.
function updateAutoOn(thisURL, thisNodeId, timer, thisLoadingText, thisFunction) {
  //alert("updateAutoOn ("+thisURL+", "+thisNodeId+", "+timer+", "+thisLoadingText+", "+thisFunction);
  jsFunction = thisFunction;
  loadingText = thisLoadingText;
   update__AutoStatus('on');
  if (thisURL != null) {
    updateAutoURL = thisURL;
    updateAutoNodeId = thisNodeId;
  }
  update__Auto(timer);
}

// updateInclude(thisURL, thisNodeId, doNotWait, thisLoadingText)
// Load the file into the HTML node. The timer is not used (nor changed!).
//         thisURL = The URL to load into thisNodeId.
//      thisNodeId = The HTML node Id that receives the thisURL data. If this is false or blank then thisURL data is not stored in an HTML node.
//       doNotWait = Do not wait for return. Default is true (Do not wait).
// thisLoadingText = The text to display while thisNodeId is set to thisURL return text.
//    thisFunction = A second js function to call when update__Auto() fires.
function updateInclude(thisURL, thisNodeId, doNotWait, thisLoadingText, thisFunction) {
  //alert('updateInclude(\''+thisURL+'\', \''+thisNodeId+'\', '+doNotWait+', \''+thisLoadingText+'\')');
  //alert("updateInclude caller is " + arguments.callee.caller.toString());
	if ( thisURL == undefined || thisURL == '' ) thisURL = false;
  if ( thisURL ) {
    //alert('jsFunction='+jsFunction);
		if ( thisNodeId == undefined || thisNodeId == '' ) thisNodeId = false;
    if ( doNotWait == undefined ) doNotWait = true;
    if ( thisLoadingText == undefined ) thisLoadingText = loadingText;
    //alert('thisFunction='+thisFunction);
    if ( thisFunction != undefined ) jsFunction = thisFunction;
    //alert("updateInclude "+thisURL+" "+thisNodeId+" "+updateAutoFlag);
    if (arguments.length!=0) {
      if ( thisNodeId ) var rfNodeId = document.getElementById(thisNodeId);
      if (reloadCount == 0) {
        if ( thisNodeId ) rfNodeId.innerHTML = '<span class="attention bold"><em>Loading '+thisLoadingText+' ...</em></span>';
      }
      reloadCount++;
      xmlhttp = update__GetHTTPObject(); //new XMLHttpRequest();
      xmlhttp.open("GET", thisURL, doNotWait);
      xmlhttp.onreadystatechange = function() {
        if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
          if ( thisNodeId ) rfNodeId.innerHTML = xmlhttp.responseText;
          //alert('jsFunction='+jsFunction);
          if ( jsFunction != undefined && 'eval(jsFunction)' != undefined ) eval(jsFunction);
        }
      }
      xmlhttp.send(null);
    }
  }
}

// URLget(thisURL, thisNodeId)
// Execute the thisURL page. Page output stored in the ScreenExit div.
// Needs: <div align="center" id="ScreenExit" class="hidden"></div> in body of page.
// I tried it without rfNodeId.innerHTML = xmlhttp.responseText; but got uneven results.
function URLget(thisURL, thisNodeId, async) {
  if (thisURL != undefined && thisURL != '') {
		if ( async == undefined ) async = true;
    //alert("URLget "+thisURL+" "+thisNodeId);
    if (arguments.length!=0) {
      xmlhttp=update__GetHTTPObject(); //new XMLHttpRequest();
      xmlhttp.open("GET", thisURL, async); // GET thisURL asynchronously (true)(default) or synchronously (false).
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         if ( thisNodeId != undefined && thisNodeId != '' && document.getElementById(thisNodeId) ) {
            var rfNodeId = document.getElementById(thisNodeId);
            rfNodeId.innerHTML = xmlhttp.responseText;
         }
          //alert(xmlhttp.responseText);
        }
      }
      xmlhttp.send(null);
    }
  }
}

// update__Auto(timer)
// This must only be called from updateAutoOn().
// Load the file into the HTML node.
// timer = The delay between reloading the updateAutoURL data into the updateAutoNodeId.
function update__Auto(timer) {
  //alert("update__Auto("+timer+")");
	if ( timer != undefined ) updateAutoTimer = timer;
  updateInclude(updateAutoURL, updateAutoNodeId); // Load the file into the HTML node.
	//console.log('updateAutoFlag='+updateAutoFlag);
  if ( updateAutoFlag ) updateSetTimeout = window.setTimeout(update__Auto,updateAutoTimer); // Set windows to recall update__Auto(timer) in timer milliseconds.
}

// update__AutoStatus(setStatus)
// setStatus = off, turn off the timer.
//             on, turn on the timer.
function update__AutoStatus(setStatus) {
  //alert("update__AutoStatus "+setStatus+" "+updateAutoFlag);
  if ( setStatus != undefined ) {
    if (setStatus == 'off') {
    //alert("update__AutoStatus('off')");
      if ( document.form_UpdateHTMLelement && document.form_UpdateHTMLelement.updateAutoFlag ) {
        document.form_UpdateHTMLelement.updateAutoFlag.value = false;
      }
      updateAutoFlag = false;
    } else if (setStatus == 'on') {
    //alert("update__AutoStatus('on')");
      if ( document.form_UpdateHTMLelement && document.form_UpdateHTMLelement.updateAutoFlag ) {
        document.form_UpdateHTMLelement.updateAutoFlag.value = true;
      }
      updateAutoFlag = true;
    }
  } else {
    // Set updateAutoFlag to document.form_UpdateHTMLelement.updateAutoFlag.value.
    if ( document.form_UpdateHTMLelement && document.form_UpdateHTMLelement.updateAutoFlag ) {
      thisFlag = document.form_UpdateHTMLelement.updateAutoFlag.value;
      if ( thisFlag == 'true' ) {
        updateAutoFlag = true;
      } else {
        updateAutoFlag = false;
      }
    }
  }
  return updateAutoFlag;
}

// update__GetHTTPObject()
// Returns new XMLHttpRequest().
function update__GetHTTPObject() {
  if ( typeof XMLHttpRequest != undefined ) {
    return new XMLHttpRequest();
  }
  try {
    return new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer 5.x
  } catch (e) {
    try {
      return new ActiveXObject("Microsoft.XMLHTTP"); // Internet Explorer 6.x
    } catch (e) {}
  }
  return false;
}

update__AutoStatus('off');

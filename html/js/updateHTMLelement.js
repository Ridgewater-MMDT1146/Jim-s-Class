// js/updateHTMLelement.js
// Functions to perform XMLHttpRequests.

// Last Updated 2018-03-13. Updated function and variable names. Updated comments. By Jim Martinson.

// UpdateAutoOff(thisURL, elementId) ................................... Turn off the timer. It will also load the thisURL output into the elementId innerHTML if they are given.
// UpdateAutoOn(thisURL, elementId, timer, preloadText, jsReturnCode) .. Turn on the timer and load thisURL output into elementId.innerHTML every timer milliseconds.
// UpdateInclude(thisURL, elementId, preloadText, jsReturnCode) ........ Load thisURL output into elementId innerHTML. The timer is not used (nor changed!).
// URLget(thisURL, elementId) .......................................... Execute the thisURL page. Page output is stored in the elementId innerHTML.
// Update__Auto(timer) ................................................. Load the UpdateAutoURL output into the UpdateAutoDOMid innerHTML.
// Update__AutoStatus(setStatus) ....................................... Turn the UpdateAutoFlag on or off.
// Update__GetHTTPObject() ............................................. Returns a new XMLHttpRequest().

var UpdateAutoFlag = false;		// The flag to determine if the setTimeout() is triggered for timed XMLHttpRequests.
var UpdateAutoDOMid = '';	    // The id of the DOM element that receives the XMLHttpRequest responseText.
var UpdateAutoTimer = 0;    	// The time delay for the window.setTimeout. Set in Update__Auto();
var UpdateAutoURL = '';				// The URL for the XMLHttpRequest call.
var UpdateDOMelement = null;  // The DOM element innerHTML that will receive the XMLHttpRequest responseText.
var UpdateLoadingText = '';   // The text to preload into UpdateDOMelement.innerHTML before the XMLHttpRequest call.
var UpdateReloadCount = 0;    // Keep a count of XMLHttpRequest reloads.
var UpdateReturnCode = false; // The js code to run when the XMLHttpRequest returns status === 200. Does eval(UpdateReturnCode).
var UpdateSetTimeout = false; // Store the setTimeout call for use by clearTimeout(UpdateSetTimeout) call.
var URI;											// URI for UpdateInclude() calls.
var XMLHttpRequestObject;     // The XMLHttpRequest object.

// UpdateAutoOff(thisURL, elementId)
// Turn off the timer. It will also load the thisURL output into the elementId innerHTML if they are given.
//   thisURL = The URL to load.
// elementId = The HTML element Id.
function UpdateAutoOff(thisURL, elementId) {
	DEBUG_UpdateAutoOff = false; // false = DEBUG off, true = DEBUG on.
  if ( DEBUG_UpdateAutoOff ) { alert("UpdateAutoOff("+thisURL+","+elementId+") UpdateAutoFlag="+UpdateAutoFlag); }
   Update__AutoStatus('off');
	if ( UpdateSetTimeout ) {
		clearTimeout(UpdateSetTimeout);
		UpdateSetTimeout = false;
	}
  if ( ( typeof thisURL !== 'undefined' ) && ( typeof elementId !== 'undefined' ) ) { UpdateInclude(thisURL, elementId); }
} // END UpdateAutoOff.

// UpdateAutoOn(thisURL, elementId, timer, preloadText, jsReturnCode)
// Turn on the timer and load thisURL output into elementId.innerHTML every timer milliseconds.
//      thisURL = The URL to call with the XMLHttpRequest.
//    elementId = The DOM element id that receives the XMLHttpRequest responseText.
//                If this is false or blank then XMLHttpRequest responseText is not stored in a DOM element.
//        timer = The millisecond delay between reloading the file into the HTML element.
//  preloadText = The text to display in DOM element innerHTML before the XMLHttpRequest call.
// 	              If undefined use UpdateLoadingText as string below.
// 	              If string, preload the DOM element innerHTML with 'Loading string ...'.
// 	              If false, do not preload the DOM element innerHTML.
// jsReturnCode = The js code to run when the XMLHttpRequest returns status === 200. Does eval(jsReturnCode).
function UpdateAutoOn(thisURL, elementId, timer, preloadText, jsReturnCode) {
	DEBUG_UpdateAutoOn = false;
  if ( DEBUG_UpdateAutoOn ) { console.warn('UpdateAutoOn[thisURL='+thisURL+', elementId='+elementId+', timer='+timer+', preloadText='+preloadText+', jsReturnCode='+jsReturnCode+']'); }
	//alert("UpdateAutoOn ("+thisURL+", "+elementId+", "+timer+", "+preloadText+", "+jsReturnCode);
	if ( typeof jsReturnCode !== 'undefined' ) {
	  UpdateReturnCode = jsReturnCode;
		if ( DEBUG_UpdateAutoOn ) { console.info('UpdateReturnCode changed to '+UpdateReturnCode); }
	} else {
	  UpdateReturnCode = false;
		if ( DEBUG_UpdateAutoOn ) { console.info('UpdateReturnCode changed to false'); }
	}
	//alert('UpdateReturnCode='+UpdateReturnCode);
  UpdateLoadingText = preloadText;
  Update__AutoStatus('on');
  if (thisURL !== null) {
    UpdateAutoURL = thisURL;
    UpdateAutoDOMid = elementId;
  }
  Update__Auto(timer);
} // END UpdateAutoOn.

// UpdateInclude(thisURL, elementId, preloadText, jsReturnCode)
// Load thisURL output into elementId innerHTML. The timer is not used (nor changed!).
//      thisURL = The URL to call with the XMLHttpRequest.
//    elementId = The DOM element id that receives the XMLHttpRequest responseText.
//                If this is false or blank then XMLHttpRequest responseText is not stored in a DOM element.
//  preloadText = The text to display in DOM element innerHTML before the XMLHttpRequest call.
// 	              If undefined use UpdateLoadingText as string below.
// 	              If string, preload the DOM element innerHTML with 'Loading string ...'.
// 	              If false, do not preload the DOM element innerHTML.
// jsReturnCode = The js code to run when the XMLHttpRequest returns status === 200. Does eval(jsReturnCode).
function UpdateInclude(thisURL, elementId, preloadText, jsReturnCode) {
	DEBUG_UpdateInclude = false;
	if ( DEBUG_UpdateInclude ) { console.warn('UpdateInclude[thisURL='+thisURL+', elementId='+elementId+', preloadText='+preloadText+', jsReturnCode='+jsReturnCode+']'); }
	if ( ( typeof thisURL === 'undefined' ) || thisURL === '' ) { thisURL = false; }
  if ( thisURL ) {
		if ( typeof elementId === 'undefined' || elementId === '' ) { elementId = false; }
    if ( typeof preloadText === 'undefined' ) { preloadText = UpdateLoadingText; }
    if ( typeof jsReturnCode !== 'undefined' ) { UpdateReturnCode = jsReturnCode;
																								 if ( DEBUG_UpdateInclude ) { console.info('UpdateReturnCode changed to '+UpdateReturnCode); }
																							 }
    if ( arguments.length !== 0) {
      if ( elementId ) { UpdateDOMelement = document.getElementById(elementId); }
      if ( UpdateReloadCount === 0 ) {
        if ( elementId ) {
					if ( preloadText !== false ) {
						UpdateDOMelement.innerHTML = '<em class="info bold">Loading '+preloadText+' ...</em>';
					} else {
						UpdateDOMelement.innerHTML = '';
					}
				}
      }
      UpdateReloadCount++;
      XMLHttpRequestObject = Update__GetHTTPObject(); // new XMLHttpRequest();
      XMLHttpRequestObject.open("GET", thisURL, true);
      XMLHttpRequestObject.onreadystatechange = function() {
				if ( XMLHttpRequestObject.readyState === 4 && XMLHttpRequestObject.status === 200 ) {
          if ( elementId && UpdateDOMelement ) { UpdateDOMelement.innerHTML = XMLHttpRequestObject.responseText; }
          if ( UpdateReturnCode ) {
						if ( DEBUG_UpdateInclude ) { console.log('eval['+UpdateReturnCode+'];'); }
						eval(UpdateReturnCode);
						UpdateReturnCode = false; // Set to false to clear UpdateReturnCode.
					}
        }
      };
      XMLHttpRequestObject.send(null);
    }
  }
} // END UpdateInclude.

// URLget(thisURL, elementId)
// Execute the thisURL page. Page output stored in the elementId div.
// I tried it without UpdateDOMelement.innerHTML = XMLHttpRequestObject.responseText; but got uneven results.
function URLget(thisURL, elementId) {
  if (thisURL !== undefined && thisURL !== '') {
    if (arguments.length !== 0) {
      XMLHttpRequestObject = Update__GetHTTPObject(); // Get a new XMLHttpRequest().
      XMLHttpRequestObject.open("GET", thisURL); // GET thisURL asynchronously.
      XMLHttpRequestObject.onreadystatechange = function() {
				if (XMLHttpRequestObject.readyState === 4 && XMLHttpRequestObject.status === 200) {
					if ( elementId !== 'undefined' && elementId !== '' && document.getElementById(elementId) ) {
						var UpdateDOMelement = document.getElementById(elementId);
						UpdateDOMelement.innerHTML = XMLHttpRequestObject.responseText;
					} else {
						console.warn('Element '+elementId+' does not exist.');
					}
				}
      };
      XMLHttpRequestObject.send(null);
    }
  }
} // END URLget.

// Update__Auto(timer)
// Load the UpdateAutoURL output into the UpdateAutoDOMid innerHTML.
// This must only be called from UpdateAutoOn().
// timer = The millisecond delay between reloading the UpdateAutoURL output into the UpdateAutoDOMid innerHTML.
function Update__Auto(timer) {
	if ( typeof timer !== 'undefined' ) { UpdateAutoTimer = timer; } else { UpdateAutoTimer = 10000; }
  UpdateInclude(UpdateAutoURL, UpdateAutoDOMid); // Load thisURL output into elementId innerHTML.
  if ( UpdateAutoFlag ) { UpdateSetTimeout = window.setTimeout(Update__Auto,UpdateAutoTimer); } // Set window to recall Update__Auto(timer) in timer milliseconds.
} // END Update__Auto.

// Update__AutoStatus(setStatus)
// Turn the UpdateAutoFlag on or off.
// setStatus = off, turn off the timer.
//              on, turn on the timer.
function Update__AutoStatus(setStatus) {
  if ( typeof setStatus !== 'undefined' ) {
    if ( setStatus === 'off' ) {
      UpdateAutoFlag = false;
    } else if ( setStatus === 'on' ) {
      UpdateAutoFlag = true;
    }
  }
  return UpdateAutoFlag;
} // END Update__AutoStatus.

// Update__GetHTTPObject()
// Returns a new XMLHttpRequest().
function Update__GetHTTPObject() {
  if ( typeof XMLHttpRequest !== 'undefined' ) {
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
} // END Update__GetHTTPObject;

Update__AutoStatus('off');

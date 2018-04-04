// div.js

// divContent(divId,divContent)
// Change the content of the div.
function divContent(divId,divContent) {
  //console.log('divContent('+divId+','+divContent+')');
	if ( document.getElementById(divId) ) {
	  document.getElementById(divId).innerHTML = divContent;
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}
// createDiv(divId, divClass, divContent, divInsert)
//       divId = the id to give the div.
//    divClass = the class to give the div.
//  divContent = the div content.
//   divInsert = the element to insert the div before.
function createDiv(divId,divClass,divContent,divInsert) {
  if (divId == undefined) divId = false;
  if (divClass == undefined) divClass = false;
  if (divContent == undefined) divContent = false;
  if (divInsert == undefined) divInsert = false;
  if ( document.body == null ) {
    stackTrace = printStackTrace();
    createDivText = 'createDiv(';
    if (divId) createDivText += '\''+divId+'\'';
    if (divClass) createDivText += '\''+divClass+'\'';
    if (divContent) createDivText += '\''+divContent+'\'';
    if (divInsert) createDivText += '\''+divInsert+'\'';
    printStackTrace();
    createDivText += ')';
    alertText = 'Error in call of '+createDivText+'!\n\n';
    alertText += 'The document body in not loaded so the createDiv function cannot be called.\n';
    alertText += 'To corect this, add a function that creates the div(s) then add the function to the onload event.\n\n';
    alertText += '// A function to create the div(s) if they are not on the page.\nfunction createDivs() {\n';
    alertText += '  '+createDivText+';\n  // Place any other createDiv calls below the one above\n';
    alertText += '}\n';
    alertText += '// Add the createDivs() function to the onload event.\n';
    alertText += 'var oldLoad = window.onload;\nvar newLoad = oldLoad ? function(){createDivs.call(this);oldLoad.call(this);} : createDivs\nwindow.onload = newLoad;\n\n';
    alertText += 'Stack trace:\n'+stackTrace+'\n';
    alert(alertText+'\n\nThis error will be inserted into the page text so you can copy it.');
    alertText = alertText.replace(/\n/g,'<br>');
    document.write(alertText+'<br><br>');
    return;
  }
  var newDivElement = document.createElement("div");
  if (divId) newDivElement.id = divId;
  if (divClass) newDivElement.className = divClass;
  if (divContent) newDivElement.innerHTML = divContent;
  if (divInsert) {
    // Ensure that the divInsert element exists.
    divInsertId = document.getElementById(divInsert);
    //alert('divInsertId='+divInsertId.id);
    if (divInsertId) {
      // The element exists, insert the new div and return.
      //alert('document.body.insertBefore(newDivElement, \''+divInsert+'\');');
      divInsertId.parentNode.insertBefore(newDivElement, divInsertId);
      return;
    }
  }
  document.body.appendChild(newDivElement);
}

// divDisplayState(divId)
// divId = The id of the div.
// Return the display setting for divId.
function divDisplayState(divId) {
  //console.log('divDisplayState('+divId+')');
	if ( document.getElementById(divId) ) {
		var e = document.getElementById(divId)
		if (e.style.display) {
			return e.style.display;
		}
		if (e.currentStyle) {
			return e.currentStyle.display;
		}
		if (document.defaultView.getComputedStyle) {
			return document.defaultView.getComputedStyle(e, null).getPropertyValue("display");
		}
		return 'UNKNOWN';
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}

// divHide(divId)
// divId = The id of the div.
// Hide the div.
function divHide(divId) {
  //console.log('divHide('+divId+')');
	if ( document.getElementById(divId) ) {
	  document.getElementById(divId).style.display = 'none';
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}
// divHideShow(divId)
// divId = The id of the div.
// Toggle the div display.
function divHideShow(divId) {
  //console.log('divHide('+divId+')');
	if ( document.getElementById(divId) ) {
		if ( divDisplayState(divId) == 'none' ) {
			divShow(divId);
		} else {
			divHide(divId);
		}
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}
// divShow(divId)
// divId = The id of the div.
// Show the div.
function divShow(divId) {
  //console.log('divShow('+divId+')');
	if ( document.getElementById(divId) ) {
	  document.getElementById(divId).style.display = 'block';
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}
// divShowInline(divId)
// divId = The id of the div.
// Show the div as inline.
function divShowInline(divId) {
  //console.log('divShow('+divId+')');
	if ( document.getElementById(divId) ) {
	  document.getElementById(divId).style.display = 'inline';
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}
// divShowOnly(divHideList,divId)
// Hide all divs in divHideList and Show divId
function divShowOnly(divHideList,divId) {
  //console.log('divShow('+divHideList+','+divId+')');
	if ( document.getElementById(divId) ) {
		var divHideArray = divHideList.split(",");
		for(var i=0; i<divHideArray.length; i++){
			divHide(divHideArray[i]);
		}
		divShow(divId);
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}
// divShowOnlyInline(divHideList,newId)
// Hide all divs in divHideList and Show divId
function divShowOnlyInline(divHideList,divId) {
  //console.log('divShow('+divHideList+','+divId+')');
	if ( document.getElementById(divId) ) {
		var divHideArray = divHideList.split(",");
		for(var i=0; i<divHideArray.length; i++){
			divHide(divHideArray[i]);
		}
		divShowInline(divId);
	} else {
		console.warn('document.getElementById('+divId+') == udefined');
	}
}
// printStackTrace()
// Prints a stack trace.
function printStackTrace() {
  var callstack = [];
  var isCallstackPopulated = false;
  try {
    i.dont.exist+=0; // doesn't exist- that's the point
  } catch(e) {
    if (e.stack) { // Firefox
      var lines = e.stack.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          callstack.push(lines[i]);
        }
      }
      // Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
    else if (window.opera && e.message) { // Opera
      var lines = e.message.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          var entry = lines[i];
          // Append next line also since it has the file info
          if (lines[i+1]) {
            entry += ' at ' + lines[i+1];
            i++;
          }
          callstack.push(entry);
        }
      }
      // Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
  }
  if (!isCallstackPopulated) { //IE and Safari
    var currentFunction = arguments.callee.caller;
    while (currentFunction) {
      var fn = currentFunction.toString();
      var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
      callstack.push(fname);
      currentFunction = currentFunction.caller;
    }
  }
  //document.write(callstack);
  return callstack;
}

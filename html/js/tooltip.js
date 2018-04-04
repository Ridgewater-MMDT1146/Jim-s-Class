// js/tooltip.js

// Custom tooltip.
// ttShow('tooltip_text); Will display the tooltip when the mouse if over the object.
// ttHide();              Will hide the tooltip when the mouse leaves the object.

// ietruebody()
// ietruebody()
// Check compatibility.
function ietruebody() {
  return (document.compatMode && document.compatMode !== "BackCompat")? document.documentElement : document.body;
}

function mouseX(evt) {
	if (!evt) { evt = window.event; }
	if (evt.pageX) {
		return evt.pageX;
	} else {
		if (evt.clientX) {
			return evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft);
		} else {
			return 0;
		}
	}
}
function mouseY(evt) {
	if (!evt) { evt = window.event; }
	if (evt.pageY) {
		return evt.pageY;
	} else {
		if (evt.clientY) {
			return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
		} else {
			return 0;
		}
	}
}

// ttHide()
// Hide the tooltip.
function ttHide() {
  //console.info('ttHide()');
  if ( ( ns6 || ie ) && ( typeof ttObj !== 'undefined' ) ) {
    ttEnable=false;
		ttObj.style.display="none";
    ttObj.style.visibility="hidden";
    ttObj.style.left="-1000px";
    ttObj.style.backgroundColor='';
    ttObj.style.width='';
		ttObj.className = ttClasses.pop();
  }
}

// ttLoad(e, prefix, postfix)
// Load the text in the element and show the tooltip.
function ttLoad(e, prefix, postfix) {
	if ( typeof e === 'string' ) { e = document.getElementById(e); }
	if ( typeof prefix === 'undefined' ) { prefix = ''; }
	if ( typeof postfix === 'undefined' ) { postfix = ''; }
  //console.info('ttLoad[e.id='+e.id+']');
	if ( e ) {
		var ttText = prefix + e.innerHTML + postfix;//.replace(/</g,'&lt;');
		//console.log('ttText='+ttText);
		//ttObj.innerHTML=ttText;
		ttShow(ttText);
	} else {
		ttShow('Element '+e+' not found in document.');
	}
}

// ttPosition(e)
// Position the tooltip.
function ttPosition(e) {
	//console.log('ttPosition()');
	ttDebugMessage = '';
	//e = e || window.event; // Get the event.
  if (ttEnable) {
    /**/
    var curX=(ns6)?e.pageX : event.clientX+ietruebody().scrollLeft;
    var curY=(ns6)?e.pageY : event.clientY+ietruebody().scrollTop;
    var hscroll = ie? ietruebody().scrollLeft : window.pageXOffset;
    var vscroll = ie? ietruebody().scrollTop : window.pageYOffset;
    /**/
    // Find out how close the mouse is to the corner of the window.
    var rightedge=ie&&!window.opera? ietruebody().clientWidth-event.clientX-ttOffsetX : window.innerWidth-e.clientX-ttOffsetX-20;
    var bottomedge=ie&&!window.opera? ietruebody().clientHeight-event.clientY-ttOffsetY+ttMoveOffsetY : window.innerHeight-e.clientY-ttOffsetY-20+ttMoveOffsetY;
    var leftedge=(ttOffsetX<0)? ttOffsetX*(-1) : -1000;
    if ( DEBUG_hPosition ) { ttDebugMessage += '<br>'; }
    if ( DEBUG_hPosition ) { ttDebugMessage += ' 70 X='+curX+' hscroll='+hscroll+' re='+rightedge+' le='+leftedge+'<br> &nbsp; &nbsp; offsetWidth='+ttObj.offsetWidth+' ttOffsetX='+ttOffsetX; }
    if ( DEBUG_vPosition ) { ttDebugMessage += '<br>'; }
    if ( DEBUG_vPosition ) { ttDebugMessage += ' 72 Y='+curY+' vscroll='+vscroll+' be='+bottomedge+' offsetHeight='+ttObj.offsetHeight+' ttOffsetY='+ttOffsetY; }
    // If the horizontal distance isn't enough to accomodate the width of the tooltip then:
		var leftValue;
		var topValue;
    if ( rightedge < ttObj.offsetWidth) {
      // Move the horizontal position of the tooltip left by it's width.
      if ( DEBUG_hPosition ) { ttDebugMessage += '<br> 78 .pageXOffset='+window.pageXOffset+' e.clientX='+e.clientX; }
      var offsetx = ttOffsetX / 2;
      leftValue = ie? ietruebody().scrollLeft+event.clientX-ttObj.offsetWidth-offsetx : window.pageXOffset+e.clientX-ttObj.offsetWidth-offsetx;
      ttObj.style.left = parseInt(leftValue)+"px";
      if ( DEBUG_hPosition ) { ttDebugMessage += '<br> 82 ttObj.style.left='+ttObj.style.left; }
    } else {
      if ( curX < leftedge ) {
        // Position the horizontal position of the tooltip 2 px from the left edge.
        leftValue = 2;
        ttObj.style.left = parseInt(leftValue)+"px";
        if ( DEBUG_hPosition ) { ttDebugMessage += '<br> 88 ttObj.style.left='+ttObj.style.left; }
      } else {
        // Position the horizontal position of the tooltip where the mouse is positioned.
        leftValue = curX+ttOffsetX;
        ttObj.style.left = parseInt(leftValue)+"px";
        if ( DEBUG_hPosition ) { ttDebugMessage += '<br> 93 ttObj.style.left='+ttObj.style.left; }
      }
    }
    if ( bottomedge < ttObj.offsetHeight ) { // If the vertical distance isn't enough to accomodate the height of the tooltip then:
      // Move the vertical position of the tooltip up by it's height.
      topValue = ie? ietruebody().scrollTop+event.clientY-ttObj.offsetHeight : window.pageYOffset+e.clientY-ttObj.offsetHeight;
      ttObj.style.top = parseInt(topValue)+"px";
      if ( DEBUG_vPosition ) { ttDebugMessage += '<br>100 ttObj.style.top='+ttObj.style.top; }
    } else {
      // Position the vertical position of the tooltip where the mouse is positioned.
      topValue = curY+ttOffsetY+ttMoveOffsetY;
      ttObj.style.top = parseInt(topValue)+"px";
      if ( DEBUG_vPosition ) { ttDebugMessage += '<br>105 ttObj.style.top='+ttObj.style.top; }
    }
    if ( topValue < vscroll ) {
      topValue = 1;
      ttObj.style.top = parseInt(topValue)+vscroll+"px";
      if ( DEBUG_vPosition ) { ttDebugMessage += '<br>110 ttObj.style.top='+ttObj.style.top; }
    }
    ttObj.style.display="block";
    ttObj.style.visibility="visible";
    if ( DEBUG_vPosition ) { ttDebugMessage += '<br>'; }
    //if (!DEBUG_vPosition) ttDebugMessage += ' '+ttObj.style.top+' '+vscroll;
    //ttObj.innerHTML=ttDebugMessage+ttinnerHTML;
    ttObj.innerHTML=ttinnerHTML+ttDebugMessage;
		if ( DEBUG_vPosition ) { console.log(ttDebugMessage); }
  }
}

// ttShow(ttText, ttClass, ttWidth)
// Show the tooltip.
// &quot; is changed to ".
// ~~n is changed to \n.
function ttShow(ttText, ttClass) { //, ttWidth) {
  //console.info('ttShow()');
	if ( ttText !== '' &&  (ns6 || ie) && ( typeof ttObj !== 'undefined' ) ) {
    tt = document.getElementById(ttDiv);
    ttClasses.push(tt.className);
		if ( typeof ttClass !== 'undefined' ) {
			tt.className = ttClass;
		}
    ttinnerHTML = ttText.replace(/&quot;/g,'"'); // Replace &quot; with ".
		ttinnerHTML = ttinnerHTML.replace(/<\/table>\n<table/g,"</table><table"); // Remove newline betwen tables.
		ttinnerHTML = ttinnerHTML.replace(/~~n/g,"\n"); // Replace ~~n with newline.
		ttinnerHTML = ttinnerHTML.trim();
		//console.warn('ttinnerHTML='+ttinnerHTML);
    ttObj.innerHTML=ttinnerHTML;
    ttEnable=true;
    return false;
  }
}

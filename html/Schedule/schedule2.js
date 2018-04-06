// Schedule/schedule2.js

var ClassMeetingIndex; // Used to count the number of class meetings for the Schedule CLass dialog.

// Meeting_Add()
// Add a new meeting to the Schedule Class dialog.
function Meeting_Add(scheduleclassId) {
	var DEBUG_Meeting_Add = true;
	if ( DEBUG_Meeting_Add ) { console.warn('Meeting_Add[scheduleclassId='+scheduleclassId+']'); }
	if ( DEBUG_Meeting_Add ) { console.log('scheduleclassId='+scheduleclassId); }
	
	ScheduleClassDialogSetWidth(2);
	var eMeetingFieldset = document.getElementById('fldMeetings');
	
	// Create the new class meeting id.
	var ClassMeetingAddId = 'add'+	ClassMeetingIndex;
	// Save the new class meeting id.
	var scheduleclassmeetingIds = document.getElementById('hid_scheduleclassmeetingIds').value;
	document.getElementById('hid_scheduleclassmeetingIds').value = scheduleclassmeetingIds+','+ClassMeetingAddId;
	var _ClassMeetingAddId = '_'+ClassMeetingAddId; // Prepend the _ for use below.

	// Create the class meeting div.
	var div = document.createElement('div');
	div.id = 'id_classmeeting'+_ClassMeetingAddId;
	div.className = 'divClassMeeting';
	div.innerHTML = '';
	// Append new meeting in Schedule Class dialog.
	eMeetingFieldset.appendChild(div);
	// Get the meeting form via AJAX.
	URI = '/Schedule/ScheduleClass/ScheduleClassForm.php?task=Meeting';
	//URI += '&scheduleId='+scheduleId;
	//URI += '&departmentId='+departmentId;
	URI += '&scheduleclassId='+scheduleclassId;
	URI += '&scmId='+ClassMeetingAddId;
	//eId = 'dialogDiv';
	preloadText = 'Getting class meeting';
	UpdateLoadingText = preloadText;
	var jsReturnCode = "Meeting_Add_Done("+div.id+")";
	console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+eId+"', '"+preloadText+', '+UpdateReturnCode+"'];");
	ScheduleClassOpenCount = 0;
	UpdateInclude(URI, div.id, preloadText, jsReturnCode);
} // END Meeting_Add.

function Meeting_Add_Done(divId) {
	var DEBUG_Meeting_Add = true;
	if ( dialogDivContents.indexOf('Load OK') !== -1 ) { // Did the dialog contents load OK?
		// Yes.
		// Add one pixel to the marginBottom to deal with browser drawing issues.
		var newClassMeetingDiv = document.getElementById(div.id);
		var style = newClassMeetingDiv.currentStyle || window.getComputedStyle(newClassMeetingDiv);
		var newMarginBottom = parseInt(style.marginBottom.replace('px','')) + 1 + 'px';
		document.getElementById(div.id).style.marginBottom = newMarginBottom;
		if ( DEBUG_Meeting_Add ) { 
			style = newClassMeetingDiv.currentStyle || window.getComputedStyle(newClassMeetingDiv);
			console.log("New marginBottom: " + style.marginBottom);
		}
	} else { // Did the dialog contents load OK?
		// No.
		if ( ScheduleClassOpenCount < 5 ) {
			ScheduleClassOpenCount++;
			
			console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+divId+"', '"+UpdateLoadingText+', '+UpdateReturnCode+"'];");
			
			UpdateInclude(URI, divId);
			setTimeout(function(){Meeting_Add_Done(divId)},ScheduleClassOpenCount*1000);
		} else {
			alert('Never got return from URI='+URI);
		}
	} // Did the dialog contents load OK?
}

// ScheduleViewSettings(makeChange)
// Set schedule settings: calendar_dayview, calendar_timebegin, calendar_timeend, calendar_timeincrement, and calendar_incrementheight.
function ScheduleViewSettings(makeChange) {
	var DEBUG_ScheduleViewSettings = false;
	if ( typeof makeChange === 'undefined' ) { makeChange = ''; }
	if ( DEBUG_ScheduleViewSettings ) { console.log('BEGIN ScheduleViewSettings[makeChange='+makeChange+']'); }
	var eId = 'div_ScheduleFunctionsContainer';
	var e = document.getElementById(eId);
	var eDisplay = e.style.display; // Get schedulecontainer height.
	if ( DEBUG_ScheduleViewSettings ) { console.log('eDisplay='+eDisplay); }
	if ( DEBUG_ScheduleViewSettings && eDisplay === 'block' ) { console.log("e.innerHTML.indexOf('Schedule view settings')="+e.innerHTML.indexOf('Schedule view settings')); }
	if ( makeChange === '' && eDisplay === 'block' && e.innerHTML.indexOf('Schedule view settings') !== -1 ) {
		ScheduleTaskShow('schedule2.js ScheduleViewSettings 187');
		return false;
	} else {
		ScheduleTaskHide();
	}
	switch ( makeChange ) { // switch makeChange.
		case '':
			URI = ROOT_http+'/Schedule/ScheduleViewSettings/ScheduleViewSettings.php';
			var preloadText = '<br><br><span class="bold info">Getting schedule settings. Please wait ...</span><br><br><br>';
			
			console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+eId+"', '"+preloadText+"'];");
			
			UpdateInclude(URI, eId, preloadText);
			//setTimeout(DisplaySchedule,50);
			window.scrollTo(0, 0);
		break;
		case 'Update schedule settings via javascript':
			/** /
			var ScheduleViewDays = 'MTWHF';
var ScheduleDayView = 'Work week';
var ScheduleIncrementHeight = 20;
var ScheduleHeightMultiplier = 1.3333333333333;
var ScheduleTimeBegin = 8;
var ScheduleTimeEnd = 17;
var ScheduleTimeIncrement = 15;
var ScheduleShowConflicts = 1;
			/**/


			
			// Get settings.
			ScheduleDayView = RadioGetValue('calendar_dayview'); // calendar_dayview is work/full week.
			console.log('ScheduleDayView='+ScheduleDayView);
			e = document.getElementById('inp_calendar_timebegin');
			ScheduleTimeBegin = parseInt(e.options[e.selectedIndex].value);
			console.log('ScheduleTimeBegin='+ScheduleTimeBegin);
			e = document.getElementById('inp_calendar_timeend');
			ScheduleTimeEnd = parseInt(e.options[e.selectedIndex].value);
			console.log('ScheduleTimeEnd='+ScheduleTimeEnd);
			e = document.getElementById('inp_calendar_timeincrement');
			ScheduleTimeIncrement = parseInt(e.options[e.selectedIndex].value);
			console.log('ScheduleTimeIncrement='+ScheduleTimeIncrement);
			e = document.getElementById('inp_calendar_incrementheight');
			ScheduleIncrementHeight = parseInt(e.options[e.selectedIndex].value);
			console.log('ScheduleIncrementHeight='+ScheduleIncrementHeight);
			// Need to ensure settings are valid.
			// Calc ScheduleHeightMultiplier.
			ScheduleHeightMultiplier = parseInt(ScheduleIncrementHeight) / parseInt(ScheduleTimeIncrement);
			console.log('ScheduleHeightMultiplier='+ScheduleHeightMultiplier);
			// Calc ScheduleViewDays.
			switch ( ScheduleDayView ) {
				case 'Full week':
					ScheduleViewDays = 'UMTWHFS'; // Should get the string from Weekdays.
				break;
				case 'Work week':
					ScheduleViewDays = 'MTWHF'; // Should get the string from Weekdays.
				break;
			}
			console.log('ScheduleViewDays='+ScheduleViewDays);
			// Save settings in the database.
			URI = '/Schedule/ScheduleViewSettings/ScheduleViewSettings.php?Update=true';
			URI += '&calendar_dayview='+ScheduleDayView.replace(' ','%20');
			URI += '&calendar_timebegin='+ScheduleTimeBegin;
			URI += '&calendar_timeend='+ScheduleTimeEnd;
			URI += '&calendar_timeincrement='+ScheduleTimeIncrement;
			URI += '&calendar_incrementheight='+ScheduleIncrementHeight;
			eId = 'div_ScheduleFunctionsContainer';
			preloadText = 'Saving schedule view settings ...';
			
			console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+eId+"', '"+preloadText+"'];");
			
			UpdateInclude(URI, eId, preloadText);
			//return;
			
			//DisplayScheduleShowHide();
			ScheduleTaskShow('schedule2.js ScheduleViewSettings 263',false);
			//DisplaySchedule('schedule2.js 264');
		break;
		case 'Cancel':
			document.getElementById(eId).style.display = 'none';
			ScheduleTaskShow('schedule2.js ScheduleViewSettings Cancel 268');
		break;
	} // switch makeChange.
	return false;
} // END ScheduleViewSettings.

// DisplayScheduleShowHide()
// Show or hide the scheduleHead, scheduleTimes, and scheduleCells and calculate left and width of cells.
// U & S cells are hidden for 'Work week' view. All cells are shown for 'Full week' view.
// All cells in a row are hidden if before begin or after end times.
// All cells in a row are hidden if the time is not evenly divisible by the ScheduleTimeIncrement.
function DisplayScheduleShowHide() {
	var DEBUG_DisplayScheduleShowHide_Cell = false;
	var DEBUG_DisplayScheduleShowHide_Time = false;
	var DEBUG_DisplayScheduleShowHide_Wide = true;
	//console.log('ScheduleDayView='+ScheduleDayView);
	var scheduleCells;
	var scheduleTimes;
	var scheduleCellindex;
	var csClassName;
	var calendarCells;
	var dayIndex;
	var calendarCell;
	var setWidth;
	var setWidthDivisor;
	var ScheduleTimeBegin_mTime = parseInt(ScheduleTimeBegin) * 60;
	var ScheduleTimeEnd_mTime = parseInt(ScheduleTimeEnd) * 60;
	if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('ScheduleTimeBegin_mTime='+ScheduleTimeBegin_mTime); }
	if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('ScheduleTimeEnd_mTime='+ScheduleTimeEnd_mTime); }

	// BEGIN Show all scheduleHeads on the right day.
	scheduleHeads = document.getElementsByClassName('scheduleHead'); // Get scheduleHeads.
	if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('scheduleHeads.length='+scheduleHeads.length); }
	for ( scheduleHeadindex=0; scheduleHeadindex<scheduleHeads.length; scheduleHeadindex++ ) { // Loop thru scheduleHeads.
		if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('scheduleHeads['+scheduleHeadindex+'].id='+scheduleHeads[scheduleHeadindex].id); }
		var ScheduleCellId = scheduleHeads[scheduleHeadindex].id;
		var ScheduleCellDay = ScheduleCellId.substring(0,1);
		if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('ScheduleCellDay='+ScheduleCellDay); }
		if ( ScheduleCellDay ) { // Is this a scheduleHead day (not the time).
			if ( ScheduleViewDays.indexOf(ScheduleCellDay) !== -1 ) { // Should this day be viewed?
				// Yes, check for scheduleHead only.
				scheduleHeads[scheduleHeadindex].className = 'scheduleHead';
				if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('Show this scheduleHead '+ScheduleCellId); }
			} else { // Should this day be viewed?
				// No, Hide this scheduleHead.
				scheduleHeads[scheduleHeadindex].className = 'scheduleHead hiddenz';
				if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('Hide this scheduleHead '+ScheduleCellId); }
			} // Should this day be viewed?
			//scheduleHeads[scheduleHeadindex].style.width = '50px';
		}
	} // Loop thru scheduleHeads.
	// END Show all scheduleHeads on the right day.

	// BEGIN Show all scheduleTimes between schedule times.
	scheduleTimes = document.getElementsByClassName('scheduleTime'); // Get scheduleTimes.
	if ( DEBUG_DisplayScheduleShowHide_Time ) { console.log('scheduleTimes.length='+scheduleTimes.length); }
	for ( scheduleTimeindex=0; scheduleTimeindex<scheduleTimes.length; scheduleTimeindex++ ) { // Loop thru scheduleTimes.
		if ( DEBUG_DisplayScheduleShowHide_Time ) { console.log('scheduleTimes['+scheduleTimeindex+'].id='+scheduleTimes[scheduleTimeindex].id); }
		var ScheduleTimeId = scheduleTimes[scheduleTimeindex].id;
		var ScheduleTime_mTime = parseInt(ScheduleTimeId.substring(1));
		if ( DEBUG_DisplayScheduleShowHide_Time ) { console.log('ScheduleTime_mTime='+ScheduleTime_mTime); } //ScheduleViewDays
		var ScheduleTime_mTimeIncrement =  parseInt( ScheduleTime_mTime / parseInt(ScheduleTimeIncrement) ) * parseInt(ScheduleTimeIncrement);
		if ( DEBUG_DisplayScheduleShowHide_Time ) { console.log('ScheduleTime_mTimeIncrement='+ScheduleTime_mTimeIncrement); } //ScheduleViewDays
		// Yes, Show this scheduleTime.
		if ( ScheduleTime_mTime === ScheduleTime_mTimeIncrement && ScheduleTime_mTime >= ScheduleTimeBegin_mTime && ScheduleTime_mTime <= ScheduleTimeEnd_mTime ) { // Should this time be viewed?
			// Yes, Show this scheduleTime.
			scheduleTimes[scheduleTimeindex].className = 'scheduleTime';
			if ( DEBUG_DisplayScheduleShowHide_Time ) { console.log('Show this scheduleTime '+ScheduleTimeId); }
		} else {
			// No, Hide this scheduleTime.
			if ( !isNaN(ScheduleTime_mTime) ) {
				scheduleTimes[scheduleTimeindex].className = 'scheduleTime hiddeny';
				if ( DEBUG_DisplayScheduleShowHide_Time ) { console.log('Hide this scheduleTime '+ScheduleTimeId); }
			}
		}
	} // Loop thru scheduleTimes.
	// END Show all scheduleTimes between schedule times.

	// BEGIN Show all scheduleCells on the right day and between schedule times.
	scheduleCells = document.getElementsByClassName('scheduleCell'); // Get scheduleCells.
	if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('scheduleCells.length='+scheduleCells.length); }
	for ( scheduleCellindex=0; scheduleCellindex<scheduleCells.length; scheduleCellindex++ ) { // Loop thru scheduleCells.
		if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('scheduleCells['+scheduleCellindex+'].id='+scheduleCells[scheduleCellindex].id); }
		var ScheduleCellId = scheduleCells[scheduleCellindex].id;
		var ScheduleCellDay = ScheduleCellId.substring(0,1);
		if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('ScheduleCellDay='+ScheduleCellDay); }
		if ( ScheduleCellDay ) {
			var ScheduleCell_mTime = parseInt(ScheduleCellId.substring(1));
			if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('ScheduleCell_mTime='+ScheduleCell_mTime); }//ScheduleViewDays
			var ScheduleCell_mTimeIncrement =  parseInt( ScheduleCell_mTime / parseInt(ScheduleTimeIncrement) ) * parseInt(ScheduleTimeIncrement);
			if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('ScheduleCell_mTimeIncrement='+ScheduleCell_mTimeIncrement); } //ScheduleViewDays
			if ( ScheduleViewDays.indexOf(ScheduleCellDay) !== -1 ) { // Should this day be viewed?
				// Yes, check for scheduleCell only.
				if ( ScheduleCell_mTime === ScheduleCell_mTimeIncrement && ScheduleCell_mTime >= ScheduleTimeBegin_mTime && ScheduleCell_mTime <= ScheduleTimeEnd_mTime ) { // Should this time be viewed?
					// Yes, Show this scheduleCell.
					scheduleCells[scheduleCellindex].className = 'scheduleCell';
					if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('Show this scheduleCell '+ScheduleCellId); }
				} else {
					// No, Hide this scheduleCell.
					scheduleCells[scheduleCellindex].className = 'scheduleCell hiddeny';
					if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('Hide this scheduleCell '+ScheduleCellId); }
				}
			} else { // Should this day be viewed?
				// No, Hide this scheduleCell.
				scheduleCells[scheduleCellindex].className = 'scheduleCell hiddeny';
				if ( DEBUG_DisplayScheduleShowHide_Cell ) { console.log('Hide this scheduleCell '+ScheduleCellId); }
			} // Should this day be viewed?
			//scheduleCells[scheduleCellindex].style.width = '50px';
		}
	} // Loop thru scheduleCells.
	// END Show all scheduleCells on the right day and between schedule times.

	// Calculate left and width for day.
	var SchedulecontainerBounds = elementBounds('schedulecontainer',297);
	if ( DEBUG_DisplayScheduleShowHide_Wide ) { console.log('SchedulecontainerBounds left='+SchedulecontainerBounds.left+' top='+SchedulecontainerBounds.top+' right='+SchedulecontainerBounds.right+' bottom='+SchedulecontainerBounds.bottom+' width='+SchedulecontainerBounds.width+' height='+SchedulecontainerBounds.height); }
	var ScheduleMinuteStart = ScheduleTimeBegin * 60;
	if ( DEBUG_DisplayScheduleShowHide_Wide ) { console.log('ScheduleViewDays='+ScheduleViewDays+' ScheduleMinuteStart='+ScheduleMinuteStart); }
	for ( var d1=0; d1<ScheduleViewDays.length; d1++ ) { // Loop thru ScheduleViewDays.
		var day = ScheduleViewDays[d1];
		var tdBounds = elementBounds(day+ScheduleMinuteStart,302);
		if ( DEBUG_DisplayScheduleShowHide_Wide ) { console.log(day+' tdBounds left='+tdBounds.left+' top='+tdBounds.top+' right='+tdBounds.right+' bottom='+tdBounds.bottom+' width='+tdBounds.width+' height='+tdBounds.height); }
		ScheduleTop = tdBounds.top;
		ScheduleDayTimePositions[day] = { left:tdBounds.left, width:tdBounds.width };
	} // Loop thru ScheduleViewDays.
	if ( DEBUG_DisplayScheduleShowHide_Wide ) { console.log('ScheduleTop='+ScheduleTop+' ScheduleDayTimePositions='+JSON.stringify(ScheduleDayTimePositions)); }

} // END DisplayScheduleShowHide.

// ScheduleClassDialogSetWidth(meetingCount)
// Set the wicth of the Schedule Class dialogDiv.
function ScheduleClassDialogSetWidth(meetingCount) {
	var DEBUG_ScheduleClassDialogSetWidth = true;
	if ( DEBUG_ScheduleClassDialogSetWidth ) { console.warn('ScheduleClassDialogSetWidth[meetingCount='+meetingCount+']'); }
		// BEGIN Increase width of the dialogDiv to allow new class meeting to float.
	// Also count the number of current class meetings.
	ClassMeetingIndex = 0;
	// Get the bounds and offsetWidth of the meetings fieldset element.
	var eMeetingFieldset = document.getElementById('fldMeetings');
	var MeetingFieldsetBounds = elementBounds(eMeetingFieldset,'schedule2.js 13'); 
	if ( DEBUG_ScheduleClassDialogSetWidth ) { console.log('MeetingFieldsetBounds='+JSON.stringify(MeetingFieldsetBounds)); }
	if ( DEBUG_ScheduleClassDialogSetWidth ) { console.log('eMeetingFieldset.offsetWidth='+eMeetingFieldset.offsetWidth); }
	var CurrentClassMeetingsMaxWidth = 0; // Will hold the max width of the current class meetings.
	var aCurrentClassMeetings = document.getElementsByClassName('divClassMeeting'); // Get the current class meeting containers.
	for ( var mi=0; mi<aCurrentClassMeetings.length; mi++ ) { // Loop thru the current class meeting containers.
		if ( DEBUG_ScheduleClassDialogSetWidth ) { console.log('aCurrentClassMeetings['+mi+'].id='+aCurrentClassMeetings[mi].id); }
		if ( aCurrentClassMeetings[mi].offsetWidth > CurrentClassMeetingsMaxWidth ) {
			CurrentClassMeetingsMaxWidth = aCurrentClassMeetings[mi].offsetWidth; // Keep the max width of the current class meetings.
		}
		ClassMeetingIndex++; // Add 1 to the class meeting index.
	} // Loop thru the current class meeting containers.
	if ( meetingCount > 2 ) {
			meetingCount = 2;
			console.log('meetingCount changed to 2');
		}
	var NeededFieldsetWidth;
	if ( DEBUG_ScheduleClassDialogSetWidth ) {
		NeededFieldsetWidth = ( CurrentClassMeetingsMaxWidth + 17 ) * meetingCount; // 15px left margin + 2* 1px border.
		console.log('CurrentClassMeetingsMaxWidth='+CurrentClassMeetingsMaxWidth+' NeededFieldsetWidth='+NeededFieldsetWidth+' MeetingFieldsetBounds.width='+MeetingFieldsetBounds.width);
	}
	if ( NeededFieldsetWidth > MeetingFieldsetBounds.width ) { // Is there room for another class meeting on the right?
		var NewMeetingFieldsetWidth = NeededFieldsetWidth + 21; // Add 15 for padding-right and a bogus 6 more.
		console.log('NewMeetingFieldsetWidth='+NewMeetingFieldsetWidth);
		eMeetingFieldset.style.width = NewMeetingFieldsetWidth + 'px';
		MeetingFieldsetBounds = elementBounds(eMeetingFieldset,'schedule2.js 13'); 
		if ( DEBUG_ScheduleClassDialogSetWidth ) { console.log('MeetingFieldsetBounds='+JSON.stringify(MeetingFieldsetBounds)); }
		if ( DEBUG_ScheduleClassDialogSetWidth ) { console.log('eMeetingFieldset.offsetWidth='+eMeetingFieldset.offsetWidth); }
	} // Is there room for another class meeting on the right?
	// END Increase width of the dialogDiv to allow new class meeting to float.
} // END ScheduleClassDialogSetWidth.

// ScheduleClass_RemoveClassMeetingVerify(scmId, thisTask)
// Verify removal of class meeting.
function ScheduleClass_RemoveClassMeetingVerify(scmId, thisTask) {
	var DEBUG_ScheduleClass_RemoveClassMeetingVerify = true;
	if ( DEBUG_ScheduleClass_RemoveClassMeetingVerify ) { console.log('BEGIN ScheduleClass_RemoveClassMeetingVerify[scmId='+scmId+' thisTask='+thisTask+']'); }
	if ( typeof thisTask === 'undefined' ) {
		if ( DEBUG_ScheduleClass_RemoveClassMeetingVerify ) { console.log('Display div_RemoveClassMeetingVerify_'+scmId); }
		document.getElementById('div_RemoveClassMeetingVerify_'+scmId).style.display = 'block';
	} else if ( thisTask ) {
		//if ( DEBUG_ScheduleClass_RemoveClassMeetingVerify ) { console.log('No clicked.'); }
		document.getElementById('div_RemoveClassMeetingVerify_'+scmId).style.display = 'none';
		
	}
} // END ScheduleClass_RemoveClassMeetingVerify.

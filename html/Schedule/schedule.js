// Schedule/schedule.js

// _Initialize() .................................................. Initialize js.
// _Resized() ..................................................... Resize js.
// _Scrolled() .................................................... Scroll js.
// AddEventListeners() ............................................ Add event listeners to the schedule classes.
// ClassmeetingArranged(e) ........................................ Show or hide class meeting time and days form elements based on Arranged checked.
// ClassmeetingOffCampus(e) ....................................... Show or hide class meeting rooms form elements based on Off campus checked.
// ClearTextSelection() ........................................... Clear any text selection on the page.
// ConvertMinutesToTime(dayminutes, flags) ........................ Convert day minutes to time. Default is 24 hr clock with two digit hour and ':00' seconds.
// ConvertTimeToMinutes(timeofday) ................................ Convert time to minutes. Seconds will be ignored if present.
// DisplaySchedule(by) ............................................ Display the classes on the schedule.
// DisplaySchedule_Begin() ........................................ Set scheduleTime, scheduleCell, and scheduleHead widths and heights.
// DisplaySchedule_Highlight_Conflicts() .......................... Check schedule for class Degree/year, room, or instructor conflicts and change meeting styles to show them.
// Events_Add( day ) .............................................. Add events for this day to EVENTS_TO_DISPLAY for positioning schedule classes.
// Events_Overlapping(day) ........................................ Check all events for overlap and add to EVENTS_OVERLAPPING.
// Events_Prepare( day ) .......................................... Adds additional properties to EVENTS_TO_DISPLAY, so that they can be positioned properly on the schedule.
// Events_Prepare_Check( overlapObject, eventKey, day ) ........... Calculate left and width of overlapping events.
// Events_Prepare_MaxOverlap(overlapObject, eventKey) ............. Calculate max overlap length for positioning schedule classes.
// Events_Sort( EVENT ) ........................................... Sorts array of event objects by their begin and position paremeters.
// Print() ........................................................ Print the contents of the 'eId' element.
// ScheduleChange() ............................................... Display the schedule change form.
// ScheduleChange_ChangeScheduleButtonCheck(e) .................... Enable/disable Change schedule button.
// ScheduleChange_CreateScheduleButtonCheck(e) .................... Enable/disable Create schedule button.
// ScheduleClassDialogDrag(e) ..................................... Handles the drag event from the Schedule Class dialog.
// ScheduleClassDragCheck(evt) .................................... Determine if this is a click or a drag of a schedule class.
// ScheduleClassDragCheckWait(evt) ................................ Wait 50 ms to ensure this is a drag vs a click.
// ScheduleClassDragBegin(evt) .................................... Begin the schedule class drag.
// ScheduleClassDragMove(evt) ..................................... Follow the mouse with the schedule class being dragged.
// ScheduleClassDragMoveAbortCheck(evt) ........................... Check for ESC key to abort sheedule class drag.
// ScheduleClassDrop(evt) ......................................... handle schedule class drop.
// ScheduleClass_Open(scheduleId, departmentId, scheduleclassId) .. Open the dialogDiv with the scheduleclass info loaded.
// ScheduleClass_OpenAdd() ........................................ Add a class to the schedule.
// ScheduleClass_OpenEdit(evt) .................................... Edit the class.
// ScheduleClass_RemoveClassVerify(thisTask) ...................... Verify removal of schedule class.
// ScheduleImportClasses(thisTask) ................................ Handle class import from another schedule.
// ScheduleImportClasses_ScheduleButtonCheck(e) ................... Enable/disable Change schedule button.
// ScheduleImportClasses_ParseButtonCheck(e) ...................... Enable/disable Change schedule button.
// ScheduleTaskHide() ............................................. Hide the schedule and display the div_ScheduleFunctionsContainer.
// ScheduleTaskShow() ............................................. Show the schedule and hide the div_ScheduleFunctionsContainer.
// ScheduleViewSettings(makeChange) ............................... Set schedule settings.
// ScheduleClass_ScrollHandler() .................................. Reposition the Schedule Class dialog on page scroll
// SetClassEndTime(e) ............................................. Set the class end time based on the # credits / meeting days.
// SetupBuildingSelectOptions(e) .................................. Set the options for the building select.
// SetupInstructorOptions() ....................................... Set the options for the next instructor select.
// SetupNextCampusSelectOptions(scmId, campusIndex) ............... Set the options for the next campus select.
// SetupRoomSelectOptions() ....................................... Set the options for the room select.
// ShowInstructorButton(e) ........................................ Show + add instructor button.
// ShowInstructorNext(e) .......................................... Show next select element for instructor.
// ShowNextCampus(scmId, nextCampusIndex) ......................... Show next select element for campus.
// ShowRoomButton(scmId, campusIndex) ............................. Show + add room button.
// SidenavToggle(sidenavClass) .................................... Show / hide side nav sub menu.

//"use strict";

// Variables
var campusId = 0;
var bcrt = 0; // Used by AutoscrollPage() by Garrett Wiley.
var buildingId = 0;
var roomId = 0;
var CampusIdsSelected = [];
var InstructorIdsSelected = [];
var dragElementTL;
var schedulecontainerTL;
var scrollTL = {};
var viewportTL = {};
var mXprevious;
var mYprevious;
var mousedownFlag = '';
var mousedownTimer = 0;
var EVENTS_TO_DISPLAY;	// Events to be rendered on the schedule
var EVENTS_OVERLAPPING;	// Events as keys with an array of their overlapping events.
var EVENTS_READY;				// Events with position and width set.
var ScheduleDayTimePositions = {};
var ScheduleTop;
var ScheduleClassOpenCount = 0;
var SchedulecontainerBounds;
var currentOpenScheduleClassId;
var ScheduleInstructions = '<br><span class="actionback nowrap">Click to edit.</span> <span class="action nowrap">--or--</span><br><span class="actionback nowrap">Mouse-down / drag / drop to move.</span>';

var _Initialize = function() {
	console.warn('_Initialize[] schedule.js');
	SidenavPosition();
	AddEventListeners();
	DisplaySchedule('_Initialize[] schedule.js');
};

var _Resized = function() {
	console.warn('_Resized[] schedule.js');
	SidenavPosition();
	console.log("document.getElementById('schedulecontainer').style.display="+document.getElementById('schedulecontainer').style.display);
	if ( document.getElementById('schedulecontainer').style.display !== 'none' ) { setTimeout(DisplaySchedule,50); }
};

var _Scrolled = function() {
	//console.warn('_Scrolled[] schedule.js');
	SidenavPosition();
};

// AddEventListeners()
// Add event listeners to the schedule classes.
function AddEventListeners() {
	var DEBUG_AddEventListeners = false;
	if ( DEBUG_AddEventListeners ) { console.warn('AddEventListeners[]'); }
	//window.addEventListener('resize',_Resized); // Add resize to re-display the schedule. Resized DisplaySchedule
	//document.addEventListener('scroll',_Scrolled); // Add resize to re-display the schedule.
	var calendar_classes = document.getElementsByClassName('calendar_class');
	for ( var i=0; i<calendar_classes.length; i++) {
		var this_calendar_class = calendar_classes[i];
		if ( DEBUG_AddEventListeners ) { console.log('Adding click EventListener for '+this_calendar_class.id); }
		this_calendar_class.addEventListener('click',ScheduleClass_OpenEdit); // Add click for class meeting edit.
		if ( DEBUG_AddEventListeners ) { console.log('Adding mousedown EventListener for '+this_calendar_class.id); }
		this_calendar_class.addEventListener('mousedown',ScheduleClassDragCheck); // Add mousedown for drag and drop.
	}
} // END AddEventListeners.

// ClassmeetingArranged(e)
// Show or hide class meeting time and days form elements based on Arranged checked.
function ClassmeetingArranged(e) { // id_scheduleclassmeetingArranged_240 id_scheduleclassmeetingArranged_add1
	var DEBUG_ClassmeetingArranged = true;
	if ( DEBUG_ClassmeetingArranged ) { console.warn('ClassmeetingArranged['+e.id+']'); }
	var eIdParts = e.id.split('_');
	var eId = eIdParts[2];
	if ( typeof eIdParts[3] !== 'undefined' ) { eId = 'add'+eIdParts[3]; }
	if ( DEBUG_ClassmeetingArranged ) { console.log('eId='+eId); }
	
	//console.log('e.checked='+e.checked);
	if ( e.checked ) {
		if ( document.getElementById('id_meetingTimes_'+eId) ) {
			document.getElementById('id_meetingTimes_'+eId).style.display = 'none';
			document.getElementById('id_meetingDays_'+eId).style.display = 'none';
		}
	} else {
		if ( document.getElementById('id_meetingTimes_'+eId) ) {
			document.getElementById('id_meetingTimes_'+eId).style.display = 'block';
			document.getElementById('id_meetingDays_'+eId).style.display = 'block';
		}
	}
} // END ClassmeetingArranged.

// ClassmeetingOffCampus(e)
// Show or hide class meeting rooms form elements based on Off campus checked.
function ClassmeetingOffCampus(e) {
	var DEBUG_ClassmeetingOffCampus = false;
	if ( DEBUG_ClassmeetingOffCampus ) { console.warn('ClassmeetingOffCampus['+e.id+']'); }
	if ( DEBUG_ClassmeetingOffCampus ) { console.log('e.checked='+e.checked); }
	// Get divRoomsId from checkbox id.
	var divRoomsId = e.id.split('_');
	divRoomsId = 'divRooms_'+divRoomsId[1];
	if ( DEBUG_ClassmeetingOffCampus ) { console.log('divRoomsId='+divRoomsId); }
	if ( e.checked ) {
		if ( document.getElementById(divRoomsId) ) {
			if ( DEBUG_ClassmeetingOffCampus ) { console.log(divRoomsId+' hidden'); }
			document.getElementById(divRoomsId).style.display = 'none';
		}
	} else {
		if ( document.getElementById(divRoomsId) ) {
			if ( DEBUG_ClassmeetingOffCampus ) { console.log(divRoomsId+' shown'); }
			document.getElementById(divRoomsId).style.display = 'block';
		}
	}
} // END ClassmeetingOffCampus.

// ClearTextSelection()
// Clear any text selection on the page.
function ClearTextSelection() {
	//console.log('Clear text selection.');
	if ( document.selection ) {
    //console.log('document.selection'); 
		document.selection.empty();
	} else if ( window.getSelection ) {
		//console.log('window.getSelection');
		window.getSelection().removeAllRanges();
	}
} // END ClearTextSelection.

// ConvertMinutesToTime(dayminutes, flags)
// Convert day minutes to time. Default is 24 hr clock with two digit hour and ':00' seconds.
// dayminutes = day minutes.
//      flags = time format options.
//              a = 12 hour format with 'am' or 'pm' meridiem appended. Overrides P.
//              h = One digit hour possible.
//              P = 12 hour format with 'AM' or 'PM' meridiem appended.
//              s = Do not append ':00' seconds.
//              _ = Put a space before the meridiem. Has no effect without a or P.
//              . = Put dot after meridiem letters (a.m.). Has no effect without a or P.
// Examples using 810 dayminutes:
// flags = return value
//  none = 13:30:00
//     a = 01:30:00pm
//    ah = 1:30:00pm
//   ah_ = 1:30:00 pm
//   ah. = 1:30:00p.m.
//  ah_. = 1:30:00 p.m.
//   ahs = 1:30pm
//  ahs_ = 1:30 pm
//  ahs. = 1:30p.m.
// ahs_. = 1:30 p.m.
//    a_ = 01:30:00 pm
//    a. = 01:30:00p.m.
//   a_. = 01:30:00 p.m.
//    as = 01:30pm
//   as_ = 01:30 pm
//   as. = 01:30p.m.
//  as_. = 01:30 p.m.
//     P = Same as 'a' except the meridiem is in uppercase.
//     s = 13:30
function ConvertMinutesToTime(dayminutes, flags) {
	var DEBUG_ConvertMinutesToTime = true;
	if ( typeof flags === 'undefined' ) { flags = ''; }
	var hr = parseInt(parseInt(dayminutes)/60);
	var mn = parseInt(dayminutes) - (hr*60);
	if ( DEBUG_ConvertMinutesToTime ) { console.log('hr='+hr+' mn='+mn+' flags='+flags); }
	var AMPM = '';
	var meridiemDot = '';
	var meridiemA = '';
	var meridiemM = '';
	var meridiemP = '';
	var meridiemSpace = '';
	if ( flags.indexOf('a') !== -1 ) { meridiemA = 'a'; meridiemM = 'm'; meridiemP = 'p'; } else { if ( flags.indexOf('P') !== -1 ) { meridiemA = 'A'; meridiemM = 'M'; meridiemP = 'P'; } }
	if ( meridiemA !== '' ) {
		if ( flags.indexOf('_') !== -1 ) { meridiemSpace = ' '; }
		if ( flags.indexOf('.') !== -1 ) { meridiemDot = '.'; }
	}
	if ( meridiemA !== '' ) {
		if ( hr > 12 ) {
			hr -= 12;
		} else {
			if ( hr === 0 ) {
				hr += 12;
			}
		}
		AMPM = meridiemSpace + meridiemA + meridiemDot + meridiemM + meridiemDot;
	}
	hr = hr.toString(); if ( hr.length < 2 && flags.indexOf('h') === -1 ) { hr = '0'+hr; }
	mn = mn.toString(); if ( mn.length < 2 ) { mn = '0'+mn; }
	if ( DEBUG_ConvertMinutesToTime ) { console.log('hr='+hr+' mn='+mn+' AMPM='+AMPM); }
	var timeofday = hr + ':' + mn;
	if ( flags.indexOf('s') !== -1 ) { timeofday += ':00'; }
	return timeofday + AMPM;
}

// ConvertTimeToMinutes(timeofday)
// Convert time to minutes. Seconds will be ignored if present.
// i.e. 11:30:00 returns 690.
// timeofday = the time to convert.
function ConvertTimeToMinutes(timeofday) {
	var DEBUG_ConvertTimeToMinutes = false;
	var PM = ( timeofday.toUpperCase().indexOf('P') !== -1 );
	var timeParts = timeofday.toUpperCase().replace('A','').replace('M','').replace('P','').split(':');
	if ( DEBUG_ConvertTimeToMinutes ) { console.log('PM='+PM+' timeParts='+timeParts); }
	if ( PM && parseInt(timeParts[0]) !== 12 ) { timeParts[0] = parseInt(timeParts[0]) + 12; }
	var DayMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
	return DayMinutes;
} // END ConvertTimeToMinutes.

// DisplaySchedule(by)
// Display the classes on the schedule.
// Class meetings are converted to EVENTS for each day and then displayed.
function DisplaySchedule(by) {
	var DEBUG_DisplaySchedule = true;
	if ( true || DEBUG_DisplaySchedule ) { console.warn('DisplaySchedule[by='+by+'] ScheduleShowConflicts='+ScheduleShowConflicts); }
	//return; // Uncomment to stop schedule display.
	DisplaySchedule_Begin();
	DisplayScheduleShowHide();
	for ( var d=0; d<ScheduleViewDays.length; d++ ) { // Loop thru schedule days. work: M=0, T=1, W=2, H=3, F=4 full: U=0, M=1, T=2, W=3, H=4, F=5, S=6 // ScheduleViewDays.length
		var day = ScheduleViewDays[d];
		EVENTS_TO_DISPLAY = [];
		EVENTS_OVERLAPPING = {};
		EVENTS_READY = {};
		if ( Events_Add(day) ) {
			Events_Overlapping(day);
			Events_Prepare(day);
			if ( DEBUG_DisplaySchedule ) { console.log('EVENTS_TO_DISPLAY='+JSON.stringify(EVENTS_TO_DISPLAY)); }
		}
		for ( var ci=0; ci<EVENTS_TO_DISPLAY.length; ci++ ) { // Loop thru EVENTS_TO_DISPLAY.
			var thisMeeting = EVENTS_TO_DISPLAY[ci];
			//if ( DEBUG_DisplaySchedule ) { console.log('thisMeeting.divId='+thisMeeting.divId); }
			if ( document.getElementById(thisMeeting.divId) ) {
				classMeetingElement = document.getElementById(thisMeeting.divId);
				console.log('281 thisMeeting.divId='+thisMeeting.divId+ 'thisMeeting.top='+thisMeeting.top+' ScheduleDayTimePositions['+thisMeeting.day+'].left='+ScheduleDayTimePositions[thisMeeting.day].left);
				var styleLeft = thisMeeting.left + ScheduleDayTimePositions[thisMeeting.day].left;
				classMeetingElement.style.left    = styleLeft + 'px';
				classMeetingElement.style.width   = thisMeeting.width - 2 + 'px';
				classMeetingElement.style.display = 'block';
				//if ( classMeetingElement.id === 'calendar_class_8_M600' ) {
					var styleTop = thisMeeting.top * ScheduleHeightMultiplier + ScheduleTop;
					console.log('281 thisMeeting.divId='+thisMeeting.divId+ 'thisMeeting.top='+thisMeeting.top+' ScheduleHeightMultiplier='+ScheduleHeightMultiplier+' ScheduleTop='+ScheduleTop+' styleTop='+styleTop);
				//}
				classMeetingElement.style.top     = styleTop + 'px';//thisMeeting.top * ScheduleHeightMultiplier + ScheduleTop + 'px'; // + 1
				classMeetingElement.style.height  = thisMeeting.height * ScheduleHeightMultiplier + 'px';
				var ceb = elementBounds(classMeetingElement);
				console.log('bounds = '+ JSON.stringify(ceb));
			} else {
				console.info("\t"+thisMeeting.divId+' not found.');
			}
		} // Loop thru EVENTS_TO_DISPLAY.
	} // Loop thru schedule days.
	DisplaySchedule_View();
} // END DisplaySchedule.

// DisplaySchedule_Begin()
// Set scheduleTime, scheduleCell, and scheduleHead widths and heights.
function DisplaySchedule_Begin() {
	var DEBUG_DisplaySchedule_Begin = true;
	// BEGIN Calculate scheduleCell width.
	// Hide the schedule so it does not effect width of page.
	document.getElementById('schedulecontainer').style.display = 'none';
	// Show calendarCells so the scheduleCell widths can be calculated.
	// Show the schedule table.
	document.getElementById('tbl_scheduleTable').style.display = 'table';
	calendarCells = document.getElementsByClassName('calendarCell');
	if ( DEBUG_DisplaySchedule_Begin ) { console.log('calendarCells.length='+calendarCells.length); }
	for ( dayIndex=0; dayIndex<calendarCells.length; dayIndex++ ) {
		//if ( DEBUG_DisplaySchedule_Begin ) { console.log('calendarCells['+dayIndex+'].title='+calendarCells[dayIndex].title+' .className='+calendarCells[dayIndex].className+' .offsetWidth='+calendarCells[dayIndex].offsetWidth); }
		if ( ScheduleViewDays.indexOf(calendarCells[dayIndex].title.substr(0,1)) !== -1 ) { // Is this day in ScheduleViewDays ('UMTWHFS' or 'MTWHF').
			if ( DEBUG_DisplaySchedule_Begin ) { console.log('Show '+calendarCells[dayIndex].title); }
			calendarCells[dayIndex].className = 'calendarCell';
		} else {
			if ( DEBUG_DisplaySchedule_Begin ) { console.log('Hide '+calendarCells[dayIndex].title); }
			calendarCells[dayIndex].className = 'calendarCell hidden';
		}
	} // Is this day in ScheduleViewDays ('UMTWHFS' or 'MTWHF').
	// Calculate scheduleCell width.
	if ( DEBUG_DisplaySchedule_Begin ) { console.log('calendarCells[3].className='+calendarCells[3].className+' calendarCells[3].offsetWidth='+calendarCells[3].offsetWidth); }
	var setWidth = parseInt(calendarCells[3].offsetWidth);
	var setWidthDivisor = 2;
	var calculatedWidth = parseInt(setWidth/setWidthDivisor) * setWidthDivisor - 4;
	if ( DEBUG_DisplaySchedule_Begin ) { console.log('calculatedWidth='+calculatedWidth); }
	// Hide the schedule table.
	document.getElementById('tbl_scheduleTable').style.display = 'none';
	// Show the schedule.
	document.getElementById('schedulecontainer').style.display = 'block';
	// END Calculate scheduleCell width.
	
	// Set scheduleTime heights.
	var scheduleTimes = document.getElementsByClassName('scheduleTime');
	if ( DEBUG_DisplaySchedule_Begin ) { console.log('scheduleTimes.length='+scheduleTimes.length); }
	for ( var scheduleCellindex=0; scheduleCellindex<scheduleTimes.length; scheduleCellindex++ ) {
		if ( scheduleTimes[scheduleCellindex].className.indexOf('scheduleHead') === -1 ) { // Is this a schedule time (not the head 'Time')?
			scheduleTimes[scheduleCellindex].style.height = ScheduleIncrementHeight + 'px';
		} // Is this a schedule time (not the head 'Time')?
	} // Is this a schedule time (not the head 'Time')?
	// Set scheduleCell heights and widths.
	var scheduleCells = document.getElementsByClassName('scheduleCell');
	if ( DEBUG_DisplaySchedule_Begin ) { console.log('scheduleCells.length='+scheduleCells.length); }
	for ( scheduleCellindex=0; scheduleCellindex<scheduleCells.length; scheduleCellindex++ ) {
		scheduleCells[scheduleCellindex].style.width = calculatedWidth + 'px';
		scheduleCells[scheduleCellindex].style.height = ScheduleIncrementHeight + 'px';
		//scheduleCells[scheduleCellindex].style.lineHeight = ScheduleIncrementHeight - 5 + 'px';
	}
	// Set scheduleHead widths.
	var scheduleHeads = document.getElementsByClassName('scheduleHead');
	if ( DEBUG_DisplaySchedule_Begin ) { console.log('scheduleHeads.length='+scheduleHeads.length); }
	for ( scheduleCellindex=0; scheduleCellindex<scheduleHeads.length; scheduleCellindex++ ) {
		if ( scheduleHeads[scheduleCellindex].className.indexOf('scheduleTime') === -1 ) { // Is this a weekday (not the time).
			scheduleHeads[scheduleCellindex].style.width = calculatedWidth + 'px';
		} // Is this a weekday (not the time).
	}
} // END DisplaySchedule_Begin.

// DisplaySchedule_Highlight_Conflicts();
// Check schedule for class 1) Degree/year, 2) room, or 3) Instructor conflicts and change meeting styles to show them.
function DisplaySchedule_Highlight_Conflicts() {
	var DEBUG_DisplaySchedule_Highlight_Conflicts = false;
	if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.warn('DisplaySchedule_Highlight_Conflicts[]'); }
	//return;
	var	calendar_class_div,
			calendar_class_div_base,
			calendar_class_div_Id,
			courseId1,
			courseId2,
			courseNumber1,
			courseNumber2,
			credential1,
			credential2,
			credentialConflict,
			credentials1,
			credentials2,
			day,
			d1,
			d2,
			eoId,
			instructor1,
			instructor2,
			instructorConflict,
			instructors1,
			instructors2,
			m1,
			m2,
			r1,
			r2,
			room1,
			room2,
			rooms1,
			rooms2,
			scId1,
			scId2;
	/** /
	if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { // Is DEBUG on?
		// Dump meetings data for DEBUG.
		console.info("\t"+day+' ClassMeetings:');
		for ( scId1 in ScheduleClass ) {if(ScheduleClass.hasOwnProperty(scId1)) { // Loop thru classes.
			for ( m1=0; m1<ClassMeeting[scId1].length; m1++ ) { // Loop thru class meetings.
				for ( d1=0; d1<ClassMeeting[scId1][m1].days.length; d1++ ) { // Loop thru days.
					if ( ClassMeeting[scId1][m1].days[d1] === day ) {
						console.log("\t"+'ClassMeeting['+scId1+']['+m1+']='+JSON.stringify(ClassMeeting[scId1][m1]));
					}
				}
			} // Loop thru class meetings.
		}} // Loop thru classes.
	} // Is DEBUG on?
	/**/
	for ( var ScheduleViewDayIndex=0; ScheduleViewDayIndex<ScheduleViewDays.length; ScheduleViewDayIndex++ ) { // Loop thru ScheduleViewDays days.
		day = ScheduleViewDays[ScheduleViewDayIndex];
		// Highlight multiple and none.
		if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info('Check '+day+' for multiple or none.'); }
		for ( scId1 in ScheduleClass ) {if(ScheduleClass.hasOwnProperty(scId1)) { // Loop thru 1st classes.
			calendar_class_div_base = 'calendar_class_'+scId1+'_';
			for ( m1=0; m1<ClassMeeting[scId1].length; m1++ ) { // Loop thru 1st class meetings.
				if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+'ClassMeeting['+scId1+']['+m1+']='+JSON.stringify(ClassMeeting[scId1][m1])); }
				for ( d1=0; d1<ClassMeeting[scId1][m1].days.length; d1++ ) { // Loop thru days.
					if ( day === ClassMeeting[scId1][m1].days[d1] ) {
						courseId1 = ScheduleClass[scId1].courseId;
						courseNumber1 = Course[courseId1].Dept + Course[courseId1].Number;
						credentials1 = Course[courseId1].credentials;
						instructors1 = ClassMeeting[scId1][m1].instructors;
						rooms1 = ClassMeeting[scId1][m1].rooms;
						var ccmTime = ConvertTimeToMinutes(ClassMeeting[scId1][m1].bTime);

						calendar_class_div_Id = calendar_class_div_base + ClassMeeting[scId1][m1].days[d1] + ccmTime;//ClassMeeting[scId1][m1].tdMinute;
						if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+'Checking '+courseNumber1+' '+calendar_class_div_Id); }
						// Check credentials.
						if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t\t"+'ClassMeeting['+scId1+']['+m1+']='+JSON.stringify(ClassMeeting[scId1][m1])); }
						calendar_class_div = document.getElementById(calendar_class_div_Id);
						if ( !credentials1.length ) {
							if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t"+'No credential'); }
							if ( calendar_class_div.className.indexOf('class_Credential_None') === -1 ) {
								calendar_class_div.className += ' class_Credential_None';
							}
						}
						// Check instructors.
						if ( instructors1.length ) {
							if ( instructors1.length > 1 ) {
								if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t"+'Multiple instructors'); }
								if ( calendar_class_div.className.indexOf('class_Instructor_Multiple') === -1 ) {
									calendar_class_div.className += ' class_Instructor_Multiple';
								}
							}
						} else {
							if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t"+'No instructor'); }
							if ( calendar_class_div.className.indexOf('class_Instructor_None') === -1 ) {
								calendar_class_div.className += ' class_Instructor_None';
							}
						}
						// Check rooms.
						if ( rooms1.length ) {
							if ( rooms1.length > 1 ) {
								if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t"+'Multiple rooms'); }
								if ( calendar_class_div.className.indexOf('class_Room_Multiple') === -1 ) {
									calendar_class_div.className += ' class_Room_Multiple';
								}
							}
						} else {
							if ( ClassMeeting[scId1][m1].onCampus === '1' ) {
								if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t"+'No room'); }
								if ( calendar_class_div.className.indexOf('class_Room_None') === -1 ) {
									calendar_class_div.className += ' class_Room_None';
								}
							}
						}
					}
				} // Loop thru days.
			} // Loop thru 1st class meetings.
		}}
		// Highlight conflicts.
		if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info('Check '+day+' for conflicts'); }
		for ( eoId in EVENTS_OVERLAPPING ) {if(EVENTS_OVERLAPPING.hasOwnProperty(eoId)) { // Loop thru 1st EVENTS_OVERLAPPING.
			//console.log('EVENTS_OVERLAPPING['+eo+']='+JSON.stringify(EVENTS_OVERLAPPING[eo]));
			//console.log('EVENTS_OVERLAPPING['+eoId+'].scmId='+EVENTS_OVERLAPPING[eoId].scmId);
			for ( scId1 in ScheduleClass ) {if(ScheduleClass.hasOwnProperty(scId1)) { // Loop thru 1st classes.
				calendar_class_div_base = 'calendar_class_'+scId1+'_';
				for ( m1=0; m1<ClassMeeting[scId1].length; m1++ ) { // Loop thru 1st class meetings.
					if ( eoId === ClassMeeting[scId1][m1].scmId ) { // Does the EVENTS_OVERLAPPING scmId match the ClassMeeting scmId?
						courseId1 = ScheduleClass[scId1].courseId;
						courseNumber1 = Course[courseId1].Dept + Course[courseId1].Number;
						credentials1 = Course[courseId1].credentials;
						instructors1 = ClassMeeting[scId1][m1].instructors;
						rooms1 = ClassMeeting[scId1][m1].rooms;
						var ccmTime = ConvertTimeToMinutes(ClassMeeting[scId1][m1].bTime);
						calendar_class_div_Id = calendar_class_div_base + day + ccmTime;//ClassMeeting[scId1][m1].tdMinute;
						calendar_class_div = document.getElementById(calendar_class_div_Id);
						if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+'Checking '+courseNumber1+' '+calendar_class_div_Id); }
						if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+"\t"+scId1+' '+courseNumber1+' '+courseId1+' credentials1='+JSON.stringify(credentials1)+' instructors1='+instructors1+' rooms1='+rooms1); }
						//console.log('EVENTS_OVERLAPPING['+eoId+'].overlaps='+JSON.stringify(EVENTS_OVERLAPPING[eoId].overlaps));
						if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+"\t"+ScheduleClass[scId1].Course+' sDate='+ClassMeeting[scId1][m1].sDate+' eDate='+ClassMeeting[scId1][m1].eDate); }
						for ( oi=0; oi<EVENTS_OVERLAPPING[eoId].overlaps.length; oi++ ) { // Loop thru EVENTS_OVERLAPPING overlaps. 
							scId2 = EVENTS_OVERLAPPING[eoId].overlaps[oi].scId;
							if ( ScheduleClass[scId1].courseId !== ScheduleClass[scId2].courseId ) { // Is this not the same course?
								//calendar_class_div_Id = calendar_class_div_base + EVENTS_OVERLAPPING[eoId].overlaps[oi].day + ClassMeeting[scId1][m1].tdMinute;
								if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t\t\t"+'calendar_class_div_Id='+calendar_class_div_Id); }
								//calendar_class_div = document.getElementById(calendar_class_div_Id);
								//console.log('EVENTS_OVERLAPPING[eoId].overlaps[oi].scId='+scId2);
								courseId2 = ScheduleClass[scId2].courseId;
								courseNumber2 = Course[courseId2].Dept + Course[courseId2].Number;
								credentials2  = Course[courseId2].credentials;
								instructors2 = ClassMeeting[scId2][m1].instructors;
								rooms2 = ClassMeeting[scId2][m1].rooms;
								if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+"\t"+'credentials2='+JSON.stringify(credentials2)); }
								//+' credentials1='+JSON.stringify(credentials2)+' instructors2='+instructors2+' rooms2='+rooms2)
								for ( m2=0; m2<ClassMeeting[scId2].length; m2++ ) { // Loop thru 2nd class meetings.
									//for ( d2=0; d2<ClassMeeting[scId2][m2].days.length; d2++ ) { // Loop thru 2nd class meeting days.
									if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+"\t"+'Overlaps '+courseNumber2+' sDate='+ClassMeeting[scId2][m2].sDate+' eDate='+ClassMeeting[scId2][m2].eDate+' credentials2='+JSON.stringify(credentials2)); }
									if ( ( ClassMeeting[scId1][m1].sDate >= ClassMeeting[scId2][m2].sDate && ClassMeeting[scId1][m1].sDate <= ClassMeeting[scId2][m2].eDate ) ||
											 ( ClassMeeting[scId1][m1].eDate >= ClassMeeting[scId2][m2].sDate && ClassMeeting[scId1][m1].eDate <= ClassMeeting[scId2][m2].eDate ) ) {
										// Check for credential conflicts.
										if ( credentials1.length ) { // Are there credentials?
											credentialConflict = false;
											for ( r1=0; r1<credentials1.length; r1++ ) { // Loop thru 1st credintials.
												credential1 = credentials1[r1];
												if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+"\t"+"\t"+'credential1='+JSON.stringify(credential1)); }
												for ( r2=0; r2<credentials2.length; r2++ ) { // Loop thru 2nd credintials.
													credential2 = credentials2[r2];
													if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+"\t"+"\t"+"\t"+'credential2='+JSON.stringify(credential2)); }
													if ( credential1.Id === credential2.Id && credential1.Yr === credential2.Yr ) { // Is there a credential conflict?
														if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.log("\t"+'calendar_class_div_base='+calendar_class_div_base); }
														credentialConflict = true;
														if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t\t"+'Conflict credential Id='+credential1.Id+' Yr='+credential1.Yr); }
														if ( calendar_class_div.className.indexOf('class_Credential_Conflict') === -1 ) {
															calendar_class_div.className += ' class_Credential_Conflict';
														}
													} // Is there a credential conflict?
												} // Loop thru 2nd credintials.
											} // Loop thru 1st credintials.
										} // Are there credentials?
										// Check for instructor conflicts.
										if ( instructors1.length ) { // Is there an instructor?
											instructorConflict = false;
											for ( r1=0; r1<instructors1.length; r1++ ) { // Loop thru 1st instructors.
												instructor1 = instructors1[r1];
												for ( r2=0; r2<instructors2.length; r2++ ) { // Loop thru 2nd instructors.
													instructor2 = instructors2[r2];
													if ( instructor1 === instructor2 ) { // Is there a instructor conflict?
														instructorConflict = true;
														if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t\t"+'Conflict instructor1='+instructor1); }
														if ( calendar_class_div.className.indexOf('class_Instructor_Conflict') === -1 ) {
															calendar_class_div.className += ' class_Instructor_Conflict';
														}
													} // Is there a instructor conflict?
												} // Loop thru 2nd instructors.
											} // Loop thru 1st instructors.
										} // Is there an instructor?
										// Check for room conflicts.
										if ( rooms1.length ) { // Is there a room?
											roomConflict = false;
											for ( r1=0; r1<rooms1.length; r1++ ) { // Loop thru 1st rooms.
												room1 = rooms1[r1];
												for ( r2=0; r2<rooms2.length; r2++ ) { // Loop thru 2nd rooms.
													room2 = rooms2[r2];
													if ( room1 === room2 ) { // Is there a instructor conflict?
														roomConflict = true;
														if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info("\t\t\t"+'Conflict room1='+room1); }
														if ( calendar_class_div.className.indexOf('class_Room_Conflict') === -1 ) {
															calendar_class_div.className += ' class_Room_Conflict';
														}
													} // Is there a instructor conflict?
												} // Loop thru 2nd rooms.
											} // Loop thru 1st rooms.
										} // Is there an room?
									} else {

									}
								} // Loop thru 2nd class meetings.
							} // Is this not the same course?
						} // Loop thru EVENTS_OVERLAPPING overlaps.
					} // Does the EVENTS_OVERLAPPING scmId match the ClassMeeting scmId?
				} // Loop thru 1st class meetings.
			}} // Loop thru 1st classes.
		}} // Loop thru 1st EVENTS_OVERLAPPING.
		if ( DEBUG_DisplaySchedule_Highlight_Conflicts ) { console.info('END '+day+' check for conflicts'); }
	} // Loop thru ScheduleViewDays days.
} // END DisplaySchedule_Highlight_Conflicts.

// Events_Add( day )
// Add events for this day to EVENTS_TO_DISPLAY.
function Events_Add( day ) {
	var DEBUG_Events_Add = false;
	if ( DEBUG_Events_Add ) { console.warn('Events_Add[day='+day+']'); }
	var begin,
			divId,
			end,
	    minutesOffset = ScheduleTimeBegin * 60,
			modifiedEvents = 0,
			sameClass;
	// Load ClassMeetings into EVENTS_TO_DISPLAY for positioning schedule classes.
	for ( var scId1 in ScheduleClass ) {if(ScheduleClass.hasOwnProperty(scId1)) { // Loop thru classes.
		if ( DEBUG_Events_Add ) { console.log('ScheduleClass['+scId1+'].courseId='+ScheduleClass[scId1].courseId+' Section='+ScheduleClass[scId1].Section); }
		for ( m1=0; m1<ClassMeeting[scId1].length; m1++ ) { // Loop thru class meetings.
			if ( DEBUG_Events_Add ) { console.log("\t"+' ClassMeeting['+scId1+']['+m1+']='+JSON.stringify(ClassMeeting[scId1][m1])); }
			begin = ConvertTimeToMinutes(ClassMeeting[scId1][m1].bTime);
			ClassMeeting[scId1][m1].tdMinute = parseInt( begin / ScheduleTimeIncrement ) * ScheduleTimeIncrement;
			begin -= minutesOffset;
			end = ConvertTimeToMinutes(ClassMeeting[scId1][m1].eTime) - minutesOffset;
			for ( d1=0; d1<ClassMeeting[scId1][m1].days.length; d1++) { // Loop thru meeting days.
				modifiedEvents = 1;
				var ccmTime = ConvertTimeToMinutes(ClassMeeting[scId1][m1].bTime);
				divId = 'calendar_class_'+scId1+'_'+ClassMeeting[scId1][m1].days[d1]+ccmTime;//ClassMeeting[scId1][m1].tdMinute;
				ClassMeetingDay = ClassMeeting[scId1][m1].days[d1];
				if ( day === ClassMeetingDay ) {
					EVENTS_TO_DISPLAY.push({
						scId  : scId1,
						scmId : ClassMeeting[scId1][m1].scmId,
						divId : divId,
						day   : day,
						sDate : ClassMeeting[scId1][m1].sDate,
						eDate : ClassMeeting[scId1][m1].eDate,
						begin : begin,
						end   : end,
						position : EVENTS_TO_DISPLAY.length
					});
				}
			} // Loop thru meeting days.
		} // Loop thru class meetings.
	}} // Loop thru classes.
	if ( DEBUG_Events_Add ) { console.log('EVENTS_TO_DISPLAY='+JSON.stringify(EVENTS_TO_DISPLAY)); }
			//we don't want to refresh the DOM if nothing changed
	if ( modifiedEvents ) {
		return true;
	}
	// Return value tells us if the view was refreshed
	return false;
} // END Events_Add.

// Events_Overlapping(day)
// Check all events for overlap and add to EVENTS_OVERLAPPING.
function Events_Overlapping(day) {
	var DEBUG_Events_Overlapping = false;
	if ( DEBUG_Events_Overlapping ) { console.warn('Events_Overlapping[day='+day+']'); }
	var currentBegin,
	    currentEnd,
	    objectKey,
	    overlappingEvent,
	    overlappingKey;
	for ( var i=0, l=EVENTS_TO_DISPLAY.length; i<l; i+=1 ) { // Loop thru EVENTS_TO_DISPLAY.
		currentDivId = EVENTS_TO_DISPLAY[i].divId;
		currentDay   = EVENTS_TO_DISPLAY[i].day;
		currentBdate = EVENTS_TO_DISPLAY[i].bDate;
		currentEdate = EVENTS_TO_DISPLAY[i].eDate;
		currentBegin = EVENTS_TO_DISPLAY[i].begin;
		currentEnd   = EVENTS_TO_DISPLAY[i].end;
		objectKey    = EVENTS_TO_DISPLAY[i].scmId;//currentBegin+'*'+currentEnd+'*'+EVENTS_TO_DISPLAY[i].position;
		EVENTS_OVERLAPPING[objectKey] = { divId: currentDivId, items: {}, length: 0, overlaps: [], scmId: EVENTS_TO_DISPLAY[i].scmId };
		if ( DEBUG_Events_Overlapping ) { console.info('Checking scId:'+EVENTS_TO_DISPLAY[i].scId+' day:'+currentDay+', begin:'+currentBegin+', end:'+currentEnd); }
		if ( DEBUG_Events_Overlapping ) { console.log("\t"+'EVENTS_TO_DISPLAY['+i+']='+JSON.stringify(EVENTS_TO_DISPLAY[i])); }
		for ( var j=0; j<l; j+=1 ) { // Loop thru EVENTS_TO_DISPLAY.
			if ( j !== i ) { // Is this a different event?
				overlappingEvent = EVENTS_TO_DISPLAY[j];
				if ( DEBUG_Events_Overlapping ) { console.log("\t"+'Against scId:'+overlappingEvent.scId+' day:'+overlappingEvent.day+', begin:'+overlappingEvent.begin+', end:'+overlappingEvent.end); }
				/** /
				if ( DEBUG_Events_Overlapping ) {
					console.log("\t\t"+'overlappingEvent.day === currentDay == '+(overlappingEvent.day === currentDay));
					console.log("\t\t"+'( overlappingEvent.begin >= currentBegin && overlappingEvent.begin <= currentEnd ) == '+(( overlappingEvent.begin >= currentBegin && overlappingEvent.begin <= currentEnd )));
					console.log("\t\t"+'( overlappingEvent.end   >= currentBegin && overlappingEvent.end   <= currentEnd ) == '+(( overlappingEvent.end   >= currentBegin && overlappingEvent.end   <= currentEnd )));
					console.log("\t\t"+'( currentBegin >= overlappingEvent.begin && currentBegin <= overlappingEvent.end ) == '+(( currentBegin >= overlappingEvent.begin && currentBegin <= overlappingEvent.end )));
					console.log("\t\t"+'( currentEnd   >= overlappingEvent.begin && currentEnd   <= overlappingEvent.end ) == '+(( currentEnd   >= overlappingEvent.begin && currentEnd   <= overlappingEvent.end )));
				}
				/**/
				if ( ( overlappingEvent.day === currentDay ) && // day is same.
						(
						 ( ( overlappingEvent.begin >= currentBegin && overlappingEvent.begin <= currentEnd ) ||	// other's begin is between current begin and end.
							 ( overlappingEvent.end   >= currentBegin && overlappingEvent.end   <= currentEnd )			// other's end is between current begin and end.
						 ) ||
						 ( ( currentBegin >= overlappingEvent.begin && currentBegin <= overlappingEvent.end ) ||	// current begin is between other's begin and end.
							 ( currentEnd   >= overlappingEvent.begin && currentEnd   <= overlappingEvent.end )			// current end is between other's begin and end.
						 )
						)
					 ) { // wraps other's begin and end.
					overlappingKey = overlappingEvent.scmId;//overlappingEvent.begin+'*'+overlappingEvent.end+'*'+overlappingEvent.position;
					EVENTS_OVERLAPPING[objectKey].items[overlappingKey] = 1;
					EVENTS_OVERLAPPING[objectKey].length += 1;
					EVENTS_OVERLAPPING[objectKey].overlaps.push({ day: overlappingEvent.day, scId: overlappingEvent.scId, scmId: overlappingEvent.scmId });
					if ( DEBUG_Events_Overlapping ) { console.info("\t"+'Overlap scId:'+overlappingEvent.scId+', scmId:'+overlappingEvent.scmId); }
				} 
			} // Is this a different event?               
		} // Loop thru EVENTS_TO_DISPLAY.
/** /
						 ( ( overlappingEvent.begin >= currentBegin && overlappingEvent.begin <= currentEnd ) || // begin is between other's begin and end.
							 ( overlappingEvent.end   >= currentBegin && overlappingEvent.end   <= currentEnd ) || // end is between other's begin and end.
							 ( overlappingEvent.begin <= currentBegin && overlappingEvent.end >= currentBegin ) || // wraps other's begin and end.
							 ( overlappingEvent.begin === currentBegin || overlappingEvent.end === currentEnd ) ) ) { // begin or end is the same
/**/
		if (!overlappingEvent){
		//EVENTS_OVERLAPPING[objectKey] = null;
		}
	} // Loop thru EVENTS_TO_DISPLAY.   
	if ( DEBUG_Events_Overlapping ) { console.log('EVENTS_OVERLAPPING='+JSON.stringify(EVENTS_OVERLAPPING)); }
} // END Events_Overlapping.

// Events_Prepare( day )
// Adds additional properties to EVENTS_TO_DISPLAY, so that they can be positioned properly on the schedule.
// Events with calculated position are added to EVENTS_READY for Events_Prepare_Check().
function Events_Prepare( day ) {
	var DEBUG_Events_Prepare = false;
	if ( DEBUG_Events_Prepare ) { console.warn('Events_Prepare[day='+day+']'); }
	var currentDay,
	    currentEvent,
	    eventKey,
			//heightMultiplier = ScheduleIncrementHeight / ScheduleTimeIncrement,
	    left,
	    overlappingEvents,
	    width;
	EVENTS_READY = {};
	Events_Sort(EVENTS_TO_DISPLAY);
	if ( DEBUG_Events_Prepare ) { console.log('EVENTS_TO_DISPLAY='+JSON.stringify(EVENTS_TO_DISPLAY)); }
	for ( var i=0, l=EVENTS_TO_DISPLAY.length; i<l; i+=1 ) { // Loop thru EVENTS_TO_DISPLAY.
		if ( DEBUG_Events_Prepare ) { console.log('EVENTS_TO_DISPLAY['+i+']='+JSON.stringify(EVENTS_TO_DISPLAY[i])); }
		currentEvent      = EVENTS_TO_DISPLAY[i];
		eventKey          = EVENTS_TO_DISPLAY[i].scmId;//currentEvent.begin+'*'+currentEvent.end+'*'+currentEvent.position;
		overlappingEvents = Events_Prepare_Check(EVENTS_OVERLAPPING[eventKey], eventKey, day);
		width = overlappingEvents.width;
		left  = overlappingEvents.left;
		currentEvent.top          = currentEvent.begin;// * heightMultiplier;
		currentEvent.width        = width;
		currentEvent.left         = left;
		currentEvent.height       = ( currentEvent.end - currentEvent.begin );// * heightMultiplier;
		currentEvent.contentWidth = currentEvent.width - 4;
		
		EVENTS_READY[eventKey]    = {
			left: left,
			width : width
		};
		if ( DEBUG_Events_Prepare ) { console.log('EVENTS_READY['+eventKey+']='+JSON.stringify(EVENTS_READY[eventKey])); }
	} // Loop thru EVENTS_TO_DISPLAY.
	if ( DEBUG_Events_Prepare ) { console.log('EVENTS_TO_DISPLAY='+JSON.stringify(EVENTS_TO_DISPLAY)); }
	if ( DEBUG_Events_Prepare ) { console.log('EVENTS_READY='+JSON.stringify(EVENTS_READY)); }
} // END Events_Prepare.

// Events_Prepare_Check( overlapObject, eventKey, day )
// Calculate left and width of overlapping events.
// This function performs a few operations.
// It accepts an event object with overlapping events of event object to be rendered (let's call it E).
// First of all it checks if E has any overlapping events.
// If not - then we know that it can take the full available width and will be positioned at x=0.
// If there are overlapping events we check if they overlap with each other, because if they don't then one event from each pair doesn't influence the width of E, but still it's x position can be influenced (e2):
//
// ********
// *  e1  *  *******
// *      *  *     *  ********
// *      *  *  E  *  *  e3  *
// ********  *     *  ********
// ********  *******
// *  e2  *
// ********
// E overlaps 3 others: e1, e2, and e3. This determines a width or 1/4.
// But e3 does not overlap e2, so the width will be 1/3.
// Finally we find the left position of E using the positions of events that were already positioned.
function Events_Prepare_Check( overlapObject, eventKey, day ) {
	var DEBUG_Events_PrepareCheck = false;
	if ( DEBUG_Events_PrepareCheck ) { console.warn('Events_Prepare_Check[overlapObject='+overlapObject.divId+', eventKey='+eventKey+', day='+day+']'); }
	var noncollidingEvents         = {},
	    noncollidingEventsPairs    = 0,
	    left                    = 0,
	    overlappingEventsAmount = Events_Prepare_MaxOverlap(overlapObject, eventKey),//overlapObject.length,
	    //overlappingEventsAmount = overlapObject.length,
	    overlappingIEvents,
	    overlapReadyIEvent,
	    startingLefts           = {},
	    width                   = null;
	if ( overlapObject ) { // Is there an overlap?
		if ( DEBUG_Events_PrepareCheck ) { console.log('overlapObject.items='+JSON.stringify(overlapObject.items)); }
		for( var i in overlapObject.items ) {if (overlapObject.items.hasOwnProperty(i)){ // Loop thru overlap items.
			overlapReadyIEvent = EVENTS_READY[i];
			overlappingIEvents = EVENTS_OVERLAPPING[i].items;
			for ( var m in overlapObject.items ) {if (overlapObject.items.hasOwnProperty(m)){ // Loop thru overlap items.
				if ( DEBUG_Events_PrepareCheck ) { console.log('i='+i+' m='+m+' noncollidingEvents[i]='+noncollidingEvents[i]+' noncollidingEvents[m]='+noncollidingEvents[m]+' overlappingIEvents[m]='+overlappingIEvents[m]+' eventKey='+eventKey); }
				if ( overlapObject.items.hasOwnProperty(m) && m !== i ) {
					if ( noncollidingEvents[m] !== i &&
							 noncollidingEvents[i] !== m &&
							 !overlappingIEvents[m] &&

							 m !== eventKey &&
							 i !== eventKey ) { // Do these events collide?
						if ( DEBUG_Events_PrepareCheck ) { console.info('Do not collide'); }
						noncollidingEvents[i]   = m;
						noncollidingEvents[m]   = i;
						noncollidingEventsPairs += 1;
					} else {
						if ( DEBUG_Events_PrepareCheck ) { console.log('Collide'); }
					} // Do these events collide?
				} else {
					if ( DEBUG_Events_PrepareCheck ) { console.log('Same'); }
				}
			}} // Loop thru overlap items.
			if ( overlapReadyIEvent ) {
				if ( DEBUG_Events_PrepareCheck ) { console.log('overlapReadyIEvent '+i+' left='+overlapReadyIEvent.left+' width='+overlapReadyIEvent.width); }
				startingLefts[overlapReadyIEvent.left] = 1;
				// Overlapping events should have the same width so we can use the value of an already rendered event
				width = overlapReadyIEvent.width;
			}
		}} // Loop thru overlap items.
		if ( DEBUG_Events_PrepareCheck ) { console.log('overlappingEventsAmount='+overlappingEventsAmount+' noncollidingEventsPairs='+noncollidingEventsPairs+' ScheduleDayTimePositions['+day+'].width='+ScheduleDayTimePositions[day].width); }
		overlappingEventsAmount -= noncollidingEventsPairs;
		if ( !width ){
		width = ScheduleDayTimePositions[day].width / (overlappingEventsAmount + 1); // 600 ScheduleDayTimePositions[day].width
		}
		if ( DEBUG_Events_PrepareCheck ) { console.log('startingLefts='+JSON.stringify(startingLefts)); }
		for (var k in startingLefts){if (startingLefts.hasOwnProperty(k)){
			if (startingLefts[left]){
				left += width;
			}
		}}
	} else { // Is there an overlap?
		width = ScheduleDayTimePositions[day].width; // 600 ScheduleDayTimePositions[day].width
	} // Is there an overlap?
	return {
		width: width,
		left : left
	};
} // END Events_Prepare_Check.

// Events_Prepare_MaxOverlap(overlapObject, eventKey)
// Calculate max overlap length for positioning schedule classes.
function Events_Prepare_MaxOverlap(overlapObject, eventKey) {
	var DEBUG_Events_MaxOverlap = false;
	if ( DEBUG_Events_MaxOverlap ) { console.warn('Events_Prepare_MaxOverlap['+ScheduleClass[ClassMeeting_ScheduleClass[eventKey]].Course+' '+eventKey+']'); }
	var MaxLength = overlapObject.length;
	if ( DEBUG_Events_MaxOverlap ) { console.log("\t"+ScheduleClass[ClassMeeting_ScheduleClass[eventKey]].Course+'.length='+MaxLength); }
	//console.log(eventKey+' MaxLength='+MaxLength);
	for ( var index in overlapObject.items ) {if(overlapObject.items.hasOwnProperty(index)) {
		var thisLength = EVENTS_OVERLAPPING[index].length;
		if ( DEBUG_Events_MaxOverlap ) { console.log("\t"+ScheduleClass[ClassMeeting_ScheduleClass[index]].Course+'.length='+thisLength); }
		MaxLength = Math.max(MaxLength,thisLength);
	}}
	if ( MaxLength > overlapObject.length ) { MaxLength -= 1; }
	if ( DEBUG_Events_MaxOverlap ) { console.log("\t"+'MaxLength='+MaxLength); }
	return MaxLength;
} // END Events_Prepare_MaxOverlap.

// Events_Sort( EVENT )
// Sorts array of event objects by their begin and position paremeters.
function Events_Sort( EVENT ) {
	EVENT.sort(function(a, b) {
		if ( a.begin > b.begin ) {
			return 1;
		} else if ( a.begin < b.begin ) {
			return -1;
		} else {
			if ( a.position > b.position ) {
				return 1;
			} else if ( a.position < b.position ) {
				return -1;
			}
		return 0;
		}
	});
} // END Events_Sort.

// Print()
// Print the contents of the 'eId' element.
// eId is the id of the element
function Print(eId) {
	"use strict";
	var prtContent = document.getElementById(eId);
	var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
	WinPrint.document.write(prtContent.innerHTML);
	WinPrint.document.close();
	WinPrint.focus();
	WinPrint.print();
	WinPrint.close();
} // END Print.

// ScheduleChange()
// Display the schedule change form.
function ScheduleChange() {
	var DEBUG_ScheduleChange = true;
	if ( typeof importClasses === 'undefined' ) { importClasses = ''; }
	if ( DEBUG_ScheduleChange ) { console.warn('ScheduleViewSettings[importClasses='+importClasses+']'); }
	var eId = 'div_ScheduleFunctionsContainer';
	var e = document.getElementById(eId);
	var eDisplay = e.style.display; // Get schedulecontainer display.
	if ( DEBUG_ScheduleChange ) { console.log('eDisplay='+eDisplay); }
	if ( DEBUG_ScheduleChange && eDisplay === 'block' ) { console.log("e.innerHTML.indexOf('Change or create schedule')="+e.innerHTML.indexOf('Change or create schedule')); }
	if ( importClasses === '' && eDisplay === 'block' && e.innerHTML.indexOf('Change or create schedule') !== -1 ) {
		ScheduleTaskShow('ScheduleChange 882');
		return false;
	} else {
		ScheduleTaskHide();
	}
	switch ( importClasses ) { // switch importClasses.
		case '':
			URI = ROOT_http+'/Schedule/ScheduleChange/ScheduleChange.php';
			var preloadText = '<br><br><span class="bold info">Getting schedule form. Please wait ...</span><br><br><br>';
			
			console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+eId+"', '"+preloadText+"'];");
			
			UpdateInclude(URI, eId, preloadText);
			//setTimeout(DisplaySchedule,50);
			window.scrollTo(0, 0);
		break;
		case 'Import classes':
			
			break;
		case 'Cancel':
			document.getElementById(eId).style.display = 'none';
			ScheduleTaskShow('ScheduleChange 903');
		break;
	} // switch importClasses.
	return false;
} // END ScheduleChange

// ScheduleChange_ChangeScheduleButtonCheck(e)
// Enable/disable Change schedule button.
function ScheduleChange_ChangeScheduleButtonCheck(e) {
	var scheduleIdSelected = document.getElementById('sel_scheduleId').value;
	console.log('scheduleIdSelected='+scheduleIdSelected);
	if ( scheduleIdSelected ) {
		document.getElementById('btn_Change_schedule').disabled = false;
	} else {
		document.getElementById('btn_Change_schedule').disabled = true;
	}
} // END ScheduleChange_ChangeScheduleButtonCheck.

// ScheduleChange_CreateScheduleButtonCheck(e)
// Enable/disable Create schedule button.
function ScheduleChange_CreateScheduleButtonCheck(e) {
	var sessionIdSelected = document.getElementById('sel_sessionId').value;
	var departmentIdSelected = document.getElementById('sel_departmentId').value;
	var scheduleNameEntered = document.getElementById('inp_scheduleName').value;
	console.log('sessionIdSelected='+sessionIdSelected+' departmentIdSelected='+departmentIdSelected+' scheduleNameEntered='+scheduleNameEntered);
	if ( sessionIdSelected && departmentIdSelected && scheduleNameEntered ) {
		document.getElementById('btn_Create_new_schedule').disabled = false;
	} else {
		document.getElementById('btn_Create_new_schedule').disabled = true;
	}
} // END ScheduleChange_CreateScheduleButtonCheck.


// ScheduleClassDialogDrag(e)
// Handles the drag event from the Schedule Class dialog.
function ScheduleClassDialogDrag(e) {
	var DEBUG_ScheduleClassDialogDrag = true;
	if ( DEBUG_ScheduleClassDialogDrag ) { console.warn('ScheduleClassDialogDrag[e.id='+e.id+']'); }
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	var e_dialogContainer = document.getElementById('dialogContainer');
	document.removeEventListener('scroll', ScheduleClass_ScrollHandler);
	function dragMouseDown(e) {
		e = e || window.event;
		// Get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}
	function elementDrag(e) {
		e = e || window.event;
		// Calculate the new cursor position
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// Set the element's new position
		e_dialogContainer.style.top = (e_dialogContainer.offsetTop - pos2) + "px";
		e_dialogContainer.style.left = (e_dialogContainer.offsetLeft - pos1) + "px";
	}
	function closeDragElement() {
		// TODO: Save location to database
		document.onmouseup = null;
		document.onmousemove = null;
		document.addEventListener('scroll', ScheduleClass_ScrollHandler);
	}
	dragMouseDown(e);
} // END ScheduleClassDialogDrag

// ScheduleClassDragCheck(evt)
// Determine if this is a click or a drag of a schedule class.
function ScheduleClassDragCheck(evt) {
	var DEBUG_ScheduleClassDragCheck = true;
	evt = (evt) ? evt : window.event;
	//console.log('evt='+JSON.stringify(evt));
	//element.removeEventListener('mousedown',ScheduleClassDragCheck);
	if ( DEBUG_ScheduleClassDragCheck ) {
		// console.warn('ScheduleClassDragCheck[evt.target.id='+evt.target.id+' event.currentTarget.id='+event.currentTarget.id+' this.id='+this.id+' mousedownFlag='+mousedownFlag+' button='+evt.button+']');
	}
	//console.warn('ScheduleClassDragCheck[] evt.target.id='+evt.target.id+' mousedownFlag='+mousedownFlag+' button='+evt.button);
	if ( evt.button !== 0 ) { return; }
	ClearTextSelection();
	mousedownFlag = 'clickwait';
	var d = new Date();
	mousedownTimer = d.getTime();
	//console.log('mousedownTimer='+mousedownTimer);
	evt.currentTarget.addEventListener('mousemove', ScheduleClassDragCheckWait);
} // END ScheduleClassDragCheck.

// ScheduleClassDragCheckWait(evt)
// Wait 50 ms to ensure this is a drag vs a click.
function ScheduleClassDragCheckWait(evt) {
	evt = (evt) ? evt : window.event;
	//console.warn('ScheduleClassDragCheckWait[] evt.currentTarget.id='+evt.currentTarget.id+' mousedownFlag='+mousedownFlag);
	ClearTextSelection();
	var d = new Date();
	var now = d.getTime();
	var diff = now - mousedownTimer;
	console.log('mousemove mousedownTimer='+mousedownTimer+' now='+now+' diff='+diff);
	if ( diff > 50 ) {
		evt.currentTarget.removeEventListener('mousemove', ScheduleClassDragCheckWait);
		mousedownFlag = 'mousemove';
		ScheduleClassDragBegin(evt);
	} else {
		console.log('WAITING');
	}
} // END ScheduleClassDragCheckWait.

// ScheduleClassDragBegin(evt)
// Begin the schedule class drag.
function ScheduleClassDragBegin(evt) {
	var DEBUG_ScheduleClassDragBegin = true;
	evt = (evt) ? evt : window.event;
	//console.warn('ScheduleClassDragBegin[] evt.currentTarget.id='+evt.currentTarget.id+' mousedownFlag='+mousedownFlag);
	dragElement = evt.currentTarget;
	ClearTextSelection();
	ttHide();
	document.body.addEventListener('mouseup',ScheduleClassDrop);
	document.body.addEventListener('mousemove',ScheduleClassDragMove);
	document.body.addEventListener('keydown',ScheduleClassDragMoveAbortCheck);
	evt.preventDefault();
	var mX = mouseX(evt);
	mXprevious = mX;
	var mY = mouseY(evt);
	mYprevious = mY;
	if ( DEBUG_ScheduleClassDragBegin ) { console.log('mX='+mX+' mY='+mY); }
	dragElement.style.zIndex = 500; // Move the class meeting up the z.
	dragElementTL = elementBounds(dragElement.id,1054);
	dragElementTL.offsetLeft = (evt.offsetX || evt.clientX - $(dragElement).offset().left);
	dragElementTL.offsetTop = (evt.offsetY || evt.clientY - $(dragElement).offset().top);
	dragElementOriginalTL = JSON.parse(JSON.stringify(dragElementTL));
	if ( DEBUG_ScheduleClassDragBegin ) { console.log('dragElementTL left='+dragElementTL.left+' top='+dragElementTL.top+' right='+dragElementTL.right+' bottom='+dragElementTL.bottom+' offsetLeft='+dragElementTL.offsetLeft+' offsetTop='+dragElementTL.offsetTop); }
	
	schedulecontainerTL = elementBounds('schedulecontainer',1060);
	if ( DEBUG_ScheduleClassDragBegin ) { console.log('schedulecontainerTL left='+schedulecontainerTL.left+' top='+schedulecontainerTL.top+' right='+schedulecontainerTL.right+' bottom='+schedulecontainerTL.bottom); }
	
	scrollTL = ScrollLeftTop();	
	if ( DEBUG_ScheduleClassDragBegin ) { console.log('scrollTL left='+scrollTL.left+' top='+scrollTL.top); }
	
	viewportTL.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	viewportTL.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	if ( DEBUG_ScheduleClassDragBegin ) { console.log('viewportTL width='+viewportTL.width+' height='+viewportTL.height); }
	
} // END ScheduleClassDragBegin.

// ScheduleClassDragMove(evt)
// Follow the mouse with the schedule class being dragged.
function ScheduleClassDragMove(evt) {
	return 'dragdrop';
	var DEBUG_ScheduleClassDragMove = false;
	evt = (evt) ? evt : window.event;
	if ( DEBUG_ScheduleClassDragMove ) { console.warn('ScheduleClassDragMove[] evt.target.id='+evt.target.id); }
	ttHide();
	// Find current mouse position.
	var mX = mouseX(evt);
	var mY = mouseY(evt);
	if ( DEBUG_ScheduleClassDragMove ) { console.log('mX='+mX+' mY='+mY+' dragElementTL offsetLeft='+dragElementTL.offsetLeft+' offsetTop='+dragElementTL.offsetTop); }
	// Calculate position to move class meeting to in order to follow the mouse.
	var posX =  mX - dragElementTL.offsetLeft;
	var posY =  mY - dragElementTL.offsetTop;
	if ( DEBUG_ScheduleClassDragMove ) { console.log('posX='+posX+' posY='+posY); }
	// Move the class meeting to follow the mouse.
	dragElement.style.left = posX + 'px';
	dragElement.style.top = posY + 'px';
	// Remember offsetLeft and offsetTop.
	var offsetLeft = dragElementTL.offsetLeft;
	var offsetTop = dragElementTL.offsetTop;
	dragElementTL = elementBounds(dragElement.id,1093);
	// Put back offsetLeft and offsetTop;
	dragElementTL.offsetLeft = offsetLeft;
	dragElementTL.offsetTop = offsetTop;
	if ( DEBUG_ScheduleClassDragMove ) { console.log('dragElementTL left='+dragElementTL.left+' top='+dragElementTL.top+' right='+dragElementTL.right+' bottom='+dragElementTL.bottom+' offsetLeft='+dragElementTL.offsetLeft+' offsetTop='+dragElementTL.offsetTop); }
	// Check if scroll up needed.
	while ( dragElementTL.top > schedulecontainerTL.top && scrollTL.top > 0 && posY < ( scrollTL.top + 1 ) ) {
		if ( DEBUG_ScheduleClassDragMove ) { console.info('Scroll up'); }
		window.scrollBy(0, -1);
		scrollTL = ScrollLeftTop();
		console.log('scrollTL left='+scrollTL.left+' top='+scrollTL.top);
	}
	// Check if scroll down needed.
	/** /
	console.log('dragElementTL.top='+dragElementTL.top+' schedulecontainerTL.bottom='+schedulecontainerTL.bottom+' ScheduleIncrementHeight='+ScheduleIncrementHeight);
	console.log('scrollTL.top='+scrollTL.top+' dragElementTL.bottom='+dragElementTL.bottom);
	console.log('scrollTL.top='+scrollTL.top+' viewportTL.height='+viewportTL.height);
	/**/
	while ( dragElementTL.top < ( schedulecontainerTL.bottom - ScheduleIncrementHeight ) && scrollTL.top < viewportTL.height && dragElementTL.bottom > ( scrollTL.top + viewportTL.height - 1 ) ) {
		if ( DEBUG_ScheduleClassDragMove ) { console.info('Scroll down'); }
		window.scrollBy(0, 1);
		scrollTL = ScrollLeftTop();	
		console.log('scrollTL left='+scrollTL.left+' top='+scrollTL.top);
	}
} // END ScheduleClassDragMove.

// ScheduleClassDragMoveAbortCheck(evt)
// Check for ESC key to abort sheedule class drag.
function ScheduleClassDragMoveAbortCheck(evt) {
	return 'dragdrop';
	evt = (evt) ? evt : window.event;
	var theKey;
	if (evt) {
		theKey = evt.which;
	} else {
		theKey = window.event.keyCode;
	}
	console.log('theKey='+theKey);
	if ( theKey === 27 ) {
		console.info(dragElement.id+' not dropped in schedule td. dragElementOriginalTL left='+dragElementOriginalTL.left+' top='+dragElementOriginalTL.top);
		dragElement.style.left = dragElementOriginalTL.left + 'px';
		dragElement.style.top = dragElementOriginalTL.top + 'px';
		document.body.removeEventListener('mouseup',ScheduleClassDrop);
		document.body.removeEventListener('mousemove',ScheduleClassDragMove);
		document.body.removeEventListener('keydown',ScheduleClassDragMoveAbortCheck);
		evt.preventDefault();
	}
} // END ScheduleClassDragMoveAbortCheck.

// ScheduleClassDrop(evt)
// handle schedule class drop.
function ScheduleClassDrop(evt) {
	return 'dragdrop';
	var DEBUG_ScheduleClassDrop = true;
	evt = (evt) ? evt : window.event;
	if ( DEBUG_ScheduleClassDrop ) { console.warn('ScheduleClassDrop[] evt.currentTarget.id='+evt.currentTarget.id+' dragElement.id='+dragElement.id); }
	dragElement.style.zIndex = 1; // Move the class meeting back down the z.
	var ScheduleClassDropOK = true; // Set false if the class meeting drop was out of bounds.
	// BEGIN Find out where the class meeting was dropped.
	if ( DEBUG_ScheduleClassDrop ) { console.log('BEGIN Find out where the class meeting was dropped.'); }
	// Get mouse position.
	var mX = mouseX(evt);
	var mY = mouseY(evt);
	//console.log('mX='+mX+' mY='+mY);
	dragElementTLNow = elementBounds(dragElement.id,1153); // Calculate upper left corner position of class meeting.
	//console.log('dragElementTLNow left='+dragElementTLNow.left+' top='+dragElementTLNow.top);
	// Loop thru schedule tds.
	var dayIndexMin; // Min day index in the schedule view.
	var dayIndexMax; // Max day index in the schedule view.
	if ( ScheduleDayView === 'Work week' ) {
		dayIndexMin = 1;
		dayIndexMax = 5;
	} else {
		dayIndexMin = 0;
		dayIndexMax = 6;
	}
	var droppedInCalendarDayTime = false; // Set true if class meeting was dropped in a scheduleCell.
	var droppedIn_day = ''; // The day the class meeting was moved to.
	var droppedIn_mTime = ''; // The mTime the class meeting was moved to.
	var meetingIndex = 0;
	var mScheduleTimeBegin = ScheduleTimeBegin * 60; // The beginning time in the schedule view.
	var mScheduleTimeEnd = ScheduleTimeEnd * 60; // The ending time in the schedule view.
	var daysOfWeek = ['U','M','T','W','H','F','S']; // This should come from Weekdays.
	daysOfWeekLoop:
	for ( var d=dayIndexMin; d<=dayIndexMax; d++ ) { // Loop thru the days in the schedule view.
		//console.log('d='+d+' daysOfWeek[d]='+daysOfWeek[d]);
		droppedIn_day = daysOfWeek[d];
		for ( droppedIn_mTime=mScheduleTimeBegin; droppedIn_mTime<=mScheduleTimeEnd; droppedIn_mTime+=ScheduleTimeIncrement ) { // Loop thru the times in the schedule view.
			var tdId = droppedIn_day + droppedIn_mTime;
			var eTD = document.getElementById(tdId); // The td we are testing.
			var tdTL = elementBounds(tdId,1178);
			var tdWidth = eTD.offsetWidth;
			var tdHeight = eTD.offsetHeight;
			var tdRight = tdTL.left + tdWidth;
			var tdBottom = tdTL.top + tdHeight;
			//console.log('left='+tdTL.left+' top='+tdTL.top+' right='+tdRight+' bottom='+tdBottom+' width='+tdWidth+' height='+tdHeight);
			if ( dragElementTLNow.left >= tdTL.left &&  dragElementTLNow.left <= tdRight && dragElementTLNow.top >= tdTL.top &&  dragElementTLNow.top <= tdBottom ) { // Did the class meeting get dropped here?
				droppedInCalendarDayTime = true;
				if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'Dropped in '+tdId); }
				// Snap class meeting to left top of schedule td.
				var tdBounds = elementBounds(tdId,1188);
				//if ( DEBUG_ScheduleClassDrop ) { console.log('tdBounds left='+tdBounds.left+' top='+tdBounds.top+' width='+tdBounds.width); }
				dragElement.style.left = tdBounds.left + 1 + 'px';
				dragElement.style.top = tdBounds.top + 2 + 'px';
				var newBounds = elementBounds(dragElement.id,1192);
				//if ( DEBUG_ScheduleClassDrop ) { console.log('newBounds left='+newBounds.left+' top='+newBounds.top); }
				break daysOfWeekLoop; // Found where it was dropped so we can stop looping.
			} // Did the class meeting get dropped here?
		} // Loop thru the times in the schedule view.
	} // Loop thru the days in the schedule view.
	if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'droppedInCalendarDayTime='+droppedInCalendarDayTime+' droppedIn_day='+droppedIn_day+' droppedIn_mTime='+droppedIn_mTime); }
	// END Find where the class meeting was dropped.
	if ( DEBUG_ScheduleClassDrop ) { console.log('END Find out where the class meeting was dropped.'); }
	var scId;
	var scmId = 0;
	var original_day;
	var original_mTime;
	var dayIndex;
	if ( droppedInCalendarDayTime ) { // Was the class meeting was dropped in a valid scheduleCell?
		// BEGIN Find the scmId.
		if ( DEBUG_ScheduleClassDrop ) { console.log('BEGIN Find the scmId.'); }
		// Find old day of class meeting.
		var idParts = dragElement.id.split('_');
		scId = parseInt(idParts[2]);
		original_day = idParts[3].substr(0,1);
		original_mTime = parseInt(idParts[3].substr(1));
		if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'scId='+scId+' original_day='+original_day+' original_mTime='+original_mTime); }
		if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'ClassMeeting['+scId+']='+JSON.stringify(ClassMeeting[scId])); }
		// BEGIN Loop thru meetings.
		if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'BEGIN Loop thru meetings.'); }
		var meetingDay;
		var scmIdFound = false;
		var bTime;
		var mTime;
		if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'Count of meetings = ClassMeeting[scId].length='+ClassMeeting[scId].length); }
		if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'Search meetings for the original day meeting was on = original_day='+original_day); }
		loopMeeting:
		for ( meetingIndex=0; meetingIndex<ClassMeeting[scId].length; meetingIndex++ ) { // Loop thru meetings.
			console.log("\t"+'Meeting days = ClassMeeting['+scId+']['+meetingIndex+'].days='+ClassMeeting[scId][meetingIndex].days);
			// Change bTime to mTime
			bTime = ConvertTimeToMinutes(ClassMeeting[scId][meetingIndex].bTime);
			mTime = parseInt(ConvertTimeToMinutes(ClassMeeting[scId][meetingIndex].bTime)/ScheduleTimeIncrement)*ScheduleTimeIncrement;
			console.log("\t"+"\t"+'bTime='+bTime+' mTime='+mTime+' original_mTime='+original_mTime);
			if ( mTime === original_mTime ) { // Is this mTime the same as the original_mTime?
				// Yes, check if the day is also the same.
				for ( dayIndex=0; dayIndex<ClassMeeting[scId][meetingIndex].days.length; dayIndex++ ) { // Loop thru meeting days.
					meetingDay = ClassMeeting[scId][meetingIndex].days[dayIndex];
					if ( meetingDay === original_day ) { // Is this meetingDay the same as the original_day?
						// Yes, we found the original day and mTime.
						scmIdFound = true;
						break loopMeeting;
					} // Is this meetingDay the same as the original_day?
				} // Loop thru meeting days.
			} // Is this mTime the same as the original_mTime?
		} // Loop thru meetings.
		console.log("\t"+"\t"+'scmIdFound='+scmIdFound+' meetingDay='+meetingDay);
		if ( scmIdFound ) {
			scmId = ClassMeeting[scId][meetingIndex].scmId;
		}
		// END Loop thru meetings.
		if ( DEBUG_ScheduleClassDrop ) { console.log("\t"+'END Loop thru meetings.'); }
		console.log("\t"+'scmId='+scmId+' meetingIndex='+meetingIndex+' meetingDay='+meetingDay+' dayIndex='+dayIndex);
		// END Find the scmId.
		if ( DEBUG_ScheduleClassDrop ) { console.log('END Find the scmId.'); }
		if ( scmIdFound ) {
			// BEGIN Find the day diff.
			if ( DEBUG_ScheduleClassDrop ) { console.log('BEGIN Find the day diff.'); }
			console.log("\t"+'Moved ClassMeeting['+scId+']['+dayIndex+'] meeting day from '+meetingDay+' to '+droppedIn_day);
			console.log("\t"+'Moved ClassMeeting['+scId+']['+dayIndex+'] meeting bTime from '+bTime+' to '+mTime);
			// Find the day diff.
			var mIndexFrom = daysOfWeek.indexOf(meetingDay);
			var mIndexTo = daysOfWeek.indexOf(droppedIn_day);
			var dayDiff = mIndexTo - mIndexFrom;
			var newDayIndex;
			console.log("\t"+'mIndexFrom='+mIndexFrom+' mIndexTo='+mIndexTo+' dayDiff='+dayDiff);
			var daysOK = true;
			for ( dayIndex=0; dayIndex<ClassMeeting[scId][meetingIndex].days.length; dayIndex++ ) {
				meetingDay = ClassMeeting[scId][meetingIndex].days[dayIndex];
				var thisDayIndex = daysOfWeek.indexOf(ClassMeeting[scId][meetingIndex].days[dayIndex]);
				console.log("\t"+'meetingDay='+meetingDay+' thisDayIndex='+thisDayIndex);
				newDayIndex = thisDayIndex + dayDiff;
				if ( newDayIndex < dayIndexMin || newDayIndex > dayIndexMax ) {
					console.log("\t"+'newDayIndex '+newDayIndex+' out of range '+dayIndexMin+'-'+dayIndexMax);
					daysOK = false;
					break;
				}
			}
			console.log("\t"+'daysOK='+daysOK+' newDayIndex='+newDayIndex+' day of week='+daysOfWeek[newDayIndex]);
			//if ( daysOK ) {
				// Snap class meeting to left top of 
			//}
			// END Find the day diff.
			if ( DEBUG_ScheduleClassDrop ) { console.log('END Find the day diff.'); }
		}
	} else { // Was the class meeting was dropped in a valid scheduleCell?
		if ( DEBUG_ScheduleClassDrop ) { console.log('The class meeting was NOT dropped in a valid scheduleCell.'); }
		ScheduleClassDropOK = false;
	} // Was the class meeting was dropped in a valid scheduleCell?
	if ( DEBUG_ScheduleClassDrop ) { console.log('ScheduleClassDropOK='+ScheduleClassDropOK); }
	if ( ScheduleClassDropOK ) { // Was the class meeting drop OK?
		// Yes, Update the ClassMeeting JSON object, Make AJAX call, and Change the calendar_class div.id.
		
		// document.getElementById(divIdOriginal).id = divIdNew;
		// The drop was OK and has been positioned on the calendar.
		// Need to: Done -- Set the ClassMeeting[scId] bTime, eTime, and days to the new values.
		//          Done -- Change div id to reflect new mTime. I.E. calendar_class_18_T780 (original_mTime) becomes calendar_class_18_720 (droppedIn_mTime).
		//          Tell the database that the class has been moved. Use updateInclude(). --> A page reload should test this
		//          Change the div contents to display the new day and times. Will be done by updateInclude(). --> Double check that this is working
		//          Done -- Redraw the calendar.
		

		// Does the tdTime need to be updated? NO - JimM.
		
		// BEGIN Update the ClassMeeting JSON object.
		if ( DEBUG_ScheduleClassDrop ) { console.log('BEGIN Update the ClassMeeting JSON object.'); }
		console.log("\t"+'ORIGINAL ClassMeeting['+scId+']='+JSON.stringify(ClassMeeting[scId]));
		//console.log('ORIGINAL ClassMeeting['+scId+']['+meetingIndex+'] =' +JSON.stringify(ClassMeeting[scId][meetingIndex]));
		//console.log('ORIGINAL ClassMeeting['+scId+'].days.length='+ClassMeeting[scId][meetingIndex].days.length);
		console.log("\t"+"\t"+'original_day=' + original_day+' droppedIn_day=' + droppedIn_day);
		console.log("\t"+"\t"+'original_mTime='+original_mTime+' droppedIn_mTime='+droppedIn_mTime);
		var MakeAJAXcall = true;
		if ( droppedIn_mTime === original_mTime || ClassMeeting[scId][meetingIndex].days.length === 1 ) { // Did the time stay the same or is there only one day?
			// Yes, simply update the ClassMeeting[scId][meetingIndex].
			ClassMeeting[scId][meetingIndex].bTime = ConvertMinutesToTime(droppedIn_mTime); // Set new bTime.
			ClassMeeting[scId][meetingIndex].eTime = ConvertMinutesToTime(ConvertTimeToMinutes(ClassMeeting[scId][meetingIndex].eTime) - (ConvertTimeToMinutes(ClassMeeting[scId][meetingIndex].bTime) - droppedIn_mTime)); // Set new eTime.
			// Find the day it was moved from in the days array and replace it.
			for ( dayIndex = 0; dayIndex < ClassMeeting[scId][meetingIndex].days.length; dayIndex++ ) {
				// If this is the day the class was moved from, replace it.
				if ( ClassMeeting[scId][meetingIndex].days[dayIndex] === original_day) {
					ClassMeeting[scId][meetingIndex].days[dayIndex] = droppedIn_day;
				}
			}
			console.log("\t"+'REPLACED ClassMeeting['+scId+']='+JSON.stringify(ClassMeeting[scId]));
		} else { // Did the time stay the same or is there only one day?
			// No, the day must be removed from the current scheduleclassmeeting and a new scheduleclassmeeting created.
			MakeAJAXcall = false;
			alert('Move to new time for multi-day meeting not finished!');
			// Multiple day class meeting had one meeting moved to a new time.
			// scheduleclassmeetings have one bTime and eTime but can have multiple days.
			// This means there in a new scheduleclassmeeting since the times changed.
			// This is done by:
			//   Remove the day from the ClassMeeting JSON object.
			//   The original scheduleclassmeeting must have this scheduleclassmeetingweekday removed. (Ajax call)
			//     DELETE the scheduleclassmeetingweekday that matches the droppedIn_day.
			//   INSERT a new scheduleclassmeeting. (Ajax call that returns the scmId)
			//     Need to send the scId, sDate, eDate, bTime, eTime, days, onCampus, rooms, and instructors values.
			//     Must also INSERT:
			//       scheduleclassmeetinginstructor ( From instructors values. )
			//       scheduleclassmeetingroom ( From rooms values. )
			//       scheduleclassmeetingweekday ( From droppedIn_day. )
			//       scheduleclassnote ( Not currently used. )
			//       scheduleclasssection ( Not currently used. We are violating 1NF and putting all section numbers in
			//         scheduleclass.scheduleclassSection. )
			//   Add the new meeting with the new scmId, bTime, eTime, days, and tdMinute values to the ClassMeeting JSON object.
			//     The sDate, eDate, onCampus, rooms, and insructors values stay the same.
			
		} // Did the time stay the same or is there only one day?
		//console.log('REPLACED ClassMeeting[scId] = ' + JSON.stringify(ClassMeeting[scId]));
		//console.log('REPLACED ClassMeeting['+scId+'].days.length='+ClassMeeting[scId][meetingIndex].days.length);
		// END Update the ClassMeeting JSON object.
		if ( DEBUG_ScheduleClassDrop ) { console.log('END Update the ClassMeeting JSON object.'); }
		
		if ( MakeAJAXcall ) {
			// BEGIN Make AJAX call.
			// Build the URL for the AJAX call
			if ( DEBUG_ScheduleClassDrop ) { console.log('BEGIN Make AJAX call.'); }		
			URI = '/Schedule/ScheduleClass/ScheduleClassUpdate.php?';
			URI += 'task=MoveClassMeeting';
			URI += '&scId='+scId;
			URI += '&scmId='+scmId;
			URI += '&bTime='+ClassMeeting[scId][meetingIndex].bTime;
			URI += '&eTime='+ClassMeeting[scId][meetingIndex].eTime;
			var days = '';
			for ( var di=0; di<ClassMeeting[scId][meetingIndex].days.length; di++) {
				days += ClassMeeting[scId][meetingIndex].days[di];
			}
			URI += '&days='+days;
			var eId = dragElement.id;
			var preloadText = 'Updating class';
			var jsReturnCode = "ScheduleClassDrop_Change_calendar_class_id('"+droppedIn_day+"', '"+droppedIn_mTime+"');";
			
			console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+eId+"', '"+preloadText+"', \""+jsReturnCode+"\"];");
			
			UpdateInclude(URI, eId, preloadText, jsReturnCode);
			
			// END Make AJAX call.
			if ( DEBUG_ScheduleClassDrop ) { console.log('END Make AJAX call.'); }		
		} else {
			if ( DEBUG_ScheduleClassDrop ) { console.log('AJAX call skipped for now.'); }
			// Put the class meeting back.
			console.info(dragElement.id+' not dropped in schedule td. dragElementOriginalTL left='+dragElementOriginalTL.left+' top='+dragElementOriginalTL.top);
			dragElement.style.left = dragElementOriginalTL.left + 'px';
			dragElement.style.top = dragElementOriginalTL.top + 'px';
		}
	} else { // Was the class meeting drop OK?
		// No, Put the class meeting back.
		console.info(dragElement.id+' not dropped in schedule td. dragElementOriginalTL left='+dragElementOriginalTL.left+' top='+dragElementOriginalTL.top);
		dragElement.style.left = dragElementOriginalTL.left + 'px';
		dragElement.style.top = dragElementOriginalTL.top + 'px';
	} // Was the class meeting drop OK?
	//console.log('tdIds='+tdIds);
	//console.log('evt.target.id='+evt.target.id+' evt.type='+evt.type);
	//evt.target.className = evt.target.className.replace(' drag_cursor','');
	//evt.target.removeEventListener('mousedown',ScheduleClassDragBegin);
	evt.preventDefault();
	//evt.target.addEventListener('click',ScheduleClass_OpenEdit);
	document.body.removeEventListener('mouseup',ScheduleClassDrop);
	document.body.removeEventListener('mousemove',ScheduleClassDragMove);
	document.body.removeEventListener('keydown',ScheduleClassDragMoveAbortCheck);
	evt.preventDefault();
} // END ScheduleClassDrop.

function ScheduleClassDrop_Change_calendar_class_id(droppedIn_day, droppedIn_mTime) {
	var DEBUG_ScheduleClassDrop_Change_calendar_class_id = true;
	if ( DEBUG_ScheduleClassDrop_Change_calendar_class_id ) { console.log('BEGIN ScheduleClassDrop_Change_calendar_class_id[droppedIn_day='+droppedIn_day+', droppedIn_mTime='+droppedIn_mTime+'] dragElement.id='+dragElement.id); }
	// Set the new div id, this needs to be changed AFTER the updateInclude().
	/**/
	// BEGIN Change the calendar_class div.id.
	if ( DEBUG_ScheduleClassDrop_Change_calendar_class_id ) { console.log('BEGIN Change the calendar_class div.id.'); }
	// CK original var newTimeID = evt.target.id.substr(0, evt.target.id.lastIndexOf("_")) + "_" + droppedIn_day + droppedIn_mTime;
	// CK original document.getElementById(evt.target.id).id = newTimeID;
	var e_calendar_class = document.getElementById(dragElement.id);
	if ( DEBUG_ScheduleClassDrop_Change_calendar_class_id ) { console.log("\t"+'ORIGINAL e_calendar_class.id='+e_calendar_class.id); }
	var newTimeID = dragElement.id.substr(0, dragElement.id.lastIndexOf("_")) + "_" + droppedIn_day + droppedIn_mTime;
	//document.getElementById(dragElement.id).id = newTimeID;
	e_calendar_class.id = newTimeID;
	if ( DEBUG_ScheduleClassDrop_Change_calendar_class_id ) { console.log("\t"+'REPLACED e_calendar_class.id='+e_calendar_class.id); }
	//console.log('newTimeID = ' + newTimeID);
	// END Change the calendar_class div.id.
	if ( DEBUG_ScheduleClassDrop_Change_calendar_class_id ) { console.log('END Change the calendar_class div.id.'); }		
	/**/
	// Redraw the calendar
	DisplaySchedule('ScheduleClassDrop 1410');
} // END ScheduleClassDrop.

// ScheduleClass_Open(scheduleId, departmentId, scheduleclassId)
// Open the dialogDiv with the scheduleclass info loaded.
function ScheduleClass_Open(scheduleId, departmentId, scheduleclassId) {
	//console.warn('ScheduleClass_Open(scheduleId='+scheduleId+', departmentId='+departmentId+', scheduleclassId='+scheduleclassId+')');
	var e_dialogDiv = document.getElementById('dialogDiv');
	var dialogDivContents = e_dialogDiv.innerHTML;
	if ( dialogDivContents.indexOf('Load OK') !== -1 ) { // Did the dialog contents load OK?
		e_dialogDiv.style.display = 'block';
		// Get ClassMeeting count.
		var MeetingCount;
		if ( typeof ClassMeeting[scheduleclassId] !== 'undefined' ) {
			MeetingCount = ClassMeeting[scheduleclassId].length;
		} else {
			MeetingCount = 1;
		}
		console.log('ClassMeeting['+scheduleclassId+'].length='+MeetingCount);
		ScheduleClassDialogSetWidth(MeetingCount); // Set dialog width.
		// BEGIN Position the dialog.
		var e_dialogContainer = document.getElementById('dialogContainer');
		var docScroll = document.documentElement;
		var docLeft = (window.pageXOffset || docScroll.scrollLeft) - (docScroll.clientLeft || 0);
		var docTop = (window.pageYOffset || docScroll.scrollTop)  - (docScroll.clientTop || 0);
		if ( dialogContainerLeft < docLeft ) {
			dialogContainerLeft = docLeft;
			e_dialogContainer.style.left = dialogContainerLeft+'px';
		}
		if ( dialogContainerLeft < 0 ) {
			dialogContainerLeft = 0;
			e_dialogContainer.style.left = dialogContainerLeft+'px';
		}
		if ( dialogContainerTop < docTop ) {
			dialogContainerTop = docTop;
			e_dialogContainer.style.top = dialogContainerTop+'px';
		}
		// Make sure dialog is rendered in the viewport
		if ( dialogContainerTop > docTop ) {
			// Get the distance of the sidenav from the top
			// By getting this, it insures the dialogDiv will never render above the top of the sidenav
			// Without this the dialog could render on the top navbar 
			var e_sidenav = document.getElementById("sidenav");
			var sidenavDistanceFromTop = parseInt(e_sidenav.style.top);

			// Check to see if dialog will be rendered above the sidenav
			if ( dialogContainerTop >= sidenavDistanceFromTop ) {
				dialogContainerTop = sidenavDistanceFromTop;
				e_dialogContainer.style.top = dialogContainerTop+'px';
			} else {
				dialogContainerTop = docTop;
				e_dialogContainer.style.top = dialogContainerTop+'px';
			}			
		}
		if ( dialogContainerTop < 0 ) {
			dialogContainerTop = 0;
			e_dialogContainer.style.top = dialogContainerTop+'px';
		}
		//e_dialogDiv.style.display = 'block';
		// END Position the dialog.
		
		// Get legend button and add drag event listener
		var e_legends = e_dialogContainer.getElementsByTagName("legend");
		e_legends[0].onmousedown = ScheduleClassDialogDrag;

	} else { // Did the dialog contents load OK?
		// No.
		if ( ScheduleClassOpenCount < 5 ) {
			ScheduleClassOpenCount++;
			URI = '/Schedule/ScheduleClass/ScheduleClassForm.php?scheduleId='+scheduleId+'&departmentId='+departmentId;
			if ( typeof scheduleclassId !== 'undefined' ) { URI += '&scheduleclassId='+scheduleclassId; }
			eId = 'dialogDiv';
			preloadText = 'Getting class';
			
			console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+eId+"', '"+preloadText+"'];");
			
			UpdateInclude(URI, eId, preloadText);
			//console.warn('console.warn 949');
			setTimeout(function(){ScheduleClass_Open(scheduleId, departmentId, scheduleclassId);},ScheduleClassOpenCount*1000);
		} else {
			alert('Never got return from URI='+URI);
		}
	} // Did the dialog contents load OK?
} // END ScheduleClass_Open.

// ScheduleClass_OpenAdd(scheduleId, departmentId)
// Add a class to the schedule.
//   scheduleId = The scheduleId for the current schedule.
// departmentId = The departmentId for the current schedule.
function ScheduleClass_OpenAdd(scheduleId, departmentId) {
	//e_dialogContainer.style.zIndex = dialogContainerZindex;
	var e_dialogDiv = document.getElementById('dialogDiv');
	e_dialogDiv.style.display = 'none';
	e_dialogDiv.innerHTML = '';
	ScheduleClassOpenCount = 0;
	ScheduleClass_Open(scheduleId, departmentId, 0);
	document.addEventListener('scroll', ScheduleClass_ScrollHandler, false);
	return false;
} // END ScheduleClass_OpenAdd.

// ScheduleClass_OpenEdit(evt)
// Edit the class.
function ScheduleClass_OpenEdit(evt) {
	var DEBUG_ScheduleClass_OpenEdit = true;
	evt = (evt) ? evt : window.event;
	if ( DEBUG_ScheduleClass_OpenEdit ) { console.warn('ScheduleClass_OpenEdit[] this.id='+this.id+' evt.currentTarget.id='+evt.currentTarget.id+' mousedownFlag='+mousedownFlag); }
	ClearTextSelection();
	
	evt.currentTarget.removeEventListener('mousemove', ScheduleClassDragCheckWait);
	if ( mousedownFlag === 'mousemove' || evt.button !== 0 ) {
		mousedownFlag = '';
		return;
	}
	mousedownFlag = 'click';
	// Get scheduleclassId.
	var calendar_class_parts = this.id.split('_');
	currentOpenScheduleClassId = parseInt(calendar_class_parts[2]);
	console.log('currentOpenScheduleClassId='+currentOpenScheduleClassId);
	// Reset the ScheduleClassOpenCount counter.
	ScheduleClassOpenCount = 0;
	// Clear the dialogDiv div.
	var e_dialogDiv = document.getElementById('dialogDiv');
	e_dialogDiv.innerHTML = '';
	console.warn('ScheduleClass_Open[scheduleId='+CurrentSchedule.scheduleId+', departmentId='+CurrentSchedule.departmentId+', currentOpenScheduleClassId='+currentOpenScheduleClassId+'];');
	ScheduleClass_Open(CurrentSchedule.scheduleId, CurrentSchedule.departmentId, currentOpenScheduleClassId);
	document.addEventListener('scroll', ScheduleClass_ScrollHandler, false);
} // END ScheduleClass_OpenEdit.

// ScheduleImportClasses(thisTask)
// Handle class import from another schedule.
function ScheduleImportClasses(thisTask) {
	var DEBUG_ScheduleImportClasses = true;
	if ( typeof thisTask === 'undefined' ) { thisTask = ''; }
	if ( DEBUG_ScheduleImportClasses ) { console.warn('ScheduleViewSettings[thisTask='+thisTask+']'); }
	var eId = 'div_ScheduleFunctionsContainer';
	var e = document.getElementById(eId);
	var eDisplay = e.style.display; // Get schedulecontainer height.
	if ( DEBUG_ScheduleImportClasses ) { console.log('eDisplay='+eDisplay); }
	if ( DEBUG_ScheduleImportClasses && eDisplay === 'block' ) { console.log("e.innerHTML.indexOf('Import classes into')="+e.innerHTML.indexOf('Import classes into')); }
	if ( thisTask === '' && eDisplay === 'block' && e.innerHTML.indexOf('Import classes into') !== -1 ) {
		ScheduleTaskShow('ScheduleImportClasses 1528');
		return false;
	} else {
		ScheduleTaskHide();
	}
	switch ( thisTask ) { // switch thisTask.
		case '':
			URI = ROOT_http+'/Schedule/ScheduleImportClasses/ScheduleImportClasses.php';
			var preloadText = '<br><br><span class="bold info">Getting import form. Please wait ...</span><br><br><br>';
			
			console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', '"+eId+"', '"+preloadText+"'];");
			
			UpdateInclude(URI, eId, preloadText);
			//setTimeout(DisplaySchedule,50);
			window.scrollTo(0, 0);
		break;
		case 'Import classes':
			
			if ( DEBUG_ScheduleImportClasses ) {
				
			}
		break;
		case 'Cancel':
			document.getElementById(eId).style.display = 'none';
			ScheduleTaskShow('ScheduleImportClasses 1552');
		break;
	} // switch thisTask.
	return false;
} // END ScheduleImportClasses.

// ScheduleImportClasses_ScheduleButtonCheck(e)
// Enable/disable Change schedule button.
function ScheduleImportClasses_ScheduleButtonCheck(e) {
	var scheduleIdSelected = document.getElementById('sel_scheduleId').value;
	console.log('scheduleIdSelected='+scheduleIdSelected);
	if ( scheduleIdSelected ) {
		document.getElementById('btn_Import_schedule_classes').disabled = false;
	} else {
		document.getElementById('btn_Import_schedule_classes').disabled = true;
	}
} // END ScheduleImportClasses_ScheduleButtonCheck.

// ScheduleImportClasses_ParseButtonCheck(e)
// Enable/disable Change schedule button.
function ScheduleImportClasses_ParseButtonCheck(e) {
	var scheduleIdSelected = document.getElementById('sel_sessionId').value;
	console.log('scheduleIdSelected='+scheduleIdSelected);
	if ( scheduleIdSelected ) {
		document.getElementById('btn_Import_parsed_classes').disabled = true;//false;
	} else {
		document.getElementById('btn_Import_parsed_classes').disabled = true;
	}
} // END ScheduleImportClasses_ParseButtonCheck.

// ScheduleTaskHide()
// Hide the schedule and display the div_ScheduleFunctionsContainer.
function ScheduleTaskHide() {
	if ( document.getElementById('schedulecontainer') ) {
		var ContainerHeight = Math.max(document.getElementById('schedulecontainer').offsetHeight,document.getElementById('div_ScheduleFunctionsContainer').offsetHeight); // Get schedulecontainer height.
		//console.log('ContainerHeight='+ContainerHeight);
		document.getElementById('schedulecontainer').style.display = 'none'; // Hide the main schedulecontainer.
		document.getElementById('div_CalendarKey').style.display = 'none'; // Hide the calendar key.
		var scheduleClasses = document.getElementsByClassName('calendar_class');
		for ( var i=0; i<scheduleClasses.length; i++ ) {
			scheduleClasses[i].style.display = 'none'; // Hide each schedule class.
		}
		document.getElementById('div_ScheduleFunctionsContainer').style.height = ContainerHeight+'px'; // Set div_ScheduleFunctionsContainer height the same as the main schedulecontainer.
		document.getElementById('div_ScheduleFunctionsContainer').style.display = 'block'; // Show the div_ScheduleFunctionsContainer.
	}
	return false;
} // END ScheduleTaskHide.

// ScheduleTaskShow(callDisplaySchedule)
// Show the schedule and hide the div_ScheduleFunctionsContainer.
function ScheduleTaskShow(by,callDisplaySchedule) {
	console.warn('ScheduleTaskShow[by='+by+', callDisplaySchedule='+callDisplaySchedule+']');
	if ( document.getElementById('schedulecontainer') ) {
		//document.getElementById('schedulecontainer').style.display = 'block'; // Show the main schedulecontainer.
		document.getElementById('div_CalendarKey').style.display = 'block'; // Show the calendar key.
		var scheduleClasses = document.getElementsByClassName('calendar_class');
		for ( var i=0; i<scheduleClasses.length; i++ ) {
			scheduleClasses[i].style.display = 'block'; // Show each schedule class.
		}
		document.getElementById('div_ScheduleFunctionsContainer').style.display = 'none'; // Hide the div_ScheduleFunctionsContainer.
	}
	//if ( typeof callDisplaySchedule === 'undefined' || !callDisplaySchedule ) { DisplaySchedule('1613 '+by); } // Re-display the schedule.
	DisplaySchedule('ScheduleTaskShow 1622 '+by);
	return false;
} // END ScheduleTaskShow.

// ScheduleClass_ScrollHandler()
// Reposition the Schedule Class dialog on page scroll
function ScheduleClass_ScrollHandler() {
	var DEBUG_ScheduleClass_ScrollHandler = true;
	if ( DEBUG_ScheduleClass_ScrollHandler ) { console.warn('ScheduleClass_ScrollHandler[]'); }
	ScheduleClass_Open(CurrentSchedule.scheduleId, CurrentSchedule.departmentId);
} // END ScheduleClass_ScrollHandler

// SetClassEndTime(e)
// Set the class end time based on the # credits, # meeting days, and if lab.
function SetClassEndTime(e) {
	var DEBUG_SetClassEndTime = true;
	if ( DEBUG_SetClassEndTime ) { console.warn('SetClassEndTime[e.id='+e.id+']'); }
	// 
	 //chkAutoEnd.checked='+document.getElementById('chkAutoEnd').checked
	
	var EndTime;
	if ( document.getElementById('chkAutoEnd').checked ) {
		document.getElementById('spn_asLab').style.display = 'inline';
		// Get course credits.
		var CourseId = document.getElementById('id_courseid').value;
		var CourseCredits = Course[CourseId].Cr;
		if ( DEBUG_SetClassEndTime ) { console.log(Course[CourseId].Title+' CourseCredits='+CourseCredits); }
		// Get meeting days.
		var dayRadios = document.getElementsByName('weekdayIds[]');
		if ( DEBUG_SetClassEndTime ) { console.log('dayRadios.lenght='+dayRadios.length); }
		var days = 0;
		for ( var i=0; i<dayRadios.length; i++ ) { if ( dayRadios[i].checked ) { days++; } }
		if ( DEBUG_SetClassEndTime ) { console.log('days='+days); }
		if ( days > 0 ) {
			// Get beginning time.
			var BeginTime = document.getElementById('id_scheduleclassmeetingBeginTime').value;
			if ( BeginTime ) {
				var flags = '';
				if ( BeginTime.indexOf('m') !== -1 ) { flags = 'a'; } else { if ( BeginTime.indexOf('M') !== -1 ) { flags = 'P'; } }
				var BeginMin = ConvertTimeToMinutes(BeginTime);
				if ( DEBUG_SetClassEndTime ) { console.log('BeginTime='+BeginTime+' BeginMin='+BeginMin+' flags='+flags); }
				var meetingMinutes;
				if ( !document.getElementById('chkAsLab').checked ) {
					meetingMinutes = parseInt( 50 * parseInt(CourseCredits) / days );
				} else {
					meetingMinutes = parseInt( 110 * parseInt(CourseCredits) / days );
				}
				var EndMin = BeginMin + meetingMinutes;
				if ( DEBUG_SetClassEndTime ) { console.log('meetingMinutes='+meetingMinutes+' EndMin='+EndMin); }
				EndTime = ConvertMinutesToTime(EndMin,flags);
				if ( DEBUG_SetClassEndTime ) { console.log('EndTime='+EndTime); }
			} else {
			EndTime = '';
			if ( DEBUG_SetClassEndTime ) { console.log('No begin time, EndTime='+EndTime); }
			}
		} else {
			EndTime = '';
			if ( DEBUG_SetClassEndTime ) { console.log('No days, EndTime='+EndTime); }
		}
		document.getElementById('id_scheduleclassmeetingEndTime').value = EndTime;
	} else {
		document.getElementById('spn_asLab').style.display = 'none';
	}
} // END SetClassEndTime.

// SetupBuildingSelectOptions(e)
// Set the options for the building select.
function SetupBuildingSelectOptions(e) {
	var DEBUG_SetupBuildingSelectOptions = true;
	if ( DEBUG_SetupBuildingSelectOptions ) { console.log('BEGIN SetupBuildingSelectOptions[e.Id='+e.id+']'); }
	// Get the campusId.
	campusId = parseInt(e.value);
	if ( DEBUG_SetupBuildingSelectOptions ) { console.log('campusId='+campusId); }
	var eId = e.id.split('_');
	var scmId = eId[1];
	var campusIndex = parseInt(eId[2]); // Get the room order.
	if ( DEBUG_SetupBuildingSelectOptions ) { console.log('scmId='+scmId+' campusIndex='+campusIndex); }
	// Clear the building select.
	var eBuildingId = 'selBuilding_'+scmId+'_'+campusIndex;
	if ( DEBUG_SetupBuildingSelectOptions ) { console.log('eBuildingId='+eBuildingId); }
	var eBuilding = document.getElementById(eBuildingId); // Get building select.
	eBuilding.options.length = 0;
	// Clear the room select.
	var eRoomId = 'selRoom_'+scmId+'_'+campusIndex;
	if ( DEBUG_SetupBuildingSelectOptions ) { console.log('eRoomId='+eRoomId); }
	var eRoom = document.getElementById(eRoomId); // Get room select.
	eRoom.options.length = 0;
	var opt = document.createElement('option');
	opt.value = '';
	opt.innerHTML = '';
	eBuilding.appendChild(opt);
	/**/
	if ( DEBUG_SetupBuildingSelectOptions ) { console.log('CollegeBuilding.length='+CollegeBuilding.length+' campusId='+campusId); }
	for ( var i=0; i<CollegeBuilding.length; i++  ) {
		//if ( DEBUG_SetupBuildingSelectOptions ) { console.log('CollegeBuilding['+i+'].campusId='+CollegeBuilding[i].campusId); }
		if ( CollegeBuilding[i].campusId === campusId ) {
			if ( DEBUG_SetupBuildingSelectOptions ) { console.log('CollegeBuilding['+i+'].buildingId='+CollegeBuilding[i].buildingId); }
			if ( DEBUG_SetupBuildingSelectOptions ) { console.log('CollegeBuilding['+i+'].Code='+CollegeBuilding[i].Code); }
			opt = document.createElement('option');
			opt.value = CollegeBuilding[i].buildingId;
			//if ( buildingId === CollegeBuilding[i].buildingId ) { opt.selected = true; }
			opt.innerHTML = CollegeBuilding[i].Code;
			eBuilding.appendChild(opt);
		}
	}
	eRoom = document.getElementById('selRoom_'+scmId+'_'+campusIndex); // Get room select.
	eRoom.options.length = 0;
	/**/
	if ( !isNaN(campusId) ) {
		document.getElementById('labBuilding_'+scmId+'_'+campusIndex).style.display = 'inline-block';
	} else {
		var eBuildingLabelId = 'labBuilding_'+scmId+'_'+campusIndex;
		if ( DEBUG_SetupBuildingSelectOptions ) { console.log('Hide '+eBuildingLabelId); }
		var eBuildingLabel = document.getElementById(eBuildingLabelId);
		eBuildingLabel.style.display = 'none';
		var eRoomLabelId = 'labRoom_'+scmId+'_'+campusIndex;
		if ( DEBUG_SetupBuildingSelectOptions ) { console.log('Hide '+eRoomLabelId); }
		var eRoomLabel = document.getElementById(eRoomLabelId);
		eRoomLabel.style.display = 'none';
	}
	SetupNextCampusSelectOptions(scmId, campusIndex);
} // END SetupBuildingSelectOptions.

// SetupInstructorOptions(e)
// Set the options for the next instructor select.
// Any already selected instructores are not added to the select.
function SetupInstructorOptions(e) {
	var DEBUG_setInstructor = true;
	var c,
			thisSelectId, thisSelect;
	if ( DEBUG_setInstructor ) { console.log('BEGIN SetupInstructorOptions[e.id='+e.id+']'); }
	var eIdParts = e.id.split('_');
	var scmId = eIdParts[1];
	//var campusIndex = parseInt(eIdParts[2]);
	//var instructorIndex = parseInt(eIdParts[3]);
	var instructorIndex = parseInt(eIdParts[2]);
	if ( DEBUG_setInstructor ) { console.log('ScheduleInstructor.length='+ScheduleInstructor.length); }
	var InstructorIdsSelected = []; // Array of instructorIds that have been selected to this point.
	for ( c=0; c<ScheduleInstructor.length; c++ ) { // Loop thru instructor indexes.
		thisSelectId = 'selInstructor_'+scmId+'_'+c;
		if ( DEBUG_setInstructor ) { console.log('thisSelectId='+thisSelectId); }
		thisSelect = document.getElementById(thisSelectId);
		SelectedInstructorId = parseInt(thisSelect.options[thisSelect.selectedIndex].value);
		if ( DEBUG_setInstructor ) { console.log('SelectedInstructorId='+SelectedInstructorId); }
		if ( !isNaN(SelectedInstructorId) ) { InstructorIdsSelected.push(SelectedInstructorId); } // Add the instructorId to the array.
	} // Loop thru instructor indexes.
	if ( DEBUG_setInstructor ) { console.log('InstructorIdsSelected='+InstructorIdsSelected); }
	for ( c=0; c<ScheduleInstructor.length; c++ ) { // Loop thru instructor indexes.
		thisSelectId = 'selInstructor_'+scmId+'_'+c;
		if ( DEBUG_setInstructor ) { console.log('thisSelectId='+thisSelectId); }
		thisSelect = document.getElementById(thisSelectId);
		console.log('thisSelect.selectedIndex='+thisSelect.selectedIndex);
		SelectedInstructorId = parseInt(thisSelect.options[thisSelect.selectedIndex].value);
		if ( !isNaN(SelectedInstructorId) ) {
			SelectedIndex = thisSelect.selectedIndex;
		} else {
			SelectedInstructorId = 0; SelectedIndex = 0;
		}
		if ( DEBUG_setInstructor ) { console.log('SelectedInstructorId='+SelectedInstructorId+' SelectedIndex='+SelectedIndex); }
		thisSelect.options.length = 0;
		var opt = document.createElement('option');
		opt.value = '';
		opt.innerHTML = '';
		thisSelect.appendChild(opt);
		/**/
		for ( var i=0; i<ScheduleInstructor.length; i++  ) {
			if ( ScheduleInstructor[i].instructorId === SelectedInstructorId || InstructorIdsSelected.indexOf(ScheduleInstructor[i].instructorId) === -1 ) { 
				if ( DEBUG_setInstructor ) { console.log('Adding selInstructor_'+c+' option for '+ScheduleInstructor[i].Name+'.'); }
				opt = document.createElement('option');
				opt.value = ScheduleInstructor[i].instructorId;
				opt.innerHTML = ScheduleInstructor[i].Name;
				thisSelect.appendChild(opt);
			}
		}
		if ( SelectedInstructorId ) {
			//thisSelect.selectedIndex = SelectedInstructorId;
			thisSelect.value = SelectedInstructorId;
		}
	} // Loop thru instructor indexes.
} // END SetupInstructorOptions.

// SetupNextCampusSelectOptions(scmId, campusIndex)
// Set the options for the next campus select.
// Any already selected campuses are not added to the select.
function SetupNextCampusSelectOptions(scmId, campusIndex) {
	var DEBUG_SetupNextCampusSelectOptions = true;
	if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('BEGIN SetupNextCampusSelectOptions[scmId='+scmId+', campusIndex='+campusIndex+']'); }
	if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('CollegeCampus.length='+CollegeCampus.length); }
	var CampusIdsSelected = []; // Array of campusIds that have been selected to this point.
	for ( var c=0; c<=campusIndex; c++ ) { // Loop thru campuses.
		var thisSelectId = 'selCampus_'+scmId+'_'+c;
		if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('thisSelectId='+thisSelectId); }
		var thisSelect = document.getElementById(thisSelectId);//CollegeCampus[c].campusId);
		SelectedCampusId = parseInt(thisSelect.options[thisSelect.selectedIndex].value);
		if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('SelectedCampusId='+SelectedCampusId); }
		if ( !isNaN(SelectedCampusId) ) { CampusIdsSelected.push(SelectedCampusId); } // Add the campusId to the array.
	} // Loop thru campuses.
	if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('CampusIdsSelected='+CampusIdsSelected); }
	var NextCampusIndex = campusIndex+1;
	if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('typeof CollegeCampus['+NextCampusIndex+']='+(typeof CollegeCampus[NextCampusIndex])); }
	if ( typeof CollegeCampus[NextCampusIndex] !== 'undefined' ) { // Is there another campus after the current one.
		var NextCampusSelect = document.getElementById('selCampus_'+scmId+'_'+NextCampusIndex);
		NextCampusSelect.options.length = 0;
		var opt = document.createElement('option');
		opt.value = '';
		opt.innerHTML = '';
		NextCampusSelect.appendChild(opt);
		for ( var i=0; i<CollegeCampus.length; i++  ) {
			if ( CampusIdsSelected.indexOf(CollegeCampus[i].campusId) === -1 ) { 
				if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('Adding option for '+CollegeCampus[i].Name+'.'); }
				opt = document.createElement('option');
				opt.value = CollegeCampus[i].campusId;
				opt.innerHTML = CollegeCampus[i].Name;
				NextCampusSelect.appendChild(opt);
			}
		}
		// Clear the building select.
		var eBuildingId = 'selBuilding_'+scmId+'_'+NextCampusIndex;
		if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('eBuildingId='+eBuildingId); }
		var eBuilding = document.getElementById(eBuildingId); // Get building select.
		eBuilding.options.length = 0;
		var eBuildingLabelId = 'labBuilding_'+scmId+'_'+NextCampusIndex;
		var eBuildingLabel = document.getElementById(eBuildingLabelId);
		eBuildingLabel.style.display = 'none';
		// Clear the room select.
		var eRoomId = 'selRoom_'+scmId+'_'+NextCampusIndex;
		if ( DEBUG_SetupNextCampusSelectOptions ) { console.log('eRoomId='+eRoomId); }
		var eRoom = document.getElementById(eRoomId); // Get room select.
		eRoom.options.length = 0;
		var eRoomLabelId = 'labRoom_'+scmId+'_'+NextCampusIndex;
		var eRoomLabel = document.getElementById(eRoomLabelId);
		eRoomLabel.style.display = 'none';
	} // Is there another Campus after the current one.
} // END SetupNextCampusSelectOptions.

// SetupRoomSelectOptions()
// Set the options for the room select.
function SetupRoomSelectOptions(e) {
	var DEBUG_SetupRoomSelectOptions = true;
	if ( DEBUG_SetupRoomSelectOptions ) { console.log('BEGIN SetupRoomSelectOptions[e.Id='+e.Id+']'); }
	// Get the buildingId.
	buildingId = parseInt(e.value);
	if ( DEBUG_SetupRoomSelectOptions ) { console.log('buildingId='+buildingId); }
	// Get the room order.
	var eId = e.id.split('_');
	var scmId = eId[1];
	var roomOrder = parseInt(eId[2]); // Get the room order.
	if ( DEBUG_SetupRoomSelectOptions ) { console.log('scmId='+scmId+' roomOrder='+roomOrder); }
	eRoom = document.getElementById('selRoom_'+scmId+'_'+roomOrder); // Get room select.
	eRoom.options.length = 0;
	var opt = document.createElement('option');
	opt.value = '';
	opt.innerHTML = '';
	eRoom.appendChild(opt);
	for ( var i=0; i<CollegeRoom.length; i++ ) {
		if ( CollegeRoom[i].buildingId === buildingId ) {
			opt = document.createElement('option');
			opt.value = CollegeRoom[i].roomId;
			//if ( roomId === CollegeRoom[i].roomId ) { opt.selected = true; }
			opt.innerHTML = CollegeRoom[i].Number;
			eRoom.appendChild(opt);
		}
	}
	if ( !isNaN(buildingId) ) {
		document.getElementById('labRoom_'+scmId+'_'+roomOrder).style.display = 'inline-block';
	} else {
		var eRoomLabelId = 'labRoom_'+scmId+'_'+roomOrder;
		if ( DEBUG_SetupRoomSelectOptions ) { console.log('Hide '+eRoomLabelId); }
		var eRoomLabel = document.getElementById(eRoomLabelId);
		eRoomLabel.style.display = 'none';
	}
} // END SetupRoomSelectOptions.

// ShowInstructorButton(e)
// Show + add instructor button.
function ShowInstructorButton(e) {
	//console.warn('ShowInstructorButton[instructorId='+instructorId+']');
	var eIdParts = e.id.split('_');
	var scmId = eIdParts[1];
	//var campusIndex = parseInt(eIdParts[2]);
	var instructorIndex = parseInt(eIdParts[2]);
	console.log('scmId='+scmId+' instructorIndex='+instructorIndex);
	if ( document.getElementById('btnShowInstructor_'+scmId+'_'+instructorIndex) ) { document.getElementById('btnShowInstructor_'+scmId+'_'+instructorIndex).style.display = 'inline'; }
} // END ShowInstructorButton.

// ShowInstructorNext(e)
// Show next select element for instructor.
function ShowInstructorNext(e) {
	console.log('BEGIN ShowInstructorNext[e.id='+e.id+']');
	var eIdParts = e.id.split('_');
	var scmId = eIdParts[1];
	//var campusIndex = parseInt(eIdParts[2]);
	//var instructorIndex = parseInt(eIdParts[3]);
	var instructorIndex = parseInt(eIdParts[2]);
	var instructorIndexNext = instructorIndex + 1;
	console.log('scmId='+scmId+' instructorIndex='+instructorIndex+' instructorIndexNext='+instructorIndexNext);
	var btnShowInstructorId = 'btnShowInstructor_'+scmId+'_'+instructorIndex;
	console.log('btnShowInstructorId='+btnShowInstructorId);
	document.getElementById(btnShowInstructorId).style.display = 'none'; // Hide the current + button.
	var divInstructorId = 'divInstructor_'+scmId+'_'+instructorIndexNext;
	console.log('divInstructorId='+divInstructorId);
	document.getElementById(divInstructorId).className = ''; // Remove hidden class.
} // END ShowInstructorNext.

// ShowNextCampus(scmId, nextCampusIndex)
// Show next select element for campus.
function ShowNextCampus(scmId, nextCampusIndex) {
	var DEBUG_ShowNextCampus = false;
	if ( DEBUG_ShowNextCampus ) { console.warn('ShowNextCampus[scmId='+scmId+' nextCampusIndex='+nextCampusIndex+']'); }
	var cmpusIndexPrevious = nextCampusIndex - 1;
	document.getElementById('btnShowRoom_'+scmId+'_'+cmpusIndexPrevious).style.display = 'none';
	var divRoomId = 'divRoom_'+scmId+'_'+nextCampusIndex;
	if ( DEBUG_ShowNextCampus ) { console.log ('divRoomId='+divRoomId); }
	var campusIndex = nextCampusIndex - 1;
	SetupNextCampusSelectOptions(scmId, campusIndex);
	document.getElementById(divRoomId).className = ''; // Remove hidden class.
} // END ShowNextCampus.

// ShowRoomButton(scmId, campusIndex)
// Show + add room button.
function ShowRoomButton(scmId, campusIndex) {
	var DEBUG_ShowRoomButton = true;
	if ( DEBUG_ShowRoomButton ) { console.log('BEGIN ShowRoomButton[scmId='+scmId+', campusIndex='+campusIndex+']'); }
	var btnShowRoomId = 'btnShowRoom_'+scmId+'_'+campusIndex;
	if ( DEBUG_ShowRoomButton ) { console.log('btnShowRoomId='+btnShowRoomId); }
	if ( document.getElementById(btnShowRoomId)) { document.getElementById(btnShowRoomId).style.display = 'inline'; }
} // END ShowRoomButton.

// SidenavToggle(sidenavClass)
// Show / hide side nav sub menu.
function SidenavToggle(sidenavClass) {
	ttHide();
	var subs = document.getElementsByClassName(sidenavClass);
	var ShowSub = false;
	var sidenavClassParts = sidenavClass.split(' ');
	var sidenavName = sidenavClassParts[0];
	for ( var i=0; i<subs.length; i++ ) {
		//console.log('subs[i].style.display='+subs[i].style.display);
		if ( subs[i].style.display === 'inline-block' ) {
			subs[i].style.display = 'none';
		} else {
			ShowSub = true;
			subs[i].style.display = 'inline-block';
		}
	}
	if ( ShowSub ) {
		document.getElementById('a_'+sidenavName).onmouseover = function(){ttShow('Close '+sidenavName.toLowerCase()+' sub menu.');};
		document.getElementById('spn_'+sidenavName).className = 'fa fa-caret-square-o-up';
		ttShow('Close '+sidenavName+' task menu.');
	} else {
		document.getElementById('a_'+sidenavName).onmouseover = function(){ttShow('Open '+sidenavName.toLowerCase()+' sub menu.');};
		document.getElementById('spn_'+sidenavName).className = 'fa fa-caret-square-o-down';
		ttShow('Open '+sidenavName+' task menu.');
	}
	return false;
} // END SidenavToggle.

function SaveAutoscrollPosition() { // by Garrett Wiley.
	document.cookie = "sp=" + document.getElementById("schedulecontainer").getBoundingClientRect().top;
} // END SaveAutoscrollPosition by Garrett Wiley.


function AutoscrollPage(todelete) { // by Garrett Wiley.
	var cook = document.cookie.split(" ");
	var scrollPos = 0;
	var scheduleVar = document.getElementById("schedulecontainer");
	//if(bcrt == 0)bcrt = scheduleVar.getBoundingClientRect().top;
	if(bcrt === 0){bcrt = scheduleVar.getBoundingClientRect().top;}
	
	for(var i = 0; i < cook.length; i++) {
		if(cook[i].substr(0, 3) === "sp=") {
			scrollPos = bcrt - parseInt(cook[i].replace(";", "").substr(3, cook[i].length-3));
		}
	}
	
	if(todelete === 1) {
		document.cookie = "sp=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}
	
	window.scrollTo(0, scrollPos);
} // END AutoscrollPage by Garrett Wiley.

document.addEventListener('DOMContentLoaded', function() { // addEventListener for AutoscrollPage by Garrett Wiley. See https://www.rgraph.net/canvas/docs/the-domcontentloaded-event.html
	AutoscrollPage(1);
}, false);

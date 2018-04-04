// Schedule/schedule3.js
// For use by Cody Kurowski

// ScheduleClassDrop(evt)
// handle schedule class drop.
function ScheduleClassDrop(evt) {
	var DEBUG_ScheduleClassDrop = true;
	evt = (evt) ? evt : window.event;
	if ( DEBUG_ScheduleClassDrop ) { console.warn('ScheduleClassDrop[] evt.currentTarget.id='+evt.currentTarget.id); }
	dragElement.style.zIndex = 10;
	var redrawCalendarOK = true;
	// BEGIN Find where class meeting was dropped.
	// Get mouse position.
	var mX = mouseX(evt);
	var mY = mouseY(evt);
	//console.log('mX='+mX+' mY='+mY);
	dragElementTLNow = elementBounds(dragElement.id,1153); // Calculate upper left corner position of class meeting.
	//console.log('dragElementTLNow left='+dragElementTLNow.left+' top='+dragElementTLNow.top);
	// Loop thru schedule tds.
	var daysOfWeek = ['U','M','T','W','H','F','S']; // This should come from Weekdays.
	var dayIndexMin; // Min day index in the schedule view.
	var dayIndexMax; // Max day index in the schedule view.
	var dayMovedTo = '';
	var droppedInCalendarDayTime = false;
	var timeMovedTo = '';
	var m1 = 0;
	if ( ScheduleDayView === 'Work week' ) {
		dayIndexMin = 1;
		dayIndexMax = 5;
	} else {
		dayIndexMin = 0;
		dayIndexMax = 6;
	}
	var minTimeBegin = ScheduleTimeBegin * 60; // The beginning time in the schedule view.
	var minTimeEnd = ScheduleTimeEnd * 60; // The ending time in the schedule view.
	daysOfWeekLoop:
	for ( var d=dayIndexMin; d<=dayIndexMax; d++ ) { // Loop thru the days in the schedule view.
		//console.log('d='+d+' daysOfWeek[d]='+daysOfWeek[d]);
		dayMovedTo = daysOfWeek[d];
		for ( timeMovedTo=minTimeBegin; timeMovedTo<=minTimeEnd; timeMovedTo+=ScheduleTimeIncrement ) { // Loop thru the times in the schedule view.
			var tdId = dayMovedTo + timeMovedTo;
			var eTD = document.getElementById(tdId); // The td we are testing.
			var tdTL = elementBounds(tdId,1178);
			var tdWidth = eTD.offsetWidth;
			var tdHeight = eTD.offsetHeight;
			var tdRight = tdTL.left + tdWidth;
			var tdBottom = tdTL.top + tdHeight;
			//console.log('left='+tdTL.left+' top='+tdTL.top+' right='+tdRight+' bottom='+tdBottom+' width='+tdWidth+' height='+tdHeight);
			if ( dragElementTLNow.left >= tdTL.left &&  dragElementTLNow.left <= tdRight && dragElementTLNow.top >= tdTL.top &&  dragElementTLNow.top <= tdBottom ) { // Did the class meeting get dropped here?
				droppedInCalendarDayTime = true;
				console.log('Dropped in '+tdId);
				// Snap class meeting to left top of schedule td.
				var tdBounds = elementBounds(tdId,1188);
				if ( DEBUG_ScheduleClassDrop ) { console.log('tdBounds left='+tdBounds.left+' top='+tdBounds.top+' width='+tdBounds.width); }
				dragElement.style.left = tdBounds.left + 1 + 'px';
				dragElement.style.top = tdBounds.top + 2 + 'px';
				var newBounds = elementBounds(dragElement.id,1192);
				if ( DEBUG_ScheduleClassDrop ) { console.log('newBounds left='+newBounds.left+' top='+newBounds.top); }
				break daysOfWeekLoop; // Found where it was dropped so we can stop looping.
			} // Did the class meeting get dropped here?
		} // Loop thru the times in the schedule view.
	} // Loop thru the days in the schedule view.
	// END Find where class meeting was dropped.
	var meetingMovedId;
	var scmId = 0;
	if ( droppedInCalendarDayTime ) { // Was the class meeting was dropped in a valid schedule day time?
		// BEGIN Check if it was OK to move the class meeting here.
		// Find old day of class meeting.
		var idParts = dragElement.id.split('_');
		meetingMovedId = parseInt(idParts[2]);
		var meetingMovedDay = idParts[3].substr(0,1);
		var meetingMovedTime = idParts[3].substr(1);
		console.log('ClassMeeting['+meetingMovedId+']='+JSON.stringify(ClassMeeting[meetingMovedId]));
		console.log('meetingMovedId='+meetingMovedId+' meetingMovedDay='+meetingMovedDay+' meetingMovedTime='+meetingMovedTime);
		// Find out which day we moved to.
		var meetingDay;
		var mdi;
		var dayFound = false;
		console.log('ClassMeeting[meetingMovedId].length='+ClassMeeting[meetingMovedId].length);
		console.log('dayMovedTo='+dayMovedTo);
		console.log('Search for meetingMovedDay='+meetingMovedDay);
		loopMeeting:
		for ( m1=0; m1<ClassMeeting[meetingMovedId].length; m1++ ) { // Loop thru meetings.
			console.log('ClassMeeting['+meetingMovedId+']['+m1+'].days='+ClassMeeting[meetingMovedId][m1].days);
			// Change bTime to mTime
			var mTime = ConvertTimeToMinutes(ClassMeeting[meetingMovedId][m1].bTime);
			console.log('mTime='+mTime+' meetingMovedTime='+meetingMovedTime);
			//if ( parseInt(mTime) === parseInt(meetingMovedTime) ) {
				for ( mdi=0; mdi<ClassMeeting[meetingMovedId][m1].days.length; mdi++ ) {
					meetingDay = ClassMeeting[meetingMovedId][m1].days[mdi];
					if ( meetingMovedDay === meetingDay ) { dayFound = true; break loopMeeting; }
				}
			//}
		}
		console.log('dayFound='+dayFound);
		if ( dayFound ) {
			scmId = ClassMeeting[meetingMovedId][m1].scmId;
			console.log('m1='+m1+' meetingDay='+meetingDay+' mdi='+mdi);
			console.log('Moved ClassMeeting['+meetingMovedId+']['+mdi+'] meeting from day '+meetingDay+' to '+dayMovedTo);
			// Find the day diff.
			var mIndexFrom = daysOfWeek.indexOf(meetingDay);
			var mIndexTo = daysOfWeek.indexOf(dayMovedTo);
			var dayDiff = mIndexTo - mIndexFrom;
			console.log('mIndexFrom='+mIndexFrom+' mIndexTo='+mIndexTo+' dayDiff='+dayDiff);
			var daysOK = true;
			for ( mdi=0; mdi<ClassMeeting[meetingMovedId][m1].days.length; mdi++ ) {
				meetingDay = ClassMeeting[meetingMovedId][m1].days[mdi];
				var thisDayIndex = daysOfWeek.indexOf(ClassMeeting[meetingMovedId][m1].days[mdi]);
				console.log('meetingDay='+meetingDay+' thisDayIndex='+thisDayIndex);
				var newDayIndex = thisDayIndex + dayDiff;
				if ( newDayIndex < dayIndexMin || newDayIndex > dayIndexMax ) {
					console.log('newDayIndex '+newDayIndex+' out of range '+dayIndexMin+'-'+dayIndexMax);
					daysOK = false;
					break;
				}
			}
			if ( daysOK ) {
				// Snap class meeting to left top of 
			}
		}
		// END Check if it was OK to move the class meeting here.
	} else { // Was the class meeting was dropped in a valid schedule day time?
		redrawCalendarOK = false;
	} // Was the class meeting was dropped in a valid schedule day time?
	if ( redrawCalendarOK ) {
		// document.getElementById(divIdOriginal).id = divIdNew;
		// The drop was OK and has been positioned on the calendar.
		// Need to: Done -- Set the ClassMeeting[scId] bTime, eTime, and days to the new values.
		//          Done -- Change div id to reflect new mTime. I.E. calendar_class_18_T780 (meetingMovedTime) becomes calendar_class_18_720 (timeMovedTo).
		//          Tell the database that the class has been moved. Use updateInclude(). --> A page reload should test this
		//          Change the div contents to display the new day and times. Will be done by updateInclude(). --> Double check that this is working
		//          Done -- Redraw the calendar.

		console.log('ClassMeeting['+meetingMovedId+']='+JSON.stringify(ClassMeeting[meetingMovedId]));
		console.log('ClassMeeting['+meetingMovedId+']['+m1+'] =' +JSON.stringify(ClassMeeting[meetingMovedId][m1]));
		console.log('meetingMovedDay = ' + meetingMovedDay);
		console.log('dayMovedTo = ' + dayMovedTo);

		// Does the tdTime need to be updated?
		// Update the ClassMeeting JSON object		
		ClassMeeting[meetingMovedId][m1].eTime = ConvertMinutesToTime(ConvertTimeToMinutes(ClassMeeting[meetingMovedId][m1].eTime) - (ConvertTimeToMinutes(ClassMeeting[meetingMovedId][m1].bTime) - timeMovedTo)); // Get new end time
		ClassMeeting[meetingMovedId][m1].bTime = ConvertMinutesToTime(timeMovedTo); // Get new day time
		// Find the day it was moved from in the days array and replace it
		for (let x = 0; x < ClassMeeting[meetingMovedId][m1].days.length; x++) {
			// If this the day the class was moved from, replace it
			if ( ClassMeeting[meetingMovedId][m1].days[x] === meetingMovedDay) {
				ClassMeeting[meetingMovedId][m1].days[x] = dayMovedTo;
			}
			
		}

		console.log('timeMovedTo='+timeMovedTo);
		console.log('ClassMeeting['+meetingMovedId+']='+JSON.stringify(ClassMeeting[meetingMovedId]));
		console.log('ClassMeeting[meetingMovedId] = ' + JSON.stringify(ClassMeeting[meetingMovedId]));
		console.log('ClassMeeting['+meetingMovedId+'].days.length='+ClassMeeting[meetingMovedId][m1].days.length);

		// Build the URL for the AJAX call
		var thisURL = '/Schedule/ScheduleClass/ScheduleClassUpdate.php?';
		thisURL += 'task=MoveClassMeeting';
		thisURL += '&scId='+meetingMovedId;
		thisURL += '&bTime='+ClassMeeting[meetingMovedId][m1].bTime;
		thisURL += '&eTime='+ClassMeeting[meetingMovedId][m1].eTime;
		var days = '';
		for ( var di=0; di<ClassMeeting[meetingMovedId][m1].days.length; di++) {
			days += ClassMeeting[meetingMovedId][m1].days[di];
		}
		thisURL += '&days='+days;
		// TODO: updateInclude() may have to use the newTimeID as the id may change before the data comes back, this should be tested
		UpdateInclude(thisURL, evt.target.id, false, 'Updating class'); // evt.target.id = calendar_class_21_T510

		// Set the new div id, this needs to be changed AFTER the updateInclude()
		var newTimeID = evt.target.id.substr(0, evt.target.id.lastIndexOf("_")) + "_" + dayMovedTo + timeMovedTo;
		document.getElementById(evt.target.id).id = newTimeID;
		console.log('newTimeID = ' + newTimeID);

		// Redraw the calendar
		DisplaySchedule();
	} else {
		// Put the class meeting back.
		console.info(dragElement.id+' not dropped in schedule td. dragElementOriginalTL left='+dragElementOriginalTL.left+' top='+dragElementOriginalTL.top);
		dragElement.style.left = dragElementOriginalTL.left + 'px';
		dragElement.style.top = dragElementOriginalTL.top + 'px';
	}
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


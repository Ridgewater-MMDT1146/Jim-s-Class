// Admin/Advising/Advising.js

var D = [ 'U', 'M', 'T', 'W', 'H', 'F', 'S' ]; // Weekdays: Sunday(U) thru Saturday(S).
var classMeetingsToDisplay = new Object(); // Class meetings that need to be displayed on the calendar.

// filterCampus(e, campus)
// Show/hide all classes from a campus.
// Also unchecks any classes from a hidden campus.
//      e = The radio that was checked or unchecked.
// campus = The name of the campus  that was checked or unchecked.
function filterCampus(e, campus) {
	console.warn('filterCampus[ campus='+campus+'] e.checked='+e.checked);
	var trs = document.getElementsByClassName(campus);
	var i;
	var c;
	var COU_ID;
	if ( e.checked ) {
		for ( i=0; i<trs.length; i++ ) {
			trs[i].style.display = 'table-row'; // Show campus classes.
		}
	} else {
		for ( i=0; i<trs.length; i++ ) { // Hide campus classes.
			trs[i].style.display = 'none';
		}
		// Uncheck all classes for the hidden campus.
		for ( c=0; c<COU_IDs[campus].length; c++ ) {
			COU_ID = COU_IDs[campus][c];
			if ( document.getElementById('chk_'+COU_ID).checked ) checkClass(COU_ID);
		}
	}
} // END filterCampus.

// checkClass(COU_ID)
// Create class divs as needed, hide classes as they are unchecked, and call displayCalandar() to display the classes on the calendar.
// COU_ID is the unique class id.
function checkClass(COU_ID) {
	console.warn('checkClass[COU_ID='+COU_ID+']');
	//console.log("PCLASS[COU_ID]['campus']="+PCLASS[COU_ID]['campus']);
	// Change background color and check or uncheck.
	var spaceInClass = parseInt(PCLASS[COU_ID]['MMAX']) - parseInt(PCLASS[COU_ID]['TENR']);
	if ( spaceInClass ) { if ( spaceInClass > parseInt(PCLASS[COU_ID]['MMAX'])/5 ) { cC = ' open'; } else { cC = ' close'; } } else { cC = ' full'; }
	var chkBox = document.getElementById('chk_'+COU_ID);
	if ( chkBox.checked ) {
		var checkedClass = ' unchecked'+PCLASS[COU_ID]['campus'];
		chkBox.checked = false;
	} else {
		var checkedClass = ' checked'+PCLASS[COU_ID]['campus'];
		chkBox.checked = true;
	}
	document.getElementById('td_'+COU_ID+'_chk').className = 'nmb sm '+cC+checkedClass;
	document.getElementById('td_'+COU_ID+'_class').className = 'nmb sm '+cC+checkedClass;
	document.getElementById('td_'+COU_ID+'_space').className = 'nmb sm right '+cC+checkedClass;
	for ( var i=0; i<PCLASS[COU_ID]['meeting'].length; i++ ) {
		document.getElementById('td_'+COU_ID+'_meeting_front_'+i).className = 'nmtb sm '+cC+checkedClass;
		document.getElementById('td_'+COU_ID+'_meeting_'+i).className = 'nmtb sm '+cC+checkedClass;
		document.getElementById('td_'+COU_ID+'_meeting_back_'+i).className = 'nmtb sm '+cC+checkedClass;
	}
	// BEGIN Show or hide class on calendar.
	var beginHour;
	var classMeetingElement;
	var classMeetingId;
	var classMeetingText;
	var daynumb;
	var meeting;
	var meetingDayLetter;
	var meetingDayLetters;
	var meetingDayNumber;
	for ( var m=0; m<PCLASS[COU_ID]['meeting'].length; m++ ) { // Loop thru meetings.
		meeting = PCLASS[COU_ID]['meeting'][m];
		beginHour = parseInt(meeting['begin']);
		var firstHour = beginHour;
		var lastHour = parseInt(meeting['end']+.017);
		//console.log('beginHour='+beginHour+' end='+meeting['end']+' firstHour='+firstHour+' lastHour='+lastHour);
		meetingDayLetters = meeting.DAYS.trim().replace(' ','');
		//console.log('meetingDayLetters='+meetingDayLetters);
		for ( var d=0; d<meetingDayLetters.length; d++ ) { // Loop thru days.
			meetingDayLetter = meetingDayLetters[d];
			meetingDayNumber = D.indexOf(meetingDayLetter);
			//console.log('meetingDayLetter='+meetingDayLetter+' meetingDayNumber='+meetingDayNumber);
			classMeetingId = 'classMeeting_'+COU_ID+'_'+meetingDayNumber;
			classMeetingElement;
			if ( chkBox.checked ) {
				// BEGIN Create or update the class meeting div.
				if ( !document.getElementById(classMeetingId) ) { // Does a div need to be created for this meeting?
					// yes, create the meeting div.
					classMeetingElement = document.createElement('div');
					classMeetingElement.id = classMeetingId;
					classMeetingElement.style.position = "absolute";
					classMeetingElement.style.display = 'none';
					classMeetingElement.className = 'classMeeting checked'+PCLASS[COU_ID]['campus']+cC;
					classMeetingText = '';
					classMeetingText += PCLASS[COU_ID]['SUBJ'] + PCLASS[COU_ID]['NBR'] + '-' + parseInt(PCLASS[COU_ID]['SECT']); // Add the course number and secction.
					if ( cC == ' full' ) classMeetingText += ' <span class="bold">(FULL)</span>'; // Add FULL if needed.
					classMeetingText += ' <span class="small">(' + COU_ID + ')</span>'; // Add the (COU_ID).
					classMeetingText += '<br>';
					classMeetingText += PCLASS[COU_ID]['TITLE'] + '<span class="small"> (' + parseInt(PCLASS[COU_ID]['CRHR']); // Add the course title and credits.

					if ( PCLASS[COU_ID]['CRMAX'] != '' ) classMeetingText += '-' + parseInt(PCLASS[COU_ID]['CRMAX']); // Add CRMAX if needed (variable credit class).
					classMeetingText += ' cr)</span>'; // Finish cr.
					classMeetingText += '<br>';
					classMeetingText += meeting['MTG_START'].substr(5,2) + '/' + meeting['MTG_START'].substr(8,2) + '/' + meeting['MTG_START'].substr(0,4) + ' - '; // Add the start date.
					classMeetingText += meeting['MTG_END'].substr(5,2) + '/' + meeting['MTG_END'].substr(8,2) + '/' + meeting['MTG_END'].substr(0,4); // Add the end date.
					if ( meeting['BLDG'] != '' ) { // Is there a building/room for the meeting?
						classMeetingText += '<br>';
						classMeetingText += 'Room ';
						if ( meeting['BLDG'] != 'MAINHU' ) classMeetingText += meeting['BLDG']; // Add the building code if not 'MAINHU'.
						classMeetingText += meeting['ROOM'] + ' '; // Add the room number.
					} // Is there a building/room for the meeting?
					classMeetingText += PCLASS[COU_ID]['INSTR_TYPE']; // Add the instruction type.
					classMeetingText += '<br>';
					classMeetingText += meeting['INSTRUCTOR'].replace('James Martinson','Jim Martinson').replace('Mark Hyberger','Rocky Hyberger'); // Add the instructor.
					if ( PCLASS[COU_ID]['SUBJ'] == 'CST' || PCLASS[COU_ID]['SUBJ'] == 'MMDT' ) {
						classMeetingText += '<br>';
						classMeetingText += 'This class is available remotely with broadband internet.';
					}
					// Add class notes.
					var classNotes = new Array();
					for ( var n=0; n<PCLASS[COU_ID]['note'].length; n++ ) { // Loop thru notes.
						if ( PCLASS[COU_ID]['note'][m] != '' && classNotes.indexOf(PCLASS[COU_ID]['note'][m]) == -1 ) {
							classNotes.push(PCLASS[COU_ID]['note'][m]);
							classMeetingText += '<br>';
							classMeetingText += PCLASS[COU_ID]['note'][m]; // Add the class note.
						}
					} // Loop thru notes.
					classMeetingElement.innerHTML = classMeetingText;
					document.getElementsByTagName('body')[0].appendChild(classMeetingElement);
				} else { // Does a div need to be created for this meeting?
					// No, get the element.
					classMeetingElement = document.getElementById(classMeetingId);
				} // Does a div need to be created for this meeting?
				// Add the meeting to calandarMeetings.
				console.log('meetingDayNumber='+meetingDayNumber);
				if ( calandarMeetings[meetingDayNumber] == undefined ) calandarMeetings[meetingDayNumber] = new Object();
				for ( var meetingDayHour=firstHour; meetingDayHour<=lastHour; meetingDayHour++ ) { // Loop thru hours the class covers.
					console.log('meetingDayHour='+meetingDayHour);
					if ( calandarMeetings[meetingDayNumber][meetingDayHour] == undefined ) calandarMeetings[meetingDayNumber][meetingDayHour] = [ ];
					if ( calandarMeetings[meetingDayNumber][meetingDayHour].indexOf(COU_ID) == -1 ) calandarMeetings[meetingDayNumber][meetingDayHour].push(COU_ID); // Add the COU_ID to calandarMeetings if not already there.
				} // Loop thru hours the class covers.
				// Add the meeting to classMeetingsToDisplay.
				if ( !classMeetingsToDisplay[COU_ID] ) classMeetingsToDisplay[COU_ID] = new Array();
				var calendarDayHourId = 'calendar_'+meetingDayNumber+'_'+beginHour;
				var classInfo = "'"+PCLASS[COU_ID]['SUBJ'] + PCLASS[COU_ID]['NBR'] + '-' + parseInt(PCLASS[COU_ID]['SECT'])+"'";
				classMeetingsToDisplay[COU_ID].push( { COU_ID:COU_ID, class:classInfo,  day:meetingDayNumber, hour:beginHour, begin:meeting['begin'], end:meeting['end'], count:0, display:0 } );
				// END Create or update the class meeting div.
			} else {
				// BEGIN Hide the class.
				// Remove the meeting from calandarMeetings.
				var COU_IDfound;
				if ( classMeetingsToDisplay[COU_ID] ) { // Is there a classMeetingsToDisplay[COU_ID]?
					for ( var m=0; m<classMeetingsToDisplay[COU_ID].length; m++ ) { // Loop thru classMeetingsToDisplay[COU_ID] meetings.
						meetingDayNumber = classMeetingsToDisplay[COU_ID][m].day;
						meetingHourBegin = classMeetingsToDisplay[COU_ID][m].hour;
						meetingHourEnd = parseInt(classMeetingsToDisplay[COU_ID][m].end);
						for ( var meetingDayHour=meetingHourBegin; meetingDayHour<=meetingHourEnd; meetingDayHour++ ) { // Loop thru classMeetingsToDisplay[COU_ID] meeting hours.
							COU_IDfound = calandarMeetings[meetingDayNumber][meetingDayHour].indexOf(COU_ID);
							if ( COU_IDfound != -1 ) calandarMeetings[meetingDayNumber][meetingDayHour].splice(COU_IDfound,1); // Remove the COU_ID from calandarMeetings if found.
						} // Loop thru classMeetingsToDisplay[COU_ID] meeting hours.
					} // Loop thru classMeetingsToDisplay[COU_ID] meetings.
					delete classMeetingsToDisplay[COU_ID]; // Remove the COU_ID from classMeetingsToDisplay.
				} // Is there a classMeetingsToDisplay[COU_ID]?
				if ( document.getElementById(classMeetingId) ) document.getElementById(classMeetingId).style.display = 'none'; // Hide the class meeting.
				// END Hide the class.
			}
		} // Loop thru days.
	} // Loop thru meetings.
	displayCalandar();
	// END Show or hide class on calendar.
} // END checkClass.

// displayCalandar()
// Display the classes on the calendar.
function displayCalandar() {
	console.warn('displayCalandar[]');

	// BEGIN Calculate total credits and set all meeting counts and displays to 1.
	var classesWithVariableCRHR = '';
	var TotalCRHR = 0;
	var TotalCRMAX = 0;
	var prefix = '';
	for ( COU_ID in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
		TotalCRHR += parseInt(PCLASS[COU_ID]['CRHR']);
		if ( PCLASS[COU_ID]['CRMAX'] == '' ) { // Is this not a variable credit class?
			TotalCRMAX += parseInt(PCLASS[COU_ID]['CRHR']);
		} else { // Is this not a variable credit class?
			TotalCRMAX += parseInt(PCLASS[COU_ID]['CRMAX']);
			classesWithVariableCRHR += prefix+PCLASS[COU_ID]['SUBJ']+PCLASS[COU_ID]['NBR'];
			prefix = ', ';
		} // Is this not a variable credit class?
		for ( var m=0; m<classMeetingsToDisplay[COU_ID].length; m++ ) { // Loop thru classMeetingsToDisplay meetings.
			classMeetingsToDisplay[COU_ID][m].count = 1;
			classMeetingsToDisplay[COU_ID][m].display = 1;
		} // Loop thru classMeetingsToDisplay meetings.
	} // Loop thru classMeetingsToDisplay.
	// END Calculate total credits and set all meeting counts and displays to 1.
	console.log('TotalCRHR='+TotalCRHR+' TotalCRMAX='+TotalCRMAX+' classesWithVariableCRHR='+classesWithVariableCRHR);
	
	// BEGIN Determine class number counts and class meeting overlap counts.
	var classNumberCount = new Object(); // The number of each class NBR selected.
	for ( COU_ID in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
		for ( var m=0; m<classMeetingsToDisplay[COU_ID].length; m++ ) { // Loop thru classMeetingsToDisplay meetings.
			// Determine classNumber counts for display duplicate classes.
			if ( m == 0 ) { // Is this the first class day?
				// Only check the classNumber for the first meeting of a class. We need to do this so we don't count a classNumber twice if it meets more than once a week.
				var classNumber = classMeetingsToDisplay[COU_ID][m].class.split('-'); // Break on the - to split off the section number.
				classNumber = classNumber[0];
				if ( !classNumberCount[classNumber] ) classNumberCount[classNumber] = 0;
				classNumberCount[classNumber]++;
			}
			// Determine class meeting overlap counts.
			for ( COU_ID2 in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
				for ( var m2=0; m2<classMeetingsToDisplay[COU_ID2].length; m2++ ) { // Loop thru classMeetingsToDisplay meetings.
					// Check if theese meetings overlap.
					if ( classMeetingsToDisplay[COU_ID][m].day == classMeetingsToDisplay[COU_ID2][m2].day ) { // Are the meetings on the same day?
						if (	(  classMeetingsToDisplay[COU_ID][m].begin >= classMeetingsToDisplay[COU_ID2][m2].begin	// Does the meeting begin on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID][m].begin <= classMeetingsToDisplay[COU_ID2][m2].end )	// Does the meeting begin on or before the other one ends?
							 ||
									(  classMeetingsToDisplay[COU_ID][m].end >= classMeetingsToDisplay[COU_ID2][m2].begin		// Does the meeting end on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID][m].end <= classMeetingsToDisplay[COU_ID2][m2].end )		// Does the meeting end on or before the other one ends?
							 ) { // If so, then they overlap.
							if ( COU_ID != COU_ID2 ) {
								classMeetingsToDisplay[COU_ID][m].count++;
							}
						}
					} // Are the meetings on the same day?
				} // Loop thru classMeetingsToDisplay meetings.
			} // Loop thru classMeetingsToDisplay.
		} // Loop thru classMeetingsToDisplay meetings.
	} // Loop thru classMeetingsToDisplay.
	// BEGIN Determine class meeting overlap counts and class number counts.

	// BEGIN Set the class meeting overlap counts the same.
	for ( COU_ID in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
		for ( var m=0; m<classMeetingsToDisplay[COU_ID].length; m++ ) { // Loop thru classMeetingsToDisplay meetings.
			for ( COU_ID2 in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
				for ( var m2=0; m2<classMeetingsToDisplay[COU_ID2].length; m2++ ) { // Loop thru classMeetingsToDisplay meetings.
					// Check if theese meetings overlap.
					if ( classMeetingsToDisplay[COU_ID][m].day == classMeetingsToDisplay[COU_ID2][m2].day ) { // Are the meetings on the same day?
						if (	(  classMeetingsToDisplay[COU_ID][m].begin >= classMeetingsToDisplay[COU_ID2][m2].begin	// Does the meeting begin on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID][m].begin <= classMeetingsToDisplay[COU_ID2][m2].end )	// Does the meeting begin on or before the other one ends?
							 ||
									(  classMeetingsToDisplay[COU_ID][m].end >= classMeetingsToDisplay[COU_ID2][m2].begin		// Does the meeting end on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID][m].end <= classMeetingsToDisplay[COU_ID2][m2].end )		// Does the meeting end on or before the other one ends?
							 ) { // If so, then they overlap.
							if ( COU_ID != COU_ID2 ) {
								if ( classMeetingsToDisplay[COU_ID2][m2].count < classMeetingsToDisplay[COU_ID][m].count ) classMeetingsToDisplay[COU_ID2][m2].count = classMeetingsToDisplay[COU_ID][m].count;
							}
						} // If so, then they overlap.
					} // Are the meetings on the same day?
				} // Loop thru classMeetingsToDisplay meetings.
			} // Loop thru classMeetingsToDisplay.
		} // Loop thru classMeetingsToDisplay meetings.
	} // Loop thru classMeetingsToDisplay.
	// END Set the class meeting overlap counts the same.
	
	// BEGIN Set the class meeting overlap display numbers.
	var DisplayGreaterThanCount = false;
	for ( COU_ID in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
		for ( var m=0; m<classMeetingsToDisplay[COU_ID].length; m++ ) { // Loop thru classMeetingsToDisplay meetings.
			console.info('Checking '+classMeetingsToDisplay[COU_ID][m].class+'['+m+']');
			for ( COU_ID2 in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
				for ( var m2=0; m2<classMeetingsToDisplay[COU_ID2].length; m2++ ) { // Loop thru classMeetingsToDisplay meetings.
					// Check if theese meetings overlap.
					if ( classMeetingsToDisplay[COU_ID][m].day == classMeetingsToDisplay[COU_ID2][m2].day ) { // Are the meetings on the same day?
						if (	(  classMeetingsToDisplay[COU_ID][m].begin >= classMeetingsToDisplay[COU_ID2][m2].begin	// Does the meeting begin on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID][m].begin <= classMeetingsToDisplay[COU_ID2][m2].end )	// Does the meeting begin on or before the other one ends?
							 ||
									(  classMeetingsToDisplay[COU_ID][m].end >= classMeetingsToDisplay[COU_ID2][m2].begin		// Does the meeting end on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID][m].end <= classMeetingsToDisplay[COU_ID2][m2].end )		// Does the meeting end on or before the other one ends?
							 ||
									(  classMeetingsToDisplay[COU_ID2][m2].end >= classMeetingsToDisplay[COU_ID][m].begin		// Does the meeting end on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID2][m2].end <= classMeetingsToDisplay[COU_ID][m].end )		// Does the meeting end on or before the other one ends?
							 ||
									(  classMeetingsToDisplay[COU_ID2][m2].end >= classMeetingsToDisplay[COU_ID][m].begin		// Does the meeting end on or after the other one begins?
									&& classMeetingsToDisplay[COU_ID2][m2].end <= classMeetingsToDisplay[COU_ID][m].end )		// Does the meeting end on or before the other one ends?
							 ) { // If so, then they overlap.
							if ( COU_ID != COU_ID2 ) {
								if ( COU_ID2 > COU_ID ) {
									//if ( classMeetingsToDisplay[COU_ID2][m2].display <= classMeetingsToDisplay[COU_ID][m].display ) {
									//	classMeetingsToDisplay[COU_ID2][m2].display = classMeetingsToDisplay[COU_ID][m].display + 1;
									//	console.log(classMeetingsToDisplay[COU_ID2][m2].class+' display increase to '+classMeetingsToDisplay[COU_ID2][m2].display+'.');
									//}
									if ( classMeetingsToDisplay[COU_ID2][m2].display < classMeetingsToDisplay[COU_ID2][m2].count ) {
										classMeetingsToDisplay[COU_ID2][m2].display++;
										console.log(classMeetingsToDisplay[COU_ID2][m2].class+' display increase to '+classMeetingsToDisplay[COU_ID2][m2].display+'.');
									}
									/** /
									if ( classMeetingsToDisplay[COU_ID2][m2].display > classMeetingsToDisplay[COU_ID2][m2].count ) {
										classMeetingsToDisplay[COU_ID2][m2].count = classMeetingsToDisplay[COU_ID2][m2].display;
										DisplayGreaterThanCount = true;
									}
									/**/
								}
							}
						} // If so, then they overlap.
					} // Are the meetings on the same day?
				} // Loop thru classMeetingsToDisplay meetings.
			} // Loop thru classMeetingsToDisplay.
		} // Loop thru classMeetingsToDisplay meetings.
	} // Loop thru classMeetingsToDisplay.
	// END Set the class meeting overlap display numbers.
	console.log('DisplayGreaterThanCount='+DisplayGreaterThanCount);
	console.info('classNumberCount',JSON.stringify(classNumberCount));
	console.info('classMeetingsToDisplay',JSON.stringify(classMeetingsToDisplay));
	
	// BEGIN Display class meetings on the calendar.
	var QuickAddIds = new Array();
	for ( COU_ID in classMeetingsToDisplay ) { // Loop thru classMeetingsToDisplay.
		if ( QuickAddIds.indexOf(COU_ID) == -1 ) QuickAddIds.push(COU_ID);
		for ( var m=0; m<classMeetingsToDisplay[COU_ID].length; m++ ) { // Loop thru classMeetingsToDisplay meetings.
			var meeting = classMeetingsToDisplay[COU_ID][m];
			//console.info('meeting',JSON.stringify(meeting));
			var calendarDayHourId = 'calendar_'+meeting.day+'_'+meeting.hour;
			var eCal = document.getElementById(calendarDayHourId);
			var calendarXY = elementLeftTop(eCal);
			var cLeft = calendarXY.left;
			var cTop = calendarXY.top;
			var cWidth = eCal.offsetWidth;
			var cHeight = eCal.offsetHeight;
			//console.log('cLeft='+cLeft+' cWidth='+cWidth+' cTop='+cTop+' cHeight='+cHeight+' calendarDayHourId='+calendarDayHourId);
			mSize = cWidth / meeting.count;
			mLeftOffset = mSize * ( meeting.display - 1 );
			mLeft = ( cLeft + mLeftOffset ) + 1 + 'px';
			mWidth = parseInt(mSize) - 1 + 'px';
			mTop = parseInt(cTop + ( meeting.begin - meeting.hour) * hourHeight) + 1 + 'px';
			mHeight = parseInt(( meeting.end - meeting.begin ) * hourHeight) - 1 + 'px';
			classMeetingId = 'classMeeting_'+COU_ID+'_'+meeting.day;
			var meetingDisplay;
			if ( document.getElementById(classMeetingId) ) {
				meetingDisplay = true;
			} else {
				meetingDisplay = false;
			}
			//console.log('mLeft='+mLeft+' mWidth='+mWidth+' mTop='+mTop+' mHeight='+mHeight+' meetingDisplay='+meetingDisplay+' classMeetingId='+classMeetingId);
			if ( meetingDisplay ) { // Should this class meeting be displayed?
				classMeetingElement = document.getElementById(classMeetingId);
				classMeetingElement.style.left = mLeft
				classMeetingElement.style.width = mWidth
				classMeetingElement.style.top = mTop
				classMeetingElement.style.height = mHeight
				classMeetingElement.style.display = 'block';
				var thisClassName = classMeetingElement.className.replace(' overlap','').replace(' duplicate',''); // Get className without overlap or duplicate.
				if ( meeting.count > 1 ) {
					console.warn('Class overlaps, show overlap border.');
					thisClassName += ' overlap';
				}
				var classNumber = classMeetingsToDisplay[COU_ID][m].class.split('-'); // Break on the - to split off the section number.
				classNumber = classNumber[0];
				if ( classNumberCount[classNumber] > 1 ) {
					console.warn('There is more than one '+classNumber+' class, show duplicate border.');
					thisClassName += ' duplicate';
				}
				classMeetingElement.className = thisClassName;
			} // Should this class meeting be displayed?
		} // Loop thru classMeetingsToDisplay meetings.
	} // Loop thru classMeetingsToDisplay.
	// END Display class meetings on the calendar.

	// Place the QuickAddIds in selected_COU_ID.
	var COU_IDs = '';
	prefix = '';
	for ( var q=0; q<QuickAddIds.length; q++ ) {
		COU_IDs += prefix+QuickAddIds[q];
		prefix = ', ';
	}
	document.getElementById('selected_COU_ID').value = COU_IDs;
	
	// Place total credits and variable credit warning.
	if ( TotalCRHR == '' || TotalCRHR == 0 ) TotalCRHR = 'none';
	document.getElementById('totalSelectedCredits').innerHTML = TotalCRHR;
	if ( classesWithVariableCRHR != '' ) {
		classesWithVariableCRHR = ' You have selected some variable credit classes which may change your total credits: '+classesWithVariableCRHR;
	}
	document.getElementById('selectedClassesWithVariableCRHR').innerHTML = classesWithVariableCRHR;
} // END displayCalandar.

// elementLeftTop(e)
// Get top and left for an element.
// e = element to check.
function elementLeftTop(e) {
  //console.info('elementLeftTop['+e.id+']');
  var left = 0;
  var top = 0;
  if ( e ) {
    while( e.tagName != "BODY" ) {
      left += e.offsetLeft;
      top += e.offsetTop;
      e = e.offsetParent;
    }
  }
  return { left: left, top: top };
} // END elementLeftTop.

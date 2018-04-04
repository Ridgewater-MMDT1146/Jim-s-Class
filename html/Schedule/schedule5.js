// Schedule/schedule5.js
// For use by Jonathan Plotz

function DisplaySchedule_View() {
	var DEBUG_DisplaySchedule_View = true;
	if ( DEBUG_DisplaySchedule_View ) { console.warn('DisplaySchedule_View[] ScheduleShowConflicts='+ScheduleShowConflicts); }
	divHide('divHighlightNone');
	divHide('divHighlightConflict');
	divHide('divHighlightCredential');
	divHide('divHighlightInstructor');
	divHide('divHighlightRoom');
	switch ( ScheduleShowConflicts ) {
		case 0:
		case '0':
		case 'None':
			DisplaySchedule_Highlight_None();
			document.getElementById('divHighlightNone').style.display = 'block';
		break;
		case 1:
		case '1':
		case 'Conflict':
			DisplaySchedule_Highlight_Conflicts();
			document.getElementById('divHighlightConflict').style.display = 'block';
		break;
		case 2:
		case '2':
		case 'Credential':
			DisplaySchedule_Highlight_Credentials();
			document.getElementById('divHighlightCredential').style.display = 'block';
		break;
			// Add case blocks for the other views and write js functions to perform them.
		case 3:
		case '3':
		case 'Instructor':
			DisplaySchedule_Highlight_Instructors();
			document.getElementById('divHighlightInstructor').style.display = 'block';
		break;
		case 4:
		case '4':
		case 'Room':
			DisplaySchedule_Highlight_Rooms();
			document.getElementById('divHighlightRoom').style.display = 'block';
		break;
	}
}

// DisplaySchedule_Highlight_None()
// Check schedule for class 1) Degree/year, 2) room, or 3) Instructor conflicts and change meeting styles to show them.
function DisplaySchedule_Highlight_None() {
	var DEBUG_DisplaySchedule_Highlight_None = false;
	if ( DEBUG_DisplaySchedule_Highlight_None ) { console.warn('DisplaySchedule_HighlightNone[]'); }
	var	calendar_class_div,
			calendar_class_div_base,
			calendar_class_div_Id,
			dayIndex,
			meetingIndex,
			scId;
	for ( scId in ScheduleClass ) {if(ScheduleClass.hasOwnProperty(scId)) { // Loop thru classes.
		calendar_class_div_base = 'calendar_class_'+scId+'_';
		for ( meetingIndex=0; meetingIndex<ClassMeeting[scId].length; meetingIndex++ ) { // Loop thru 1st class meetings.
			// instructor and room code see below.
			for ( dayIndex=0; dayIndex<ClassMeeting[scId][meetingIndex].days.length; dayIndex++ ) { // Loop thru days.
				calendar_class_div_Id = calendar_class_div_base + ClassMeeting[scId][meetingIndex].days[dayIndex] + ClassMeeting[scId][meetingIndex].tdMinute;
				calendar_class_div = document.getElementById(calendar_class_div_Id);
				// Do what you need here.
				// See DisplaySchedule_Highlight_Conflicts() in scheduler.js to see how to find instructors and rooms. Credential info is not available yet!
				calendar_class_div.className="calendar_class";
			} // Loop thru days.
		} // Loop thru 1st class meetings.
	}} // Loop thru classes.
} // END DisplaySchedule_Highlight_None.

// DisplaySchedule_Highlight_Credentials()
// Highlight the different credential courses and credential/year courses.
var cColors = ['FF2800', 'FF003F', 'FF6347', 'FB4F14', 'FFA500', 'E48400', 'E4D00A', 'FBEC5D', 'FFFF00', '7FFF00', '00FF00', '4CBB17', 'B2FFFF', '7DF9FF', '00FFFF', 'DF73FF', 'D19FE8', 'F4BBFF', 'FE4EDA', 'FF00FF', 'FF1493'];
function DisplaySchedule_Highlight_Credentials() {
	var DEBUG_DisplaySchedule_Highlight_Credentials = true;
	if ( DEBUG_DisplaySchedule_Highlight_Credentials ) { console.warn('DisplaySchedule_Highlight_Credentials[] cColors.length='+cColors.length); }
	var	calendar_class_div,
			calendar_class_div_base,
			calendar_class_div_Id,
			dayIndex,
			meetingIndex,
			scId;
	var credentialsInUse = [];
	var credentialsInUseIndex = 0;
	var cId;
	var cYr;
	for ( scId in ScheduleClass ) {if(ScheduleClass.hasOwnProperty(scId)) { // Loop thru classes.
		var ScheduleClass_courseId = ScheduleClass[scId].courseId;
		for ( var credentialIndex=0; credentialIndex<Course[ScheduleClass_courseId].credentials.length; credentialIndex++ ) {
			var thisCredential = Course[ScheduleClass_courseId].credentials[credentialIndex];
			if ( DEBUG_DisplaySchedule_Highlight_Credentials ) { console.log(Course[ScheduleClass_courseId].Dept+Course[ScheduleClass_courseId].Number+' thisCredential='+JSON.stringify(thisCredential)); }
			cId = thisCredential.Id;
			// Add cIds cId object. {cId:cId,cYr:[2,1]}
			/** /
			var thisCIdObject = 
			credentialsInUse.push({cId:cId,cYr:[]})
			cYr = thisCredential.Yr;
			if ( typeof credentialsInUse[cId] === 'undefined' ) {
				credentialsInUse[cId] = [];
			}
			if ( credentialsInUse[cId].indexOf(cYr) === -1 ) { // Is the Yr NOT in the array?
				credentialsInUse.cIds.push(cYr);
			}
			/**/
			
		}
	}} // Loop thru classes.
	var result;
	credentialsInUse=[ {cId:1,cYr:[2,1]}, {cId:5,cYr:[1]}, {cId:5,cYr:[3]} ];
	var valx = 1;
	result = credentialsInUse.filter(function( credentialsInUse, val ) {return credentialsInUse.cId === val;});
	console.log('cId 1 result='+JSON.stringify(result));
	result = credentialsInUse.filter(function( credentialsInUse ) {return credentialsInUse.cId === 6;});
	console.log('cId 6 result='+JSON.stringify(result));
	result = credentialsInUse.filter(function( credentialsInUse ) {return credentialsInUse.cId === 5;});
	console.log('cId 5 result='+JSON.stringify(result));
	result = credentialsInUse.filter(function( credentialsInUse ) {return credentialsInUse.cYr.indexOf(1) !== -1;});
	console.log('cYr 1 result='+JSON.stringify(result));
	result = credentialsInUse.filter(function( credentialsInUse ) {return credentialsInUse.cYr.indexOf(2) !== -1;});
	console.log('cYr 2 result='+JSON.stringify(result));
	result = credentialsInUse.filter(function( credentialsInUse ) {return credentialsInUse.cYr.indexOf(4) !== -1;});
	console.log('cYr 4 result='+JSON.stringify(result));
	

	var credentialColor = {};
	/*
	credentialColor = { [ {cId:1, cYr:[{Yr:1,color:'FF2800'},{Yr:2,color:'FF003F'}]}, {cId:2, cYr:[{Yr:1,color:'FF6347'},{Yr:2,color:'FB4F14'}]} ] }
	credentialColor = { 1:[{Yr:1,color:'FF2800'},{Yr:2,color:'FF003F'}]}, {cId:2, cYr:[{Yr:1,color:'FF6347'},{Yr:2,color:'FB4F14'}]} ] }
	credentialColor[cId][cYr].color
	credentialColor.1.1
	credentialColor.1.2
	*/
	if ( DEBUG_DisplaySchedule_Highlight_Credentials ) { console.log('credentialsInUse='+JSON.stringify(credentialsInUse)); }
	for ( cId in credentialsInUse ) {if(credentialsInUse.hasOwnProperty(cId)) { // Loop thru credentialsInUse.
		//credentialColor[cId]
		
		
		
	}} // Loop thru credentialsInUse.
	
	for ( scId in ScheduleClass ) {if(ScheduleClass.hasOwnProperty(scId)) { // Loop thru classes.
		
		
		calendar_class_div_base = 'calendar_class_'+scId+'_';
		for ( meetingIndex=0; meetingIndex<ClassMeeting[scId].length; meetingIndex++ ) { // Loop thru 1st class meetings.
			// instructor and room code see below.
			for ( dayIndex=0; dayIndex<ClassMeeting[scId][meetingIndex].days.length; dayIndex++ ) { // Loop thru days.
				calendar_class_div_Id = calendar_class_div_base + ClassMeeting[scId][meetingIndex].days[dayIndex] + ClassMeeting[scId][meetingIndex].tdMinute;
				calendar_class_div = document.getElementById(calendar_class_div_Id);
				// Do what you need here.
				// See DisplaySchedule_Highlight_Conflicts() in scheduler.js to see how to find instructors and rooms. Credential info is not available yet!
				calendar_class_div.className="calendar_class";
				
				
				
				
				
			} // Loop thru days.
		} // Loop thru 1st class meetings.
	}} // Loop thru classes.
} // END DisplaySchedule_Highlight_Credentials.

// DisplaySchedule_Highlight_Instructors()
// Highlight the different Instructors.
function DisplaySchedule_Highlight_Instructors() {
	var DEBUG_DisplaySchedule_Highlight_Instructors = false;
	if ( DEBUG_DisplaySchedule_Highlight_Instructors ) { console.warn('DisplaySchedule_Highlight_Instructors[]'); }
	DisplaySchedule_Highlight_None();
} // END DisplaySchedule_Highlight_Instructors.

// DisplaySchedule_Highlight_Rooms()
// Highlight the different rooms.
function DisplaySchedule_Highlight_Rooms() {
	var DEBUG_DisplaySchedule_Highlight_Rooms = false;
	if ( DEBUG_DisplaySchedule_Highlight_Rooms ) { console.warn('DisplaySchedule_Highlight_Rooms[]'); }
	DisplaySchedule_Highlight_None();
} // END DisplaySchedule_Highlight_Rooms.

/** /
									instructors = ClassMeeting[scId][meetingIndex].instructors;
									if ( instructors.length ) { // Is there an instructor?
										instructorConflict = false;
										for ( instructorIndex=0; instructorIndex<instructors.length; instructorIndex++ ) { // Loop thru 1st instructors.
											instructor = instructors[instructorIndex];
											// Now you have the instructor name.
											
										} // Loop thru 1st instructors.
									} // Is there an instructor?

									rooms = ClassMeeting[scId][meetingIndex].rooms;
									if ( rooms.length ) { // Is there an room?
										roomConflict = false;
										for ( roomIndex=0; roomIndex<rooms.length; roomIndex++ ) { // Loop thru 1st rooms.
											room = rooms[roomIndex];
											// Now you have the room number.
											
										} // Loop thru 1st rooms.
									} // Is there an room?
/**/

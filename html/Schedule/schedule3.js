// Schedule/schedule3.js
// For use by Cody Kurowski

// ScheduleClass_RemoveClassVerify(thisTask)
// Verify removal of schedule class.
function ScheduleClass_RemoveClassVerify(thisTask) {
	var DEBUG_ScheduleClass_RemoveClassVerify = true;
	if ( DEBUG_ScheduleClass_RemoveClassVerify ) { console.log('BEGIN ScheduleClass_RemoveClassVerify[thisTask='+thisTask+']'); }
	if ( typeof thisTask === 'undefined' ) {
		if ( DEBUG_ScheduleClass_RemoveClassVerify ) { console.log('Display div_RemoveClassVerify'); }
		document.getElementById('div_RemoveClassVerify').style.display = 'block';
	} else if ( thisTask ) {
		if ( DEBUG_ScheduleClass_RemoveClassVerify ) { console.log('Yes clicked.'); }
		if ( DEBUG_ScheduleClass_RemoveClassVerify ) { console.warn('ScheduleClass_RemoveClassVerify[scheduleId='+CurrentSchedule.scheduleId+', departmentId='+CurrentSchedule.departmentId+', scheduleclassId='+currentOpenScheduleClassId+'];'); }

		var ids = [];

		if ( DEBUG_ScheduleClass_RemoveClassVerify ) { console.log(ClassMeeting[currentOpenScheduleClassId]); }
		// Loop through ClassMeeting[currentOpenScheduleClassId] to make the ids to remove from the DOM
		for (let i = 0; i < ClassMeeting[currentOpenScheduleClassId].length; i++) {
			// Loop through days
			for (let x = 0; x < ClassMeeting[currentOpenScheduleClassId][i].days.length; x++) {
				var id = 'calendar_class_'+currentOpenScheduleClassId+'_'+ClassMeeting[currentOpenScheduleClassId][i].days[x]+ClassMeeting[currentOpenScheduleClassId][i].tdMinute;
				ids.push(id);
				if ( DEBUG_ScheduleClass_RemoveClassVerify ) { console.log(id); }					
			}
		}

		console.log(EVENTS_TO_DISPLAY);

		// Remove the class from the Schedule		
		ClassMeeting[currentOpenScheduleClassId] = [];

		// TODO: Send AJAX call to remove the ClassMeeting
		URI = '/Schedule/ScheduleClass/ScheduleClassUpdate.php?';
		URI += 'task=RemoveClass';
		URI += '&scId='+currentOpenScheduleClassId;
		console.log("UpdateInclude['"+window.location.protocol+'//'+window.location.hostname+URI+'&DEBUG=true'+"', false];");
		
		UpdateInclude(URI, false);	

		// Remove the ids from the DOM
		for (let i = 0; i < ids.length; i++) {
			document.getElementById(ids[i]).remove();			
		}

		// Update the schedule
		DisplaySchedule();
		
		// Close the popup
		document.removeEventListener('scroll', ScheduleClass_ScrollHandler); 
		document.getElementById('dialogDiv').style.display = 'none';
	} else {
		if ( DEBUG_ScheduleClass_RemoveClassVerify ) { console.log('No clicked.'); }
		document.getElementById('div_RemoveClassVerify').style.display = 'none';
	}
} // END ScheduleClass_RemoveClassVerify.


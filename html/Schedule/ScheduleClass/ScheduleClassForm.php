<?
// Schedule/ScheduleClass/ScheduleClassForm.php
// Return schedule class form.

#$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedPermissions="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
#$debuggingAvailable = false;
include('../../application.phpinc'); // Include application setup file. Use a relative path.
switch ( $f['task'] ) {
	case '';
		include('Schedule/ScheduleClass/ScheduleClassForm.phpinc');
	break;
	case 'Meeting';
		f('scmId');
		if ( !$f['scmId'] ) $f['scmId'] = 0;
		$scmId = $f['scmId'];
		$thisMeeting = array();
		$thisMeeting['Day'] = array();
		$thisMeeting['Instructor'] = array();
		$thisMeeting['Room'] = array();
		$thisMeeting['scheduleclassmeetingBeginTime'] = '';
		$thisMeeting['scheduleclassmeetingEndDate'] = '';
		$thisMeeting['scheduleclassmeetingEndTime'] = '';
		$thisMeeting['scheduleclassmeetingOnCampus'] = 1;
		$thisMeeting['scheduleclassmeetingStartDate'] = '';
		$f['departmentId'] = $_SESSION['user']['departmentId'];
// Get weekdays.
require('site/get_weekdays.phpinc');
		include('Schedule/ScheduleClass/ScheduleClassForm_Meeting.phpinc');
	break;
}
?>

<?
// Schedule/ScheduleClass/ScheduleClassUpdate.php
// Return schedule class form.

$Ignore_uuid = true;

if ( !isset($_GET['DEBUG']) ) {
	$pageHeaderCall = NULL;
	$pageFooterCall = false;
	$DEBUG_ScheduleViewSettings = false;
	//$Skip_application_site = true; // Uncomment this line to skip loading application_site.phpinc, site_js.phpinc. This is useful for pages loaded by XMLhttp requests.
} else {
	$pageHeaderCall = 'ScheduleViewSettings.php';
	$pageFooterCall = '';
	$DEBUG_ScheduleViewSettings = true;
	//$Skip_SESSION_game = true; // Uncomment this line to skip loading game variables and site_js.phpinc. This is useful for pages loaded by XMLhttp requests.
}

$authorizedGroups = "USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
include('../../application.phpinc'); // Include application setup file. Use a relative path.
f('DEBUG');

if ( $Ignore_uuid || $_SESSION['uuid'] != $f['uuid'] ) {
pageHeader($pageHeaderCall);
if ( $pageHeaderCall ) d_On();

switch ($f['task']) {
  case 'MoveClassMeeting':
		include('Schedule/ScheduleClass/ScheduleClassUpdate/MoveClassMeeting.phpinc');
  break;
  case 'RemoveClass':
		include('Schedule/ScheduleClass/ScheduleClassUpdate/RemoveClass.phpinc');
  break;
  case '':
  break;
  case '':
  break;
  case '':
  break;
  case '':
  break;
  case '':
  break;
  case '':
  break;
  case '':
  break;
  case '':
  break;
}

if ( $pageHeaderCall ) { d_Off(); d_On('foot'); }
pageFooter($pageFooterCall);
}

?>

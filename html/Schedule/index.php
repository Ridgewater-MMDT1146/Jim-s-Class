<?
// Schedule/index.php
// schedule control.

#$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedPermissions="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
include('../application.phpinc'); // Include application setup file. Use a relative path.

// Add 2-10 schedule.js
$addCount = 10;
$jsText = 'Schedule/schedule.js';
for ( $i=2; $i<=$addCount; $i++ ) {
	$jsText .= ',Schedule/schedule'.$i.'.js';
}
$jsText .= ',form.js';

// ** BEGIN $f['task'] control switch statement.
switch ($f['task']) {
  case 'Add class':
  case 'Update class':
		require('Schedule/getSchedule.phpinc');
		pageHeader($scheduleInfo['scheduleName'].' ('.$sessionInfo['YRTR'].')','',$jsText,'','','','','bodyId'); // ."Schedule '.$scheduleInfo['scheduleName'] Removed to shorten name.
		require('Schedule/ScheduleClass/ScheduleClassForm_Verify.phpinc');
		#d_Var('$error',$error,'d+');
		if ( !$error ) {
			require('Schedule/ScheduleClass/ScheduleClassForm_Process.phpinc');
		}
		require('Schedule/getScheduleClasses.phpinc');
		require('Schedule/displaySchedule.phpinc');
		echo '<script type="text/javascript">', 'AutoscrollPage(0);', '</script>';
  break;
  case 'Change schedule':
		//d_V(false,'d');
		$_SESSION['user']['scheduleId'] = $f['scheduleId'];
		$query = "
				UPDATE `userdata`
					 SET scheduleId = ".$f['scheduleId']."
				 WHERE userId = ".$_SESSION['user']['userId']."
		";
		d_Var('userdataUPDATE',$query,'q');
		$userdataUPDATE = query_do($query);
		d_Var('$userdataUPDATE',$userdataUPDATE,'l');
  case '':
		if ( $_SESSION['user']['scheduleId'] ) { // Does the user have a loaded schedule?
			// Yes.
			require('Schedule/getSchedule.phpinc');
			pageHeader($scheduleInfo['scheduleName'].' ('.$sessionInfo['YRTR'].')','',$jsText,'','','','','bodyId'); // ."Schedule '.$scheduleInfo['scheduleName'] Removed to shorten name.
			require('Schedule/getScheduleClasses.phpinc');
			require('Schedule/displaySchedule.phpinc');
		} else { // Does the user have a loaded schedule?
			// No.
			require('Schedule/noSchedule.phpinc');
		} // Does the user have a loaded schedule?
  break;
  case 'Select schedule':
		require('site/saveCurrentSchedule.phpinc');
  case 'Create new schedule':
		require('Schedule/verifySchedule.phpinc');
		if ( !count($formError)) {
			d_V(false,'d');
			require('Schedule/getSchedule.phpinc'); // Will also create the new schedule.
			pageHeader($scheduleInfo['scheduleName'].' ('.$sessionInfo['YRTR'].')',$cssText,$jsText,'','','','','bodyId'); // ."Schedule '.$scheduleInfo['scheduleName'] Removed to shorten name.
			require('Schedule/getScheduleClasses.phpinc');
			require('Schedule/displaySchedule.phpinc');
		} else {
			require('Schedule/ScheduleChange/newSchedule.phpinc');
		}
  break;
  case 'Import parsed classes':
		$f['sessionImportId'] = $f['sessionId'];
		require('Schedule/getSchedule.phpinc');
		require('Schedule/ScheduleImportClasses/ImportParsedClasses.phpinc');
		pageHeader($scheduleInfo['scheduleName'].' ('.$sessionInfo['YRTR'].')',$cssText,$jsText,'','','','','bodyId'); // ."Schedule '.$scheduleInfo['scheduleName'] Removed to shorten name.
		require('Schedule/getScheduleClasses.phpinc');
		require('Schedule/displaySchedule.phpinc');
  break;
  case 'Import schedule classes':
		require('Schedule/getSchedule.phpinc');
		require('Schedule/ScheduleImportClasses/ImportScheduleClasses.phpinc');
		pageHeader($scheduleInfo['scheduleName'].' ('.$sessionInfo['YRTR'].')',$cssText,$jsText,'','','','','bodyId'); // ."Schedule '.$scheduleInfo['scheduleName'] Removed to shorten name.
		require('Schedule/getScheduleClasses.phpinc');
		require('Schedule/displaySchedule.phpinc');
  break;
  case '':
  break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
}
?>

<?
pageFooter();
?>

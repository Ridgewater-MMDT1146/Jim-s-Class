<?
// schedule/index_page.php
// schedule control.

#$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedPermissions="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
include('../../application.phpinc'); // Include application setup file. Use a relative path.
// ** BEGIN $f['task'] control switch statement.
switch ($f['task']) {
  case '':
		pageHeader('Building');
		require('buildingForm.phpinc');
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

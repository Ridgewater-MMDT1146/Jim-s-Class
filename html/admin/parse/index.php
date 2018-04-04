<?
// index_page.php
// index_page_purpose.

#$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedPermissions="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
include('../../application.phpinc'); // Include application setup file. Use a relative path.
ini_set('max_execution_time', 300); // Increase max time to execute this page.

// Get class files for parsing.
require('parseProcess_Get_parseFiles.phpinc');

$showAnyHeader = false;
pageHeader('Parse Classes','',''); // false = no page header, NULL = no page header or tracking.
// ** BEGIN $f['task'] control switch statement.
switch ($f['task']) {
  case '':
		require('selectYRTR.phpinc');
  break;
  case 'Parse':
		require('parse.phpinc');
		require('selectYRTR.phpinc');
  break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
}
// ** END $f['task'] control switch statement.

pageFooter();

?>

<?
// index_page.php
// index_page_purpose.

#$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedPermissions="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
include('application.phpinc'); // Include application setup file. Use a relative path.

// ** BEGIN $f['task'] control switch statement.
switch ($f['task']) {
  case '':
  case '':
  break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
}
// ** END $f['task'] control switch statement.

pageHeader('page_title','',''); // false = no page header, NULL = no page header or tracking.
sectionHeader('');

sectionFooter();
pageFooter();
?>

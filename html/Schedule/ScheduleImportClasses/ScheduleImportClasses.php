<?
// Schedule/ScheduleImportClasses/ScheduleImportClasses.php
// Create and return ImportClasses form html.
// calendar_dayview, calendar_timebegin, calendar_timeend, calendar_timeincrement, calendar_incrementheight

// AUTHENTICATION AND TITLE SETTINGS.
#$skipAuthentication = true; // Authentication is skipped for this page.
$authorizedPermissions="PUBLIC"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
require('../../application.phpinc'); // Include application setup file. Use a relative path.

pageheader(NULL);
require('Schedule/ScheduleImportClasses/ScheduleImportClasses.phpinc');
pageFooter(false);
?>

<?
// admin/course/index.php
// Course Management.

// AUTHENTICATION AND TITLE SETTINGS.
#$skipAuthentication = true; // Authentication is skipped for this page.
$authorizedPermissions="PUBLIC"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
require('../../application.phpinc'); // Include application setup file. Use a relative path.
switch ($f['task']) {
	case 'Add course':
	case 'Update course':
    require('courseFormVerify.phpinc');
    if ( !isset($formError) ) {
      require('courseFormProcess.phpinc');
    } else {
      pageHeader('Course Management - Edit course');
      require('courseForm.phpinc');
    	break;
    }
	case '':
	case 'Apply department filter':
	case 'Cancel':
    pageHeader('Course Management');
    require('courseManagement.phpinc');
	break;
	case 'Add new course':
	case 'Edit course':
    f('courseId');
    if ( $f['courseId'] ) {
      pageHeader('Course Management - Edit course');
    } else {
      pageHeader('Course Management - Add course');
    }
    require('courseForm.phpinc');
	break;
	case '':
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
}

pageFooter();
?>

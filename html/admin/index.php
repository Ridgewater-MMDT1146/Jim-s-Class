<?
// admin index.php
// SC administration functions.
//$TRACK = false; // false = skip tracking for this page. Default is true.
ini_set('include_path',"/home/jimmarti/public_html/sc/".PATH_SEPARATOR.ini_get('include_path')); // ** Setup include_path.
// ** Unrestricted access can be set with PUBLIC for unauthorized users or ALL for authorized users in any userpermission.
// ** To restrict access to a group or groups, list them here. "Admin,User".
$authorizedPermissions="Admin"; // ** Set the page access.
require('../application.phpinc');
pageHeader('Admin','','updateHTMLelement.js');
require('common/pageHeader.phpinc'); // ** Include the page header.
// ** BEGIN f_task control switch statement.
switch ($f['task']) {
	case '':
	case 'Admin':
		break;
	case 'case1':
  	//require('');
		break;
	case 'case2':
  	require('');
		break;
	default:
		programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
}
// ** END f_task control switch statement.

sectionHeader();

sectionFooter();

pageFooter();
?>

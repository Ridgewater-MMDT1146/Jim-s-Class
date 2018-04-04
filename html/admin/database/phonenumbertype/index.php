<?
// admin/database/phonenumbertype.php
// Manage phonenumbertypes.

// AUTHENTICATION AND TITLE SETTINGS.
// Unrestricted access can be set to PUBLIC for authorized or unauthorized users. Set to ALL for all authorized users in any userpermission.
$authorizedPermissions = 'Admin';
require('../../../application.phpinc'); // Include application setup file. Use a relative path.
pageHeader("Address Type Administration");

switch ($f['task']) {
	case '';
    require('phonenumbertypeList.phpinc');
	break;
	case 'Update';
    require('phonenumbertypeListVerify.phpinc');
    if ( !isset($formError) ) require('phonenumbertypeListPerform.phpinc');
    require('phonenumbertypeList.phpinc');
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
	break;
}

pageFooter();
?>

<?
// admin/group/userpermission.php
// Group add/edit page.

$authorizedPermissions = 'Admin';
require('../../application.phpinc'); // Include application setup file. Use a relative path.
// Process form.
switch ($f['task']) {
	case '':
	case 'Add':
	case 'Edit':
    require('groupForm.phpinc');
	break;
	case 'Cancel':
	case 'Done':
    headerLocation('/admin/group/');
	break;
	case 'Add group':
	case 'Update group':
    // Verify group form.
    require('groupVerify.phpinc');
    if (!$error) require('groupProcess.phpinc');
    headerLocation('/admin/group/');
			break;
	case 'Add to group':
	case 'Remove from group':
    require('groupUserProcess.phpinc');
    require('groupForm.phpinc'); // If you want them to see the form then use include. this is the end of new section
	break;
	case 'Delete group':
    require('groupDelete.phpinc');
    headerLocation('/admin/group/');
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
	break;
}
?>

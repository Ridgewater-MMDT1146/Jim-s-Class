<?
// admin/user/user.php
// User add/edit page.

$authorizedPermissions = 'Admin';
require('../../application.phpinc'); // Include application setup file. Use a relative path.
// Process form.
switch ($f['task']) {
	case '':
	case 'Add':
	case 'Edit':
    require('userForm.phpinc');
	break;
	case 'Cancel':
	case 'Done':
    headerLocation('/admin/user/');
    #h#eader("Location: /admin/user");
	break;
	case 'Add user':
	case 'Update user':
    // Verify user form.
    require('userVerify.phpinc');
    if ( !isset($formError) ) {
      require('userProcess.phpinc');
      #headerLocation('/admin/user/'); // If you do not want them to see the form again use header.
      require('admin/user/userForm.phpinc'); // If you want them to see the form then use include.
    } else {
      require('admin/user/userForm.phpinc'); // If you want them to see the form then use include.
    }
	break;
	case 'Add to group':
	case 'Remove from group':
    require('userGroupProcess.phpinc');
    require('userForm.phpinc'); // If you want them to see the form then use include.
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
	break;
}
?>

<?
// User/Information/user.php
// User edit page.

$authorizedPermissions = 'USER';
include('../../application.phpinc'); // Include application setup file. Use a relative path.
// Process form.
switch ($f['task']) {
	case '':
	case 'Edit':
    include('User/Information/userForm.phpinc');
	break;
	case 'Cancel':
	case 'Done':
    headerLocation('/user');
	break;
	case 'Update user':
    // Verify user form.
    include('User/Information/userVerify.phpinc');
    if ( !isset($formError) ) {
      include('User/Information/userProcess.phpinc');
      #headerLocation('/admin/user/'); // If you do not want them to see the form again use header.
      include('User/Information/userForm.phpinc'); // If you want them to see the form then use include.
    } else {
      include('User/Information/userForm.phpinc'); // If you want them to see the form then use include.
    }
	break;
	case 'Add to group':
	case 'Remove from group':
    include('User/Information/userGroupProcess.phpinc');
    include('User/Information/userForm.phpinc'); // If you want them to see the form then use include.
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
	break;
}
?>

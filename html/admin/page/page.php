<?
// admin/page/page.php
// Page add/edit page.

$authorizedPermissions = 'Admin';
require('../../application.phpinc'); // Include application setup file. Use a relative path.
// Process form.
switch ($f['task']) {
	case '':
	case 'Add':
	case 'Edit':
    require('admin/page/pageForm.phpinc');
	break;
	case 'Cancel':
	case 'Done':
    headerLocation('/admin/page/');
	break;
	case 'Add page':
	case 'Update page':
    // Verify page form.
    require('admin/page/pageVerify.phpinc');
    if (!$error) {
      require('admin/page/pageProcess.phpinc');
      headerLocation('/admin/page/');
    }
    require('admin/page/pageForm.phpinc'); // If you want them to see the form then use include.
			break; //new section
	case 'Delete page':
    require('admin/page/pageDelete.phpinc');
    headerLocation('/admin/page/');
	case 'Add to group':
	case 'Remove from group':
    require('admin/page/pageGroupProcess.phpinc');
    require('admin/page/pageForm.phpinc'); // If you want them to see the form then use include. this is the end of new section
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
	break;
}
?>

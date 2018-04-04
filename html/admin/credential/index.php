<?
// admin/credential/index.php
// Credential Management.

// AUTHENTICATION AND TITLE SETTINGS.
#$skipAuthentication = true; // Authentication is skipped for this page.
$authorizedPermissions="PUBLIC"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
require('../../application.phpinc'); // Include application setup file. Use a relative path.
switch ($f['task']) {
	case 'Add credential':
	case 'Update credential':
    require('credentialFormVerify.phpinc');
    if ( !isset($formError) ) {
      require('credentialFormProcess.phpinc');
    } else {
      pageHeader('Credential Management - Edit credential');
      require('CredentialForm.phpinc');
    	break;
    }
	case '':
	case 'Cancel':
    pageHeader('Credential Management');
    require('CredentialManagement.phpinc');
	break;
	case 'Add new credential':
	case 'Edit credential':
    f('credentialId');
    if ( $f['credentialId'] ) {
      pageHeader('Credential Management - Edit credential');
    } else {
      pageHeader('Credential Management - Add credential');
    }
    require('CredentialForm.phpinc');
	break;
	case '':
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
}

pageFooter();
?>

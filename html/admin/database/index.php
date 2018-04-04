<?
// admin/database/index.php
// Website database administration control page.

$authorizedPermissions = 'Admin';
require('../../application.phpinc'); // Include application setup file. Use a relative path.
pageHeader("Database Administration");
?>
<div>Select a database administration function from above.</div>
<?
pageFooter();
?>

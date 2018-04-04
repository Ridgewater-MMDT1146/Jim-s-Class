<?
// index.php
// Return user to root folder.
#$skipAuthentication = true; // Uncomment this line to skip authentication for this page.
require('../application.phpinc'); // Include application setup file. Use a relative path.
headerLocation('/');
?>

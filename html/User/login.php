
<?
// User/login.php
// Login page
//$TRACK = false; // Uncomment this line to turn off tracking for this page.
$skipAuthentication = true;
require('../application.phpinc'); 
#formValue('','authURL');
#formValue('','authTitle');
pageHeader('','','');
require('User/login.phpinc');
#if ($TRACK) $_SESSION['TRACKdata'] .= "<li>\$_SESSION['user']['Firstname']=".$_SESSION['user']['Firstname']."<br>\n";
pageFooter();
?>

<? 
// User/unauthorized.php

#$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedPermissions="PUBLIC"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
require('../application.phpinc'); 
formValue('','authURL');
pageHeader('Unauthorized Access','','');
?>

<div align="center" class="center">
<span class="bold error">
<?
if (isset($_GET['authTitle'])) {
?>
You are not authorized to view the "<?=$_GET['authTitle']?>" page.
<?
} else {
?>
You are not authorized to view this page.
<?
}
if ($DEBUG['page']['code']) { 
?> 
<br>(<?=$authURL?>)
<? 
} ?>
</span>
<br>
<br>
If you feel this is an error, please contact the <span class="appName"><?=$_SESSION['APP']['shortname']?></span> web site Administrator <a href="mailto:<?=$_SESSION['APP']['ADMIN']['email']?>"><?=$_SESSION['APP']['ADMIN']['name']?></a> at <?=$_SESSION['APP']['ADMIN']['email']?>.
</div>
<?
if (!isset($_SESSION['user']['Firstname']) || (isset($_SESSION['user']['Firstname']) && $_SESSION['user']['Firstname'] == '')) {
  require('common/loginForm.phpinc');
}
?>
<?
pageFooter();
?>

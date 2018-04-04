<?
// index.php
// Main page.

// AUTHENTICATION AND TITLE SETTINGS.
#$skipAuthentication = true; // Authentication is skipped for this page.
$authorizedPermissions="PUBLIC"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
require('application.phpinc'); // Include application setup file. Use a relative path.
switch ($f['task']) {
	case '':
	case 'Home':
	break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
}

pageHeader('Main Page for now');

sectionHeader('Site needs');
include('siteNeeds.html');
sectionFooter();

sectionHeader('Change log');
include('changelog.html');
sectionFooter();

sectionHeader('Student List - Add your name to the list.');
?><pre><?
require('StudentNames.phpinc');
?></pre><?
sectionFooter();

sectionHeader('Student Work.');
require('StudentWork.phpinc');
sectionFooter();

sectionHeader('Instructors listed here to \'see\' colors.');
?>
<ul class="nav nav-sidebar-second">
	<li style="color:#19CF2E">Jim Martinson</li><!---->
	<li style="color:#A1A140">Allen Benusa</li><!---->
	<li style="color:#94704D">Rocky Hyberger</li><!---->
	<li style="color:#949CB5">Amy Maher</li><!---->
	<li style="color:#CC7AA3">Jeff Polman</li><!---->
</ul>
<hr>
<ul class="list-group">
	<li class="list-group-item list-group-item-success">Jim Martinson</li> 
	<li class="list-group-item list-group-item-info">Allen Benusa</li>
	<li class="list-group-item list-group-item-warning">Rocky Hyberger</li>
	<li class="list-group-item list-group-item-danger">Amy Maher</li>
	<li class="list-group-item list-group-item-info">Joyce Leske</li>
	<li class="list-group-item list-group-item-danger">Jeff Polman</li>
</ul>
<?
sectionFooter();

pageFooter();
?>

<?
// assignments/index.php
// index_page_purpose.

#$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedPermissions="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
include('../application.phpinc'); // Include application setup file. Use a relative path.


pageHeader('Scheduler Assignments','',''); // false = no page header, NULL = no page header or tracking.
sectionHeader('');
?>
<ol>
	<li><pre>
2016-02-10 
  Sync scheduler with cst.ridgewater.edu
  Add name to StudentNames.phpinc file.
  Add your strengths to /site/_work/StudentStrengths.html
  Update your database using the /site/_backup/scheduler 20160219.sql file</pre>
    </li>
	<li><pre>
2016-02-24 
  Kelly and Tor are working on sideNav.
  Jim is working on Credentials for DB.</pre>
    </li>
<li>Need to tie instructors to departments. (DB)</li>
<li>Left side nav.</li>
<li>Database management. (Admin)</li>
<li>CSS</li>
<li>JS</li>
<li>.</li>
<li>.
  <?
sectionFooter();
pageFooter();
?>
</li>
</ol>

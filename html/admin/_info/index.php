<?
// admin/_info/index.php
// Display data info.

// Last Updated 2014-05-22. Changed field conditionals to be unchecked by default. By Jim Martinson

#$TRACK = false; // Uncomment this line to turn off tracking for this page.

// AUTHENTICATION AND TITLE SETTINGS.
#$skipAuthentication = true; // Uncomment this line to skip authentication for this page.
$authorizedPermissions="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
include('../../application.phpinc'); // Include application setup file. Use a relative path.
include('admin/_info/infoFunctions.phpinc');
pageHeader("Database information utilities",'/admin/_info/normalize.css,/admin/_info/_info.css','/admin/_info/_info.js');
formValue('table'); if ( $f['table'] ) { $sectionTitle = $f['table'].' Table'; } else { $sectionTitle = 'Tables'; }
formValue('database'); if ( !$f['database'] ) $f['database'] = $_SESSION['DATABASE']['Default'];
// Show menu.
include('admin/_info/infoMenu.phpinc');
?>
<form name="form_info">
<?
switch ($f['task']) {
  case '': // Tables.
  case 'Login':
    #include('../../_info/infoTables.phpinc');
  break;
  case 'table':
    $f['task'] = 'Fields';
  case 'Fields': // Fields
    include('admin/_info/infoFields.phpinc');
  break;
  case 'Backup tables': // Data
    include('admin/_info/BackupTables.phpinc');
  break;
  case 'Data': // Data
    include('admin/_info/infoData.phpinc');
  break;
  case 'Datatypes': // Datatype
    include('admin/_info/infoDatatype.phpinc');
  break;
  case 'Form': // Form
    include('admin/_info/form/infoForm.phpinc');
  break;
  case 'List': // List
    include('admin/_info/form/infoListForm.phpinc');
  break;
  case 'Notes': // Notes
    include('admin/_info/infoNotes.phpinc');
  break;
  case 'Parse': // Parse
    include('admin/_info/infoParse.phpinc');
  break;
  case 'Reorder': // Reorder
  case 'ReorderSet': // Reorder
  case 'Perform Reoder'; // Performs the update
    include('admin/_info/infoReorder.phpinc');
  break;
  case 'Set': // Set
    include('admin/_info/infoSet.phpinc');
  break;
  case 'DELETE': // DELETE
    include('admin/_info/query/infoDELETE.phpinc');
  break;
  case 'INSERT': // INSERT
    include('admin/_info/query/infoINSERT.phpinc');
  break;
  case 'SELECT': // SELECT
    include('admin/_info/query/infoSELECT.phpinc');
  break;
  case 'UPDATE': // UPDATE
    include('admin/_info/query/infoUPDATE.phpinc');
  break;
  case '$_POST':  // $_POST
    include('admin/_info/infoPost.phpinc');
  break;
  case 'infoDir': // infoDir
    include('admin/_info/infoDir.phpinc');
  break;
  case 'sql': // sql
    include('admin/_info/infoSQL.phpinc');
  break;
  default:
    programmingError("The task [".$f['task']."], subtask [".$f['subtask']."], form [".$f['form']."] is not programmed.");
  break;
}
?>
</form>
<script type="text/javascript">
  info_ResizeTextareas(120);
<? if ( $f['task'] == 'Form' && $f['subtask'] == 'Expand settings' ) {
?>  info_ExpandCollapse('Expand settings');
<? } if ( $f['task'] == 'Form' && $f['subtask'] == 'Collapse settings' ) {
?>  info_ExpandCollapse('Collapse settings');
<? } if ( $f['task'] == 'Form' && $f['subtask'] == 'Expand code' ) {
?>  info_ExpandCollapse('Expand code');
<? } if ( $f['task'] == 'Form' && $f['subtask'] == 'Collapse code' ) {
?>  info_ExpandCollapse('Collapse code'); <? } ?>
</script>
<?
d_On('foot');
pageFooter();
?>

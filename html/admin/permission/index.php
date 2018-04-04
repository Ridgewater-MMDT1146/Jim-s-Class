<?
// admin/group/index.php
// Website administration main page.

$authorizedPermissions = 'Admin';
require('../../application.phpinc'); // Include application setup file. Use a relative path.
$query = "
    SELECT userpermissionId,
           userpermissionName,
           groupDescription
      FROM `userpermission`
  ORDER BY userpermissionName
";
$groupResult = query_do($query);
$groupCount = $GLOBALS['_QUERY']['count'];
pageHeader("Group administration");
if ($groupCount) {
?>
  <table>
    <tr style="vertical-align:bottom;">
      <td>
          <form name="addGroup" action="userpermission.php" method="post">
              <input type="hidden" name="userpermissionId" id="userpermissionId" value="0">
                <input type="submit" name="task" value="Add">
            </form>
        </td>
        <th>Name</th>
      <th>Description</th>
    </tr>
<?
  query_seek($groupResult, 0);
  while ($groupInfo = query_row($groupResult)) {
    #d_Var('$groupInfo',$groupInfo);
?>
  <tr>
      <td>
          <form name="editGroup_<?=$groupInfo['userpermissionId']?>" action="userpermission.php" method="post">
              <input type="hidden" name="userpermissionId" id="userpermissionId" value="<?=$groupInfo['userpermissionId']?>">
                <input type="submit" name="task" value="Edit">
            </form>
        </td>
        <td><?=$groupInfo['userpermissionName']?></td>
      <td><?=$groupInfo['groupDescription']?></td>
    </tr>
<?
  }
?>
  </table>
<?
} else {
?>
<form name="addGroup" action="userpermission.php" method="post" class="inline">
    <input type="hidden" name="userpermissionId" id="userpermissionId" value="0">
    There are no groups. You can <input type="submit" name="task" value="Add" style="font-size:smaller;"> one.
</form>
<?
}
?>
<p>

<?
pageFooter();
?>

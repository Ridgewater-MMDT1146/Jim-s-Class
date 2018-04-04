<?
// admin/user/index.php
// Website administration main page.

$authorizedPermissions = 'Admin';
require('../../application.phpinc'); // Include application setup file. Use a relative path.
// Get the list of users.
formValue('userInactive'); if ( !$f['userInactive'] ) $f['userInactive'] = 0;
$query = "
    SELECT user.*, userhistory.userhistoryDate AS lastLogin
      FROM `user`
 LEFT JOIN userhistory ON userhistory.userId = user.userId
     WHERE userInactive = ".$f['userInactive']."
       AND ( userhistory.userhistoryDate = ( SELECT MAX(userhistoryDate) from userhistory WHERE userhistory.userId = user.userId )
             OR
             userhistory.userhistoryDate IS NULL )
      ORDER BY userFirstname, userLastname
";
$userResult = query_do($query);
$userCount = $GLOBALS['_QUERY']['count'];
pageHeader("User administration");
?>
  <table>
    <tr><td colspan="6">
<?
  if (!$f['userInactive']) {
?>
  <h3 class="inline">Active users</h3> &nbsp; <a href="./?userInactive=1">View inactive users</a>.
<?
  } else {
?>
  <h3 class="inline">Inactive users</h3> &nbsp; <a href="./?userInactive=0">View active users</a>.
<?
  }
#}
if ($userCount) {
?>
    </th></tr>
    <tr style="vertical-align:bottom;">
      <td>
        <form name="addUser" action="user.php" method="post">
          <input type="hidden" name="userId" id="userId" value="0">
          <input type="submit" name="task" value="Add" class="smaller">
        </form>
      </td>
      <th class="left">Name</th>
      <th class="left">Username</th>
      <th>Email</th>
      <th>Last access</th>
    </tr>
<?
  $volunteersShown = false;
  query_seek($userResult, 0);
  while ($userInfo = query_row($userResult)) {
    #d_Var('$userInfo',$userInfo);
?>
  <tr>
      <td>
        <form name="editUser_<?=$userInfo['userId']?>" action="user.php" method="post">
          <input type="hidden" name="userId" id="userId" value="<?=$userInfo['userId']?>">
          <input type="submit" name="task" value="Edit" class="smaller">
        </form>
      </td>
      <td><?=userName($userInfo['userId'])?></td>
      <td><?=$userInfo['userUsername']?></td>
      <td><?=$userInfo['userEmailAddress']?></td>
      <td><? if ( $userInfo['lastLogin'] != '' ) { echo $userInfo['lastLogin']; } else { echo '<span class="warn">Never logged in.</span>'; }?></td>
    </tr>
<?
  }
?>
  </table>
<?
} else {
  if (!$f['userInactive']) {
?>
  <br>
  There are no active users.
<?
  } else {
?>
  <br>
  There are no inactive users.
<?
  }
}
?>
<p>

<?
pageFooter();
?>

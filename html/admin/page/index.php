<?
// admin/page/index.php
// Website administration main page.

$authorizedPermissions = 'Admin';
require('../../application.phpinc'); // Include application setup file. Use a relative path.
$query = "
    SELECT pageId,
           pageURL,
           pageDescription
      FROM `page`
  ORDER BY pageURL
";
$pageResult = query_do($query);
$pageCount = $GLOBALS['_QUERY']['count'];
pageHeader("Page administration");
if ($pageCount) {
?>
  <table>
    <tr style="vertical-align:bottom;">
      <th>
        <form name="addPage" action="page.php" method="post">
          <input type="hidden" name="pageId" id="pageId" value="0">
          <input type="submit" name="task" value="Add">
        </form>
      </th>
      <th>URL</th>
      <th>Description</th>
      <th>Groups</th>
    </tr>
<?
  query_seek($pageResult, 0);
  while ($pageInfo = query_row($pageResult)) {
    // Get the list of groups for this page.
$query = "
    SELECT userpermission.userpermissionName
      FROM `userpermission`
INNER JOIN group_page ON userpermission.userpermissionId = group_page.userpermissionId
     WHERE group_page.pageId = ".$pageInfo['pageId']."
  ORDER BY userpermission.userpermissionName
";
$group_pageResult = query_do($query);
$group_pageCount = $GLOBALS['_QUERY']['count'];
#if ($group_pageCount) #d_Var('$group_pageResult',$group_pageResult);
$groupList = query_to_list($group_pageResult); if ( !$groupList ) $groupList = '0';

?>
  <tr>
      <td>
          <form name="editPage_<?=$pageInfo['pageId']?>" action="page.php" method="post">
              <input type="hidden" name="pageId" id="pageId" value="<?=$pageInfo['pageId']?>">
              <input type="submit" name="task" value="Edit">
            </form>
        </td>
<?
        $f['pageURL'] = 'http://'.$_SERVER['SERVER_NAME'].'/'.$pageInfo['pageURL'];
        #if (substr($f['pageURL'],strlen($f['pageURL'])-9,9) == 'index.php') $f['pageURL'] = str_replace('index.php','',$f['pageURL']);
?>
        <td><?=$f['pageURL']?></td>
      <td><?=$pageInfo['pageDescription']?></td>
        <td><?=listAnd($groupList)?></td>
    </tr>
<?
  }
?>
  </table>
<?
} else {
?>
<form name="addPage" action="page.php" method="post" class="inline">
    <input type="hidden" name="pageId" id="pageId" value="0">
    There are no pages. You can <input type="submit" name="task" value="Add" style="font-size:smaller;"> one.
</form>
<?
}
?>
<p>

<?
pageFooter();
?>

<?
// /site/menu_SoundSettingSave.php
// Change sound settings.

$TRACK = false; // Uncomment this line to turn off tracking for this page.
// AUTHENTICATION AND TITLE SETTINGS.
$authorizedGroups="USER"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
require('../application.phpinc'); // Include application setup file. Use a relative path.

f('sound');
f('setting');
echo 'task == '.$f['task']."<br>\n";
echo 'sound == '.$f['sound']."<br>\n";
echo 'setting == '.$f['setting']."<br>\n";
switch ( $f['task'] ) {
	case 'Reset':
		// Reset all SESSION['user']['Sound'] settings.
		$query = "
				SELECT SoundMute
						 , SoundAttention
						 , SoundAvailable
						 , SoundError
						 , SoundNotice
						 , SoundPing
						 , SoundWarning
					FROM `userdata`
				 WHERE userId = ".$_SESSION['userId']."
		";
		#d_Var('userdataInfo',$query,'q');
		$userdataInfo = query_info($query);
		#d_Var('$userdataInfo',$userdataInfo);
		foreach ( $userdataInfo as $sound => $setting ) {
			$_SESSION['user']['Sound'][str_replace('Sound','',$sound)] = $setting;
			if ( $sound != 'SoundMute' ) {
?>
			<?=$sound?> id_<?=str_replace('Sound','',$sound)?> == <div id="id_<?=str_replace('Sound','',$sound)?>" class="xhidden inline"><?=$_SESSION['user']['Sound'][str_replace('Sound','',$sound)]?>|<?=$HTTP?>/sounds/<?=strtolower(str_replace('Sound','',$sound))?><?=$_SESSION['user']['Sound'][str_replace('Sound','',$sound)]?>.wav</div><br>
<?
			} else {
?>
			<?=$sound?> id_<?=str_replace('Sound','',$sound)?> == <div id="id_<?=str_replace('Sound','',$sound)?>" class="xhidden inline"><?=$_SESSION['user']['Sound'][str_replace('Sound','',$sound)]?></div><br>
<?
			}
				
		}
	break;
	case 'Save':
		// UPDATE userdata Sound.sound settings.
		$query = "
				UPDATE `userdata`
					 SET Sound".$f['sound']." = ".$f['setting']."
				 WHERE userId = ".$_SESSION['userId']."
		";
		echo 'userdataUPDATE == '.$query."<br>\n";
		$userdataUPDATE = query_do($query);
	case 'Set':
		// Set SESSION['user']['Sound'][sound].
		$_SESSION['user']['Sound'][$f['sound']] = $f['setting'];
	break;
}
?>

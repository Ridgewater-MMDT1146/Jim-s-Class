<?
// js/site_js.php
// Create dynamic javascript.
#$TRACK = false; // Uncomment this line to turn off tracking for this page.
$authorizedPermissions="PUBLIC"; // List of groups authorized to view this page (i.e., PUBLIC = anyone, USER = any user, "Admin,Manager" = users in the Admin or Manager groups).
require('../application.phpinc'); // Include application setup file. Use a relative path.
//$f['DEBUG_site_js'] = true;
f('DEBUG_site_js');
if ( $GLOBALS['f']['DEBUG_site_js'] ) { // DEBUG_site
  pageHeader('site_js');
  d_On();
} // END DEBUG_site.
header("Content-type: application/x-javascript"); // Set the content-type.
header("Cache-Control: no-cache, must-revalidate"); header("Expires: Sun, 1 Jan 2006 06:00:00 GMT"); // Stop cache.

f('js_site_directory');
$jsText = "";
echo "
// BEGIN FILE ".__File__." ".currentDateTime()."
// ".basename(__FILE__)." contains site dynamic javascript.
console.warn('".basename(__FILE__)."');

/** / // BEGIN comments on line:".__LINE__.".
";

$jsText .= "

var ROOT_http = '".$HTTP."';
";
#d_V('js_site_directory','d');

echo "
/**/ // END comments on line:".__LINE__.".
";

echo $jsText; // Write out the script.

// Add js_site_directory file if given.
if ( $f['js_site_directory'] ) {
	$jsFile = 'js_write_'.$f['js_site_directory'].'.phpinc';
	$jsPath = $_SESSION['ROOT']['directory'].'/'.$f['js_site_directory'].'/'.$jsFile;
	echo "\n\n// \$f['js_site_directory'] path == [".$jsPath."]. ".basename(__FILE__).':'.__LINE__."\n";
	if ( file_exists($jsPath) ) {
		require($jsPath);
	} else {
	}
}

echo "
// END FILE ".__File__."
";

if ( $GLOBALS['f']['DEBUG_site_js'] ) { // DEBUG_site
	pageFooter();
} // END DEBUG_site.
?>

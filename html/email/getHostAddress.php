<?
// email/getHostAddress.php
// Check if the IP address is a 192., 10. or other.
$skipAuthentication = true; // Uncomment this line to skip authentication for this page.
require('../application.phpinc'); // Include application setup file. Use a relative path.
pageHeader('getHostAddress.phpinc test'); // Include page header. pageHeader('page_title','css_file_list','js_file_list',true_to_debug_page)
if ( !isset($ipNetwork) ) require('email/getHostAddress.phpinc');
d_Var('$ipNetwork',$ipNetwork,'/l');
d_Var("\$_SESSION['APP']['EMAIL']",$_SESSION['APP']['EMAIL'],'+l');
pageFooter();
?>

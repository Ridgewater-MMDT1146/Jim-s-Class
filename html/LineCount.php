<?
 
/**
 * Counts the lines of code in this folder and all sub folders
 * You may not sell this script or remove these header comments
 * @author Hamid Alipour, http://blog.code-head.com/
**/
$default_timezone = 'America/Chicago'; date_default_timezone_set($default_timezone); // Set the default timezone.

#define('SHOW_DETAILS', true);

class Folder {

	var $name;
	var $path;
	var $folders;
	var $files;
	var $exclude_extensions;
	var $exclude_files;
	var $exclude_folders;


	function Folder($path) {
		$dirTemp = array_filter( explode(DIRECTORY_SEPARATOR, $path) );
		$this -> path 		= $path;
		$this -> name		= array_pop( $dirTemp );
		$this -> folders 	= array();
		$this -> files		= array();
		$this -> exclude_extensions = array('gif', 'jpg', 'jpeg', 'png', 'tft', 'bmp', 'ico', 'sql', 'ttf', 'mp3', 'wav', 'xml');
		$this -> exclude_files 	    = array('Linecount.php', 'rest-of-the-files-to-exclude');
		$this -> exclude_folders 	 = array('_private', '_vti_bin', '_vti_cnf', '_vti_log', '_vti_pvt', '_vti_txt', 'fonts', 'images', 'sounds', '_info', '_work', '_backup', '_notes', '_archive', '_Archive');
	}

	function count_lines() {
		if ( defined('SHOW_DETAILS') ) echo "/Folder: {$this -> path}...<br>\n";
		$total_lines = 0;
		$this -> get_contents();
		foreach($this -> files as $file) {
			if ( in_array($file -> ext, $this -> exclude_extensions) || in_array($file -> name, $this -> exclude_files) ) {
				if ( defined('SHOW_DETAILS') ) echo "#---Skipping File: {$file -> name};<br>\n";
				continue;
			}
			$total_lines += $file -> get_num_lines();
		}
		foreach($this -> folders as $folder) {
			if ( in_array($folder -> name, $this -> exclude_folders) ) {
				if ( defined('SHOW_DETAILS') ) echo "#Skipping Folder: {$folder -> name};<br>\n";
				continue;
			}
			$total_lines += $folder -> count_lines();
		}
		if ( defined('SHOW_DETAILS') ) echo "\n Total lines in {$this -> name}: $total_lines;<br><br>\n";
		return $total_lines;
	}

	function get_contents() {
		$contents = $this -> _get_contents();
		foreach($contents as $key => $value) {
			if ( $value['type'] == 'Folder' ) {
				$this -> folders[] = new Folder($value['item']);
			} else {
				$this -> files[]   = new File  ($value['item']);
			}
		}
	}

	function _get_contents() {
		$folder = $this -> path;
		if ( !is_dir($folder) ) {
			return array();
		}
		$return_array = array();
		$count		  = 0;
		if ( $dh = opendir($folder) ) {
			while( ($file = readdir($dh)) !== false ) {
				if ( $file == '.' || $file == '..' ) continue;
				$return_array[$count]['item']	= $folder .$file .(is_dir($folder .$file) ? DIRECTORY_SEPARATOR : '');
				$return_array[$count]['type']	= is_dir($folder .$file) ? 'Folder' : 'File';
				$count++;
			}
			closedir($dh);
		}
		return $return_array;
	}

} // Class

class File {

	var $name;
	var $path;
	var $ext;


	function File($path) {
		$nameExplode = explode('.', $this -> name);
		$this -> path = $path;
		$this -> name = basename($path);
		$this -> ext  = array_pop( $nameExplode );
	}

	function get_num_lines() {
		$count_lines = count(file($this -> path));
		if ( defined('SHOW_DETAILS') ) echo "|---File: {$this -> name}, lines: $count_lines;<br>\n";
		return $count_lines;
	}

} // Class

function getDirectoryAndFileCount($path) {
	$fileCount = 0;
	$directoryCount = 0;
	$ignore = array('.','..','_private', '_vti_bin', '_vti_cnf', '_vti_log', '_vti_pvt', '_vti_txt', 'fonts', 'images', 'sounds', '_info', '_work', '_backup', '_notes', '_Archive', '_archive');
	$files = scandir($path);
	foreach($files as $t) {
		if( in_array($t, $ignore) ) continue;
		if ( strpos($t,'.cloak') !== false ) continue;
		//echo $t."<br>\n";
		if ( strpos($t,'.') === false ) $directoryCount++;
		if ( is_dir(rtrim($path, '/') . '/' . $t) ) {
			list($dCount,$fCount) = getDirectoryAndFileCount(rtrim($path, '/') . '/' . $t);
			$directoryCount += $dCount;
			$fileCount += $fCount;
		} else {
			$fileCount++;
		}   
	}
	return array($directoryCount,$fileCount);
}

$path_to_here = dirname(__FILE__).DIRECTORY_SEPARATOR;
//echo '$path_to_here == '.$path_to_here."<br><br>\n";
$folder 		  = new Folder($path_to_here);
list($directoryCount,$fileCount) = getDirectoryAndFileCount($path_to_here);
?>
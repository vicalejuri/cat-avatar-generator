<?php
/**
 * ====================
 * CAT-AVATAR-GENERATOR
 * ====================
 * 
 * @authors: Andreas Gohr, David Revoy
 * 
 * This PHP is licensed under the short and simple permissive:
 * [MIT License](https://en.wikipedia.org/wiki/MIT_License)
 * 
**/

// /!\ change the path to your system's cache or a folder(write permission) 
// Note: this path end with / and is relative to the cat-avatar-generator.php file.
$cachepath = 'cache/';

function build_cat($seed=''){
    // init random seed
    if($seed) srand( hexdec(substr(md5($seed),0,6)) );

    // throw the dice for body parts
    $parts = array(
        'body' => rand(1,15),
        'fur' => rand(1,10),
        'eyes' => rand(1,15),
        'mouth' => rand(1,10),
        'accessorie' => rand(1,20)
    );

    // create backgound
    $cat = @imagecreatetruecolor(70, 70)
        or die("GD image create failed");
    $white = imagecolorallocate($cat, 255, 255, 255);
    imagefill($cat,0,0,$white);

    // add parts
    foreach($parts as $part => $num){
        $file = dirname(__FILE__).'/avatars/'.$part.'_'.$num.'.png';

        $im = @imagecreatefrompng($file);
        if(!$im) die('Failed to load '.$file);
        imageSaveAlpha($im, true);
        imagecopy($cat,$im,0,0,0,0,70,70);
        imagedestroy($im);
    }

    // restore random seed
    if($seed) srand();

    header('Pragma: public');
    header('Cache-Control: max-age=86400');
    header('Expires: '. gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));
    header('Content-Type: image/jpg');
    imagejpeg($cat, NULL, 90);
    imagedestroy($cat);
}

$imageurl = $_GET["seed"];
$imageurl = preg_replace('/[^A-Za-z0-9\._-]/', '', $imageurl); 
$imageurl = substr($imageurl,0,35).'';
$cachefile = ''.$cachepath.''.$imageurl.'.jpg';
$cachetime = 604800; # 1 week (1 day = 86400)

// Serve from the cache if it is younger than $cachetime
if (file_exists($cachefile) && time() - $cachetime < filemtime($cachefile)) {
  header('Pragma: public');
  header('Cache-Control: max-age=86400');
  header('Expires: '. gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));
  header('Content-Type: image/jpg');
  readfile($cachefile);
  exit;
}

// ...Or start generation
ob_start(); 

// render the picture:
build_cat($_REQUEST['seed']);

// Save/cache the output to a file
$savedfile = fopen($cachefile, 'w+'); # w+ to be at start of the file, write mode, and attempt to create if not existing.
fwrite($savedfile, ob_get_contents());
fclose($savedfile);
chmod($savedfile, 0755);
ob_end_flush();

?>

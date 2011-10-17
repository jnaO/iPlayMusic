<?php

include 'Music.php';
$music = new Music();
include 'Art.php';
$art = new Art();

$am = array ();

$a = ( !empty ($_POST['a']) ) ? $_POST['a'] : $_GET['a'] ;

switch ($a) {
    case 'art':
        $am['art'] = $art->getAlbumArt();
        break;
}

$m = ( !empty ($_POST['r']) ) ? $_POST['r'] : $_GET['r'] ;

switch ($m) {
    case 'tracks':
        $am['music'] = $music->getTracks();
        break;
    case 'allfiles':
        $music->getAllFiles();
        break;
    case 'filetypes':
        $music->getFileTypes();
        break;
}

header('Content-type: application/json');
echo(json_encode($am));
?>
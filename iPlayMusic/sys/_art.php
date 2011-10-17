<?php
include 'Art.php';
$art = new Art();

$a = ( !empty ($_POST['a']) ) ? $_POST['a'] : $_GET['a'] ;

switch ($a) {
    case 'art':
        $art->getAlbumArt();
        break;
}
?>
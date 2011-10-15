<?php

include 'Art.php';
$art = new Art();

$s = ( !empty ($_POST['r']) ) ? $_POST['r'] : $_GET['r'] ;

switch ($s) {
    case 'tracks':
        $music->getTracks();
        break;
    case 'allfiles':
        $music->getAllFiles();
        break;
    case 'filetypes':
        $music->getFileTypes();
        break;
}
?>
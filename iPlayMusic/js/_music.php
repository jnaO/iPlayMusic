<?php

include 'Music.php';
$music = new Music();

switch ($_POST['r']) {
    case 'filenames':
        $music->getFileNames();
        break;
    case 'tracktitles':
        $music->getTrackTitles();
        break;
    case 'filetypes':
        $music->getFileTypes();
        break;
}


?>

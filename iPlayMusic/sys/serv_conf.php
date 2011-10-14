<?php
require_once '../config.php';


/* ========================| MUSIC_FOLDER |======================== */
$s = ( !empty($_SERVER['HTTPS']) ) ? 'https://' : 'http://';

define('SERVER_MUSIC_FOLDER', $_SERVER['DOCUMENT_ROOT'].'/'.$music_folder);
define('PUBLIC_MUSIC_FOLDER', $s.$_SERVER['SERVER_NAME'].'/'.$music_folder);


/* =========================| ALBUM_ART |========================= */
define('SERVER_ALBUM_ART_FOLDER', $_SERVER['DOCUMENT_ROOT'].'/'.$album_art_folder);
define('PUBLIC_ALBUM_ART_FOLDER', $s.$_SERVER['SERVER_NAME'].'/'.$album_art_folder);

?>

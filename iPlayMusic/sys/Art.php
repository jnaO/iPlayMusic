<?php

require_once 'serv_conf.php';

/**
 * Functions returns information about music files stored in folder iPlayMusic/music/
 */
class Art {

    private $images = array();
    private $filetypes = array();
    private $album_art = array();


    /**
     * Locates album art files and put them in private array "$art_files"
     *
     * Populates array "$filetypes" with allowed filetypes from constant
     *
     */
    public function __construct() {

        /* Pick up images from folder */
        $this->images = glob(SERVER_ALBUM_ART_FOLDER . "*.*");
        /* Explode allowed_file_types-constant into an array, and populate private arr "filetypes" */
        $this->filetypes = explode('||', ALBUM_ART_FILE_TYPES_ALLOWED);
        /* Populate private array "album_art" */
        $this->createAlbumArtObjects();

    }

    /**
     * Put extra data to the images supplied, such as file name, public file path
     * as well as checkes the images for being of a type that is valid
     */
    private function createAlbumArtObjects(){
        for($i = 0; $i < count($this->images); $i++ ){

            // Check if the type of file is valid
            if($this->isArtLegal($this->images[$i])){
                // Create an Album Art Object
                $aObj = $this->createObject($this->images[$i]);

            }
        }
    }

    /**
     * Turn our image into an Album Art Object
     * I.E. change server path to public path, and give it a name (filename,
     * without .*, and replace underscore with space...)
     *
     * @param String $peiceOfArt
     *      Image file, including server path
     *
     */
    private function createObject($peiceOfArt){

        $peiceOfArt = str_replace(SERVER_ALBUM_ART_FOLDER, '', $peiceOfArt);

        $art_obj = array();
        $i = count($this->album_art);
        $this->album_art[$i]['name']    = str_replace('_', ' ', substr($peiceOfArt, 0, stripos($peiceOfArt, '.')));
        $this->album_art[$i]['file']    = PUBLIC_ALBUM_ART_FOLDER . $peiceOfArt;

    }


    /**
     * Check to see if we have a match between files .* and specified files in
     * constant ALBUM_ART_FILE_TYPES_ALLOWED
     *
     * @param String $peiceOfArt
     *      file, including server path
     *
     * @return Boolean
     *      returns true if we get a match
     */
    private function isArtLegal($peiceOfArt){

        $file_name = str_replace(SERVER_ALBUM_ART_FOLDER, '', $peiceOfArt);
        $filetype = stristr($file_name, '.');

        if(in_array($filetype, $this->filetypes)){
            return true;
        }
        return false;
    }

    /**
     *
     * @return $album_art Array
     *      An array of album_art-objects
     *
     */
    public function getAlbumArt(){
       return $this->album_art;
    }

}
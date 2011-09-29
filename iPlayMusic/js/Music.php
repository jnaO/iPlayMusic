<?php

require_once '../config.php';

/**
 * Functions returns information about music files stored in folder iPlayMusic/music/
 */
class Music {

    private $music_files = array();
    private $filetypes = array();
    private $tracks = array();


    /**
     * Creates an array of Track objects :: $tracks
     * Creates an array of supported filetypes :: $filetypes
     * Creates an array of all files contained in MUSIC_FOLDER :: $music_files
     */
    public function __construct() {
        /* Pick up musicfiles from folder */
        $this->music_files = glob(MUSIC_FOLDER . "*.*");

        /* Iterate through exising music files stored in foldes specified in config.php */
        for ($i = 0; $i < count($this->music_files); $i++) {

            /* Remove path to musicfiles from the string stored in $music_files */
            $track = $this->music_files[$i] = str_replace(MUSIC_FOLDER, '', $this->music_files[$i]);

            /* Set filetypes supported by user */
            $file_type = stristr($this->music_files[$i], '.');
            $this->setFileType($file_type);

            // Create track object
            $this->createTrack($file_type, $track);
        }
    }



    /**
     * Creates a track object and place it into the $tracks array
     *
     * Each track carries
     *
     * @param String $file_type
     * @param String $track
     */
    private function createTrack($file_type, $track) {
        // create name, title nad path
        $num = count($this->tracks[$file_type]);
        $this->tracks[$file_type][$num]['file'] = $track;
        $this->tracks[$file_type][$num]['title'] = $this->setTrackTitle($track);
        $this->tracks[$file_type][$num]['path'] = MUSIC_FOLDER;
    }

    private function setFileType($file_type) {
        if (!in_array($file_type, $this->filetypes)) {
            $this->filetypes[count($this->filetypes)] = $file_type;
        }
    }

    /**
     * Add the title of a track to $track_titles
     * @param String $title_item
     */
    private function setTrackTitle($title_item) {
        $title_item = str_replace('_', ' ', $title_item);
        $title_item = substr($title_item, 0, strripos($title_item, '.'));

        return $title_item;
    }


// Below are all public functions

    /**
     * Returnes all files in iPlayMusic/music
     * array of String's
     */
    public function getAllFiles() {
        header('Content-type: application/json');
        echo(json_encode($this->music_files));
    }

    /**
     * Returnes the filetype(s) of files in iPlayMusic/music
     * array of String's
     */
    public function getFileTypes() {
        header('Content-type: application/json');
        echo(json_encode($this->filetypes));
    }

    /**
     * Returnes an array of Track-objects as json based on all existing
     * files in MUSIC_FOLDER
     */
    public function getTracks() {
        header('Content-type: application/json');
        echo(json_encode($this->tracks));
    }

}

//$test = new Music();
//$test->getTracks();
//$test->getAllFiles();
//$test->getFileTypes();
//$test->getFileNames();
//$test->getTrackTitles();
?>

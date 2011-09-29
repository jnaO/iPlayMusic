<?php
include '../config.php';
/**
 * Functions returns information about music files stored in folder iPlayMusic/music/
 */
class Music {

    private $music_files = array();
    private $filetypes = array();
    private $track_titles = array();
    private $file_names = array();

    public function __construct() {

        /* Pick up musicfiles from folder */
        $this->music_files = glob(MUSIC_FOLDER."*.*");

        /* Do stuff with musicfiles */
        for ($i = 0; $i < count($this->music_files); $i++) {

            /* Remove path to musicfiles from the string stored in $music_files */
            $this->music_files[$i] = str_replace(MUSIC_FOLDER, '', $this->music_files[$i]);

            /* Set filetypes supported by user */
            $item = stristr($this->music_files[$i], '.');
            if(!in_array($item, $this->filetypes)){
                $this->filetypes[count($this->filetypes)] = $item;
            }

            /* Set track titles */
            $title_item = substr($this->music_files[$i], 0, strripos($this->music_files[$i], '.'));
            $this->setTrackTitle($title_item);

            /* Set filenames */
            $file_item = substr($this->music_files[$i], 0, strripos($this->music_files[$i], '.'));
            if(!in_array($file_item, $this->file_names)){
                $this->file_names[count($this->file_names)] = $file_item;
            }

        }
    }

    private function setTrackTitle ($title_item) {
        $title_item = str_replace('_', ' ', $title_item);
        if(!in_array($title_item, $this->track_titles)){
            $this->track_titles[count($this->track_titles)] = $title_item;
        }
    }

    /**
     * Returnes all files in iPlayMusic/music
     * array of String's
     */
    public function getAllFiles() {
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
     * Returnes the file name, but exchange underscores with space
     * Array of String's
     */
    public function getTrackTitles() {
        echo(json_encode($this->track_titles));
    }

    /**
     * Returnes all unique filenames minus the filetype
     * I.E. If you have:
     *      song1.mp3
     *      song1.wav
     *      song1.ogg
     *      song2.mp3
     *      song2.wav
     *      song2.ogg
     *
     * This function will return ['song1','song2']
     */
    public function getFileNames() {
        echo(json_encode($this->file_names));
    }

    public function getAlbumArt() {

    }

}

//$test = new Music();
//$test->getAllFiles();
//$test->getFileTypes();
//$test->getFileNames();
//$test->getTrackTitles();
?>

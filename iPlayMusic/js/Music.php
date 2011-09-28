<?php

class Music {

    private $music_files = array();
    private $filetypes = array();
    private $track_titles = array();
    private $file_names = array();

    public function __construct() {

        /* Pick up musicfiles from folder */
        $this->music_files = glob("../music/*.*");

        /* Do stuff with musicfiles */
        for ($i = 0; $i < count($this->music_files); $i++) {

            /* Remove path to musicfiles from the string stored in $music_files */
            $this->music_files[$i] = str_replace("../music/", '', $this->music_files[$i]);

            /* Set filetypes supported by user */
            $item = stristr($this->music_files[$i], '.');
            if(!in_array($item, $this->filetypes)){
                $this->filetypes[count($this->filetypes)] = $item;
            }

            /* Set track titles */
            $title_item = substr($this->music_files[$i], 0, strripos($this->music_files[$i], '.'));
            $title_item = str_replace('_', ' ', $title_item);
            if(!in_array($title_item, $this->track_titles)){
                $this->track_titles[count($this->track_titles)] = $title_item;
            }

            /* Set filenames */
            $file_item = substr($this->music_files[$i], 0, strripos($this->music_files[$i], '.'));
            if(!in_array($file_item, $this->file_names)){
                $this->file_names[count($this->file_names)] = $file_item;
            }

        }
    }


    public function getAllFiles() {
        print_r(json_encode($this->music_files));
    }

    public function getFileTypes() {
        print_r(json_encode($this->filetypes));
    }

    public function getTrackTitles() {
        print_r(json_encode($this->track_titles));
    }

    public function getFileNames() {
        print_r(json_encode($this->file_names));
    }

    public function getAlbumArt() {

    }

}

$test = new Music();
//$test->getAllFiles();
//$test->getFileTypes();
$test->getFileNames();
//$test->getTrackTitles();
?>

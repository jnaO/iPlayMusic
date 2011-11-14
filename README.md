	       .--. .          .    .
	    o  |   )|          |\  /|           o
	    .  |--' | .-.  .  .| \/ |.  . .--.  .  .-.
	    |  |    |(   ) |  ||    ||  | `--.  | (
	  -' `-'    `-`-'`-`--|'    '`--`-`--'-' `-`-'
	                      ;
	                   `-'

IMPLEMENTATION
==============
Paste:
	<link rel="stylesheet" type="text/css" href="./iPlayMusic/sys/iPlayMusic.css" media="screen" />

into your html document `<head>`

and paste:
	<script type="text/javascript" src="./iPlayMusic/sys/iPlayMusic.js"></script>

into your html document, just before `</body>`

FILES
-----
Copy your music files into the folder `iPlayMusic/music/`
Cope your album art image (160px*160px) into `iPlayMusic/albumart/`
Remove `iPlayMusic/albumart/default_album_art.png`


WHAT IS THIS
============
School project -HTML5, js & php music player

    Project will supply users with a code-snippet implemented music player to
        integrate with their web page


    Project technologies:
        • HTML5
        • JavaScript (and jQuery)
        • php

    Project main focus:
        • Web based music player
        • Compatible with all major browsers, as long as they are up to date
            (I.E. no IE6-support... Or 7 or 8)
        • Compatible with iOS5-devices

    Project will offer simplicity:
        • download code
        • implement snippets
        • copy music to a specified folder and it should work.

    Features
        • repeat mode (off/one/all -default "all")
        • album art
        • Tracklist
        • NOFLASH

    Project dev site:
        • http://iplaymusic.jnao.me
        • http://iplaymusic.jnao.me/mockup.php
        • github.com/jnaO/iPlayMusic

    Resource:
        • http://goo.gl/2kJoE

    HTML5
        • // Audio tag
        • // Music file playlist
        • // Canvas as progress bar
        • Range input as volume control

    PHP
        • // Find all files in folder (music)
        • // Sort files by file type
        • // Return array of files (matching file type condition) as json

        • // Find album art file
        • // Return album art filename as string

    JavaScript
        • Browser file type compatability check
        • Music player functions (Play, Stop, Pause, Previous, Next)
        • Receive json information from PHP back end, and populate music list
        • Maximize / minimize music player

    CONFIG
    – create a config file for user customization
        • Custom music folder
        • Custom album art folder
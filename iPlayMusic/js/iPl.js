$(document).ready(function(){
    var loadMusic = new LoadMusic();
    loadMusic.init();


//    var musicPlayer = new MusicPlayer();
//    musicPlayer.init();
});









/*============================================================================*/
/*============================================================================*/
/*===============================|           |================================*/
/*===============================| LOADMUSIC |================================*/
/*===============================|           |================================*/
/*============================================================================*/
/*============================================================================*/

function LoadMusic(){

    log('I am LoadMusic');

/* ============================| Fill playlist |============================= */
    this.init= function(){

        log('Initiate loadMusic');

        /* Check what filetypes the browser supports */
        var sup = checkBrowserAudioCompat();

        /* ===========| if we have browser support |=========== */
        if(sup.succes) {
            var tracksGottten = getTracks(sup.support);
        } else { // === If browser do not support mp3, ogg or wav ===

        }
    }


    /**
     * Ajax call to receive an array of musicfiles
     *
     * @param types Array
     *      an array of filetypes the browser supports
     **/
    function getTracks(types){

        log('Recieveing tracks');

        $.ajax({
            type: 'POST',
            url: 'iPlayMusic/js/_music.php',
            data: 'r=tracks',
            dataType: 'json',
            success: function(msg){

                // set variable for control of filetype compatibility.
                var match = false;

                // Check each of the filetypes (@param types) supplied for
                // compatibility with userAgent, and if match:
                // populateTrackList()
                for (var i = 0; i < types.length; i++) {

                    if(msg[types[i]] != 'undefined'){

                        log('We have a matching filetype: '+types[i]);

                        populateTrackList(msg[types[i]]);
                        match = true;
                        break;
                    }
                }

                // if we dont get a match between supported filetypes, and
                // filetypes provided by user
                if(match === false){
                    log('no match');
                }

            }
        });
    }


    function populateTrackList(arrayOfTracks){
        var trackList = arrayOfTracks;
        if(trackList.length > 0){
            var musicPlayer = new MusicPlayer(trackList);
            musicPlayer.init();
        }
        log('trackList populated with '+trackList.length+' songs');

    }

/**
 * Check audiocompatibility of the browser
 * CanPlayType returns maybe, probably, or an empty string. We default to mp3
 * because we then can use the ID3 tag to extract additional info
 *
 * @return String
 *      a valid filetype that the broser supports, or an emty
 *      string if the browser do not support audio
 */
    function checkBrowserAudioCompat() {
        var myAudio = document.createElement('audio');

        if (myAudio.canPlayType) {

            var typesSupported = new Array;

            // Check if browser support mp3
            if ( "" != myAudio.canPlayType('audio/mpeg')) {
                typesSupported[typesSupported.length] = ".mp3";
            }
            // Check if browser support ogg
            if ( "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"')) {
                typesSupported[typesSupported.length] = ".ogg";
            }
            if ( "" != myAudio.canPlayType('audio/wav')) {
                typesSupported[typesSupported.length] = ".wav";
            }
            var ret = {
                succes: true,
                support: typesSupported
            }
            return ret;
        }else {
            var update = false;
            update = confirm("Your browser do not support audio in HTML5. Please update your browser, "+
                "or consider upgrading to preferably Google Chrome, Mozilla Firefox or Opera.");
            if ( update ) {
                    window.location = "http://www.google.com/chrome";
            }
            return {succes: false};
        }
    }

}





/*============================================================================*/
/*============================================================================*/
/*==============================|             |===============================*/
/*==============================| MUSICPLAYER |===============================*/
/*==============================|             |===============================*/
/*============================================================================*/
/*============================================================================*/

function MusicPlayer (myTracks) {

    log('I am MusicPlayer');
    var trackList = myTracks;
    var audio = undefined;

/* ===========================| Initiate player |============================ */
    this.init = function(){

        log('Initiate player');

        log(trackList);
    /* create <article> to hold our musicplayer and prepend it to <body> */
        var iPlayMusic_article = $('<article id="iPlayMusic_article"/>');
        $('body').prepend(iPlayMusic_article);

    /* Populate the newly created div with the audio tag and the canvas tag (canvas
     * used as progressbar), as well as controls (play, pause, stop and so on) */
        var tagControls = this.createControls();
        var tagAudio = this.createAudioElement();
        var tagProgress = this.createProgressBar();
        $('#iPlayMusic_article').prepend(tagControls, tagAudio, tagProgress);

    }

/* ==========================| Create progress bar |=========================== */
    this.createProgressBar = function(){
        log('I am Progressbar');

        var barWidth = $("#iPlayMusic_article").width();
        var theBar = $('<canvas id="canvas" width="'+barWidth+'" height="5"/>');
        return theBar;
    }

/* =========================| Create <audio> element |========================= */
    this.createAudioElement = function(){
        log('I am <AUDIO>');

        var audioElement = $('<audio id="iPlayMusic"/>');
        audio = $("#iPlayMusic");
        return audioElement;
    }

/* =======================| Create Musicplayer Controls |======================= */
    this.createControls = function(){
        log('I am a list of MusicControls');

        var controlsList = $('<ul id="controls"/>');

    /* Populate the controls ul with li's containing the control buttons, as well as
     * the logo and the control for expanding the music player */
        var controlsArray = ['logo', 'previous', 'play', 'stop', 'next', 'repeat', 'expand'];

        var controlHtml = String;
        for(var c in controlsArray){
            controlHtml += ('<li id="controls_'+controlsArray[c]+'" />');
//            log(controlHtml);
        }
        controlsList.html(controlHtml);
        return controlsList;

    }

}











function log(msg){
    if(typeof console != "undefined" && typeof console.log != "undefined"){
        console.log(msg);
    }else{
        // do nuthin
    }
}


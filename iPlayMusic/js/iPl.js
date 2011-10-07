var storage = (function () {

    var isLocalStorage = !!(typeof localStorage !== undefined);
    return {
        set: function (key, value) {
            if (isLocalStorage) {
                localStorage.setItem(key, value);
            }
        },
        get: function (key) {
            if (isLocalStorage) {
                localStorage.getItem(key);
            }
        },
        remove: function (key) {
            if (isLocalStorage) {
                localStorage.removeItem(key);
            }
        }
    }

}());


$(document).ready(function(){
    var loadMusic = new LoadMusic();
    loadMusic.init();

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
    this.init = function(){

        log('Initiate loadMusic');

        /* Check wthishat filetypes the browser supports */
        var sup = checkBrowserAudioCompat();

        /* ===========| if we have browser support |=========== */
        if(sup.succes) {
            getTracks(sup.support);
        } else { // === If browser do not support mp3, ogg or wav ===

        }
    } // <- end init()


    /**
     * Ajax call to receive an array of musicfiles
     *
     * @param types Array
     *      an array of filetypes the browser supports
     **/
    var getTracks = function(types){

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
    } // <- end getTracks()


    var populateTrackList = function(arrayOfTracks){
        var trackList = arrayOfTracks;

        // TODO start musicPlayer
        if(trackList.length > 0){
            var musicPlayer = new MusicPlayer(trackList);
            musicPlayer.init();
        }
        log('trackList populated with '+trackList.length+' songs');

    }  // <- end populateTracklist()

/**
 * Check audiocompatibility of the browser
 * CanPlayType returns maybe, probably, or an empty string. We default to mp3
 * because we then can use the ID3 tag to extract additional info
 *
 * @return Array
 *      'succes'
 *          returns a boolean to indicate if the browser suppor any of the formats
 *      'support'
 *          If true, an array of filetypes that the broser supports is also returned, or an emty
 *          string if the browser do not support audio
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
    var progBar = undefined;
    var isPlaying = false;

/* ===========================| Initiate player |============================ */
    this.init = function(){

        log('Initiate player');

        log(trackList);
    /* create <article> to hold our musicplayer and prepend it to <body> */
        var iPlayMusic_article = $('<article id="iPlayMusic_article"/>');
        $('body').prepend(iPlayMusic_article);

    /* Populate the newly created div with the audio tag and the canvas tag (canvas
     * used as progressbar), as well as controls (play, pause, stop and so on) */
        var tagControls = createControls();
        var tagAudio = createAudioElement();
        var tagProgress = createProgressBar();
        $('#iPlayMusic_article').prepend(tagControls, tagAudio, tagProgress);

        controls();
        setAudio();

        // edit value to true to activate autostart of iPlayMusic
        setIsPlaying(false);

        log('below is a test to see if true == \'true\'')
        log(false == 0);

    } // <- end init()

/* ==========================| Create progress bar |=========================== */
    var createProgressBar = function(){
        log('I am Progressbar');

        var barWidth = $("#iPlayMusic_article").width();
        var theBar = $('<canvas id="canvas" width="'+barWidth+'" height="5"/>');
        return theBar;
    } // <- end createProgressBar()

/* =========================| Create <audio> element |========================= */
    var createAudioElement = function(){

        var audioElement = $('<audio id="iPlayMusic"/>');
        log('I am <audio>: '+audioElement);
        return audioElement;
    } // <- end createAudioElemen()

/* =======================| Create Musicplayer Controls |======================= */
    var createControls = function(){
        log('I am a list of MusicControls');

        var controlsList = $('<ul id="controls"/>');

    /* Populate the controls ul with li's containing the control buttons, as well as
     * the logo and the control for expanding the music player */
        var controlsArray = ['logo', 'previous', 'play', 'stop', 'next', 'repeat', 'expand'];

        var controlHtml = new String;
        for(var c = 0; c < controlsArray.length; c++){
            controlHtml += '<li id="controls_'+controlsArray[c]+'" />';
        }
        log(controlHtml);
        controlsList.html(controlHtml);
        return controlsList;

    } // <- end createControls()


    var setAudio = function(){
        audio = document.getElementById("iPlayMusic");
        audio.src = trackList[0].path+trackList[0].file;;
        log('<audio> set, with source: "'+trackList[0].path+trackList[0].file+'"');
//        audio.play();
//        audio.volume = '30';
    } // <- end setAudio()

    var controls = function(){
        var playPauseBtn = $("#controls_play");
        var stopBtn = $("#controls_stop");
        var rewindBtn = $("#controls_previous");
        var fastForwardBtn = $("#controls_next");
        var songLink = $(".song_link");
        var expandPlayer = $("#controls_expand");

        var isExpanded = false;
        playPauseBtn.addClass('play');
        expandPlayer.addClass('isExpanded_'+isExpanded);


        var ul = document.getElementById("controls");
        log(ul);

        ul.addEventListener('click', function(e){
            var id = e.target.id;
            musicControls(id);

        });

        var musicControls = function(id) {

            switch(id)
            {
                case 'controls_previous':
                    playPrevious();
                    break;
                case 'controls_play':
                    togglePlayPause();
                    break;
                case 'controls_stop':
                    stop();
                    break;
                case 'controls_next':
                    playNext();
                    break;
                case 'controls_repeat':
                    changeRepeatState(id);
                    break;
                case 'controls_expand':
                    toggleExpand();
                    break;
                default:
                    log('default '+id);
                }

        }

        var playNext = function(){

            log('pressNext');
        } // <- end togglePlayPause()

        var togglePlayPause = function(){

            log('pressPlay');
        } // <- end togglePlayPause()

        var stop = function(){

            log('pressStop');
        } // <- end togglePlayPause()

        var playPrevious = function(){

            log('pressPrevious');
        } // <- end togglePlayPause()

 /* *   *   *   * Repeat function   *   *   *   *   */
        var repeatBtn = ( storage.get('repeat_state') ) ? parseInt(storage.get('repeat_state')): 0;

        var changeRepeatState = function(id){

            repeatBtn++;

            if ( repeatBtn >= 3 ) {
                repeatBtn = 0;
            }

            document.getElementById(id).className = 'repeat_'+repeatBtn;
            storage.set('repeat_state', repeatBtn);

            switch (repeatBtn) {
                case 0:
                    log('repeat off');
                    break;
                case 1:
                    log('repeat all');
                    break;
                case 2:
                    log('repeat one');
                    break;
                default:
                    break;
            }

            log('pressRepeat');
        } // <- end togglePlayPause()

        var toggleExpand = function(){

            log('expand Player');
        } // <- end togglePlayPause()





        $("#controls_repeat").addClass('repeat_'+repeatBtn)

        $("#controls_repeat").click(function(){


        });


    } //<- end controls()

    /**
     * Set the class var (boolean) "isPlaying"
     */
    var setIsPlaying = function(val){
        if (loSt()) {
            localStorage.setItem('isPlaying', val);
        }
        isPlaying = val;
    }

    /**
     * returns the value of class boolean isPlaying
     */
    var getIsPlaying = function(){
        if (loSt()) {
            var loc = ( localStorage.getItem('isPlaying') == ('true' || 'false') ) ?
                'this is in local storage '+localStorage.getItem('isPlaying') : false;
            log(loc);
        }
        return isPlaying;
    }

}











function log(msg){
    if(typeof console != "undefined" && typeof console.log != "undefined"){
        console.log(msg);
    }else{
        // do nuthin
    }
}

/**
 * check for localStorage browser compatibility
 * @return Boolean
 */
function loSt() {
    if(typeof localStorage != "undefined"){
        log('Browser support \'localStorage\'');
        return true;
    }else{
        log('Browser DON\'T support \'localStorage\'');
        return false;
    }
}





/*
 * I want to do my own loaclStorage, a function that should do exactly what
 * localStorage does, but with a validation that the browser supports '
 * localStorage
 *
 *==immediate function
 *
 **/
$(document).ready(function(){
    var musicPlayer = new MusicPlayer();
    musicPlayer.init();
});

//window.onload = function () {
//   var musicplayer = new MusicPlayer();
//   musicplayer.init();
//};
//
//
//var MusicPlayer = function () {
//
//    var tracklist = new TrackList();
//    var controls = new Controls();
//
//    var play = function (track) {
//        //mess around with audio tag
//    }
//
//    this.init = function () {
//        tracklist.populate(function () {
//            play(tracklist.next());
//        });
//    }
//
//
//};
//
//var TrackList = function () {
//
//    var currentPosition = 0;
//    var tracks = [];
//
//    this.populate = function (whenReady) {
//        //ajax
//        whenReady();
//    }
//
//    this.next = function () {
//        var nextTrack = tracks[currentPosition];
//        currentPosition++;
//        return nextTrack;
//    }
//}
//
//




/*============================================================================*/
/*============================================================================*/
/*===============================|           |================================*/
/*===============================| LOADMUSIC |================================*/
/*===============================|           |================================*/
/*============================================================================*/
/*============================================================================*/

function LoadMusic(){

    log('I am LoadMusic');

    var trackList = [];

/* ============================| Return trackList |============================= */
    this.getTrackList = function(){
        return trackList;
    }




/* ============================| Fill playlist |============================= */
    /**
     * Populate the tracklist with the song-objects from specified music folder
     *
     *  @param whenReady function
     *      function to start when playlist is filled
     */
    this.init = function(whenReady){

        log('I am LoadMusic Init! ');

    /* Check wthishat filetypes the browser supports */
        var sup = checkBrowserAudioCompat();

    /* ===========| if we have browser support |=========== */
        if(sup.succes) {

            log('Recieveing tracks');

            var types = sup.support;

            $.ajax({
                type: 'POST',
                url: 'iPlayMusic/sys/_music.php',
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

                            // Fill out trackList with track objects
                            trackList  = msg[types[i]];
                            match = true;
                            whenReady();
                            break;
                        }
                    }

                    // if we dont get a match between supported filetypes, and
                    // filetypes provided by user
                    if(match === false){
                        log('no match between supplied files and browser audio support');
                    }

                }
            }); // <- end $.ajax
        } else { // === If browser do not support mp3, ogg or wav ===
            log('no audio support in browser');
        }


        log('trackList populated with '+trackList.length+' songs');



        log('end of load music init');
    } // <- end init()





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

function MusicPlayer () {

    log('I am MusicPlayer');

    var loadMusic = new LoadMusic();

    var trackList = [];
    var audio = undefined;
    var progBar = undefined;
    var isPlaying = false;

    // internal reference to musicPlayer (this)
    var tRef = this;

    this.init = function(){
        loadMusic.init(function(){
            log('Let\'s initiate musicPlayer!');
            tRef.startPlayer();
        });
    }

/* ===========================| Initiate player |============================ */
    this.startPlayer = function(){

        log('Initiate player');

        trackList = loadMusic.getTrackList();

        log('I am tracklist '+trackList);
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

        ul.addEventListener('click', function(e){
            var id = e.target.id;

            switch(id) {
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

        });

        var playNext = function(){

            log('pressNext');
        } // <- end playNext()

        var togglePlayPause = function(){

            log('pressPlay');
        } // <- end togglePlayPause()

        var stop = function(){

            log('pressStop');
        } // <- end stop()

        var playPrevious = function(){

            log('pressPrevious');
        } // <- end playPrevious()


 /* *===*===*===*===*===*===*===* Repeat function===*===*===*===*===*===*===*/
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
        } // <- end changeRepeatState()

        var toggleExpand = function(){

            log('expand Player');
        } // <- end toggleExpand()





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




/**
 * A wrapper of localStorage, to make sure that we do not try to set or retrieve
 * any parameters from localStorage, if the browser do not support it
 *
 * storage has three methods:
 *      @method set Method
 *          @param key String
 *              the key used to identify the value to be stored
 *          @param value String
 *              value of the key
 *      @method get Method
 *          @param key String
 *              the key used to identify the value to be retrieved
 *      @method remove Method
 *          @param key String
 *              the key used to identify the value to be removed
 *
 * storage works the same as localStorage, hence syntax looks as follows:
 *      storage.set('key', 'val') :: localStorage.setItem('key', 'val');
 */
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





/*
 * I want to do my own loaclStorage, a function that should do exactly what
 * localStorage does, but with a validation that the browser supports '
 * localStorage
 *
 *==immediate function
 *
 **/
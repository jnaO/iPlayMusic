/**
 * =================================| <audio> |=================================
 * audio.src
 *      URL for the video.
 * audio.preload
 *      Hint to the browser how much it should download before the video starts playing.
 * audio.autoplay
 *      Boolean attribute that hints that the browser should start playing the video automatically.
 * audio.loop
 *      Boolean attribute indicating whether the video should loop.
 * audio.controls
 *      Boolean attribute indicating whether the browser should show its controls.
 */
document.onreadystatechange = function(){
    if (document.readyState === 'complete' ){
        var musicPlayer = new MusicPlayer();
        musicPlayer.init();
    }
}

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

            // just for easy typing.
            var types = sup.support;


            // Oldschool ajax. First we create a var to hold our ajax
            // Tut to be foud @ http://www.tizag.com/ajaxTutorial/ajax-javascript.php
            var ajaxRequest;
            try{
                // Opera 8.0+, Firefox, Safari
                ajaxRequest = new XMLHttpRequest();
            } catch (e){
                // Fallback for Internet Explorer
                try{
                    ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try{
                        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e){
                        // if we still have not managed to get the call through
                        alert("Your browser can\'t handle ajax calls. it is time to ugrade! \ngoogle chrome, opera and firefox are recommended browsers.");
                        return false;
                    }
                }
            }
            // Receiveing data
            ajaxRequest.onreadystatechange = function(){
                if(ajaxRequest.readyState == 4){

                    // json-ify the string that is returned
                    var msg = JSON.parse(ajaxRequest.responseText);

                    var music   = msg['music'];
                    var art     = msg['art'];

                    // set variable for control of filetype compatibility.
                    var match = false;

                    // Check each of the filetypes (@param types) supplied for
                    // compatibility with userAgent, and if match:
                    // populateTrackList()
                    for (var i = 0; i < types.length; i++) {

                        if(music[types[i]] != 'undefined'){

                            log('We have a matching filetype: '+types[i]);

                            // Fill out trackList with track objects
                            trackList  = music[types[i]];
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
            }

            ajaxRequest.open("POST", "iPlayMusic/sys/_music.php" + "?r=tracks&a=art", true);
            ajaxRequest.send(null);


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
            return {
                succes: false
            };
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
    var track = new Track();

    var trackList = [];
    var trackNumber = 0;

    var audio = undefined;
    var progBar = undefined;
    var isPlaying = false;

    // internal reference to musicPlayer (this)
    var tRef = this;

    /**
     * Load the music and on success start the player
     */
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

        createPlayer();
        controls();
        track.init();
        track.playTrack();

        // edit value to true to activate autostart of iPlayMusic
        setIsPlaying(false);

    } // <- end init()



    /* =============================| Create Player |=============================== */
    var createPlayer = function(){
        /* create <article> to hold our musicplayer and prepend it to <body> */
        var iPlayMusic_article = '<article id="iPlayMusic_article"></article>';
        document.body.innerHTML = iPlayMusic_article + document.body.innerHTML;

    /* Populate the newly created div with the audio tag and the canvas tag (canvas
     * used as progressbar), as well as controls (play, pause, stop and so on) */
        createControls();
        createAudioElement();
        createProgressBar();

    } // <-end createPlayer()



    /* ==========================| Create progress bar |=========================== */
    var createProgressBar = function(){
        log('I am Progressbar');

        var barWidth = document.getElementById('iPlayMusic_article').clientWidth;
        var theBar = document.createElement('canvas');
        theBar.setAttribute('id', 'canvas');
        theBar.setAttribute('width', barWidth);
        theBar.setAttribute('heigth', '5');
        document.getElementById('iPlayMusic_article').appendChild(theBar);

//        return theBar;
    } // <- end createProgressBar()



    /* =========================| Create <audio> element |========================= */
    var createAudioElement = function(){

        var audioElement = document.createElement('audio');
        audioElement.setAttribute('id', 'iPlayMusic');

        log('I am <audio>: '+audioElement);
        document.getElementById('iPlayMusic_article').appendChild(audioElement);
    } // <- end createAudioElemen()



    /* =======================| Create Musicplayer Controls |======================= */
    var createControls = function(){
        log('I am a list of MusicControls');


        // Create the ul containing the controls
        var controlsList = document.createElement('ul');
        controlsList.setAttribute('id',  'controls');
        document.getElementById('iPlayMusic_article').appendChild(controlsList);

    /* Populate the controls ul with li's containing the control buttons, as well as
     * the logo and the control for expanding the music player */
        var controlsArray = ['logo', 'previous', 'play', 'stop', 'next', 'repeat', 'expand'];

        var containingArticle = document.getElementById('controls');
        for(var c = 0; c < controlsArray.length; c++){
            var elem = document.createElement('li');
            elem.setAttribute('id',  'controls_'+controlsArray[c]);
            containingArticle.appendChild(elem);
        }

    } // <- end createControls()







    function Track(){

        log('I am track');

        var currentTrack = undefined;

        this.isPlaying = false;

        this.init = function(){
            log('Track init');
            trackNumber = (storage.get('tracknumber')) ? storage.get('tracknumber') : 0;
            audio = document.getElementById("iPlayMusic");

        }

        var listen = function(){
            log('Im listening');

            audio.addEventListener('playing',function(){
                audio.removeEventListener('playing', arguments.callee, false);
                track.isPlaying = true;
                isTrackPlaying();
            });
            audio.addEventListener('pause',function(){
                audio.removeEventListener('pause', arguments.callee, false);
                track.isPlaying = false;
                isTrackPlaying();
            });
            audio.addEventListener('ended',function(){
                audio.removeEventListener('ended', arguments.callee, false);

                // TODO check repeatmode repeatmode

//                if (){
//                    track.playNextTrack();
//                }
            });


        }

        var isTrackPlaying = function(){
            if(track.isPlaying) {
                document.getElementById('controls_play').setAttribute('class', 'pause');
                storage.set('trackNumber', trackNumber);
            } else {
                document.getElementById('controls_play').setAttribute('class', 'play');
                storage.set('audioPosition', audio.currentTime);
            }
            log('Audio is playing: ' + track.isPlaying);
        }

        var setAudioSource = function(trNum){
            currentTrack = trackList[trNum];
            audio.src = currentTrack.path+currentTrack.file;
            listen();
        }


        this.incrementTrackNumber = function(){
            trackNumber++;
            if(trackNumber >= trackList.length){
                trackNumber = 0;
            }
            log(trackNumber);
        }

        this.decrementTrackNumber = function(){
            trackNumber--;
            if(trackNumber < 0){
                trackNumber = (trackList.length -1 );
            }
            log(trackNumber);
        }

        this.playNextTrack = function(){
            track.incrementTrackNumber();
            setAudioSource(trackNumber);
            audio.play();
        }


        this.playPreviousTrack = function(){
            track.decrementTrackNumber();
            setAudioSource(trackNumber);
            audio.play();
        }


        this.playTrack = function(){
            setAudioSource(trackNumber);
            audio.play();
        }

        this.stopTrack = function(){
            audio.pause();
            log(audio.currentTime);
            audio.currentTime = 0;
            log(audio.currentTime);
        }
    } // <- end Track()

    var controls = function(){
        var playPauseBtn = document.getElementById('controls_play');
        var stopBtn = $("#controls_stop");
        var rewindBtn = $("#controls_previous");
        var fastForwardBtn = $("#controls_next");
        var songLink = $(".song_link");
        var expandPlayer = document.getElementById('controls_expand');
        var repeatElem = document.getElementById('controls_repeat');

        var isExpanded = false;
        var repeatBtn = ( storage.get('repeat_state') ) ? parseInt(storage.get('repeat_state')): 0;

        playPauseBtn.setAttribute('class', 'play');
        expandPlayer.setAttribute('class', 'isExpanded_'+isExpanded);
        repeatElem.setAttribute('class', 'repeat_'+repeatBtn);


        var ul = document.getElementById("controls");

        ul.addEventListener('click', function(e){
            var id = e.target.id;

            switch(id) {
                case 'controls_previous':
                    track.playPreviousTrack();
                    break;
                case 'controls_play':
                    (track.isPlaying) ? audio.pause() : track.playTrack();
                    break;
                case 'controls_stop':
                    track.stopTrack();
                    break;
                case 'controls_next':
                    log('next '+track.isPlaying);
                    (track.isPlaying) ? track.playNextTrack() : track.incrementTrackNumber();
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

        var toggleExpand = function(){
            isExpanded = !isExpanded;
            log('I am toggleExpand: '+isExpanded);
            expandPlayer.setAttribute('class', 'isExpanded_'+isExpanded);
            document.getElementById('iPlayMusic_article').style.height = (isExpanded) ? '300px' : '55px';


        };

        /* *===*===*===*===*===*===*===* Repeat function===*===*===*===*===*===*===*/
        var changeRepeatState = function(){

            repeatBtn++;

            if ( repeatBtn >= 3 ) {
                repeatBtn = 0;
            }

            repeatElem.className = 'repeat_'+repeatBtn;
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

        } // <- end changeRepeatState()

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
                return localStorage.getItem(key);
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


/**
 * =================================| <audio> |=================================
 * audio.src
 *      URL for the video.
 * audio.preload
 *      Hint to the browser how much it should download before the video starts playing.
 * audio.autoplay
 *      Boolean attribute that hints that the browser should start playing the video automatically.
 * audio.loop
 *      Boolean attribute indicating whether the video should loop.
 * audio.controls
 *      Boolean attribute indicating whether the browser should show its controls.
 */
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

    var tRef = this;

    var trackList   = [];
    var albumArt    = [];

/* =============================| Fill trackList |============================== */
    this.setTrackList = function(param){
        trackList = param;
    }
/* ============================| Return trackList |============================= */
    this.getTrackList = function(){
        return trackList;
    }


/* ============================| Return AlbumArt |============================== */
    this.getAlbumArt = function(){
        return albumArt;
    }
/* =============================| Fill AlbumArt |=============================== */
    this.setAlbumArt = function(param){
        albumArt = param;
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
                    tRef.setAlbumArt(msg['art']);

                    // set variable for control of filetype compatibility.
                    var match = false;

                    // Check each of the filetypes (@param types) supplied for
                    // compatibility with userAgent, and if match:
                    // populateTrackList()
                    for (var i = 0; i < types.length; i++) {

                        if(music[types[i]] != 'undefined'){

                            log('We have a matching filetype: '+types[i]);

                            // Fill out trackList with track objects
                            tRef.setTrackList(music[types[i]]);
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
    var track = null;

    var trackList = [];
    var trackNumber = 0;

    var albumArt = [];

    var audio = undefined;
    var progressBar = undefined;
    var isPlaying = false;

    var lastClickedControlBtn = '';

    // internal reference to musicPlayer (this)
    var tRef = this;







/* =========================| Load Music & Album Art |========================== */

    /**
     * Load the music and on success start the player
     */
    this.init = function(){
        loadMusic.init(function(){
            log('Let\'s initiate musicPlayer!');
            tRef.startPlayer();
        });
    } // <- end init()






/* =========================| Initiate actuall player |========================= */
    this.startPlayer = function(){

        log('Initiate player');

        trackList   = loadMusic.getTrackList();
        albumArt    = loadMusic.getAlbumArt();

        track = new Track();

        log(albumArt[0]);

        createPlayer();
        controls();
        createTrackList();
        track.init();
        track.playTrack();

        // edit value to true to activate autostart of iPlayMusic
        setIsPlaying(false);

    } // <- end init()







/* ============================| Create TrackList |============================= */
    var createTrackList = function(){

        // Create the trackListContainer
        var trackListContainer = domEl.create('div', 'track_list_container');
        domEl.append('iPlayMusic_article', trackListContainer);

        // Create trackListUl
        var trackListElement = domEl.create('ul', 'track_list');
        domEl.append('track_list_container', trackListElement);

        // Create list items
        for(var tli = 0; tli < trackList.length; tli++){
            var trackListLiElement = domEl.create('li', 'track_no_'+tli);
            var trackNameElement = document.createTextNode(trackList[tli]['title']);
            trackListLiElement.appendChild(trackNameElement);
            domEl.append('track_list', trackListLiElement);
        }

        // Create album cover
        var albumCover = domEl.create('img');
        albumCover.src = albumArt[0]['file'];
        domEl.append('track_list_container', albumCover);

    } // <- end createTrackList()







/* =============================| Create Player |=============================== */
    var createPlayer = function(){
    /* create <article> to hold our musicplayer and prepend it to <body> */
        var iPlayMusic_article = '<article id="iPlayMusic_article" class="contracted"></article>';
        document.body.innerHTML = iPlayMusic_article + document.body.innerHTML;

    /* Populate the newly created div with the audio tag and the canvas tag (canvas
     * used as progressbar), as well as controls (play, pause, stop and so on) */
        createControls();
        createAudioElement();

        progressBar = new ProgressBar();
        progressBar.init();

    } // <-end createPlayer()









    /* ============================| Progress bar |============================= */
    function ProgressBar (){

        log('I am Progressbar');

        this.init = function() {
            log('Init progressbar');
            create();
        }

        var create = function(){
            log('I am Create progressbar');
            var barWidth = document.getElementById('iPlayMusic_article').clientWidth;
            var theBar = document.createElement('canvas');
            theBar.setAttribute('id', 'progressbar');
            theBar.setAttribute('heigth', '1');
            theBar.setAttribute('width', barWidth);
            document.getElementById('iPlayMusic_article').appendChild(theBar);

        } // <- end create()

        this.makeProgress = function(){

            var canvas = document.getElementById('progressbar');

            //get current time in seconds
            var elapsedTime = Math.round(audio.currentTime);
            //update the progress bar
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");

                //clear canvas before painting
                ctx.clearRect(0, 0, canvas.clientWidth, 1);

                ctx.fillStyle = "rgb(245,245,245)";
                var fWidth = (elapsedTime / audio.duration) * (canvas.clientWidth);
                if (fWidth > 0) {
                    ctx.fillRect(0, 0, fWidth, 10);
                }
            }// we can add an else here to notify users that their browser do not support <canvas>

        }


//        return theBar;
    } // <- end progressBar()









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

        this.repeatState = '';


        //
        this.init = function(){
            log('Track init');
            trackNumber = (storage.get('tracknumber')) ? storage.get('tracknumber') : 0;
            audio       = document.getElementById("iPlayMusic");
            audio.src   = trackList[trackNumber].path+trackList[trackNumber].file;
            listen();
            log(audio.src);

        }


        // Add eventlisteners to audio
        var listen = function(){
            log('Im listening');

            audio.addEventListener("timeupdate", function(){
                progressBar.makeProgress();
            });


            // When audio start playing
            audio.addEventListener('playing',function(){
                log('::::::: PLAY :::::::::::');
                setActiveTrack();
                storage.set('tracknumber', trackNumber);
                track.isPlaying = true;
                isTrackPlaying();
            });

            // When audio stop playing
            audio.addEventListener('pause',function(){
                log('::::::: PAUSE :::::::::::');
                track.isPlaying = false;
                isTrackPlaying();
            });

            // On audio end
            audio.addEventListener('ended',function(){
                log('::::::: STOP :::::::::::');

                // TODO check repeatmode repeatmode

                switch (track.repeatState){
                    case 'repeat one':
                        track.playTrack();
                        break;

                    case 'repeat off':
                        ( trackNumber == ( trackList.length - 1) ) ? track.stopTrack() : track.playTrack() ;
                        break;

                    default:
                        track.playNextTrack();

                }
            });
        } // <- end listen()




        // Set class "active_track" on li-element containing the current track name
        var setActiveTrack = function () {
            log('I am setActiveTrack');
            var lis = document.getElementById('track_list').getElementsByTagName('li');
            for (var ert = 0; ert < lis.length; ert++) {
                lis[ert].removeAttribute('class');
            }

            document.getElementById('track_no_'+trackNumber).setAttribute('class', 'active_track');
        }




        // Change play/pause-button according to audio state
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



        // Fast forward
        this.playNextTrack = function(){
            track.incrementTrackNumber();
            setAudioSource(trackNumber);
            audio.play();
        }


        // Rewind
        this.playPreviousTrack = function(){
            track.decrementTrackNumber();
            setAudioSource(trackNumber);
            audio.play();
        }



        // Play
        this.playTrack = function(){

            // If last pressed button was fastforward or rewind we want to reset the audio src
            if ( lastClickedControlBtn == 'controls_previous' || lastClickedControlBtn == 'controls_next' ) {
                setAudioSource(trackNumber);
            }
            audio.play();
        }



        // Pause
        this.pauseTrack = function(){
            storage.set('currentPosition', audio.currentTime);
            audio.pause();
        }


        // Stop
        this.stopTrack = function(){
            audio.pause();
            log(audio.currentTime);
            audio.currentTime = 0;
            log(audio.currentTime);
        }
    } // <- end Track()









/* ===========================| Controls MusicPlayer |========================== */
    var controls = function(){

        var playPauseBtn = document.getElementById('controls_play');
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
                    log('next '+track.isPlaying);
                    (track.isPlaying) ? track.playPreviousTrack() : track.decrementTrackNumber();
                    clickedControl(id);
                    break;
                case 'controls_play':

                    if (track.isPlaying) {
                        track.pauseTrack();
                        clickedControl(id);
                        log('pause '+track.isPlaying);
                    } else {
                        track.playTrack();
                        log('play '+track.isPlaying)
                    }

                    break;
                case 'controls_stop':
                    track.stopTrack();
                    clickedControl(id);
                    break;
                case 'controls_next':
                    log('next '+track.isPlaying);
                    (track.isPlaying) ? track.playNextTrack() : track.incrementTrackNumber();
                    clickedControl(id);
                    break;
                case 'controls_repeat':
                    changeRepeatState();
                    break;
                case 'controls_expand':
                    toggleExpand();
                    break;
                default:
                    log('default '+id);
            }

        });


        var clickedControl = function(me){
            lastClickedControlBtn = me;
            log('last clicked :: '+lastClickedControlBtn);
        }


        var toggleExpand = function(){
            isExpanded = !isExpanded;
            log('I am toggleExpand: '+isExpanded);
            expandPlayer.setAttribute('class', 'isExpanded_'+isExpanded);
            if(isExpanded){
                document.getElementById('iPlayMusic_article').removeAttribute('class');
                document.getElementById('iPlayMusic_article').setAttribute('class', 'expanded');
            } else {
                document.getElementById('iPlayMusic_article').removeAttribute('class');
                document.getElementById('iPlayMusic_article').setAttribute('class', 'contracted');
            }


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
                    track.repeatState = 'repeat off';
                    break;
                case 1:
                    log('repeat all');
                    track.repeatState = 'repeat all';
                    break;
                case 2:
                    log('repeat one');
                    track.repeatState = 'repeat one';
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

var domEl = (function(){

    return {
        create: function(elem, id, cla){

            var e = document.createElement(elem);
            if (id) e.setAttribute('id', id);
            if (cla) e.setAttribute('class', cla);

            return e;

        },
        append: function(parId, chiId){
            document.getElementById(parId).appendChild(chiId);
        },
        setClass: function(elemId, cla){
            document.getElementById(elemId).setAttribute('class', cla);
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

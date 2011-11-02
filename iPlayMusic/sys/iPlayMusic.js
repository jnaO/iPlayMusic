
function log(msg) {
    if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
        console.log(msg);
    } else {
        // Uncomment to get alers in I.E. ...
//        alert(msg);
    }
}

/**
 * check for localStorage browser compatibility
 * @return Boolean
 */
function loSt() {
    if (typeof localStorage !== "undefined") {
        log('Browser support \'localStorage\'');
        return true;
    } else {
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

    var isLocalStorage = (typeof localStorage !== undefined);

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
    };

}());

var domEl = (function () {

    return {
        create: function (elem, id, cla) {

            var e = document.createElement(elem);
            if (id) {
                e.setAttribute('id', id);
            }
            if (cla) {
                e.setAttribute('class', cla);
            }

            return e;

        },
        append: function (parId, chiId) {
            document.getElementById(parId).appendChild(chiId);
        },
        setClass: function (elemId, cla) {
            document.getElementById(elemId).setAttribute('class', cla);
        }
    };

}());

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




/*============================================================================*/
/*============================================================================*/
/*===============================|           |================================*/
/*===============================| LOADMUSIC |================================*/
/*===============================|           |================================*/
/*============================================================================*/
/*============================================================================*/

function LoadMusic() {

    log('I am LoadMusic');

    var trackList   = [],
        tRef        = this,
        albumArt    = [];

/* =============================| Fill trackList |============================== */
    this.setTrackList = function (param) {
        trackList = param;
    };
/* ============================| Return trackList |============================= */
    this.getTrackList = function () {
        return trackList;
    };


/* ============================| Return AlbumArt |============================== */
    this.getAlbumArt = function () {
        return albumArt;
    };
/* =============================| Fill AlbumArt |=============================== */
    this.setAlbumArt = function (param) {
        albumArt = param;
    };





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
        var myAudio = document.createElement('audio'),
            typesSupported = [],
            upDateBrowser = '';

        if (myAudio.canPlayType) {


            // Check if browser support mp3
            if ("" !== myAudio.canPlayType('audio/mpeg')) {
                log(myAudio.canPlayType('audio/mpeg'));
                typesSupported[typesSupported.length] = ".mp3";
            }
            // Check if browser support ogg
            if ("" !== myAudio.canPlayType('audio/ogg; codecs="vorbis"')) {
                typesSupported[typesSupported.length] = ".ogg";
            }
            if ("" !== myAudio.canPlayType('audio/wav')) {
                typesSupported[typesSupported.length] = ".wav";
            }

            return {
                succes: true,
                support: typesSupported
            };
        } else {
            upDateBrowser = confirm("Your browser do not support audio in HTML5. Please update your browser, " +
                "or consider upgrading to preferably Google Chrome, Mozilla Firefox or Opera.");
            if (upDateBrowser) {
                window.location = "http://www.google.com/chrome";
            }
            return {
                succes: false
            };
        }
    }




    /* ============================| Fill playlist |============================= */
    /**
     * Populate the tracklist with the song-objects from specified music folder
     *
     *  @param whenReady function
     *      function to start when playlist is filled
     */
    this.init = function (whenReady) {

        log('I am LoadMusic Init! ');

        /* Check wthishat filetypes the browser supports */
        var sup = checkBrowserAudioCompat(),
            types = sup.support,
            ajaxRequest;

        /* ===========| if we have browser support |=========== */
        if (sup.succes) {

            log('Recieveing tracks');

            // just for easy typing.


            // Oldschool ajax. First we create a var to hold our ajax
            // Tut to be foud @ http://www.tizag.com/ajaxTutorial/ajax-javascript.php
            try {
                // Opera 8.0+, Firefox, Safari
                ajaxRequest = new XMLHttpRequest();
            } catch (e) {
                // Fallback for Internet Explorer
                try {
                    ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (f) {
                    try {
                        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (g) {
                        // if we still have not managed to get the call through
                        alert("Your browser can\'t handle ajax calls. it is time to ugrade! \ngoogle chrome, opera and firefox are recommended browsers.");
                        return false;
                    }
                }
            }
            // Receiveing data
            ajaxRequest.onreadystatechange = function () {
                if (ajaxRequest.readyState === 4) {

                    // json-ify the string that is returned
                    var msg = JSON.parse(ajaxRequest.responseText),
                        music   = msg.music,
                    // set variable for control of filetype compatibility.
                        match = false,
                        i;
                    tRef.setAlbumArt(msg.art);


                    // Check each of the filetypes (@param types) supplied for
                    // compatibility with userAgent, and if match:
                    // populateTrackList()
                    for (i = 0; i < types.length; i++) {

                        if (music[types[i]] !== undefined) {

                            log('We have a matching filetype: ' + types[i]);

                            // Fill out trackList with track objects
                            tRef.setTrackList(music[types[i]]);
                            match = true;
                            whenReady();
                            break;
                        }
                    }

                    // if we dont get a match between supported filetypes, and
                    // filetypes provided by user
                    if (match === false) {
                        log('no match between supplied files and browser audio support');
                    }

                }
            };

            ajaxRequest.open("POST", "iPlayMusic/sys/_music.php" + "?r=tracks&a=art", true);
            ajaxRequest.send(null);


        } else { // === If browser do not support mp3, ogg or wav ===
            log('no audio support in browser');
        }


        log('trackList populated with ' + trackList.length + ' songs');



        log('end of load music init');
    }; // <- end init()
}





/*============================================================================*/
/*============================================================================*/
/*==============================|             |===============================*/
/*==============================| MUSICPLAYER |===============================*/
/*==============================|             |===============================*/
/*============================================================================*/
/*============================================================================*/

function MusicPlayer() {

    log('I am MusicPlayer');

    var loadMusic = new LoadMusic(),
        track = null,
        trackList = [],
        trackNumber = 0,
        albumArt = [],
        audio,
        progressBar,
        isPlaying = false,
        lastClickedControlBtn = '',

    // internal reference to musicPlayer (this)
        tRef = this,



/* ============================| Create TrackList |============================= */
        createTrackList = function () {

            var trackListContainer = domEl.create('div', 'track_list_container'),
                trackListElement = domEl.create('ul', 'track_list'),
                tli,
                trackNameElement,
                trackListLiElement,
                albumCover = domEl.create('img');
            // Create the trackListContainer
            domEl.append('iPlayMusic_article', trackListContainer);

            // Create trackListUl
            domEl.append('track_list_container', trackListElement);

            // Create list items
            for (tli = 0; tli < trackList.length; tli++) {
                trackListLiElement = domEl.create('li', 'track_no_' + tli);
                trackNameElement = document.createTextNode(trackList[tli].title);
                trackListLiElement.appendChild(trackNameElement);
                domEl.append('track_list', trackListLiElement);
            }

            // Create album cover
            albumCover.src = albumArt[0].file;
            domEl.append('track_list_container', albumCover);

        }, // <- end createTrackList()



        createContainingArticle = function () {
        /* create <article> to hold our musicplayer and prepend it to <body> */
            var iPlayMusic_article = '<article id="iPlayMusic_article" class="contracted"></article>';
            document.body.innerHTML = iPlayMusic_article + document.body.innerHTML;

        }, // <- end createTrackList()









    /* =========================| Create <audio> element |========================= */
        createAudioElement = function () {

            var audioElement = document.createElement('audio');
            audioElement.setAttribute('id', 'iPlayMusic');

            log('I am <audio>: ' + audioElement);
            document.getElementById('iPlayMusic_article').appendChild(audioElement);
        }, // <- end createAudioElemen()








    /* =======================| Create Musicplayer Controls |======================= */
        createControls = function () {
            log('I am a list of MusicControls');


            // Create the ul containing the controls
            var controlsList = domEl.create('ul',  'controls'),
                controlsArray = ['logo', 'previous', 'play', 'stop', 'next', 'repeat', 'expand'],
                c,
                elem,
                containingArticle;
            domEl.append('iPlayMusic_article', controlsList);

        /* Populate the controls ul with li's containing the control buttons, as well as
         * the logo and the control for expanding the music player */

            containingArticle = document.getElementById('controls');
            for (c = 0; c < controlsArray.length; c++) {
                elem = document.createElement('li');
                elem.setAttribute('id',  'controls_' + controlsArray[c]);
                containingArticle.appendChild(elem);
            }

        }; // <- end createControls()









    /* ============================| Progress bar |============================= */
    function ProgressBar() {

        log('I am Progressbar');
        var barHeight = 10,
            barWidth,
            theBar,
            t = false;


            this.create = function () {
                log('I am Create progressbar');
                barWidth = document.getElementById('iPlayMusic_article').clientWidth;
                theBar = domEl.create('canvas', 'progressbar');
                theBar.setAttribute('heigth', barHeight);
                theBar.setAttribute('width', barWidth);
                domEl.append('iPlayMusic_article', theBar);
            }; // <- end create()

            this.remove = function () {
                log('I am remove progressbar');
                document.getElementById('iPlayMusic_article').removeChild(theBar);
            };

            this.update = function () {

                setTimeout(function(){
                    if (!t) {
                        progressBar.remove();
                        progressBar.create();
                        t = true;
                    }
                }, 500);
                setTimeout(function(){
                    t = false;
                }, 800);
                log(t);

                if (document.getElementById('iPlayMusic_article').clientWidth !== barWidth) {
                    log('I\'m not the same');
                    barWidth = document.getElementById('iPlayMusic_article').clientWidth;

                }
            };


        this.makeProgress = function () {

            var canvas = document.getElementById('progressbar'),
                ctx,
                fWidth,

            //get current time in seconds
                elapsedTime = Math.round(audio.currentTime);
            //update the progress bar
            if (canvas.getContext) {
                ctx = canvas.getContext("2d");
                fWidth = (elapsedTime / audio.duration) * (canvas.clientWidth);

                //clear canvas before painting
                ctx.clearRect(0, 0, canvas.clientWidth, 1);
                ctx.fillStyle = "rgb(245,245,245)";

                if (fWidth > 0) {
                    ctx.fillRect(0, 0, fWidth, barHeight);
                }
            }// we can add an else here to notify users that their browser do not support <canvas>

        };

        this.init = function () {
            log('Init progressbar');
            this.create();
        };

        window.addEventListener('resize', function(){
                    progressBar.update();
                });
//        return theBar;
    } // <- end progressBar()






    function Track() {

        log('I am track');

        this.isPlaying = false;
        this.repeatState = '';

        var currentTrack,




        // Set class "active_track" on li-element containing the current track name
            setActiveTrack = function () {
                log('I am setActiveTrack');
                var lis = document.getElementById('track_list').getElementsByTagName('li'),
                    ert;
                for (ert = 0; ert < lis.length; ert++) {
                    lis[ert].removeAttribute('class');
                }

                document.getElementById('track_no_' + trackNumber).setAttribute('class', 'active_track');
            }, // <- end setActiveTrack()





        // Change play/pause-button according to audio state
            isTrackPlaying = function () {
                if (track.isPlaying) {
                    document.getElementById('controls_play').setAttribute('class', 'pause');
                    storage.set('trackNumber', trackNumber);
                } else {
                    document.getElementById('controls_play').setAttribute('class', 'play');
                    storage.set('audioPosition', audio.currentTime);
                }
                log('Audio is playing: ' + track.isPlaying);
            }, // <- end isTrackPlaying



        // Add eventlisteners to audio
            listen = function () {
                log('Im listening');

                audio.addEventListener("timeupdate", function () {
                    progressBar.makeProgress();
                });

                // When audio start playing
                audio.addEventListener('playing', function () {
                    log('::::::: PLAY :::::::::::');
                    setActiveTrack();
                    storage.set('tracknumber', trackNumber);
                    track.isPlaying = true;
                    isTrackPlaying();
                });

                // When audio stop playing
                audio.addEventListener('pause', function () {
                    log('::::::: PAUSE :::::::::::');
                    track.isPlaying = false;
                    isTrackPlaying();
                });

                // On audio end
                audio.addEventListener('ended', function () {
                    log('::::::: STOP :::::::::::');

                    // TODO check repeatmode repeatmode

                    switch (track.repeatState) {
                    case 'repeat one':
                        track.playTrack();
                        break;

                    case 'repeat off':
                        (trackNumber === (trackList.length - 1)) ? track.stopTrack() : track.playTrack();
                        break;

                    default:
                        track.playNextTrack();

                    }
                });
            }, // <- end listen()




            setAudioSource = function (trNum) {
                currentTrack = trackList[trNum];
                audio.src = currentTrack.path + currentTrack.file;
            }; // <- end setAudioSource()


        this.incrementTrackNumber = function () {
            trackNumber++;
            if (trackNumber >= trackList.length) {
                trackNumber = 0;
            }
            log(trackNumber);
        }; // <- end incrementTrackNumber()



        this.decrementTrackNumber = function () {
            trackNumber--;
            if (trackNumber < 0) {
                trackNumber = (trackList.length - 1);
            }
            log(trackNumber);
        }; // <- end decrementTrackNumber()



        // Fast forward
        this.playNextTrack = function () {
            track.incrementTrackNumber();
            setAudioSource(trackNumber);
            audio.play();
        }; // <- end playNextTrack()


        // Rewind
        this.playPreviousTrack = function () {
            track.decrementTrackNumber();
            setAudioSource(trackNumber);
            audio.play();
        }; // <- end playPreviousTrack()



        // Play
        this.playTrack = function () {

            // If last pressed button was fastforward or rewind we want to reset the audio src
            if (lastClickedControlBtn === 'controls_previous' || lastClickedControlBtn === 'controls_next') {
                setAudioSource(trackNumber);
            }
            audio.play();
        }; // <- end playTrack



        // Pause
        this.pauseTrack = function () {
            storage.set('currentPosition', audio.currentTime);
            audio.pause();
        }; // <- end pauseTrack()


        // Stop
        this.stopTrack = function () {
            audio.pause();
            log(audio.currentTime);
            audio.currentTime = 0;
            log(audio.currentTime);
        }; // <- end stopTrack()

        //
        this.init = function () {
            log('Track init');
            trackNumber = storage.get('tracknumber') || 0;
            audio       = document.getElementById("iPlayMusic");
            audio.src   = trackList[trackNumber].path + trackList[trackNumber].file;
            listen();
            log(audio.src);

        }; // <- end init()
    } // <- end Track()









/* ===========================| Controls MusicPlayer |========================== */
    var controls = function () {

        var playPauseBtn = document.getElementById('controls_play'),
            expandPlayer = document.getElementById('controls_expand'),
            repeatElem = document.getElementById('controls_repeat'),
            isExpanded = false,
            repeatBtn = parseInt(storage.get('repeat_state'), 10) || 0,
            ul = document.getElementById("controls");

        playPauseBtn.setAttribute('class', 'play');
        expandPlayer.setAttribute('class', 'isExpanded_' + isExpanded);
        repeatElem.setAttribute('class', 'repeat_' + repeatBtn);




        var clickedControl = function (me) {
            lastClickedControlBtn = me;
            log('last clicked :: ' + lastClickedControlBtn);
        },


            toggleExpand = function () {
                isExpanded = !isExpanded;
                log('I am toggleExpand: ' + isExpanded);
                expandPlayer.setAttribute('class', 'isExpanded_' + isExpanded);
                if (isExpanded) {
                    document.getElementById('iPlayMusic_article').removeAttribute('class');
                    document.getElementById('iPlayMusic_article').setAttribute('class', 'expanded');
                } else {
                    document.getElementById('iPlayMusic_article').removeAttribute('class');
                    document.getElementById('iPlayMusic_article').setAttribute('class', 'contracted');
                }


            }, // <- end toggleExpand()

        /* *===*===*===*===*===*===*===* Repeat function===*===*===*===*===*===*===*/
            changeRepeatState = function () {

                repeatBtn++;

                if (repeatBtn >= 3) {
                    repeatBtn = 0;
                }

                repeatElem.className = 'repeat_' + repeatBtn;
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

            }; // <- end changeRepeatState()


        ul.addEventListener('click', function (e) {
            var id = e.target.id;

            switch (id) {
            case 'controls_previous':
                log('next ' + track.isPlaying);
                (track.isPlaying) ? track.playPreviousTrack() : track.decrementTrackNumber();
                clickedControl(id);
                break;
            case 'controls_play':

                if (track.isPlaying) {
                    track.pauseTrack();
                    clickedControl(id);
                    log('pause ' + track.isPlaying);
                } else {
                    track.playTrack();
                    log('play ' + track.isPlaying);
                }
                break;
            case 'controls_stop':
                track.stopTrack();
                clickedControl(id);
                break;
            case 'controls_next':
                log('next ' + track.isPlaying);
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
                log('default ' + id);
            } // <- end switch

        }); // <- end eventlistener on ul list

    }, //<- end controls()

    /**
     * Set the class var (boolean) "isPlaying"
     */
        setIsPlaying = function (val) {
            if (loSt()) {
                localStorage.setItem('isPlaying', val);
            }
            isPlaying = val;
        },


/* =============================| Create Player |=============================== */
        createPlayer = function () {
            createContainingArticle();
        /* Populate the newly created div with the audio tag and the canvas tag (canvas
         * used as progressbar), as well as controls (play, pause, stop and so on) */
            createControls();
            createAudioElement();

            progressBar = new ProgressBar();
            progressBar.init();

        }; // <-end createPlayer()
/* =========================| Load Music & Album Art |========================== */

    /**
     * Load the music and on success start the player
     */
    this.init = function () {
        loadMusic.init(function () {
            log('Let\'s initiate musicPlayer!');
            tRef.startPlayer();
        });
    }; // <- end init()






/* =========================| Initiate actuall player |========================= */
    this.startPlayer = function () {

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

    }; // <- end init()


}











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


document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        var musicPlayer = new MusicPlayer();
        musicPlayer.init();
    }
};

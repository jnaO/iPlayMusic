/*
 *  Document   : iPlayMusic
 *  Created on : Sep 5, 2011, 6:14:07 PM
 *  Author     : jnaO
 *  Description:
 *      JavaScript for iPlayMusic HTML5/JavaScript/PHP musicplayer
 *      https://github.com/jnaO/iPlayMusic
 *
 *
 * log to console for debug, test browser compatibility
 * @param msg String
 *      the log message
 */
function log(msg) {
    if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
        console.log(msg);
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


/**
 * Since I dont use jQuery on this project, I have here a small function to create
 * and mainpulate a new element
 */
var domEl = (function () {

    return {

        /**
         * Create a new element
         *
         * @param elem String
         *      type of element (I.E. 'div' or 'ul')
         * @param id String
         *      id of element
         * @param class String
         *      class of element
         */
        create: function (elem, id, cla) {
            var e = document.createElement(elem);
            if (id) {
                e.setAttribute('id', id);
            }
            if (cla) {
                e.setAttribute('class', cla);
            }
            return e;
        },

        /**
         * Appends child element to parent
         *
         * @param parId String
         *      id of DOM element intended to be parent
         * @param chiId String
         *      the child element to be appended
         */
        append: function (parId, chiId) {
            document.getElementById(parId).appendChild(chiId);
        },

        /**
         * Sets class of element
         *
         * @param elemId String
         *      The id of the element onto wich the class should be set
         * @param cla String
         *      The class to set on the element
         */
        setClass: function (elemId, cla) {
            document.getElementById(elemId).setAttribute('class', cla);
        }
    };

}());

/**
 * =================================| <audio> |=================================
 * audio.error
 *      URL for the video.
 * audio.networkState
 *      URL for the video.
 * audio.startTime
 *      URL for the video.
 * audio.defaultPlaybackRate
 *      URL for the video.
 * audio.seekable
 *      URL for the video.
 * audio.loop
 *      URL for the video.
 * audio.muted
 *      URL for the video.
 * audio.src
 *      URL for the video.
 * audio.preload
 *      URL for the video.
 * audio.seeking
 *      URL for the video.
 * audio.duration
 *      URL for the video.
 * audio.playbackRate
 *      URL for the video.
 * audio.ended
 *      URL for the video.
 * audio.controls
 *      URL for the video.
 * audio.currentSrc
 *      URL for the video.
 * audio.buffered
 *      Hint to the browser how much it should download before the video starts playing.
 * audio.currentTime
 *      Boolean attribute that hints that the browser should start playing the video automatically.
 * audio.paused
 *      Boolean attribute indicating whether the video should loop.
 * audio.played
 *      Boolean attribute indicating whether the browser should show its controls.
 * audio.autoplay
 *      Boolean attribute indicating whether the browser should show its controls.
 * audio.volume
 *      Boolean attribute indicating whether the browser should show its controls.
 */

/**
 * ==============================| eventListeners |=============================
 * loadstart
 * play
 * playing
 * timeupdate
 * progress
 * pause
 * canplay
 * ended
 * suspend
 * loadedmetadata
 * canplaythrough
 * ratechange
 * emptied
 * loadeddata
 * seeking
 * durationchange
 * stalled
 * waiting
 * seeked
 * volumechange
 */




/*============================================================================*/
/*============================================================================*/
/*===============================|           |================================*/
/*===============================| LOADMUSIC |================================*/
/*===============================|           |================================*/
/*============================================================================*/
/*============================================================================*/

function LoadMusic() {

    var trackList   = [],
        tRef        = this,
        albumArt    = [];

/* =============================| Fill trackList |============================== */
    this.setTrackList = function (param) {
        trackList = param;
    };
/* ============================| Return trackList |============================= */
    this.getTrackList = function () {
        return trackList;
    };


/* ============================| Return AlbumArt |============================== */
    this.getAlbumArt = function () {
        return albumArt;
    };
/* =============================| Fill AlbumArt |=============================== */
    this.setAlbumArt = function (param) {
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




    /* ============================| Fill playlist |============================= */
    /**
     * Populate the tracklist with the song-objects from specified music folder
     *
     *  @param whenReady function
     *      function to start when playlist is filled
     */
    this.init = function (whenReady) {

        /* Check wthishat filetypes the browser supports */
        var sup = checkBrowserAudioCompat(),
            types = sup.support,
            ajaxRequest;

        /* ===========| if we have browser support |=========== */
        if (sup.succes) {

            // Oldschool ajax. First we create a var to hold our ajax
            // Tut to be foud @ http://www.tizag.com/ajaxTutorial/ajax-javascript.php
            try {
                // Opera 8.0+, Firefox, Safari
                ajaxRequest = new XMLHttpRequest();
            } catch (e) {
                // Fallback for Internet Explorer
                try {
                    ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (f) {
                    try {
                        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (g) {
                        // if we still have not managed to get the call through
                        alert("Your browser can\'t handle ajax calls. it is time to ugrade! \ngoogle chrome, opera and firefox are recommended browsers.");
                        return false;
                    }
                }
            }
            // Receiveing data
            ajaxRequest.onreadystatechange = function () {
                if (ajaxRequest.readyState === 4) {

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

                        if (music[types[i]] !== undefined) {

                            // Fill out trackList with track objects
                            tRef.setTrackList(music[types[i]]);
                            match = true;
                            whenReady();
                            break;
                        }
                    }

                    // if we dont get a match between supported filetypes, and
                    // filetypes provided by user
                    if (match === false) {
                    }

                }
            };

            ajaxRequest.open("POST", "iPlayMusic/sys/_music.php" + "?r=tracks&a=art", true);
            ajaxRequest.send(null);


        } else { // === If browser do not support mp3, ogg or wav ===
        }
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
    var loadMusic = new LoadMusic(),
        timeOutTime = 40,
        track = null,
        trackList = [],
        trackNumber = 0,
        repeatBtn = parseInt(storage.get('repeatButton')) || 0,
        albumArt = [],
        audio,
        progressBar,
        isPlaying = storage.get('isPlaying') || false ,
        lastClickedControlBtn = '',
    // internal reference to musicPlayer (this)
        tRef = this,



/* ============================| Create TrackList |============================= */
        createTrackList = function () {

            var trackListContainer = domEl.create('div', 'track_list_container')
              , trackListElement = domEl.create('ul', 'track_list')
              , tli
              , trackNameElement
              , trackListLiElement
              , trackListItems
              , albumCover = domEl.create('img');
            // Create the trackListContainer
            domEl.append('iPlayMusic_article', trackListContainer);

            // Create album cover
            albumCover.src = albumArt[0].file;
            domEl.append('track_list_container', albumCover);
            // Create trackListUl
            domEl.append('track_list_container', trackListElement);

            // Create list items
            for (tli = 0; tli < trackList.length; tli++) {
                trackListLiElement = domEl.create('li', 'track_no_' + tli);
                trackNameElement = document.createTextNode(trackList[tli].title);
                trackListLiElement.setAttribute('data-tracknumber', tli);
                trackListLiElement.appendChild(trackNameElement);
                domEl.append('track_list', trackListLiElement);
            }
            document.getElementById('track_list').addEventListener('click', function(e){
                trackNumber = e.target.dataset.tracknumber
                track.setAudioSource(trackNumber);
                track.playTrack();
            });


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

            document.getElementById('iPlayMusic_article').appendChild(audioElement);
        }, // <- end createAudioElemen()








    /* =======================| Create Musicplayer Controls |======================= */
        createControls = function () {

            // Create the ul containing the controls
            var controlsList = domEl.create('ul',  'controls'),
                controlsArray = ['previous', 'play', 'stop', 'next', 'repeat', 'expand'],
                c,
                elem,
                containingArticle;
            domEl.append('iPlayMusic_article', controlsList);

        /* Populate the controls ul with li's containing the control buttons, as well as
         * the logo and the control for expanding the music player */

            containingArticle = document.getElementById('controls');
            for (c = 0; c < controlsArray.length; c++) {
                elem = document.createElement('li');
                elem.setAttribute('id',  'controls_' + controlsArray[c]);
                containingArticle.appendChild(elem);
            }

        }; // <- end createControls()









    /* ============================| Progress bar |============================= */
    function ProgressBar() {

        var barWidth,
            t = false,
            progressCanvas;


        this.create = function () {

            barWidth = document.getElementById('iPlayMusic_article').clientWidth;
            progressCanvas = domEl.create('canvas', 'progressbar');
            progressCanvas.setAttribute('heigth', 150);
            progressCanvas.setAttribute('width', barWidth);
            domEl.append('iPlayMusic_article', progressCanvas);
        }; // <- end create()

        this.remove = function () {
            document.getElementById('iPlayMusic_article').removeChild(progressCanvas);
        };

        this.update = function () {

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

            if (document.getElementById('iPlayMusic_article').clientWidth !== barWidth) {
                barWidth = document.getElementById('iPlayMusic_article').clientWidth;
            }
        };

        this.makeProgress = function () {


            var ctx,
                fWidth,

            //get current time in seconds
                elapsedTime = audio.currentTime;
            //update the progress bar
            if (progressCanvas.getContext) {
                ctx = progressCanvas.getContext("2d");
                fWidth = (elapsedTime / audio.duration) * (progressCanvas.clientWidth);

                //clear canvas before painting
                ctx.clearRect(0, 0, progressCanvas.clientWidth, 150);
                ctx.fillStyle = "rgb(245,245,245)";

                if (fWidth > 0) {
                    ctx.fillRect(0, 0, fWidth, 150);
                }
                if (audio.paused || audio.ended) {
                    return;
                }

                /* This steals a lot of CPU, the fewer millisecs, the harder on the
                 * processor.
                 * 0 - 10   =   98% CPU
                 * 20       ≈   65% CPU
                 * 30       ≈   45% CPU
                 *  */
                setTimeout(function () {
                    progressBar.makeProgress();
                }, timeOutTime);
            }// we can add an else here to notify users that their browser do not support <canvas>

        };


        this.init = function () {
            this.create();
        };

        window.addEventListener('resize', function(){
                    progressBar.update();
                });
//        return theBar;
    } // <- end progressBar()






    function Track() {
        this.isPlaying = false;
        this.repeatState = storage.get('repeatState') || 'repeat off';

        var currentTrack,




        // Set class "active_track" on li-element containing the current track name
            setActiveTrack = function () {
                var lis = document.getElementById('track_list').getElementsByTagName('li'),
                    ert;
                for (ert = 0; ert < lis.length; ert++) {
                    lis[ert].removeAttribute('class');
                }

                document.getElementById('track_no_' + trackNumber).setAttribute('class', 'active_track');
            }, // <- end setActiveTrack()





        // Change play/pause-button according to audio state
            isTrackPlaying = function (playOrPause) {
                track.isPlaying = (playOrPause === 'play');
                storage.set('isPlaying', track.isPlaying);
                if (track.isPlaying) {
                    document.getElementById('controls_play').setAttribute('class', 'pause');
                    storage.set('trackNumber', trackNumber);
                } else {
                    document.getElementById('controls_play').setAttribute('class', 'play');
                    storage.set('audioPosition', audio.currentTime);
                }
            }, // <- end isTrackPlaying



        // Add eventlisteners to audio
            listen = function () {
                // When audio start playing
                audio.addEventListener('playing', function () {
                    setActiveTrack();
                    isTrackPlaying('play');
                    progressBar.makeProgress();
                    audio.paused = false;
                    audio.ended = false;
                });

                // When audio stop playing
                audio.addEventListener('pause', function () {
                    isTrackPlaying('pause');
                    audio.paused = true;
                });

                // On audio end
                audio.addEventListener('ended', function () {
                    audio.ended = true;
                    switch (track.repeatState) {
                    case 'repeat one':
                        track.playTrack();
                        break;

                    case 'repeat off':
						(trackNumber == (trackList.length - 1)) ? track.stopTrack() : track.playNextTrack();
                        break;

                    default:
                        track.playNextTrack();

                    }
                });
            }; // <- end listen()




        this.setAudioSource = function (trNum) {
                currentTrack = trackList[trNum];
                audio.src = currentTrack.path + currentTrack.file;
            }; // <- end setAudioSource()


        this.incrementTrackNumber = function () {
            trackNumber++;
            if (trackNumber >= trackList.length) {
                trackNumber = 0;
            }
        }; // <- end incrementTrackNumber()



        this.decrementTrackNumber = function () {
            trackNumber--;
            if (trackNumber < 0) {
                trackNumber = (trackList.length - 1);
            }
        }; // <- end decrementTrackNumber()



        // Fast forward
        this.playNextTrack = function () {
	        track.incrementTrackNumber();
            track.setAudioSource(trackNumber);
            track.playTrack();
        }; // <- end playNextTrack()


        // Rewind
        this.playPreviousTrack = function () {
            track.decrementTrackNumber();
            track.setAudioSource(trackNumber);
            track.playTrack();
        }; // <- end playPreviousTrack()



        // Play
        this.playTrack = function (tr) {
            track.pauseTrack();
            trackNumber = tr || trackNumber;
            // If last pressed button was fastforward or rewind we want to reset the audio src
            if (lastClickedControlBtn === 'controls_previous' || lastClickedControlBtn === 'controls_next') {
                track.setAudioSource(trackNumber);
            }
            setTimeout(function(){
                audio.play();
            }, timeOutTime);
        }; // <- end playTrack



        // Pause
        this.pauseTrack = function () {
            storage.set('currentPosition', audio.currentTime);
            audio.pause();
            audio.paused = true;
        }; // <- end pauseTrack()


        // Stop
        this.stopTrack = function () {
            audio.pause();
            audio.currentTime = 0;
        }; // <- end stopTrack()

        //
        this.init = function () {
            trackNumber = storage.get('trackNumber') || 0;
            audio       = document.getElementById("iPlayMusic");
            audio.src   = trackList[trackNumber].path + trackList[trackNumber].file;
            listen();

        }; // <- end init()
    } // <- end Track()









/* ===========================| Controls MusicPlayer |========================== */
    var controls = function () {

        var playPauseBtn = document.getElementById('controls_play')
          , expandPlayer = document.getElementById('controls_expand')
          , repeatElem = document.getElementById('controls_repeat')
          , isExpanded = false
          , ul = document.getElementById("controls")
          ;

        playPauseBtn.setAttribute('class', 'play');
        expandPlayer.setAttribute('class', 'isExpanded_' + isExpanded);
        repeatElem.setAttribute('class', 'repeat_' + repeatBtn);




        var clickedControl = function (me) {
            lastClickedControlBtn = me;
        },


            toggleExpand = function () {
                isExpanded = !isExpanded;
                expandPlayer.setAttribute('class', 'isExpanded_' + isExpanded);
                if (isExpanded) {
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
                storage.set('repeatButton', repeatBtn);

                switch (repeatBtn) {
                case 0:
                    track.repeatState = 'repeat off';
                    storage.set('repeatState', 'repeat off');
                    break;
                case 1:
                    track.repeatState = 'repeat all';
                    storage.set('repeatState', 'repeat all');
                    break;
                case 2:
                    track.repeatState = 'repeat one';
                    storage.set('repeatState', 'repeat one');
                    break;
                default:
                    break;
                }

            }; // <- end changeRepeatState()


        ul.addEventListener('click', function (e) {
            var id = e.target.id;

            switch (id) {
            case 'controls_previous':
                (track.isPlaying) ? track.playPreviousTrack() : track.decrementTrackNumber();
                clickedControl(id);
                break;
            case 'controls_play':

                if (track.isPlaying) {
                    track.pauseTrack();
                    clickedControl(id);
                } else {
                    track.playTrack();
                }
                break;
            case 'controls_stop':
                track.stopTrack();
                clickedControl(id);
                break;
            case 'controls_next':
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
            } // <- end switch

        }); // <- end eventlistener on ul list

    }, //<- end controls()




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
/* =========================| Load Music & Album Art |========================== */

    /**
     * Load the music and on success start the player
     */
    this.init = function () {
        loadMusic.init(function () {
            tRef.startPlayer();
        });
    }; // <- end init()






/* =========================| Initiate actuall player |========================= */
    this.startPlayer = function () {

        trackList   = loadMusic.getTrackList();
        albumArt    = loadMusic.getAlbumArt();

        track = new Track();
        createPlayer();
        controls();
        createTrackList();
        track.init();
        if (isPlaying == 'true') {
            track.playTrack();
        }
    }; // <- end init()


}




document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        var musicPlayer = new MusicPlayer();
        musicPlayer.init();
    }
};

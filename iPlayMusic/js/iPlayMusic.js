$(document).ready(function($){
    log($("#iPlayMusic_article").width());
    log(($("#vol_btn").width() ));
    $("#canvas").attr('width', $("#iPlayMusic_article").width());
    $("#volume_control").css('width', ($("#iPlayMusic_article").width()-70));
    // A boolean to tell if a song is playing atm
    var isPlaying = new Boolean(false);
    isPlaying = ( localStorage.getItem('is_playing') == 'false' ) ? false : true ;

    // Get progressbar canvas
    var canvas = document.getElementById('canvas');

    // put our audiofiles in an nice array
    // TODO replace array content with files in folder 'music''
    var audioFiles = new Array('steam', 'serenity', 'theRighteous');

    // Create audio element
    var audio = document.getElementById("iPlayMusic");

    // Filetype support in current browser, to know if we should user .ogg, .mp3 or .wav
    var fileType = checkAudioCompat();
    log(fileType);

    // Pick song to play from audioFiles Array, use filetype from checkAudioCompat
    var i = ( localStorage.getItem('last_song_playing') ) ? parseInt( localStorage.getItem('last_song_playing') ): 0;
    audio.src = "iPlayMusic/music/"+audioFiles[i]+fileType;

    // set init volume
    var audioVolume = ( localStorage.getItem('audio_volume') ) ? parseFloat(localStorage.getItem('audio_volume')) : ($("#volume_control").val()/1000);
    $("#volume_control").val(audioVolume*1000);
    audio.volume = audioVolume;

    // control audio volume through the slider
    $("#volume_control").change(function(){
        audioVolume = ($("#volume_control").val()/1000);
        audio.volume = audioVolume;
        localStorage.setItem('audio_volume', audioVolume);

    });

    // Listen for "playing", and if it hears it sets pause img for toggleButton,
    // set isPlaying to true
    audio.addEventListener( 'playing',
        function(){
            isPlaying = true;
            localStorage.setItem('is_playing', isPlaying);
            playPauseBtn.attr('src', 'iPlayMusic/controls/pause.png');
            console.log('isPlaying: '+isPlaying);
            localStorage.setItem('last_song_playing', i);
        },
        true);

    // Listen for "pause", and if it hears it sets play img for toggleButton,
    // set isPlaying to false
    audio.addEventListener( 'pause',
        function(){
            isPlaying = false;
            localStorage.setItem('is_playing', isPlaying);
            playPauseBtn.attr('src', 'iPlayMusic/controls/play.png');
            console.log('isPlaying: '+isPlaying);
        },
        true);

    // Autoplay. Started out using canplayThrough, but then it want to load entire file in ff
    audio.addEventListener("canplay", function () {
            if ( isPlaying === true ) {
            log('inside just before: '+isPlaying);
                audio.play();
            }
        },
        false);

    // play next song on end of this one (playlist)
    audio.addEventListener( 'ended',
        function(){
            if ( repeatAudio() !== 2 ) {
                i++;
                // Check to see if we're at the last position in the array of audiofiles
                // if we are, start over from the top
                if(i >= audioFiles.length) {
                    if ( (i+1) >= audioFiles.length && repeatAudio() === 0 ) {
                        i=0;
                        return;
                    }
                    i=0;
                }
            }

            audio.src = 'iPlayMusic/music/'+audioFiles[i]+fileType;
            audio.play();
        },
        false);

    // Set the progressbar
    audio.addEventListener("timeupdate", progressBar, true);

    // If space is pressed toggle play / pause
    $(this).bind('keypress', function(e) {
        var key = (e.keyCode ? e.keyCode : e.charCode);
        if(key == 32){
            (isPlaying === true) ? audio.pause() : audio.play();
        }
        console.log(key);
    });

/********************************** controls ***************************************/

    // get play/pause and stop buttons bu element ID
    var playPauseBtn = $("#toggle_play_pause_btn");
    var stopBtn = $("#stop_btn");
    var rewindBtn = $("#prev_btn");
    var fastForwardBtn = $("#ff_btn");
    var songLink = $(".song_link");

    songLink.click(function(){
        audio.pause();
        console.log($(this).attr('data-link')+fileType);
        audio.src = 'iPlayMusic/music/'+$(this).attr('data-link')+fileType;
        i = $(this).attr('data-song_number');
        audio.play();
    });


    // Stop **** Do not work properly in FF for some reason...
    // TODO Fix for FIreFox bug?
    stopBtn.click(function(){
        audioStop(audio);
    });

    // Play / Pause
    playPauseBtn.click(function(){
        if(isPlaying === true){
            audio.pause();
        }else{
            audio.play();

        }
    });

    // Rewind track if track has played more than 4s, else previous track
    rewindBtn.click(function(){
        var timePlayed = Math.round(audio.currentTime);

        if ( timePlayed < 4 ) {
            i--;
            if ( i < 0 ) {
                i = audioFiles.length-1;
            }
            audio.src = "iPlayMusic/music/"+audioFiles[i]+fileType;
        } else if (timePlayed >= 4){
            audioStop(audio);
            audio.play();
        }
    });

    // Fast forward / next track
    fastForwardBtn.click(function(){
        i++;
        if ( i >= audioFiles.length ) {
            i = 0;
        }
        audio.src = "iPlayMusic/music/"+audioFiles[i]+fileType;
    });


/******************************** end controls **************************************/

    function progressBar() {
        //get current time in seconds
        var elapsedTime = Math.round(audio.currentTime);
        //update the progress bar
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            //clear canvas before painting
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            ctx.fillStyle = "rgb(200,0,0)";
            var fWidth = (elapsedTime / audio.duration) * (canvas.clientWidth);
            if (fWidth > 0) {
                ctx.fillRect(0, 0, fWidth, canvas.clientHeight);
            }
        }// we can add an else here to notify users that theie browser do not support <canvas>
    }

    // Enable mouse click in progressbar to set currentTime of audio clip.
    canvas.addEventListener("click", function(e) {
            if (!e) {
                e = window.event;
            } //get the latest windows event if it isn't set
            try {
                //calculate the current time based on position of mouse cursor in canvas box
                audio.currentTime = audio.duration * (e.offsetX / canvas.clientWidth);
            }
            catch (e) {
                console.log(e+'  ::  fail');
            }
        }, true);

    // Repeat function
    var repeatBtn = ( localStorage.getItem('repeat_state') ) ? parseInt(localStorage.getItem('repeat_state')): 0;
    $("#repeat_btn").attr('src', 'iPlayMusic/controls/repeat_'+repeatBtn+'.png')

    $("#repeat_btn").click(function(){
        repeatBtn++;

        if ( repeatBtn >= 3 ) {
            repeatBtn = 0;
        }

        $(this).attr('src', 'iPlayMusic/controls/repeat_'+repeatBtn+'.png')
        localStorage.setItem('repeat_state', repeatBtn);

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

    });
});


/**
 * Repeat state
 * @return int
 *      0 = no repeat
 *      1 = repeat all
 *      2 = repeat one
 */
 function repeatAudio(){
     var rep = ( localStorage.getItem('repeat_state') ) ? parseInt(localStorage.getItem('repeat_state')) : 0;
     return rep;
 }

/**
 * Check audiocompatibility of the browser
 *
 * @return String
 *      a valid filetype that the broser supports, or an emty
 *      string if the browser do not support audio
 */
function checkAudioCompat() {
    var myAudio = document.createElement('audio');

    if (myAudio.canPlayType) {

        // CanPlayType returns maybe, probably, or an empty string.
        if ( "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"')) {
            return ".ogg";
        }
        if ( "" != myAudio.canPlayType('audio/mpeg')) {
            return ".mp3";
        }
        return ".wav";
    }else {
        alert("Your browser do not support audio in HTML5. Please consider upgrading to preferably Google Chrome, Mozilla Firefox or Opera.");
        return "";
    }
}
/**
 * Stop function
 *
 * @param audio
 *      The audio element on wich to perform the stop action
 */
function audioStop(audio){
    audio.pause();
    audio.currentTime = 0;
}
function log(msg){
    console.log(msg);
}
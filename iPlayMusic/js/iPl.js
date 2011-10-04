function MusicPlayer () {

    log('I am MusicPlayer');


/* ===========================| Initiate player |============================ */
    this.init= function(){
        log('Initiate musicPlayer');

    /* create <article> to hold our musicplayer and prepend it to <body> */
        var iPlayMusic_article = $('<article id="iPlayMusic_article"/>');
        $('body').prepend(iPlayMusic_article);

    /* Populate the newly created div with the audio tag and the canvas tag (canvas
     * used as progressbar), as well as controls (play, pause, stop and so on) */
        var tagControls = $('<ul id="controls"/>');
        var tagAudio = $('<audio id="iPlayMusic"/>');
        var tagProgress = $('<canvas id="canvas" width="500" height="5"/>');
        $('#iPlayMusic_article').prepend(tagControls, tagAudio, tagProgress);

    /* Populate the controls ul with li's containing the control buttons, as well as
     * the logo and the control for expanding the music player */
        var controlsArray = ['logo', 'previous', 'play', 'stop', 'next', 'repeat', 'expand']
        for(var c in controlsArray){
            var n = ('<li id="controls_'+controlsArray[c]+'" />');
            $("#controls").append(n);
        }
    }

    this.controls = function(){

    }

}

function log(msg){
    if(typeof console != "undefined" && typeof console.log != "undefined"){
        console.log(msg);
    }else{
        // do nuthin
    }
}

$(document).ready(function(){

    var musicPlayer = new MusicPlayer();
    musicPlayer.init();
});
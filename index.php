<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="iPlayMusic"/>
        <meta name="keywords" content="HTML5, JavaScript, PHP, Music Player" />
        <meta name="author" content="jnaO" />

        <title>iPlayMusic</title>
         <?php
        $iphone = strpos($_SERVER['HTTP_USER_AGENT'], "iPhone");
        $android = strpos($_SERVER['HTTP_USER_AGENT'], "Android");
        $palmpre = strpos($_SERVER['HTTP_USER_AGENT'], "webOS");
        $berry = strpos($_SERVER['HTTP_USER_AGENT'], "BlackBerry");
        $ipod = strpos($_SERVER['HTTP_USER_AGENT'], "iPod");
        $ipad = strpos($_SERVER['HTTP_USER_AGENT'], "iPad");

        if ($iphone || $ipad || $ipod == true) {
            ?>
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
            <meta name="viewport" content="width=600,user-scalable=no" />

            <link rel="apple-touch-startup-image" href="img/iphone/startup.png" />
            <link rel="apple-touch-icon" href="img/iphone/touch-icon-iphone.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="img/iphone/touch-icon-ipad.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="img/iphone/touch-icon-iphone4.png" />

            <?
        }
        ?>



        <link href='//fonts.googleapis.com/css?family=Josefin+Sans:400,600,700|Josefin+Slab:700&amp;v2' rel='stylesheet' type='text/css' />
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>

<?
        if ($iphone || $android || $palmpre || $ipod || $berry == true) {
            ?>
            <link href="css/handheld.css" type="text/css" rel="stylesheet" title="handheld" media="all" />
<!--            <script type="text/javascript" src="js/jsHandheld.js"></script>-->
            <?
        } else {
            ?>
            <link rel="stylesheet" type="text/css" href="css/style.css" media="screen" />
            <?
        }
        ?>


    </head>
    <body>
        <article class="top wrapper">
            <pre class="logo">
     .--. .          .    .
  o  |   )|          |\  /|           o
  .  |--' | .-.  .  .| \/ |.  . .--.  .  .-.
  |  |    |(   ) |  ||    ||  | `--.  | (
-' `-'    `-`-'`-`--|'    '`--`-`--'-' `-`-'
                    ;
                 `-'
            </pre>
            <p class="center">
                <a href="//github.com/jnaO/iPlayMusic" target="_blank">github.com/jnaO/iPlayMusic</a><br />
                <a href="mockup.php">Mockups</a>
            </p>
        </article>
<!--        <article class="bottom wrapper">
            <audio id="iPlayMusic">
                HTML5 audio not supported. I recommend you switching to a modern browser. Else you will miss out on content here and elsewhere as well.<br />
                Good alternatives are chrome, firefox and opera.
            </audio>


            <img id="album_cover" class="float_left" src="iPlayMusic/albumart/serenity_front.png" alt="Serenity album front" />
            <p class="float_left">
                1. <span class="song_link" data-link="steam" data-song_number="0">Steam</span><br />
                2. <span class="song_link" data-link="serenity" data-song_number="1">Serenity</span><br />
                3. <span class="song_link" data-link="theRighteous" data-song_number="2">The Righteous</span>
            </p>
            <p class="clearer"></p>




            <canvas id="canvas" width="500" height="5">
                canvas not supported
            </canvas><br />
            <img class="webkit" id="vol_btn" src="iPlayMusic/controls/volume.png" alt="previous" />
            <input name="volume_control" id="volume_control" type="range" min="0" max="1000" value="700" /><br />
            <img class="mplayer_btn" id="prev_btn" src="iPlayMusic/controls/prev.png" alt="previous" />
            <img class="mplayer_btn" id="toggle_play_pause_btn" src="iPlayMusic/controls/play.png" alt="play" />
            <img class="mplayer_btn" id="stop_btn" src="iPlayMusic/controls/stop.png" alt="stop" />
            <img class="mplayer_btn" id="ff_btn" src="iPlayMusic/controls/ff.png" alt="fast forward" />
            <img class="repeat_btn" id="repeat_btn" src="iPlayMusic/controls/repeat_0.png" alt="fast forward" />
        </article>-->
    </body>
</html>

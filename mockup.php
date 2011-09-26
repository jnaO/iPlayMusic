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

        <script type="text/javascript" src="iPlayMusic/js/iPlayMusic.js"></script>
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
        <link rel="stylesheet" type="text/css" href="iPlayMusic/css/iPlayMusic.css" media="screen" />


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
                <a href="index.php" target="_blank">Home</a>
            </p>
        </article>
        <article id="iPlayMusic_article" class="bottom wrapper">
            <h6>Folded</h6>
            <img src="img/mockup/folded.png" alt="Folded mockup of iPlayMusic" /><br />
            <h6>Expanded</h6>
            <img src="img/mockup/unfolded.png" alt="Unfolded mockup of iPlayMusic" />
        </article>
    </body>
</html>

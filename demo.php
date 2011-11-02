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

        if ($iphone || $ipod == true) {
            ?>
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
            <meta name="viewport" content="width=600" />

            <link rel="apple-touch-startup-image" href="img/iphone/startup.png" />
            <link rel="apple-touch-icon" href="img/iphone/touch-icon-iphone.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="img/iphone/touch-icon-ipad.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="img/iphone/touch-icon-iphone4.png" />

            <?
        }
        ?>



        <link href='//fonts.googleapis.com/css?family=Josefin+Sans:400,600,700|Josefin+Slab:700&amp;v2' rel='stylesheet' type='text/css' />

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
        <link rel="stylesheet" type="text/css" href="iPlayMusic/sys/iPlayMusic.css" media="screen" />

        <!--[if lt IE 9]>
        <script type="text/javascript" src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        <script type="text/javascript">

            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-26694851-1']);
            _gaq.push(['_setDomainName', 'jnao.me']);
            _gaq.push(['_trackPageview']);

            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();

        </script>
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
            <? include_once 'inc/nav.inc'; ?>
        </article>

        <script type="text/javascript" src="iPlayMusic/sys/iPlayMusic.js"></script>

        <?
include_once '_class/Count.php';
$user_count = new Count();
$user_count->trackUsers();
        ?>
    </body>
</html>

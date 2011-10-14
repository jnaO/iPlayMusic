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
            <? include_once 'inc/nav.inc'; ?>
        </article>
        <article class="top wrapper">
            <h3>What do we get from '$_SERVER'</h3>
            <?php

$serv = array('AUTH_TYPE','DOCUMENT_ROOT','GATEWAY_INTERFACE','HTTPS','HTTP_ACCEPT',
        'HTTP_ACCEPT_CHARSET','HTTP_ACCEPT_ENCODING','HTTP_ACCEPT_LANGUAGE',
        'HTTP_CONNECTION','HTTP_HOST','HTTP_REFERER','HTTP_USER_AGENT',
        'PATH_TRANSLATED','PHP_AUTH_DIGEST','PHP_AUTH_PW','PHP_AUTH_USER',
        'PHP_SELF','QUERY_STRING','REMOTE_ADDR','REMOTE_HOST','REMOTE_PORT',
        'REQUEST_METHOD','REQUEST_URI','SCRIPT_FILENAME','SCRIPT_NAME','SERVER_ADDR',
        'SERVER_ADMIN','SERVER_NAME','SERVER_PORT','SERVER_PROTOCOL','SERVER_SIGNATURE',
        'SERVER_SOFTWARE');

for ( $i = 0; $i < count($serv);$i++) {
     echo '<h6>$_SERVER[\'' . $serv[$i] . '\']</h6>';
     echo (!empty($_SERVER[$serv[$i]]) ) ? $_SERVER[$serv[$i]] :  '(I am empty)';
     echo '<br /><hr />';

}


?>
        </article>
    </body>
</html>

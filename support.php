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

        <article class="bottom wrapper">
            <h4>Your browser supports these audio types:</h4>
            <ul id="types">
            </ul>
            <p>
                You can test the browser support of a specific filetype by simply asking: canPlayType(type). An in return you'll get the answer: "", "maybe" or "probably". <br />
                For readability I've made "" to "no".<br />
                <br />
                As a point of reference check out <a href="http://modernizr.github.com/Modernizr/annotatedsource.html" target="_blank">Modenizr</a> @ <a href="http://www.github.com/" target="_blank">github</a>.

            </p>
        </article>

        <script>
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
            types = {
                'mp3': 'mpeg',
                'ogg': 'ogg; codecs="vorbis"',
                'wav': 'wav',
                'AIFF': 'aiff',
                'WMA': 'wma',
                'AAC (m4a)': 'x-m4a',
                'AAC (aac)': 'aac'
            },
            type,
            span,
            i = 0,
            canPlayType = '',
            textNode = '',
            typeTextNode = '',
            listItem,
            upDateBrowser = '';

        if (myAudio.canPlayType) {


            for (type in types) {
                canPlayType = myAudio.canPlayType('audio/' + types[type]) || 'no';
                span = document.createElement('span');
                span.setAttribute('class', 'type ' + canPlayType);
                typeTextNode = document.createTextNode(canPlayType);
                span.appendChild(typeTextNode);
                textNode = document.createTextNode(type + ': ');
                listItem = document.createElement('li');
                listItem.appendChild(textNode);
                listItem.appendChild(span);
                document.getElementById('types').appendChild(listItem);
            }
//            // Check if browser support mp3
//
//
//            // Check if browser support ogg
//            console.log('ogg');
//            console.log(myAudio.canPlayType('audio/ogg; codecs="vorbis"'));
//            var canPlayOgg = myAudio.canPlayType('audio/ogg; codecs="vorbis"') || 'no',
//                ogg = document.createTextNode(canPlayOgg);
//            document.getElementById('ogg').appendChild(ogg);
//
//            // Check if browser support wav
//            console.log('wav');
//            console.log(myAudio.canPlayType('audio/wav'));
//            var canPlayWav = myAudio.canPlayType('audio/wav') || 'no',
//                wav = document.createTextNode(canPlayWav);
//            document.getElementById('wav').appendChild(wav);

        } else {
            upDateBrowser = confirm("Your browser do not support audio in HTML5. Please update your browser, " +
                "or consider upgrading to preferably Google Chrome, Mozilla Firefox or Opera.");
            if (upDateBrowser) {
                window.location = "http://www.google.com/chrome";
            }

        }
    }
    checkBrowserAudioCompat();
        </script>
        <?
include_once '_class/Count.php';
$user_count = new Count();
$user_count->trackUsers();
        ?>
    </body>
</html>

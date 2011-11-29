/*
    Document   : iPlayMusic
    Created on : Sep 5, 2011, 6:14:07 PM
    Author     : jnaO
    Description:
        JavaScript for iPlayMusic HTML5/JavaScript/PHP musicplayer
        https://github.com/jnaO/iPlayMusic
*/
function log(msg) {if(typeof console!=='undefined'&&typeof console.log!=='undefined') {console.log(msg);}}
var storage=(function(){var isLocalStorage=(typeof localStorage!==undefined);return{set:function(key,value){if(isLocalStorage){localStorage.setItem(key,value);}},get:function(key){if(isLocalStorage){return localStorage.getItem(key);}},remove:function(key){if(isLocalStorage){localStorage.removeItem(key);}}};}());var domEl=(function(){return{create:function(elem,id,cla) {var e=document.createElement(elem);if(id){e.setAttribute('id',id);}
if(cla){e.setAttribute('class',cla);}
return e;},append:function(parId,chiId) {document.getElementById(parId).appendChild(chiId);},setClass:function(elemId,cla) {document.getElementById(elemId).setAttribute('class',cla);}};}());function LoadMusic() {var trackList=[],tRef=this,albumArt=[];this.setTrackList=function(param) {trackList=param;};this.getTrackList=function(){return trackList;};this.getAlbumArt=function(){return albumArt;};this.setAlbumArt=function(param) {albumArt=param;};function checkBrowserAudioCompat(){var myAudio=document.createElement('audio'),typesSupported=[],upDateBrowser='';if(myAudio.canPlayType){if(""!==myAudio.canPlayType('audio/mpeg')){typesSupported[typesSupported.length]=".mp3";}
if(""!==myAudio.canPlayType('audio/ogg; codecs="vorbis"')){typesSupported[typesSupported.length]=".ogg";}
if(""!==myAudio.canPlayType('audio/wav')){typesSupported[typesSupported.length]=".wav";}
return{succes:true,support:typesSupported};}else{upDateBrowser=confirm("Your browser do not support audio in HTML5. Please update your browser, "+"or consider upgrading to preferably Google Chrome, Mozilla Firefox or Opera.");if(upDateBrowser){window.location="http://www.google.com/chrome";}
return{succes:false};}}
this.init=function(whenReady) {var sup=checkBrowserAudioCompat(),types=sup.support,ajaxRequest;if(sup.succes){try{ajaxRequest=new XMLHttpRequest();}catch(e) {try{ajaxRequest=new ActiveXObject("Msxml2.XMLHTTP");}catch(f){try{ajaxRequest=new ActiveXObject("Microsoft.XMLHTTP");}catch(g) {alert("Your browser can\'t handle ajax calls. it is time to ugrade! \ngoogle chrome, opera and firefox are recommended browsers.");return false;}}}
ajaxRequest.onreadystatechange=function(){if(ajaxRequest.readyState===4) {var msg=JSON.parse(ajaxRequest.responseText),music=msg.music,match=false,i;tRef.setAlbumArt(msg.art);for(i=0;i<types.length;i++){if(music[types[i]]!==undefined) {tRef.setTrackList(music[types[i]]);match=true;whenReady();break;}}
if(match===false) {}}};ajaxRequest.open("POST","iPlayMusic/sys/_music.php"+"?r=tracks&a=art",true);ajaxRequest.send(null);}else{}};}
function MusicPlayer(){var loadMusic=new LoadMusic(),timeOutTime=40,track=null,trackList=[],trackNumber=0,repeatBtn=parseInt(storage.get('repeatButton'))||0,albumArt=[],audio,progressBar,isPlaying=storage.get('isPlaying')|| false,lastClickedControlBtn='',tRef=this,createTrackList=function(){var trackListContainer=domEl.create('div','track_list_container'),trackListElement=domEl.create('ul','track_list'),tli,trackNameElement,trackListLiElement,trackListItems,albumCover=domEl.create('img');domEl.append('iPlayMusic_article',trackListContainer);albumCover.src=albumArt[0].file;domEl.append('track_list_container',albumCover);domEl.append('track_list_container',trackListElement);for(tli=0;tli<trackList.length;tli++) {trackListLiElement=domEl.create('li','track_no_'+tli);trackNameElement=document.createTextNode(trackList[tli].title);trackListLiElement.setAttribute('data-tracknumber',tli);trackListLiElement.appendChild(trackNameElement);domEl.append('track_list',trackListLiElement);}
document.getElementById('track_list').addEventListener('click',function(e){trackNumber=e.target.dataset.tracknumber
track.setAudioSource(trackNumber);track.playTrack();});},createContainingArticle=function(){var iPlayMusic_article='<article id="iPlayMusic_article" class="contracted"></article>';document.body.innerHTML=iPlayMusic_article+document.body.innerHTML;},createAudioElement=function(){var audioElement=document.createElement('audio');audioElement.setAttribute('id','iPlayMusic');document.getElementById('iPlayMusic_article').appendChild(audioElement);},createControls=function(){var controlsList=domEl.create('ul','controls'),controlsArray=['previous','play','stop','next','repeat','expand'],c,elem,containingArticle;domEl.append('iPlayMusic_article',controlsList);containingArticle=document.getElementById('controls');for(c=0;c<controlsArray.length;c++) {elem=document.createElement('li');elem.setAttribute('id','controls_'+controlsArray[c]);containingArticle.appendChild(elem);}};function ProgressBar() {var barWidth,t=false,progressCanvas;this.create=function(){barWidth=document.getElementById('iPlayMusic_article').clientWidth;progressCanvas=domEl.create('canvas','progressbar');progressCanvas.setAttribute('heigth',150);progressCanvas.setAttribute('width',barWidth);domEl.append('iPlayMusic_article',progressCanvas);};this.remove=function() {document.getElementById('iPlayMusic_article').removeChild(progressCanvas);};this.update=function() {setTimeout(function(){if(!t){progressBar.remove();progressBar.create();t=true;}},500);setTimeout(function(){t=false;},800);if(document.getElementById('iPlayMusic_article').clientWidth!==barWidth){barWidth=document.getElementById('iPlayMusic_article').clientWidth;}};this.makeProgress=function(){var ctx,fWidth,elapsedTime=audio.currentTime;if(progressCanvas.getContext){ctx=progressCanvas.getContext("2d");fWidth=(elapsedTime/audio.duration)*(progressCanvas.clientWidth);ctx.clearRect(0,0,progressCanvas.clientWidth,150);ctx.fillStyle="rgb(245,245,245)";if(fWidth>0){ctx.fillRect(0,0,fWidth,150);}
if(audio.paused||audio.ended){return;}
setTimeout(function(){progressBar.makeProgress();},timeOutTime);}};this.init=function(){this.create();};window.addEventListener('resize',function(){progressBar.update();});}
function Track() {this.isPlaying=false;this.repeatState=storage.get('repeatState')|| 'repeat off';var currentTrack,setActiveTrack=function(){var lis=document.getElementById('track_list').getElementsByTagName('li'),ert;for(ert=0;ert<lis.length;ert++){lis[ert].removeAttribute('class');}
document.getElementById('track_no_'+trackNumber).setAttribute('class','active_track');},isTrackPlaying=function(playOrPause){track.isPlaying=(playOrPause==='play');storage.set('isPlaying',track.isPlaying);if(track.isPlaying){document.getElementById('controls_play').setAttribute('class','pause');storage.set('trackNumber',trackNumber);}else{document.getElementById('controls_play').setAttribute('class','play');storage.set('audioPosition',audio.currentTime);}},listen=function(){audio.addEventListener('playing',function(){setActiveTrack();isTrackPlaying('play');progressBar.makeProgress();audio.paused=false;audio.ended=false;});audio.addEventListener('pause',function(){isTrackPlaying('pause');audio.paused=true;});audio.addEventListener('ended',function(){audio.ended=true;switch(track.repeatState) {case'repeat one':track.playTrack();break;case'repeat off':(trackNumber==(trackList.length-1))?track.stopTrack():track.playNextTrack();break;default:track.playNextTrack();}});};this.setAudioSource=function(trNum) {currentTrack=trackList[trNum];audio.src=currentTrack.path+currentTrack.file;};this.incrementTrackNumber=function(){trackNumber++;if(trackNumber>=trackList.length) {trackNumber=0;}};this.decrementTrackNumber=function(){trackNumber--;if(trackNumber<0) {trackNumber=(trackList.length-1);}};this.playNextTrack=function(){track.incrementTrackNumber();track.setAudioSource(trackNumber);track.playTrack();};this.playPreviousTrack=function(){track.decrementTrackNumber();track.setAudioSource(trackNumber);track.playTrack();};this.playTrack=function(tr){track.pauseTrack();trackNumber=tr|| trackNumber;if(lastClickedControlBtn==='controls_previous'|| lastClickedControlBtn==='controls_next'){track.setAudioSource(trackNumber);}
setTimeout(function(){audio.play();},timeOutTime);};this.pauseTrack=function(){storage.set('currentPosition',audio.currentTime);audio.pause();audio.paused=true;};this.stopTrack=function(){audio.pause();audio.currentTime=0;};this.init=function(){trackNumber=storage.get('trackNumber')||0;audio=document.getElementById("iPlayMusic");audio.src=trackList[trackNumber].path+trackList[trackNumber].file;listen();};}
var controls=function(){var playPauseBtn=document.getElementById('controls_play'),expandPlayer=document.getElementById('controls_expand'),repeatElem=document.getElementById('controls_repeat'),isExpanded=false,ul=document.getElementById("controls");playPauseBtn.setAttribute('class','play');expandPlayer.setAttribute('class','isExpanded_'+isExpanded);repeatElem.setAttribute('class','repeat_'+repeatBtn);var clickedControl=function(me) {lastClickedControlBtn=me;},toggleExpand=function(){isExpanded=!isExpanded;expandPlayer.setAttribute('class','isExpanded_'+isExpanded);if(isExpanded) {document.getElementById('iPlayMusic_article').removeAttribute('class');document.getElementById('iPlayMusic_article').setAttribute('class','expanded');}else{document.getElementById('iPlayMusic_article').removeAttribute('class');document.getElementById('iPlayMusic_article').setAttribute('class','contracted');}},changeRepeatState=function(){repeatBtn++;if(repeatBtn>=3){repeatBtn=0;}
repeatElem.className='repeat_'+repeatBtn;storage.set('repeatButton',repeatBtn);switch(repeatBtn){case 0:track.repeatState='repeat off';storage.set('repeatState','repeat off');break;case 1:track.repeatState='repeat all';storage.set('repeatState','repeat all');break;case 2:track.repeatState='repeat one';storage.set('repeatState','repeat one');break;default:break;}};ul.addEventListener('click',function(e) {var id=e.target.id;switch(id){case'controls_previous':(track.isPlaying)?track.playPreviousTrack():track.decrementTrackNumber();clickedControl(id);break;case'controls_play':if(track.isPlaying){track.pauseTrack();clickedControl(id);}else{track.playTrack();}
break;case'controls_stop':track.stopTrack();clickedControl(id);break;case'controls_next':(track.isPlaying)?track.playNextTrack():track.incrementTrackNumber();clickedControl(id);break;case'controls_repeat':changeRepeatState();break;case'controls_expand':toggleExpand();break;default:}});},createPlayer=function(){createContainingArticle();createControls();createAudioElement();progressBar=new ProgressBar();progressBar.init();};this.init=function(){loadMusic.init(function(){tRef.startPlayer();});};this.startPlayer=function(){trackList=loadMusic.getTrackList();albumArt=loadMusic.getAlbumArt();track=new Track();createPlayer();controls();createTrackList();track.init();if(isPlaying=='true'){track.playTrack();}};}
document.onreadystatechange=function(){if(document.readyState==='complete') {var musicPlayer=new MusicPlayer();musicPlayer.init();}};
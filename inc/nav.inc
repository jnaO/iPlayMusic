<?
function current_page ($filename, $title) {
    $nav_conf = $_SERVER['PHP_SELF'];
    echo ( $nav_conf == $filename ) ? $title : '<a href="'.$filename.'">'.$title.'</a>' ;
}
?>
<nav class="center">
    <a href="//github.com/jnaO/iPlayMusic" target="_blank">github.com/jnaO/iPlayMusic</a><br />
    <?  current_page('/index.php', 'Home'); ?>
    <?  current_page('/mockup.php', 'Mockup'); ?>
    <?  current_page('/demo.php', 'Demo'); ?>
    <?  current_page('/support.php', 'Support audio type'); ?>
</nav>
<?php
function createDiffButton ($name, $nb) {
	echo "<li><input type='button' value='".$name."' onclick='javascript:createNewGame(".$nb.")' class='diff'></li>";
}

function createRestartButton () {
	echo "<li><input type='button' value='Recommencer' onclick='javascript:restartGame()' class='diff'></li>";
}

function createTitle ($name) {
	echo "<li><h2 class='title'>$name</h2></li>";
}
?>
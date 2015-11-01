(function(){

    //Variables
    var file;
    var fs = require('fs');

    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    var thiswindow = BrowserWindow.getFocusedWindow();

    //Audio Management
    /*
    audio_file.onchange = function(e){
        var files = this.files;
        console.log(e.target.files[0].fileName);
        file = URL.createObjectURL(files[0]);
        filename=file.fileName;
        console.log(file.path);
    };
*/

    $(function () {
        $("#audio_file").on("change", function () {
            var files = $(this)[0].files;
            for (var i = 0; i < files.length; ++i) {
            console.log(files[i].name);
            document.getElementById("result").innerHTML = files[i].name;
            file = URL.createObjectURL(files[0]);
            }
        });
    });

    $(function () {
        $("#directory_input").on("change", function () {
            var files = $(this)[0].files;
            for (var i = 0; i < files.length; ++i) {
            document.getElementById("result").innerHTML = files[i].path;
            console.log(files[i].path);
            }
        });
    });


    //Music UI
    document.getElementById("playButton").addEventListener("click", function (e) {
        audio_player.src = file;
        audio_player.play();
        console.log("Playing " + file.fileName);
    });

    document.getElementById("stopButton").addEventListener("click", function (e) {
        audio_player.pause();
    });

    //Timeline

    var music = document.getElementById('audio_player');
    var duration;
    var pButton = document.getElementById('playButton');
    var timeAllotted = document.getElementById('timeAllotted');
    var playhead = document.getElementById('playhead');

    var timeline = document.getElementById('timeline');
    var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

    music.addEventListener("timeupdate", timeUpdate, false);

    timeline.addEventListener("click", function(event) {
      moveplayhead(event);
      music.currentTime = duration * clickPercent(event);
    }, false);

    function clickPercent(e) {
      return (e.pageX - timeline.offsetLeft) / timelineWidth;
    }

    playhead.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    var onplayhead = false;

    function mouseDown() {
        console.log("Clicked Playhead")
        onplayhead = true;
        window.addEventListener('mousemove', moveplayhead, true);
        music.removeEventListener('timeupdate', timeUpdate, false);
      }

    function mouseUp(e) {
        if (onplayhead == true) {
          moveplayhead(e);
          window.removeEventListener('mousemove', moveplayhead, true);
          music.currentTime = duration * clickPercent(e);
          music.addEventListener('timeupdate', timeUpdate, false);
        }
        onplayhead = false;
      }

    function moveplayhead(e) {
      var newMargLeft = e.pageX - timeline.offsetLeft;
      if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
      }
      if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
      }
      if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
      }
    }


    function timeUpdate() {
      var playPercent = timelineWidth * (music.currentTime / duration);
      playhead.style.marginLeft = playPercent + "px";

      var totalSec = music.currentTime;
      var hours = parseInt( totalSec / 3600 ) % 24;
      var minutes = parseInt( totalSec / 60 ) % 60;
      var seconds = parseInt(totalSec % 60, 10);
      var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

      console.log(result);
      timeAllotted.innerHTML = result;
      if (music.currentTime == duration) {
        pButton.className = "";
        pButton.className = "play";
      }
    }


    music.addEventListener("canplaythrough", function() {
      duration = music.duration;
    }, false);




})();

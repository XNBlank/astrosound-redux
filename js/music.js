(function(){

    //Variables
    var file;
    var fs = require('fs');

    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    var thiswindow = BrowserWindow.getFocusedWindow();
    var repeat = false;
    var filename = "";
    var pauseTime;

    var music = document.getElementById('audio_player');
    var duration;
    var pButton = document.getElementById('playButton');
    var timeAllotted = document.getElementById('timeAllotted');
    var playhead = document.getElementById('playhead');
    var volumehead = document.getElementById('volumeHead');
    var volumePercent = document.getElementById('volumePercent');
    var volumeslider = document.getElementById('volumeSlider');
    var timeline = document.getElementById('timeline');
    var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
    var volumesliderHeight = volumeslider.offsetHeight - volumehead.offsetHeight;

    //Audio Management

    function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    var homeDir = getUserHome();

    function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            if(name.indexOf(".mp3") > -1 ||name.indexOf(".ogg") > -1 ||name.indexOf(".m4a") > -1 ||name.indexOf(".wav") > -1){
                files_.push(name);
            }
        }
    }
    return files_;
    }

    function loadSong(e, dir, files_) {

        }

    //console.log(getFiles(homeDir + "\\Music"));

    var dirList = getFiles(homeDir + "\\Music");
    var output = "";
    var _output = [];
    for(i = 0; i < dirList.length; i++){
        _output[i] = dirList[i].split("/").pop();
        output += "<li class='song'><a href='#'>" + _output[i] + "</li>";
    }

    document.getElementById("result").innerHTML = output;


    $(function () {
        $("#audio_file").on("change", function () {
            var files = $(this)[0].files;
            for (var i = 0; i < files.length; ++i) {
            console.log(files[i].name);
            filename = files[i].name;
            file = URL.createObjectURL(files[0]);
            audio_player.src = file;
            audio_player.currentTime = 0;
            audio_player.play();
            document.getElementById("stopButton").style.color = "";
            document.getElementById("playButton").style.color = "#16a085";
            }
        });
    });

    $(function () {
        $("#directory_input").on("change", function (e) {
            var files = $(this)[0].files;
            for (var i = 0; i < files.length; ++i) {

            console.log(files[i].path);
            }
        });
    });


    //Music UI
    document.getElementById("playButton").addEventListener("click", function (e) {
        audio_player.src = file;
        audio_player.load();
        console.log(music.currentTime);
        if((audio_player.paused == true) && (pauseTime > 0)){
            console.log("Was paused? " + audio_player.paused);
            audio_player.play();
            audio_player.currentTime = pauseTime;
            document.getElementById("stopButton").style.color = "";
            document.getElementById("playButton").style.color = "#16a085";
            pauseTime = 0;
        }else if(audio_player.paused){
            audio_player.play();
            console.log("Restart");
            document.getElementById("playButton").style.color = "#16a085";
        }

        console.log("Playing " + filename);
    });

    document.getElementById("repeatButton").addEventListener("click", function (e) {
        $('#repeatCheck').each(function () { this.checked = !this.checked; });
        if($('#repeatCheck').is(':checked')){
            repeat = true;
            console.log("Toggled Repeat on " + repeat);
            document.getElementById("repeatButton").style.color = "#16a085";
        }
        else{
            repeat = false;
            console.log("Toggled Repeat off " + repeat);
            document.getElementById("repeatButton").style.color = "";
        }
    });

    document.getElementById("volumeButton").addEventListener("click", function (e) {
        $('#volumeCheck').each(function () { this.checked = !this.checked; });
        if($('#volumeCheck').is(':checked')){
            console.log("Toggled Volume Slider");
            document.getElementById("volumeButton").style.color = "#16a085";
            document.getElementById("volumeBacking").style.display = "inline-block";
        }
        else{
            console.log("Toggled Volume Slider off " + repeat);
            document.getElementById("volumeButton").style.color = "";
            document.getElementById("volumeBacking").style.display = "none";
        }
    });


    document.getElementById("stopButton").addEventListener("click", function (e) {
        audio_player.pause();
        pauseTime = audio_player.currentTime;
        document.getElementById("stopButton").style.color = "#16a085";
        document.getElementById("playButton").style.color = "";
        console.log(pauseTime);
    });

    //Timeline


    music.addEventListener("timeupdate", timeUpdate, false);

    timeline.addEventListener("click", function(event) {
      moveplayhead(event);
      music.currentTime = duration * clickPercent(event);
      if(audio_player.paused == true){
          pauseTime = audio_player.currentTime;
      }
    }, false);

    function clickPercent(e) {
      return (e.pageX - timeline.offsetLeft) / timelineWidth;
    }
    function volumePercents(e){
        return (e.pageY - volumeslider.offsetTop) / 100;
    }

    playhead.addEventListener('mousedown', mouseDown, false);
    volumehead.addEventListener('mousedown', mouseDown_, false);
    window.addEventListener('mouseup', mouseUp, false);

    var onplayhead = false;
    var onvolumehead = false;

    function mouseDown() {
        console.log("Clicked Playhead");
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
        if (onvolumehead == true){
            movevolumehead(e);
            window.removeEventListener('mousemove', movevolumehead, true);
            console.log(music.volume);
            var _perc = volumePercents(e);
            if(_perc > 1){ _perc = 1};
            if(_perc < 0){_perc = 0};
            music.volume = _perc;

        }
        onplayhead = false;
        onvolumehead = false;
      }

    function mouseDown_() {
        console.log("Clicked VolumeHead");
        onvolumehead = true;
        window.addEventListener('mousemove', movevolumehead, true);
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

    function movevolumehead(e){
        var newMargTop = -e.pageY - volumeslider.offsetTop;
        console.log("newMargTop : " + newMargTop);
        if(newMargTop >= 0 && newMargTop <= volumesliderHeight){
            volumehead.style.marginTop = newMargTop + "px";
        }
        if (newMargTop < 0){
            volumehead.style.marginTop = "0px";
        }
        if (newMargTop > volumesliderHeight) {
          volumehead.style.marginTop = volumesliderHeight + "px";
        }

    }

    function timeUpdate() {
      var playPercent = timelineWidth * (music.currentTime / duration);
      var volPercent = volumesliderHeight * (music.volume / 80);
      playhead.style.marginLeft = playPercent + "px";
      volumehead.style.marginTop = volPercent + "px";
      volumePercent.innerHTML = Math.round(music.volume * 100) + "%";

      //console.log(playPercent);

      var totalSec = music.currentTime;
      var hours = parseInt( totalSec / 3600 ) % 24;
      var minutes = parseInt( totalSec / 60 ) % 60;
      var seconds = parseInt(totalSec % 60, 10);
      var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
      //console.log(result);
      timeAllotted.innerHTML = result;

      if(repeat == true){
          if(playPercent >= 489){
              music.currentTime = 0;
          }
      }

      if (music.currentTime == duration) {
        pButton.className = "";
        pButton.className = "play";
      }
    }


    music.addEventListener("canplaythrough", function() {
      duration = music.duration;
    }, false);




})();

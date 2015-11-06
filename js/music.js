(function(){

    //Variables
    var file;
    var fs = require('fs');
    var path_ = require("path");
    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    var thiswindow = BrowserWindow.getFocusedWindow();
    var repeat = false;
    var filename = "";
    var pauseTime;

    var music = document.getElementById('audio_player');
    var saveDirsText = document.getElementById('savedDirs');
    var duration = 0;
    var pButton = document.getElementById('playButton');
    var timeAllotted = document.getElementById('timeAllotted');
    var playhead = document.getElementById('playhead');
    var volumehead = document.getElementById('volumeHead');
    var volumePercent = document.getElementById('volumePercent');
    var volumeslider = document.getElementById('volumeSlider');
    var timeline = document.getElementById('timeline');
    var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
    var volumesliderWidth = volumeslider.offsetWidth - volumehead.offsetWidth;
    var volumeModule = document.getElementById('volumeBacking');
    console.log(volumesliderWidth + " : " + volumehead.offsetWidth);
    volumeModule.style.display = "none";
    var savedDirs = [];


    //Audio Management

    //Marquee
    $("#textwrapper").css({"display":"block"});
    var scrollwidth = $("#textwidth").width();
    $("#textwrapper").remove();

    var scrollwrapperwidth = $("#scrollwrapper").width();
    if(scrollwidth < scrollwrapperwidth) scrollwidth = scrollwrapperwidth;
    $("#scrollcontent").css({"width":scrollwidth});
    $("#firstcontent").css({"width":scrollwidth});

    var appending = scrollwrapperwidth-scrollwidth;
    var noappend = 0;

    function animatetext(rate){
      var dist = scrollwidth+parseFloat($("#scrollcontent").css("left"));
      if(!rate)rate = 1;
      var duration = Math.abs(dist/(rate/100));
      $("#scrollcontent").animate({"left":"-"+scrollwidth},{
        step: function() {
          if(parseFloat($("#scrollcontent").css("left"))< parseFloat(appending)
              && !noappend){
              noappend = 1;
              $("#scrollcontent").css({"width":scrollwidth+scrollwidth});
              $("#scrollcontent").append("<span style='float:left; text-align:left;width:"+scrollwidth+"px;'>"+$("#scrollcontent").children(":first").html()+"</span>");
          }
        },
        duration: duration,
        easing: "linear",
        complete:function(){
          $("#scrollcontent").children(":first").remove();
          $("#scrollcontent").css({"left":0});
          $("#scrollcontent").css({"width":scrollwidth});
          noappend=0;
          animatetext(6);
        }
      });
    }
    $("#scrollcontent").mouseover(function(e){
    	$("#scrollcontent").stop();
    });
    $("#scrollcontent").mouseout(function(e){
    	animatetext(6);
    });

    $(document).ready(function(){
    	animatetext(6);
    });

    //Grab the user directory
    function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    //Save that directory
    var homeDir = getUserHome();
    var saveDir = homeDir + "/.astrosound";
    var savePath = path_.join(homeDir + "/.astrosound", "settings");
    try {
    fs.readFile(savePath, 'utf8', function (err, data) {
        if (err) throw err;
            if(data === ""){

            }else {
                savedDirs = data.split(',');
                console.log("Split Directories : ");
                console.log(savedDirs);
                startApp();
            }
        });
    }
    catch(e) {
    }

    if (!fs.existsSync(saveDir)){
        fs.mkdirSync(saveDir);
    }

    if(!fs.existsSync(savePath)){
        console.log("Doesn't exist.");
        fs.writeFile(savePath, '', function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
        });
    }


    //Grab files from a directory
    function getFiles (dir, files_){
    files_ = files_ || [];
    console.log(dir);
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

    //Get Directory
    $(function () {
        $("#directory_input").on("change", function (e) {
            var files = $(this)[0].files;
            for (var i = 0; i < files.length; ++i) {
            console.log(files[i].path);
            if((savedDirs.indexOf(files[i].path) > -1)){
                console.log("Already exists!");
                alert("Duplicate Directory added.");
            } else {
                var dirList = getFiles(files[i].path);
                alert("Got path " + files[i].path);
                savedDirs.push(files[i].path);
                var saveme_ = savedDirs.toString();
                console.log(saveme_);
                fs.writeFile(savePath, saveme_, function (err) {
                  if (err) throw err;
                  console.log('It\'s saved!');
                });
                for (var i = 0; i < savedDirs.length; i++){
                    var _i = getFiles(savedDirs[i]);
                    saveDirsText = document.getElementById('savedDirs');
                    saveDirsText.value = savedDirs;
                    loadDir(_i);
                }

            }

            }
        });
    });


    $(function () {
        $("#audio_file").on("change", function () {
            var files = $(this)[0].files;
            var _name = files[0].name;
            var __dir = files[0].path;
            var _dir = __dir.split("\\" + _name);
            console.log(_name);
            console.log(_dir[0]);
            //var dirList = getFiles(_dir[0], _name);
            alert("Got song " + _dir[0] + " : " + _name);
            file = URL.createObjectURL(files[0]);
            audio_player.src = file;
            audio_player.currentTime = 0;
            audio_player.play();
            document.getElementById("stopButton").style.color = "";
            document.getElementById("playButton").style.color = "#16a085";
        });
    });


    function startApp(){
        for (var i = 0; i < savedDirs.length; i++){
                var _i = getFiles(savedDirs[i]);
                saveDirsText = document.getElementById('savedDirs');
                saveDirsText.value = savedDirs;
                loadDir(_i);
            }

        }


        //Load the music into the application
        function loadDir(dirList){
            var output = "";
            var _output = [];
            var _outputDir = [];
            var _outputDirFinal = [];
            for(var i = 0; i < dirList.length; i++){
                _output[i] = dirList[i].split("\/").pop();
                _outputDir[i] = dirList[i].split("\\").join("\\\\");
                //This is super messy and needs an alternative. For now, this is working.
                output += "<li class='song'><a href='#' onclick='var player = document.getElementById(\"audio_player\"); player.src = \"" + _outputDir[i] + "\"; player.play(); player.currentTime = 0; var x = document.getElementsByClassName(\"songTitle\"); for (var i = 0; i < x.length; i++){ x[i].innerHTML = \"" + _output[i] + "\";}'>" + _output[i] + "</li>";
            }
            //Add to the music page.
            document.getElementById("result").innerHTML += output;
        }

    document.getElementById('settingsReload').addEventListener("click", function() {
        savedDirs = saveDirsText.value;
        fs.writeFile(savePath, savedDirs, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
        });
        location.reload();
    });


    document.getElementById('audio_player').addEventListener('playing',function() {
            file = audio_player.src;

            document.getElementById("stopButton").style.color = "";
            document.getElementById("playButton").style.color = "#16a085";
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
        return (e.pageX - volumeslider.offsetLeft) / volumesliderWidth;
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

        function mouseDown_() {
          console.log("Clicked VolumeHead");
          onvolumehead = true;
          window.addEventListener('mousemove', movevolumehead, true);
        }

        function mouseUp(e) {
            if (onplayhead == true) {
                moveplayhead(e);
                window.removeEventListener('mousemove', moveplayhead, true);
            }
            if (onvolumehead == true){
                movevolumehead(e);
                window.removeEventListener('mousemove', movevolumehead, true);
                console.log(music.volume);
            }
            onplayhead = false;
            onvolumehead = false;
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
      music.currentTime = duration * clickPercent(e);
      music.addEventListener('timeupdate', timeUpdate, false);
    }

    function movevolumehead(e) {
      var newMargLeft = e.pageX - volumeslider.offsetLeft - volumesliderWidth;
      if (newMargLeft >= 0 && newMargLeft <= volumesliderWidth) {
        volumehead.style.marginLeft = newMargLeft + "px";
      }
      if (newMargLeft < 0) {
        volumehead.style.marginLeft = "0px";
      }
      if (newMargLeft > timelineWidth) {
        volumehead.style.marginLeft = volumesliderWidth + "px";
      }
      var setVol = (9 * volumePercents(e))/volumesliderWidth;
      if(setVol > 1){setVol = 1;}
      if(setVol < 0){setVol = 0;}
      music.volume = setVol;
    }


    function timeUpdate() {
      var playPercent = timelineWidth * (music.currentTime / duration);
      var volPercent = volumesliderWidth * ((music.volume / 90) * 90);
      playhead.style.marginLeft = playPercent + "px";
      volumehead.style.marginLeft = volPercent + "px";
      volumePercent.innerHTML = Math.round(music.volume * 100) + "%";
      var totalSec = music.currentTime;
      var hours = parseInt( totalSec / 3600 ) % 24;
      var minutes = parseInt( totalSec / 60 ) % 60;
      var seconds = parseInt(totalSec % 60, 10);
      var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
      timeAllotted.innerHTML = result;

      if(repeat == true){
          if(playPercent >= 489){
              music.currentTime = 0;
          }
      } else {

      }

      if (music.currentTime == duration) {
          document.getElementById("stopButton").style.color = "#16a085";
          document.getElementById("playButton").style.color = "";
      }

      music.addEventListener("canplaythrough", function() {
        duration = music.duration;
      }, false);


    }
})();

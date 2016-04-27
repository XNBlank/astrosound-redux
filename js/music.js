(function(){
    var fs = require('fs');
    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    var window = BrowserWindow.getFocusedWindow();
    window.$ = window.jQuery = require('./js/vendor/jquery.min.js');
    var jsmediatags = require("jsmediatags");

    var music = document.getElementById('audio_player');
    var paused = false;

    function loadSong(dir, files_) {
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

    function getUserHome() {
      return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }


    function computeMaxCallStackSize() {
            try {
                return 1 + computeMaxCallStackSize();
            } catch (e) {
                // Call stack overflow
                return 1;
            }
        }


    function array2base64(arr)
    {
        var arr2;
        var base64 = "";
        if(arr.length > 800){
            var arrLength = arr.length;
            console.log(arrLength);

            for(var i = 0; i < arr.length; i += 800){
                nextArr = arr.splice(i,(i+800)-1);
                console.log(i);
                if(nextArr != null){
                    //This one goes first since it has the first 15729 array chunks
                    var b1Arr = [].concat.apply([], nextArr);
                    var b1 = new Buffer(b1Arr).toString('base64');

                    if(base64 != ""){
                        base64.concat(b1);
                    } else {
                        base64 = b1;
                    }
                    console.log("This is " + i);
                    console.log(base64);
                }
            }

        }

        var bArr = [].concat.apply([], arr);
        var b = new Buffer(bArr).toString('base64');
        console.log("This is B \n" + b);

        if(base64 != ""){
            result = base64.concat(b);
        } else {
            result = b;
        }

        return b;

    }

    function getID3(file){
        jsmediatags.read(file, {
          onSuccess: function(tag) {
            console.log(tag);
            var title = tag.tags.title;
            var album = tag.tags.album;
            var artist = tag.tags.artist;
            var artArr = tag.tags.picture;
            var metadata = [title,album,artist];

            console.log(metadata);
            var stackSize = computeMaxCallStackSize();

            console.log(stackSize);

            alert("Got a song! " + "\n" + metadata[0] + "\n" + metadata[1] + "\n" + metadata[2]);

            var home = getUserHome();
            console.log(artArr.format);

            art = array2base64(artArr.data);

            fs.writeFile(("" + home + "/.astrosound/art.png"), art, 'base64', function(err) {
              //console.log(err);
            });


            console.log(art);

            $(".album_art").css("background", "url(data:" + artArr.format + ";base64," + art + ")");

            return metadata;
          },
          onError: function(error) {
            console.log(':(', error.type, error.info);
          }
        });
    }



    $(function () {
        var isDragging = false;
        $("#playback")
        .mouseup(function(){
            console.log("Clicked!");
            audio_player.currentTime = $("#playback").val();
            console.log(audio_player.currentTime);
            console.log(audio_player.currentTime);
            isDragging = false;
            audio_player.play();
            paused = false;
        })
        .mousedown(function(){
            isDragging = true;
            audio_player.pause();
            paused = true;
        })
        .mousemove(function(){
            if(isDragging){
                audio_player.currentTime = $("#playback").val();
                console.log(audio_player.currentTime);
                console.log(audio_player.currentTime);
            }
        });
    });

    audio_player.addEventListener("timeupdate", timeUpdate, false);

    $(function () {
        $("#audio_file").on("change", function () {
            var files = $(this)[0].files;
            var _name = files[0].name;
            var __dir = files[0].path;
            var songID3 = getID3(files[0]);

            var _dir = __dir.split("\\" + _name);
            console.log(_name);
            console.log(_dir[0]);
            //var dirList = getFiles(_dir[0], _name);

            file = URL.createObjectURL(files[0]);

            audio_player.src = file;
            audio_player.currentTime = 0;
            audio_player.play();

            console.log(audio_player.duration);


            $("#play_button").css("color", "#fff");
            $("#stop_button").css("color:;");

        });
    });

    $(function() {
        var isDragging = false;
        $("#volume")
        .mousedown(function(){
            isDragging = true;
        })
        .mousemove(function(){
            if(isDragging){
                var setVol = $(this).val();
                console.log(setVol / 100);
                audio_player.volume = setVol / 100;
            }
        });
    });

    function timeUpdate(){
        if(paused == false){
            $("#playback").val(audio_player.currentTime);
            $("#playback").prop("max", audio_player.duration);

            var curTime = $("#playback").val();
            $("#playback").removeClass("is-lowest-value");


            lower = (curTime / audio_player.duration * 100);
            upper = (100 - (curTime / audio_player.duration + lower));

            $("#playback mdl-slider_background-flex .mdl-slider__background-lower").css("flex", lower + " 1 0%");
            $("#playback mdl-slider_background-flex .mdl-slider__background-upper").css("flex", upper + " 1 0%");

            //console.log(audio_player.duration);
            //console.log(audio_player.currentTime);
            //console.log(curTime);
        }
    }


})();

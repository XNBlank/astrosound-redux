(function(){
    var fs = require('fs');
    var remote = require('electron').remote.app;
    var BrowserWindow = require('electron').remote.BrowserWindow;
    var window = BrowserWindow.getFocusedWindow();
    window.$ = window.jQuery = require('./js/vendor/jquery.min.js');
    var jsmediatags = require("jsmediatags");
    var JsonDB = require("node-json-db");
    var SpotifyAPI = require("spotify-web-api-node");
    var spotify = new SpotifyAPI();
    var db = new JsonDB("settings", true, false);
    var path_ = require("path");

    var home = getUserHome();
    var savePath = path_.join(home + "/.astrosound", "settings");

    var music = document.getElementById('audio_player');
    var paused;
    var repeat = false;
    var shuffle = false;
    var volumeHidden = true;
    songInfo = ({});
    songList = [];
    var savedDirs = [];

    var fullresart; //Full Resolution Album Art

//Gets HOME of users computer. Used to grab a path to save data.
    function getUserHome() {
      return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    if(!fs.existsSync(savePath)){
        console.log("Doesn't exist.");
        fs.writeFile(savePath, '', function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
        });
    }

//Tests Max Stack Size
    function computeMaxCallStackSize() {
            try {
                return 1 + computeMaxCallStackSize();
            } catch (e) {
                // Call stack overflow
                return 1;
            }
        }


        

/*
Was used to grab album art from ID3. Was too slow and failed to work 80% of the time. Possible to fix however.
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
    */



//Gets Song info and Album Art
    function getID3(file, cb){

        var metadata;

        jsmediatags.read(file, {
          onSuccess: function(tag) {
            console.log(tag);
            var title = tag.tags.title;
            var album = tag.tags.album;
            var artist = tag.tags.artist;
            var artArr = tag.tags.picture;
            metadata = [title,album,artist];

            console.log(metadata);
            cb(metadata);
            //var stackSize = computeMaxCallStackSize();

            //console.log(stackSize);

            //alert("Got a song! " + "\n" + metadata[0] + "\n" + metadata[1] + "\n" + metadata[2]);
            //searchSpotify(title,artist,album);

            $(".info-bar").html("<p>"+title + "<br>" + artist + " - " + album+"</p>");


          },
          onError: function(error) {
            console.log(':(', error.type, error.info);
            return error.info;
          }
        });

    }


function searchSpotify(title, artist, album){
    var artlink;
    var data;

    spotify.searchTracks('track:'+title+' artist:'+artist+'')
    .then(function(data) {
        console.log('Search tracks by '+artist+' in the artist name', data.body);

        try{
            artlink = data.body.tracks.items[0].album.images[1].url;
            fullresart = data.body.tracks.items[0].album.images[0].url;
            console.log(fullresart);
            console.log(artlink);
        }catch(e){
            $("#album-art").css({
                "background": "url(./img/empty.png) no-repeat center center",
                "background-size": "100%"
            });
        }


    }, function(err) {
        console.log('Something went wrong!', err);
        throw new Error("Something went badly wrong!\n" + err);
        return;
    });

    try{
        setTimeout(function() {
            $("#album-art").css({
                "background": "url("+ artlink +") no-repeat center center",
                "background-size": "100%"
            });
        }, 2500);

        setTimeout(function () {
            songInfo = ({
                "title": title,
                "artist": artist,
                "album": album
            });
            console.log(songInfo);
            songList.push(songInfo);
            //db.push(songList);
        }, 1);

    }catch(e){
        console.log(e);
    }
}

//Playback / Timeline bar
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


//Adding Directories

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
            //console.log(name);
            files_.push(name);

        }
    }
}
return files_;
}



//Get Directory
$(function () {
    $("#add_directory").on("change", function (e) {
        var files = $(this)[0].files;

        for (var i = 0; i < files.length; i++) {
            console.log(files[i].path);
            if((savedDirs.indexOf(files[i].path) > -1)){
                console.log("Already exists!");
                alert("Duplicate Directory added.");
            } else {
                var dirList = getFiles(files[i].path);
                alert("Got path " + files[i].path);
                savedDirs.push(files[i].path);
                console.log(dirList);


                for(var j = 0; j < dirList.length; j++){
                    var songID3 = getID3(dirList[j]);

                }

                setTimeout(function () {
                    console.log(songList);
                }, 350);
            }
        }

    });
});




//When adding new audio file
    $(function () {
        $("#audio_file").on("change", function () {
            var files = $(this)[0].files;
            var _name = files[0].name;
            var __dir = files[0].path;
            try{
                getID3(files[0], function(songID3){
                    console.log(songID3);
                    searchSpotify(songID3[0],songID3[2],songID3[1]);
                });
            }catch(e){
                console.log(e);
            }




            var _dir = __dir.split("\\" + _name);
            console.log(_name);
            console.log(_dir[0]);
            file = URL.createObjectURL(files[0]);
            paused = false;
            console.log(paused);
            audio_player.src = file;
            audio_player.currentTime = 0;
            audio_player.play();
        });
    });


//Volume Slider
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

                if(audio_player.volume < 0.7 && audio_player.volume > 0){
                    $("#volume_button").html("<i class='material-icons'>volume_down</i>");
                } else if(audio_player.volume >= 0.7){
                    $("#volume_button").html("<i class='material-icons'>volume_up</i>");
                } else if(audio_player.volume <= 0){
                    $("#volume_button").html("<i class='material-icons'>volume_mute</i>");
                }
            }
        });
    });



    String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
    }



    function timeUpdate(){
        if(paused == false){
            $("#playback").val(audio_player.currentTime);
            $("#playback").prop("max", audio_player.duration);

            var curTime = $("#playback").val();
            $("#playback").removeClass("is-lowest-value");

            var timeLeft = (audio_player.duration - curTime).toString();

            lower = (curTime / audio_player.duration * 100);
            upper = (100 - (curTime / audio_player.duration + lower));

            //console.log(curTime.toHHMMSS());

            $(".time-allott").html(curTime.toHHMMSS());
            $(".time-left").html(timeLeft.toHHMMSS());

            $(".mdl-slider__background-lower:first").css("flex", lower + " 1 0%");
            $(".mdl-slider__background-upper:first").css("flex", upper + " 1 0%");

            if(repeat){
                if(timeLeft <= 1){
                    audio_player.currentTime = 0;
                }
            } else {
                if(timeLeft <= 1){
                    paused = true;
                }

            }

            //console.log(audio_player.duration);
            //console.log(audio_player.currentTime);
            //console.log(curTime);
        }


        if(paused == false){
            document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon mdl-button--colored";
            document.getElementById("stop_button").className = "mdl-button mdl-js-button mdl-button--icon";
        }else{
            document.getElementById("stop_button").className = "mdl-button mdl-js-button mdl-button--icon mdl-button--colored";
            document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon";
        }
    }

//--------
//Controls
//--------


document.getElementById("play_button").addEventListener("click", function(e) {
    audio_player.play();
    paused = false;
    document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon mdl-button--colored";
    document.getElementById("stop_button").className = "mdl-button mdl-js-button mdl-button--icon";
    console.log("Play is pressed");
});

document.getElementById("stop_button").addEventListener("click", function(e) {
    audio_player.pause();
    audio_player.currentTime = 0;
    paused = true;
    document.getElementById("stop_button").className = "mdl-button mdl-js-button mdl-button--icon mdl-button--colored";
    document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon";
    console.log("Stop is pressed");
});

$(function(){
    $("#repeat_button").on("click", function(){
        if(repeat == false){
            repeat = true;
            $("#repeat_button").addClass("mdl-button--colored");
        } else {
            repeat = false;
            $("#repeat_button").removeClass("mdl-button--colored");
        }
    });
});

$(function(){
    $("#album-art").on("click", function(){
        console.log(fullresart);
        if(fullresart == null){
            $("#album-art-full").css({
                "background": "url('./img/empty.png') no-repeat center center",
                "background-size": "100%"
            });
        }else{
            $("#album-art-full").css({
                "background": "url("+ fullresart +") no-repeat center center",
                "background-size": "100%"
            });
        }


    });
});

$(function(){
    $("#volume_button").on("click", function() {
        var t;
        console.log("This works! " + volumeHidden );
        if(volumeHidden == true){
            //$("#volumebar").css("display", "inherit");
            $("#volume_button").addClass("mdl-button--colored");
            $("#volumebar").addClass("visible");
            volumeHidden = false;
            interval(function(){
                var isOpaque = $("#volumebar").css("opacity");
                console.log(isOpaque);
                if(isOpaque == 1){
                    $("#volumebar").css("display", "inherit");
                    console.log("Inherit!");

                } else if(isOpaque == 0){
                    $("#volumebar").css("display", "none");
                    console.log("None!");

                }
            },100,3);
        } else if(volumeHidden == false){
            //$("#volumebar").css("display", "none");
            $("#volume_button").removeClass("mdl-button--colored");
            $("#volumebar").removeClass("visible");
            volumeHidden = true;
            interval(function(){
                var isOpaque = $("#volumebar").css("opacity");
                console.log(isOpaque);
                if(isOpaque != 0){
                    $("#volumebar").css("display", "inherit");
                    console.log("Inherit!");

                } else if(isOpaque == 0){
                    $("#volumebar").css("display", "none");
                    console.log("None!");

                }
            },100,3);
        }


    });
});

function interval(func, wait, times){
    var interv = function(w, t){
        return function(){
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
};



})();

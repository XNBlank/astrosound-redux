(function(){
    var fs = require('fs');
    var remote = require('electron').remote.app;
    var menuRemote = require('electron').remote;
    var BrowserWindow = require('electron').remote.BrowserWindow;
    var window = BrowserWindow.getFocusedWindow();
    window.$ = window.jQuery = require('./js/vendor/jquery.min.js');
    var jsmediatags = require("jsmediatags");
    var SpotifyAPI = require("spotify-web-api-node");
    var spotify = new SpotifyAPI();
    var path_ = require("path");

    var home = getUserHome();
    var savePath = path_.join(home + "/.astrosound", "music.db");

    var music = document.getElementById('audio_player');
    var paused;
    var stopped;
    var playlists = {};
    var favourites = {};
    var repeat = false;
    var shuffle = false;
    var volumeHidden = true;
    var sort = { title : 1 };
    var sortOrd = "DEC";
    var curSong = 0;
    songInfo = ({});
    songList = [];
    var savedDirs = [];

    var fullresart; //Full Resolution Album Art

    var Datastore = require('nedb')
    , db = new Datastore({ filename: savePath, autoload: true });


    const {Menu, MenuItem} = menuRemote;

    const menu = new Menu();
    menu.append(new MenuItem({label: 'Sort by', enabled: 'false', click() { console.log('item 1 clicked'); }}));
    menu.append(new MenuItem({type: 'separator'}));
    menu.append(new MenuItem({label: 'Name', click() { sortByName() }}));
    menu.append(new MenuItem({label: 'Artist', click() { sortByArtist() }}));
    menu.append(new MenuItem({label: 'Album', click() { sortByAlbum() }}));
    menu.append(new MenuItem({label: 'Time', click() {  }}));
    menu.append(new MenuItem({label: 'Favourites', click() {  }}));

    document.getElementById("lib-head").addEventListener('contextmenu', (e) => {
      e.preventDefault();
      menu.popup(menuRemote.getCurrentWindow());
    }, false);

    function sortByName(){
      if(sortOrd == "DEC" && sort == {title : 1}) {
        sort = { title : -1 };
        sortOrd = "ASC";
      } else {
        sort = { title : 1 };
        sortOrd = "DEC";
      }
      console.log(sort);
      console.log(sortOrd);
      //$('#inner').empty();
      loadDir(db);
    }

    function sortByArtist(){
      if(sortOrd == "DEC" && sort == {artist : 1}) {
        sort = { artist : -1 };
        sortOrd = "ASC";
      } else {
        sort = { artist : 1 };
        sortOrd = "DEC";
      }
      console.log(sort);
      console.log(sortOrd);
      //$('#inner').empty();
      loadDir(db);
    }

    function sortByAlbum(){
      if(sortOrd == "DEC" && sort == {album : 1}) {
        sort = { album : -1 };
        sortOrd = "ASC";
      } else {
        sort = { album : 1 };
        sortOrd = "DEC";
      }
      console.log(sort);
      console.log(sortOrd);
      //$('#inner').empty();
      loadDir(db);
    }

//Gets HOME of users computer. Used to grab a path to save data.
    function getUserHome() {
      return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }



  window.setThumbarButtons([
  {
    tooltip: 'Previous Song',
    icon: path_.join(__dirname, '/img/prev-song.png'),
    click() { document.getElementById("last_song").click(); }
  },
  {
    tooltip: 'Play',
    icon: path_.join(__dirname, '/img/play.png'),
    click() { document.getElementById("play_button").click(); }
  },
  {
    tooltip: 'Stop',
    icon: path_.join(__dirname, '/img/stop.png'),
    click() { document.getElementById("stop_button").click(); }
  },
  {
    tooltip: 'Next Song',
    icon: path_.join(__dirname, '/img/next-song.png'),
    click() { document.getElementById("next_song").click(); }
  }
]);


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
    function getID3(file, path, cb){

        var metadata;

        jsmediatags.read(path, {

          onSuccess: function(tag) {
            //console.log(tag);
            var title = tag.tags.title;
            var album = tag.tags.album;
            var artist = tag.tags.artist;
            var artArr = tag.tags.picture;
            metadata = [title,album,artist];

            //console.log(metadata);
            songList.push(metadata);


            var songData = { title: title
                            ,artist: artist
                            ,album: album
                            ,location: escape(path)
                           };

            //console.log(songData);

            db.find({location: escape(path)}, function (err, docs) {
              if(docs.length > 0){
                //console.log("Already added this song.");
                return;
              }

              db.insert(songData, function (err, pushed) {   // Callback is optional

                if(err) console.log(err);
                //console.log(pushed);
              });
            });

            //$("#loadingMessage").html("Importing " + title + " : " + artist + " - " + album);
            cb(metadata);
            //var stackSize = computeMaxCallStackSize();

            //console.log(stackSize);

            //alert("Got a song! " + "\n" + metadata[0] + "\n" + metadata[1] + "\n" + metadata[2]);
            //searchSpotify(title,artist,album);

            $(".info-bar").html("<p>"+title + "<br>" + artist + " - " + album+"</p>");


          },
          onError: function(error) {
            console.log(':(', error.type, error.info, path + file);
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
            //console.log(fullresart);
            //console.log(artlink);
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
            //console.log(songInfo);
            songList.push(songInfo);

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
            stopped = false;
        })
        .mousedown(function(){
            isDragging = true;
            audio_player.pause();
            stopped = true;
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

    $(document).ready(function(){
    	loadDir(db);
    });


//Load the music into the application
function loadDir(database){
    var output = "";
    var songCount;
    var data;

    database.count({}, function (err, count) {
      //console.log(count);
      songCount = count;
    });

    setTimeout(function () {

      document.getElementById("library").style.display = "none";
      document.getElementById("settings").style.display = "none";
      document.getElementById("favorites").style.display = "none";
      document.getElementById("playlists").style.display = "none";
      document.getElementById("loading-screen").style.display = "initial";

      database.find({}).sort(sort).exec(function (err, docs) {
        for(var i = 0; i < songCount; i++){
          //console.log("Song No. " + i)
          //console.log(err);
          //console.log(docs[i]);
          data = docs[i];
          //console.log(data);
          //console.log(data.title);
          //console.log(data.artist);
          //console.log(data.album);
          //console.log(data.location);

          //console.log(data);

          var unescapedPath = unescape(data.location);

          function escapeHtml(unsafe) {
              return unsafe
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;");
           }

           var safePath = escapeHtml(unescapedPath).split("\\").join("\\\\");
           //console.log(safePath);
           var safeName;
           var safeArtist;
           var safeAlbum;
           var filename = safePath.substring(safePath.lastIndexOf("\\") + 1);

           if(data.title == undefined) {
             safeName = filename;
           } else {
             safeName = data.title;
           }

           if(data.artist == undefined) {
             safeArtist = "Unknown";
           } else {
             safeArtist = data.artist;
           }

           if(data.album == undefined) {
             safeAlbum = "Unknown";
           } else {
             safeAlbum = data.album;
           }

            //This is super messy and needs an alternative. For now, this is working.
            output += "\
            <tr class='song-row' id='songNo" + i + "' value='" + safePath + "'>\
              <td class='mdl-data-table__cell--non-numeric song-rowName'>" + safeName + "</td>\
              <td class='mdl-data-table__cell--non-numeric song-rowArtist'>" + safeArtist + "</td>\
              <td class='mdl-data-table__cell--non-numeric song-rowAlbum'>" + safeAlbum + "</td>\
              <td></td>\
              <td class='mdl-data-table__cell--non-numeric'><button class='mdl-button mdl-js-button mdl-button--icon'><i class='material-icons'>favorite</i></button></td>\
              <td class='mdl-data-table__cell--non-numeric'><button class='mdl-button mdl-js-button mdl-button--icon'><i class='material-icons'>playlist_add</i></button></td>\
            </tr>\
            ";
        }

        document.getElementById("library").style.display = "initial";
        document.getElementById("settings").style.display = "none";
        document.getElementById("favorites").style.display = "none";
        document.getElementById("playlists").style.display = "none";
        document.getElementById("loading-screen").style.display = "none";
        $('#inner').empty()
        //Add to the music page.
        document.getElementById("inner").innerHTML += output;
      });

    }, 500);

}



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

        if(files == null) return;

        document.getElementById("library").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("favorites").style.display = "none";
        document.getElementById("playlists").style.display = "none";
        document.getElementById("loading-screen").style.display = "initial";

        for (var i = 0; i < files.length; i++) {
            console.log(files[i].path);
            if((savedDirs.indexOf(files[i].path) > -1)){
                console.log("Already exists!");
                alert("Duplicate Directory added.");
            } else {
                var dirList = getFiles(files[i].path);
                //alert("Got path " + files[i].path);
                savedDirs.push(files[i].path);
                console.log(dirList);


                for(var j = 0; j < dirList.length; j++){
                    var __song = dirList[j].substring(dirList[j].lastIndexOf("\/") + 1);
                    var __dir = files[i].path;
                    console.log(__song);
                    console.log(files[i].path);
                    getID3( __song, __dir + "\\" + __song, function(songID3){
                      console.log(songList);
                      $("#loadingMessage").html("Importing " + songID3[0] + " : " + songID3[2] + " - " + songID3[1]);
                    });

                    console.log(j);

                }

                setTimeout(function () {
                  document.getElementById("inner").innerHTML += "";
                  loadDir(db);
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

            console.log(files);
            console.log(_name);
            console.log(__dir);
            try{
                getID3(files[0], __dir, function(songID3){
                    console.log(songID3);
                    searchSpotify(songID3[0],songID3[2],songID3[1]);
                    $('#inner').empty();
                    loadDir(db);
                });
            }catch(e){
                console.log(e);
            }

            var _dir = __dir.split("\\" + _name);
            console.log(_name);
            console.log(_dir[0]);
            file = URL.createObjectURL(files[0]);
            stopped = false;
            console.log(stopped);
            audio_player.src = file;
            audio_player.currentTime = 0;
            audio_player.play();
        });
    });

    $(function(){
      $(document).on('click', ".song-row", function() {
        console.log("Hi");
        $(".song-row").removeClass("activeSong");
        var song = $(this).attr("value");
        $(this).addClass("activeSong");
        var _curSong = $(this).attr("id");
        curSong = parseInt(_curSong.replace("songNo", ""));
        console.log(song);

        var path = song.split("\\\\").join("\\");
        var file = path.substring(path.lastIndexOf("\\") + 1);

        try{
            getID3(file, path, function(songID3){
                console.log(songID3);
                searchSpotify(songID3[0],songID3[2],songID3[1]);
            });
        }catch(e){
            console.log(e);
        }


        db.find({location: escape(path)}, function (err, docs) {
          console.log(docs[0].title);
          console.log(docs[0].artist);
          console.log(docs[0].album);
        });

        stopped = false;
        audio_player.src = song;
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
                $("#volume-level").html(setVol + "%");
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
        if(stopped == false){
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
                    //stopped = true;
                    var _cSong = $('*[id^="songNo"]');
                    var _i;
                    var i = _cSong.length-1;

                    if(shuffle == false){
                      if(curSong == i){
                          console.log("Hit the end of the list!");
                          _i = 0;
                      } else {
                          _i = curSong + 1;
                      }
                    } else {
                      var _i = Math.floor(Math.random() * (i - 0 + 1)) + 0;
                    }


                    console.log(i);
                    $("#songNo" + _i).trigger('click');

                }

            }

            //console.log(audio_player.duration);
            //console.log(audio_player.currentTime);
            //console.log(curTime);
        }


        if(stopped == false){
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
    stopped = false;
    document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon mdl-button--colored";
    document.getElementById("stop_button").className = "mdl-button mdl-js-button mdl-button--icon";
    console.log("Play is pressed");
});

document.getElementById("stop_button").addEventListener("click", function(e) {
    audio_player.pause();
    audio_player.currentTime = 0;
    stopped = true;
    document.getElementById("stop_button").className = "mdl-button mdl-js-button mdl-button--icon mdl-button--colored";
    document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon";
    console.log("Stop is pressed");
});

$(function(){
    $("#next_song").on("click", function(){
      var _cSong = $('*[id^="songNo"]');
      var _i;
      var i = _cSong.length-1;

      if(shuffle == false){
        if(curSong == i){
            console.log("Hit the end of the list!");
            _i = 0;
        } else {
            _i = curSong + 1;
        }
      } else {
        var _i = Math.floor(Math.random() * (i - 0 + 1)) + 0;
      }


      console.log(i);
      $("#songNo" + _i).trigger('click');

    });
});

$(function(){
    $("#last_song").on("click", function(){
      var _cSong = $('*[id^="songNo"]');
      var _i;
      var i = _cSong.length-1;

      if(shuffle == false){
        if(curSong == 0){
            console.log("This is the start of the list!");
            _i = i;
        } else {
            console.log("Play next song.")
            _i = curSong - 1;
        }
      } else {
        var _i = Math.floor(Math.random() * (i - 0 + 1)) + 0;
      }


      console.log(i);
      $("#songNo" + _i).trigger('click');

    });
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
    $("#shuffle_button").on("click", function(){
        if(shuffle == false){
            shuffle = true;
            $("#shuffle_button").addClass("mdl-button--colored");
        } else {
            shuffle = false;
            $("#shuffle_button").removeClass("mdl-button--colored");
        }
        console.log(shuffle);
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

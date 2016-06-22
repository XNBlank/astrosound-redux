(function () {
        var fs = require('fs');

        var remote = require('electron').remote.app;

        var BrowserWindow = require('electron').remote.BrowserWindow;
        var window = BrowserWindow.getFocusedWindow();
        window.$ = window.jQuery = require('./js/vendor/jquery.min.js');

        var library = document.getElementById("library");
        var playlists = document.getElementById('playlists');
        var faves = document.getElementById('favorites');
        var settings = document.getElementById("settings");
        var path_ = require("path");
        var home = getUserHome();
        var savePath = path_.join(home + "/.astrosound", "settings.db");

        var Datastore = require('nedb')
        , db = new Datastore({ filename: savePath, autoload: true });

        var settingsDB = {
          interface : "orange"
        }

        var UIColor = "orange";


        var loadTimer = null;

        function getUserHome() {
          return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
        }

        //Titlebar Buttons
        function init() {

        document.getElementById("libraryLink").addEventListener("click", function(e){
            library.style.display = "initial";
            settings.style.display = "none";
            faves.style.display = "none";
            playlists.style.display = "none";

            document.getElementById('title').textContent = "Library";
            document.getElementById('drawer').className = "mdl-layout__drawer";
            document.getElementById('drawer').setAttribute('aria-hidden','true');
            var x = document.getElementsByClassName("mdl-layout__obfuscator");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].className = "mdl-layout__obfuscator";
            }
        });

        document.getElementById("playlistsLink").addEventListener("click", function(e){
            library.style.display = "none";
            settings.style.display = "none";
            faves.style.display = "none";
            playlists.style.display = "initial";

            document.getElementById('title').textContent = "Playlists";
            document.getElementById('drawer').className = "mdl-layout__drawer";
            document.getElementById('drawer').setAttribute('aria-hidden','true');
            var x = document.getElementsByClassName("mdl-layout__obfuscator");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].className = "mdl-layout__obfuscator";
            }
        });

        document.getElementById("faveLink").addEventListener("click", function(e){
            library.style.display = "none";
            settings.style.display = "none";
            faves.style.display = "initial";
            playlists.style.display = "none";

            document.getElementById('title').textContent = "Favorites";
            document.getElementById('drawer').className = "mdl-layout__drawer";
            document.getElementById('drawer').setAttribute('aria-hidden','true');
            var x = document.getElementsByClassName("mdl-layout__obfuscator");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].className = "mdl-layout__obfuscator";
            }
        });

        document.getElementById("settingsLink").addEventListener("click", function(e){
            library.style.display = "none";
            settings.style.display = "initial";
            faves.style.display = "none";
            playlists.style.display = "none";

            document.getElementById('title').textContent = "Settings";
            document.getElementById('drawer').className = "mdl-layout__drawer";
            document.getElementById('drawer').setAttribute('aria-hidden','true');
            var x = document.getElementsByClassName("mdl-layout__obfuscator");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].className = "mdl-layout__obfuscator";
            }
        });


        document.getElementById("exitLink").addEventListener("click", function(e){
            console.log("close");
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });

        document.getElementById("minimize").addEventListener("click", function (e) {
            console.log("minimize");
            var window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });

        document.getElementById("maximize").addEventListener("click", function (e) {
            console.log("maximize");
            var window = BrowserWindow.getFocusedWindow();
            var isMax = window.isMaximized();
            if(isMax == true){
                window.unmaximize();
            } else {
                window.maximize();
            }

        });

        document.getElementById("close").addEventListener("click", function (e) {
            console.log("close");
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });
        };


      function updateUI(){
        switch (UIColor) {
            case "orange":
                $("#colorScheme").attr("href", "./css/material.deep_orange-red.min.css");
                $("#theme-selector").val('Orange');
            break;
            case "red":
                $("#colorScheme").attr("href", "./css/material.red-deep_orange.min.css");
                $("#theme-selector").val('Red');
            break;
            case "blue":
                $("#colorScheme").attr("href", "./css/material.blue-light_blue.min.css");
                $("#theme-selector").val('Blue');
            break;
            case "purple":
                $("#colorScheme").attr("href", "./css/material.deep_purple-purple.min.css");
                $("#theme-selector").val('Purple');
            break;
            case "green":
                $("#colorScheme").attr("href", "./css/material.green-light_green.min.css");
                $("#theme-selector").val('Green');
            break;
            case "dark":
                $("#colorScheme").attr("href", "./css/material.dark-blue.css");
                $("#theme-selector").val('Dark');
            break;
        }
      }


        $(function(){

            $("#theme-selector").on("change", function(data){
                //console.log("Test " + $(this).val());
                UIColor = ($(this).val()).toLowerCase();

                settingsDB.interface = UIColor;
                db.remove({}, { multi: true }, function(err,old){
                  db.insert(settingsDB, function(err,pushed){

                  });
                });

                console.log(UIColor);
                updateUI();
                $("label[for='theme-selector'].mdl-textfield__label").html("Theme - Saved!");

            });

            $("body").css("display","inherit");

        });

        /*
        var onSampleResized = function(e){
            var table = $(e.currentTarget); //reference to the resized table
        };

        $("#tb-library").colResizable({
            liveDrag:true,
            gripInnerHtml:"<div class='grip'></div>",
            draggingClass:"dragging",
            onResize:onSampleResized
        });
        */

        document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();

            if(loadTimer > 0){
                for(var i = loadTimer; i > 0; i--){
                    loadTimer--;
                    console.log(loadTimer);
                }
            } else if(loadTimer <= 0){
                library.style.display = "initial";
                settings.style.display = "none";
                faves.style.display = "none";
                playlists.style.display = "none";
                document.getElementById("loading-screen").style.display = "none";

                db.find({}, function(err,docs){
                  if(err) console.log(err);
                  console.log(docs);
                  if(docs.length <= 0){
                    console.log("Empty.");
                    db.insert(settingsDB, function(err, docs){
                      if(err) console.log(err);
                    });
                  } else {
                    UIColor = docs[0].interface;
                    console.log(UIColor);

                    updateUI();

                  }
                });



            }

        }
    };

})();

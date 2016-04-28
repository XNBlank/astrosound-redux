(function () {
        var fs = require('fs');

        var remote = require('remote');
        var BrowserWindow = remote.require('browser-window');
        var window = BrowserWindow.getFocusedWindow();
        window.$ = window.jQuery = require('./js/vendor/jquery.min.js');

        var library = document.getElementById("library");
        var playlists = document.getElementById('playlists');
        var faves = document.getElementById('favorites');
        var settings = document.getElementById("settings");
        var path_ = require("path");
        var home = getUserHome();
        var savePath = path_.join(home + "/.astrosound", "settings");

        var JsonDB = require("node-json-db");
        var db = new JsonDB("settings", true, false);

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

        $(function(){
            $("#col-orange").on("click", function(){
                $("#colorScheme").attr("href", "./css/material.deep_orange-red.min.css");
                UIColor = "orange";
                db.push("/settings",UIColor);

                if(!fs.existsSync(savePath)){
                    console.log("Doesn't exist.");
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                } else {
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                }
            });

            $("#col-red").on("click", function(){
                $("#colorScheme").attr("href", "./css/material.red-deep_orange.min.css");
                UIColor = "red";
                db.push("/settings",UIColor);

                if(!fs.existsSync(savePath)){
                    console.log("Doesn't exist.");
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                } else {
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                }
            });

            $("#col-blue").on("click", function(){
                $("#colorScheme").attr("href", "./css/material.blue-light_blue.min.css");
                UIColor = "blue";
                db.push("/settings",UIColor);

                if(!fs.existsSync(savePath)){
                    console.log("Doesn't exist.");
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                } else {
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                }
            });

            $("#col-purple").on("click", function(){
                $("#colorScheme").attr("href", "./css/material.deep_purple-purple.min.css");
                UIColor = "purple";
                db.push("/settings",UIColor);

                if(!fs.existsSync(savePath)){
                    console.log("Doesn't exist.");
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                } else {
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                }
            });

            $("#col-green").on("click", function(){
                $("#colorScheme").attr("href", "./css/material.green-light_green.min.css");
                UIColor = "green";
                db.push("/settings",UIColor);

                if(!fs.existsSync(savePath)){
                    console.log("Doesn't exist.");
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                } else {
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                }
            });

            $("#col-dark").on("click", function(){
                $("#colorScheme").attr("href", "./css/material.dark-blue.css");
                UIColor = "dark";
                db.push("/settings",UIColor);

                if(!fs.existsSync(savePath)){
                    console.log("Doesn't exist.");
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                } else {
                    fs.writeFile(savePath, JSON.stringify(db.data, null, 4), function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
                }
            });

            var UIColor = db.getData("/settings");

            switch (UIColor) {
                case "orange":
                    $("#colorScheme").attr("href", "./css/material.deep_orange-red.min.css");
                break;
                case "red":
                    $("#colorScheme").attr("href", "./css/material.red-deep_orange.min.css");
                break;
                case "blue":
                    $("#colorScheme").attr("href", "./css/material.blue-light_blue.min.css");
                break;
                case "purple":
                    $("#colorScheme").attr("href", "./css/material.deep_purple-purple.min.css");
                break;
                case "green":
                    $("#colorScheme").attr("href", "./css/material.green-light_green.min.css");
                break;
                case "dark":
                    $("#colorScheme").attr("href", "./css/material.dark-blue.css");
                break;
            }

            $("body").css("display","inherit");

        });

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
            }

        }
    };

})();

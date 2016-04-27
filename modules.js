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
        var nowplaying = document.getElementById("nowplaying");

        var loadTimer = null;

        //Titlebar Buttons
        function init() {

        document.getElementById("play_button").addEventListener("click", function(e) {
            if(document.getElementById("play_button").className == "mdl-button mdl-js-button mdl-button--icon"){
                document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon mdl-button--colored";
                console.log("Play is pressed");
            } else if(document.getElementById("play_button").className == "mdl-button mdl-js-button mdl-button--icon mdl-button--colored"){
                document.getElementById("play_button").className = "mdl-button mdl-js-button mdl-button--icon";
                console.log("Play is unpressed");
            }
        });

        document.getElementById("libraryLink").addEventListener("click", function(e){
            library.style.display = "initial";
            settings.style.display = "none";
            faves.style.display = "none";
            playlists.style.display = "none";
            nowplaying.style.display = "none";

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
            nowplaying.style.display = "none";

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
            nowplaying.style.display = "none";

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
            nowplaying.style.display = "none";

            document.getElementById('title').textContent = "Settings";
            document.getElementById('drawer').className = "mdl-layout__drawer";
            document.getElementById('drawer').setAttribute('aria-hidden','true');
            var x = document.getElementsByClassName("mdl-layout__obfuscator");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].className = "mdl-layout__obfuscator";
            }
        });

        document.getElementById("playingLink").addEventListener("click", function(e){
            library.style.display = "none";
            settings.style.display = "none";
            faves.style.display = "none";
            playlists.style.display = "none";
            nowplaying.style.display = "initial";

            document.getElementById('title').textContent = "Now Playing";
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

(function () {
        var fs = require('fs');


        var remote = require('remote');
        var BrowserWindow = remote.require('browser-window');
        var window = BrowserWindow.getFocusedWindow();
        window.$ = window.jQuery = require('./js/vendor/jquery.min.js');

        document.getElementById('music_link').addEventListener("click", function (e) {
            document.getElementById('page_music').style.display = "inherit";
            document.getElementById('page_playlists').style.display = "none";
            document.getElementById('page_settings').style.display = "none";
            document.getElementById('page_about').style.display = "none";
            document.getElementById('music_link_a').className = "drawer-link-selected";
            document.getElementById('playlist_link_a').className = "drawer-link";
            document.getElementById('settings_link_a').className = "drawer-link";
            document.getElementById('about_link_a').className = "drawer-link";
        });

        document.getElementById('about_link').addEventListener("click", function (e) {
            document.getElementById('page_music').style.display = "none";
            document.getElementById('page_settings').style.display = "none";
            document.getElementById('page_playlists').style.display = "none";
            document.getElementById('page_about').style.display = "inherit";
            document.getElementById('music_link_a').className = "drawer-link";
            document.getElementById('playlist_link_a').className = "drawer-link";
            document.getElementById('settings_link_a').className = "drawer-link";
            document.getElementById('about_link_a').className = "drawer-link-selected";
        });

        document.getElementById('playlist_link').addEventListener("click", function (e) {
            document.getElementById('page_music').style.display = "none";
            document.getElementById('page_settings').style.display = "none";
            document.getElementById('page_playlists').style.display = "inherit";
            document.getElementById('page_about').style.display = "none";
            document.getElementById('music_link_a').className = "drawer-link";
            document.getElementById('playlist_link_a').className = "drawer-link-selected";
            document.getElementById('settings_link_a').className = "drawer-link";
            document.getElementById('about_link_a').className = "drawer-link";
        });

        document.getElementById('settings_link').addEventListener("click", function (e) {
            document.getElementById('page_music').style.display = "none";
            document.getElementById('page_settings').style.display = "inherit";
            document.getElementById('page_playlists').style.display = "none";
            document.getElementById('page_about').style.display = "none";
            document.getElementById('music_link_a').className = "drawer-link";
            document.getElementById('playlist_link_a').className = "drawer-link";
            document.getElementById('settings_link_a').className = "drawer-link-selected";
            document.getElementById('about_link_a').className = "drawer-link";
        });


        //Titlebar Buttons
        function init() {

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
        }
    };

})();

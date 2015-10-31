(function () {

        var file;

        audio_file.onchange = function(){
            var files = this.files;
            file = URL.createObjectURL(files[0]);
        };

        document.getElementById("playButton").addEventListener("click", function (e) {
            console.log("Playing " + file);
            audio_player.src = file;
            audio_player.play();
        });

        document.getElementById("stopButton").addEventListener("click", function (e) {
            audio_player.pause();
        });

        var remote = require('remote');
        var BrowserWindow = remote.require('browser-window');
        var window = BrowserWindow.getFocusedWindow();
        window.$ = window.jQuery = require('./js/vendor/jquery.min.js');

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

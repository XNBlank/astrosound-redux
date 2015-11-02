(function(){

var fs = require('fs');
var remote = require('remote');

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

})();

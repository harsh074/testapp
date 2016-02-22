var exec = require('cordova/exec');

var Cache ={
    clear : function( success, error ){
        exec(success, error, "Cache", "clear", [])
    }
}

module.exports = Cache;

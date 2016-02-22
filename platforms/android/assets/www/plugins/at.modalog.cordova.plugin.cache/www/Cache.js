cordova.define("at.modalog.cordova.plugin.cache.Cache", function(require, exports, module) { var exec = require('cordova/exec');

var Cache ={
    clear : function( success, error ){
        exec(success, error, "Cache", "clear", [])
    }
}

module.exports = Cache;

});

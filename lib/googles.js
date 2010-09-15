(function(){
    
    var __t = Tilings;
    
    __t.GoogleSearch = function(params) {
        var that = this;
        __t.googleLoad("script","1",function(){
            that.boot(params);
        });
    };
    
    __t.GoogleSearch.prototype = {
        boot: function() {
            
        }
    };
    
})();
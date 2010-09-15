(function(){
    
    var _t = Tilings = {}; // application namespace
    
    // fire-starter, cable-jumper, battery-charger, etc.
    
    _t.boot = function(elemId) {
        //__t.APIs.loadGoogleEnvironment(); // no one cares when this loads
        $(function(){
            press = new _t.Press({ // want it global for now
                textObj: $(elemId)
            });
        });
    };
    
})();
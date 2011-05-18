var t = Tilings = {}; // application namespace

// fire-starter, cable-jumper, battery-charger, etc.

t.boot = function(elemId) {
  $(function(){
    press = new t.Press({ // want it global for now
      textObj: $(elemId)
    });
  });
};
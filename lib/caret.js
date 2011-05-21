Tilings.Caret = (function(){
  
  var keys = Tilings.utils.keys
    , press
    , focusFn
    , blurFn;
  
  function shiftTiles(to,from) {
    
  }
  
  function eastWest(key,shift) {
    var meta = (key === keys.WEST)
        ? { direction: "prev", where: "before", pos: "end" }
        : { direction: "next", where: "after", pos: "start" };
    // the adjacent letter, in whatever direction
    var adj = $("#caret")[meta.direction](".letter");
    if(adj.length !== 0) {
        adj[meta.where](cliches.caret());
        (shift === true)
          ? adj.addClass("selected")
          : $(".letter").removeClass("selected");
    }
    else {
        var before = $("#caret").closest(".tile");
        if(before[meta.direction]().length !== 0) {
            press.tileFocus(before[meta.direction](".tile"),meta.pos,shift,meta.direction);
            press.tileBlur(before);
        }
    }
  }
  
  function northSouth(key,withShift) {
    if(document.getElementById("caret") === null) {
        return;
    }
    var height = $(".tile").height(),
        parent = $("#caret").closest(".tile"),
        thatLeft = $("#caret").offset().left - 1,
        thatTop = parent.offset().top,
        letter = undefined, // the letter itself
        meta = { method: "after", which: "first", where: "start" };
        
    if(key === keys.NORTH) { // headed north
        if(parent.hasPrev() === false) {
            return;
        }
        parent.prevAll().each(function(){
            var thisOffset = $(this).offset();
            if(letter !== undefined || thisOffset.top === thatTop) {
                return;
            }
            if($(this).hasClass("carriage")) {
                thatTop = $(this).prev().offset().top + 1;
                return;
            }
            if(thatTop - thisOffset.top > height+5) {
                letter = $(this).next().find(".letter:first");
                meta.method = "before"; return;
            }
            $(this).find(".letter").reverse().each(function(){ // loop the letters
                if(letter !== undefined) { return; }
                if($(this).offset().left > thatLeft) { return; }
                letter = $(this);
            });
        });
    }
    else { // headed south
        meta = { method: "before", which: "last", where: "end" };
        if(parent.hasNext() === false) {
            return;
        }
        parent.nextAll().each(function(){
            if(letter !== undefined) {
                return;
            }
            var thisOffset = $(this).offset();
            if(thisOffset.top === thatTop) {
                return;
            }
            if($(this).hasClass("carriage")) {
                thatTop = $(this).next().offset().top - 1; // reset top benchmark
                return;
            }
            if(thisOffset.top - thatTop > height+5) {
                alert("happens");
                letter = $(this).prev().find(".letter:last");
                meta.method = "after";
                return;
            }
            $(this).find(".letter").each(function(){ // loop the letters
                if(letter !== undefined) { return; }
                if($(this).offset().left < thatLeft) { return; }
                letter = $(this);
            });
        });
    }
    
    (letter !== undefined)
        ? letter.addCaret(meta.method)
        : press.tileFocus($(".tile:"+meta.which),meta.where);
    press.tileBlur(parent);
  }
  
  function move(k,shift) {
    (k === keys.EAST || k === keys.WEST) ? eastWest(k,shift) : northSouth(k,shift);
  }
  
  function build(_press,$where,focusFn,blurFn) {
    press = _press;
  }
  
  return {
    init: build,
    move: move
  };
  
})();
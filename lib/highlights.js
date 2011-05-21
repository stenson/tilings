// functions for dealing with mouse interaction with the text itself
// for the purposes of selecting the words/letters (i.e. highlighting)
// any references to "this" are relevant since these functions are
// being attached directly to dom event listeners

Tilings.Highlights = (function(){
  
  var mousedown = null
    , start = undefined
    , selectClass = "selected"
    , startClass = "selectionStart"
    , $el = null
    , currentString = ""
    , tiles = document.getElementsByClassName("tile")
    , selectedTiles = document.getElementsByClassName(selectClass)
  
  // utility functions for general selecting and all that
  
  function lastTile() {
    return [].slice.call(tiles,-1)[0];
  }
  
  // functions and curried functions for managing selections
  
  function _s(method,className) {
    return function(tile,$tiles) {
      return ($tiles||$(tile))[method+"Class"](className);
    }
  }
  
  var select = _s("add",selectClass)
    , deselect = _s("remove",selectClass)
    , isStart = _s("has",startClass)
    , makeStart = _s("add",startClass)
    , removeStart = _s("remove",startClass);
  
  // non-anonymous functions for binding to dom events
  
  function tileMousedown() {
    $(tiles).removeClass("focus").removeClass("selectionStart");
    start = $(this).addClass("selectionStart").offset();
  }

  function tileMouseover() {
    if(mousedown === true) {
      $t = $(this);
      deselect(tiles);
      $("#caret").remove(); // GET RID OF THIS
      
      select(this);
      if(!isStart(null,$t)) {
        var direction = directionFromClickPosition($t.offset());
        select(null,$(".selectionStart"));
        select(null,$t[direction+"Until"](".selectionStart"));
      }
    }
  }
  
  function directionFromClickPosition(where) {
    start = (start === undefined) ? $(lastTile()).offset() : start;
    return (where.top < start.top) ? "next" :
             (where.top > start.top) ? "prev" :
               (where.left < start.left) ? "next"
                 : "prev";
  }
  
  function generalMousedown() {
    mousedown = true;
    $(".selected").removeClass("selected");
  }
  
  function generalMouseup() {
    mousedown = false;
    if($(".tile.selected").length < 1) {
      var start = $(".selectionStart");
      removeStart(null,start);
      deselect(null,start);
    }
    else {
      currentString = _.map($(".tile.selected"),function(el){
        return $(el).text();
      }).join(" ");
    }
  }
  
  function addListeners() {
    $el.delegate(".tile","mousedown",tileMousedown)
      .delegate(".tile","mouseover",tileMouseover)
      .mousedown(generalMousedown)
      .mouseup(generalMouseup);
  }
  
  function highlightBetween(start,end) {
    var started = false
      , ended = false
      , _start = start[0]
      , _end = end[0];
    
    for(var i = 0, l = tiles.length; i < l; i++) {
      var tile = tiles[i]
        , isBookend = (tile == _start || tile == _end);
      if(!started && isBookend) {
        started = true;
        select(tile);
      }
      else if(started && !ended) {
        select(tile);
        if(isBookend) ended = true;
      }
    }
  }
  
  return {
    init: function(_el) {
      addListeners($el = _el);
    },
    get: function() {
      return currentString;
    },
    tiles: function() {
      return tiles;
    },
    highlightBetween: highlightBetween
  };
  
})();

// functions for dealing with mouse interaction with the text itself
// for the purposes of selecting the words/letters (i.e. highlighting)
// any references to "this" are relevant since these functions are
// being attached directly to dom event listeners

Tilings.enableHighlights = (function(){
  
  var mousedown = null
    , start = undefined
    , $el = null;
  
  var tileMousedown = function() {
    $(".tile").removeClass("focus").removeClass("selectionStart");
    $(this).addClass("selectionStart");
    start = $(this).offset();
  }

  var tileMouseover = function() {
    if(mousedown === true) {
      $this = $(this);
      $(".tile").removeClass("selected");
      $("#caret").remove();
      
      // short circuit if there's nothing between
      if($this.hasClass("selectionStart")) return $this.addClass("selected");
      else $(".selectionStart").addClass("selected");
      
      // update outer-scope start variable
      start = (start === undefined) ? $(".tile:last").offset() : start
      var where = $this.offset()
        , direction = (where.top < start.top) ? "next" :
            (where.top > start.top) ? "prev" :
              (where.left < start.left) ? "next" : "prev"
        // the jquery method we'll call in a secundo
        , fn = direction + "Until";
            
      $(this).addClass("selected")
        [fn](".selectionStart").addClass("selected");
    }
  }
  
  function generalMousedown() {
    mousedown = true;
    $(".selected").removeClass("selected");
  }
  
  function generalMouseup() {
    mousedown = false;
    if($(".tile.selected").length < 1) {
      $(".selectionStart")
        .removeClass("selectionStart")
        .removeClass("selected");
    }
    else {
      var string = $(".tile.selected").map(function(){
        return $(this).text();
      }).join(" ");
    }
  }
  
  function addListeners() {
    $el.delegate(".tile","mousedown",tileMousedown)
      .delegate(".tile","mouseover",tileMouseover)
      .mousedown(generalMousedown)
      .mouseup(generalMouseup);
  }
  
  // public interface
  return function($eel) {
    $el = $eel;
    addListeners();
  };
  
})();

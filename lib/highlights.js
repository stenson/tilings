// functions for dealing with mouse interaction with the text itself
// for the purposes of selecting the words/letters (i.e. highlighting)
// any references to "this" are relevant since these functions are
// being attached directly to dom event listeners

Tilings.Highlights = (function(){
  
  var mousedown = null
    , start = undefined
    , $el = null
    , currentString = "";
  
  function tileMousedown() {
    $(".tile").removeClass("focus").removeClass("selectionStart");
    $(this).addClass("selectionStart");
    start = $(this).offset();
  }

  function tileMouseover() {
    if(mousedown === true) {
      $this = $(this);
      $(".tile").removeClass("selected");
      $("#caret").remove();
      
      if($this.hasClass("selectionStart"))
        return $this.addClass("selected");
      else
        $(".selectionStart").addClass("selected");
      
      var direction = directionFromClickPosition($this.offset());
      $this.addClass("selected")
        [direction + "Until"](".selectionStart").addClass("selected");
    }
  }
  
  function directionFromClickPosition(where) {
    start = (start === undefined) ? $(".tile:last").offset() : start
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
      $(".selectionStart")
        .removeClass("selectionStart")
        .removeClass("selected");
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
  
  function highlightBetween() {
    
  }
  
  return {
    init: function(_el) {
      addListeners($el = _el);
    },
    get: function() {
      return currentString;
    }
  };
  
})();

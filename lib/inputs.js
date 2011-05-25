Tilings.Inputs = (function(){
  
  var cliches = Tilings.Cliches
    , selection = Tilings.Selections
    , press;
  
  function _delete() {
    
  }
  
  function carriage() {
    
  }
  
  function arrow() {
    
  }
  
  function space() {
    
  }
  
  function letter(l,isPunct) {
    var el = cliches.letter(l,isPunct)
      , select = selection.current();
    if(selection.hasSelection()) {
      select.before(cliches.);
      $(select).remove();
    }
    $("#caret").before(el);
    
    /*
    var selection = $(".selected.tile");
    if(selection.length > 0) {
      var first = selection[0];
      selection.slice(1).remove(); // get rid of the rest
      $(first).find(".word").empty()
        .append(cliches.letter(l,isPunct))
        .end()
        .removeClass("selected");
      press.tileFocus($(first),"end");
    }
    else {
      $("#caret").before(cliches.letter(l,isPunct));
    }
    */
  }
  
  return {
    init: function(p) {
      press = p;
    },
    _delete: _delete,
    carriage: carriage,
    arrow: arrow,
    space: space,
    letter: letter
  };
  
})();
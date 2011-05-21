Tilings.Buffer = (function(){
  
  var buffer
    , press
    , events = { // the functions a calling function must implement
          _delete: null
        , carriage: null
        , move: null
        , insert: null
        , space: null
      }
    , keys = Tilings.utils.keys
    , regs = Tilings.utils.regs
    , noop = function(){}
    , moveCaret = Tilings.Caret.move;
  
  // two conditional-happy functions for processing characters
  // from the <input> buffer; the first looks for control characters
  // the second processes meaningful characters
  
  function processKeyDown(e) {
    var n = e.keyCode;
    (n === 8) ? press.deleteHit() :
      (n === keys.CARRIAGE) ? press.carriageReturn() :
        (n >= keys.WEST && n <= keys.SOUTH) ? moveCaret(n,e.shiftKey)
          : setTimeout(processLetter,1);
    clear();
  }
  
  function processLetter() {
    var c = buffer.val();
    (c.match(regs.letters)) ? press.insertLetter(c,false) :
      (c.match(regs.punctuation)) ? press.insertLetter(c,true) :
        (c.match(/^ $/)) ? press.spaceBreak() :
          (c.match(/^[*]{2,}$/)) ? console.log("paste!")
            : null;
  }
  
  // non-anonymous functions
  
  function clear() {
    buffer.val("");
  }
  
  function keepRefocusing() {
    setInterval(function(){ buffer.focus() },1);
  }
  
  function enableInputBuffer(_press,$el) {
    buffer = $el;
    press = _press;
    buffer
      .bind("beforecopy",noop)
      .bind("keydown",processKeyDown);
    keepRefocusing();
    Tilings.Caret.init(_press);
  }
  
  return {
    init: enableInputBuffer
  };
  
})();
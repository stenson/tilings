Tilings.Cliches = (function(){
  
    var regs = Tilings.utils.regs;
    
    // the caret (needs a total rewrite)
    
    function caret() {
      $("#caret").remove();
      return $("<span/>",{
        id: "caret"
      });
      //return $("#caret");
    }
    
    // an individual letter
    
    function letter(c,isPunct) {
      return (isPunct || c.match(regs.punctuation)) ?
        cabin("span.letter.punctuation",c) : cabin("span.letter",c);
    }
    
    // a word, comprised of letters
    
    function word(_word) {
      var fragment = document.createDocumentFragment()
        , wordSpan = cabin("span.word")
        , cs = _word.split("");
      for(var i = 0, l = cs.length; i < l; i++) {
        fragment.appendChild(letter(cs[i]));
      }
      wordSpan.appendChild(fragment);
      return wordSpan;
    }
    
    // a tile, contains a word (mainly a formatting thing)
    
    function tile(_word) {
      return (_word.match(regs.carriage))
        ? cabin("div.carriage.format.tile")
        : cabin("div.tile",word(_word));
    }
    
    // return the public interface
    
    return {
      caret: caret,
      letter: letter,
      word: word,
      tile: tile
    };
    
})();
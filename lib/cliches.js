Tilings.cliches = (function(){
  
    var regs = Tilings.utils.regs;
    
    // the caret (needs a total rewrite)
    
    function caret() {
      $("#caret").remove();
      return $("<span/>",{
        id: "caret"
      });
    }
    
    // an individual letter
    
    function letter(c,isPunct) {
      return (isPunct || c.match(regs.punctuation)) ?
        cabin("span.letter.punctuation",c) : cabin("span.letter",c);
    }
    
    // a word, comprised of letters
    
    function word(_word) {
      console.log(_word);
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
    
    // // common objects for editor manipulation
    // 
    // _t.cliches = {
    //     // caret
    //     caret: function() {
    //         $("#caret").remove();
    //         return $("<span/>",{
    //             id: "caret"
    //         });
    //     },
    //     letter: function(_letter,isPunctuation) {
    //         var letter = $("<span>",{
    //             "class": "letter",
    //             html: _letter
    //         });
    //         if(isPunctuation === true || _letter.match(utils.regs.punctuation)) {
    //             letter.addClass("punctuation");
    //         }
    //         return letter;
    //     },
    //     word: function(_word) {
    //       var fragment = document.createDocumentFragment()
    //         , letters = _word.split("");
    //       for(var i = 0, l = letters.length; i < l; i++) {
    //         fragment.append()
    //       }
    //       // var word = $("<span/>",{
    //       //     "class": "word"
    //       // });
    //       // // now add all the letters to the word
    //       // var length = _word.length;
    //       // for(var i = 0; i < length; i += 1) {
    //       //     word.append(this.letter(_word[i]));
    //       // }
    //       // return word;
    //     },
    //     tile: function(_word) {
    //         if(_word.match(utils.regs.carriage)) {
    //             return $("<div/>",{
    //                 "class": "carriage format tile"
    //             });
    //         }
    //         return $("<div/>",{
    //             "class": "tile",
    //             data: {
    //                 stack: (_word === "") ? "" : _word+"|"
    //             },
    //             html: this.word(_word)
    //         });
    //     },
    //     history: function(tile) { // should be moved somewhere else
    //         var offset = tile.offset(),
    //             history = tile.data("stack").slice(0,-1).split("|").reverse();
    //     }
    //};
    
})();
(function(){
    
    var _t = Tilings,
        utils = _t.utils;
    
    // common objects for editor manipulation
    
    _t.cliches = {
        // caret
        caret: function() {
            $("#caret").remove();
            return $("<span/>",{
                id: "caret"
            });
        },
        letter: function(_letter,isPunctuation) {
            var letter = $("<span>",{
                "class": "letter",
                html: _letter
            });
            if(isPunctuation === true || _letter.match(utils.regs.punctuation)) {
                letter.addClass("punctuation");
            }
            return letter;
        },
        word: function(_word) {
            var word = $("<span/>",{
                "class": "word"
            });
            // now add all the letters to the word
            var length = _word.length;
            for(var i = 0; i < length; i += 1) {
                word.append(this.letter(_word[i]));
            }
            return word;
        },
        tile: function(_word) {
            if(_word.match(utils.regs.carriage)) {
                return $("<div/>",{
                    "class": "carriage format tile"
                });
            }
            return $("<div/>",{
                "class": "tile",
                data: {
                    stack: (_word === "") ? "" : _word+"|"
                },
                html: this.word(_word)
            });
        },
        history: function(tile) { // should be moved somewhere else
            var offset = tile.offset(),
                history = tile.data("stack").slice(0,-1).split("|").reverse();
        }
    };
    
})();
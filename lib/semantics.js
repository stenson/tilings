(function(){
    
    var _t = Tilings;
    
    _t.semantics = { }; // namespace
    
    /* a word (no spaces) */
    
    _t.semantics.Word = function(word,params) {
        this.boot(word,params);
    };
    
    _t.semantics.Word.prototype = {
        boot: function(word,params) {
            this.word = word;
            this.params = params;
        }
    };
    
    /* a phrase (spaces) */
    
    _t.semantics.Phrase = function(phrase,params) {
        this.boot(phrase,params);
    };
    
    _t.semantics.Phrase.prototype = {
        boot: function(phrase,params) {
            this.phrase = phrase;
            this.params = params;
        }
    };
    
})();
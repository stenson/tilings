// cheat!
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

(function(){
    
    var _t = Tilings;
    
    _t.log = function(string) {
        try { console.log(string); }
        catch(e) { }
    };
    
    _t.utils = {
        regs: { // common regular expressions
          letters: /^[\w]{1}$/,
          punctuation: /^[-)(,.?'"!:;\/]{1}$/,
          whitespace: /^[\s\n\t]+$/,
          carriage: /^[\n]+$/
        },
        keys: {
          NORTH: 38,
          SOUTH: 40,
          EAST: 39,
          WEST: 37,
          CARRIAGE: 13
        }
    };
    
    // niceity
    
    $.fn.addCaret = function(where) { // questionable
        $(".tile").removeClass("focus");
        $(this).closest(".tile").addClass("focus");
        $(this)[where](_t.cliches.caret());
    };
    
    // jquery utility functions
    
    $.fn.reverse = function() {
        return this.pushStack(this.get().reverse(), arguments);
    };
    
    $.fn.hasNext = function(selector) {
        return $(this).next(selector).length !== 0;
    };
    
    $.fn.hasPrev = function(selector) {
        return $(this).prev(selector).length !== 0;
    };
    
})();
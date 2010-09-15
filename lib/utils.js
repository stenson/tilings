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
        jumpRope: function(callback) { // simplified async (1-second)
            setTimeout(function(){ // callback function, good for text
                callback(); // manipulation
            },1);
        },
        regs: { // common regular expressions
            letters: /^[\w]{1}$/,
            punctuation: /^[-)(,.?'"!:;\/]{1}$/,
            whitespace: /^[\s\n\t]+$/,
            carriage: /^[\n]+$/
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
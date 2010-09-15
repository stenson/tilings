/*
    jquery functions to add
    -> jump function (happens on a 1 second delay)
    hasNext(selector)
*/

// cheat!
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

(function($,undefined){

    /* main function (jQuery) */

    $.fn.tile = function() {
        var words = $(this).text().split(/ /),
            length = words.length;
        $(this).empty();
        for(var i = 0; i < length; i += 1) {
            $(this).append(Tilings.tile(words[i]));
        }
    };

    var Tilings = {
        tile: function(_word) {
            return $("<span/>",{
                "class": "tile",
                text: _word
            });
        },
        word: function(_word) {
            
        },
        punct: function() {
            
        }
    };
    
})(jQuery);
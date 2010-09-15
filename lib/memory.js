(function(){
    
    // TODO add speed intervals in here somehow?
    
    var _t = Tilings;
    
    _t.memory = { };
    
    var memories = ["#"], // bottom of stack symbol
        position = 1;
    
    _t.memory.remember = function(html) {
        memories[position] = html;
        delete memories[position+1];
        position += 1;
    };
    
    _t.memory.recall = function() {
        if(position === 0) {
            return false;
        }
        else {
            position -= 1;
            return memories[position+1];
        }
    };
    
    _t.memory.restore = function() {
        if(memories[position] === undefined) {
            return false;
        }
        else {
            position += 1;
            return memories[position-1];
        }
    };
    
})();
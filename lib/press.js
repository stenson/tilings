
  var keys = {
        NORTH: 38,
        SOUTH: 40,
        EAST: 39,
        WEST: 37,
        CARRIAGE: 13
      }
    , cliches = t.cliches
    , utils = t.utils
    , buffer = null;
  
  // two conditional-happy functions for processing characters
  // from the <input> buffer; the first looks for control characters
  // the second processes meaningful characters
  
  function processKeyDown(o,e) {
    var n = e.keyCode;
    (n === 8) ? o.deleteHit() :
      (n === keys.CARRIAGE) ? o.carriageReturn() :
        (n >= keys.WEST && n <= keys.SOUTH) ? o.moveCaret(n,e.shiftKey)
          : processLetter(o,e);
  }
  
  function processLetter(o,event) {
    buffer.val("");
    setTimeout(function(){
      var c = buffer.val()
        , regs = utils.regs;
      (c.match(regs.letters)) ? o.insertLetter(c,false) :
        (c.match(regs.punctuation)) ? o.insertLetter(c,true) :
          (c.match(/^ $/)) ? o.spaceBreak() :
            (c.match(/^[*]{2,}$/)) ? console.log("paste!")
              : null;
    },0);
  }
  
  // these are functions for turning unset text into appropriate
  // spans and breaks and all that jazz
  
  function enableInputBuffer() {
    buffer = $("#buffer");
    // should be a better way to do this...
    setInterval(function(){ buffer.focus() },300);
    return buffer;
  }
  
  function setPlainText($el) {
    var el = $el[0]
      , words = $el.text().replace(/^[\n\t\r]+/,"").split(/ /)
      , fragment = document.createDocumentFragment();
    // clear the existing stuff
    el.innerHTML = "";
    // build the fragment
    for(var i = 0, l = words.length; i < l; i++) {
      var w = words[i];
      if(w) fragment.appendChild(t.cliches.tile(w));
    }
    el.appendChild(fragment);
  }
  
  t.Press = function(params) {
    this.boot(params);
  };
  
  t.Press.prototype = {
      
    boot: function(params) {
      this.text = params.textObj;
      this.prepareText() // make the necessary html
          .bufferListen() // listen to the text buffer
          .letterListen(); // and now we're ready
      
      Tilings.enableHighlights(this.text);
    },
      
    prepareText: function() {
      this.buffer = enableInputBuffer();
      setPlainText(this.text);
      return this;
    },
      
    bufferListen: function() {
      this.buffer
        .bind("beforecopy",function(){}) // opportunity to inject something
        .bind("keydown",_.bind(processKeyDown,null,this));
      return this;
    },
    
    letterListen: function() {
      var that = this;
      
      this.text.delegate(".letter","click",function(e){
        var $t = $(this)
          , over = e.pageX - $t.offset().left
          , pos = $t.prevAll(".letter").length;
          
        if(over > $t.width()/2) pos += 1;
        that.tileFocus($t.closest(".tile"), pos, e.shiftKey);
      });
      
      return this;
    },
      
      insertLetter: function(letter,isPunctuation) {
          if($(".selected.tile").length !== 0) {
              //this.deleteHit();
              var selection = $(".selected.tile"),
                  first = selection[0],
                  rest = selection.slice(1);
              rest.remove();
              $(first).find(".word").empty()
                  .append(cliches.letter(letter,isPunctuation))
                  .end()
                  .removeClass("selected");
              this.tileFocus($(first),"end");
          }
          else {
              $("#caret").before(cliches.letter(letter,isPunctuation));
          }
          this.historicize($("#caret").closest(".tile"));
      },
      
      historicize: function(tile) {
          clearTimeout(tile.data("waiter"));
          tile.data("waiter",setTimeout(function(){
              var stack = tile.data("stack") || "";
              tile.data("stack",stack+tile.text()+"|");
          },1250));
      },
      
      // moving the caret around in the text
      moveCaret: function(key,withShift) {
          if(key === keys.EAST || key === keys.WEST) {
              var meta = (key === keys.WEST) // a concise conditional, no?
                  ? { direction: "prev", where: "before", pos: "end" }
                  : { direction: "next", where: "after", pos: "start" };
              // the adjacent letter, in whatever direction
              var adj = $("#caret")[meta.direction](".letter");
              if(adj.length !== 0) {
                  adj[meta.where](cliches.caret());
                  if(withShift === true) {
                      adj.addClass("selected");
                  }
                  else {
                      $(".letter").removeClass("selected");
                  }
              }
              else {
                  var before = $("#caret").closest(".tile");
                  if(before[meta.direction]().length !== 0) {
                      this.tileFocus(
                          before[meta.direction](".tile"),
                          meta.pos,withShift,meta.direction);
                      this.tileBlur(before);
                  }
              }
          }
          else { // up and down
              if(document.getElementById("caret") === null) {
                  return;
              }
              var height = $(".tile").height(),
                  parent = $("#caret").closest(".tile"),
                  thatLeft = $("#caret").offset().left - 1,
                  thatTop = parent.offset().top,
                  letter = undefined, // the letter itself
                  meta = { method: "after", which: "first", where: "start" };
                  
              if(key === keys.NORTH) { // headed north
                  if(parent.hasPrev() === false) {
                      return;
                  }
                  parent.prevAll().each(function(){
                      var thisOffset = $(this).offset();
                      if(letter !== undefined || thisOffset.top === thatTop) {
                          return;
                      }
                      if($(this).hasClass("carriage")) {
                          thatTop = $(this).prev().offset().top + 1;
                          return;
                      }
                      if(thatTop - thisOffset.top > height+5) {
                          letter = $(this).next().find(".letter:first");
                          meta.method = "before"; return;
                      }
                      $(this).find(".letter").reverse().each(function(){ // loop the letters
                          if(letter !== undefined) { return; }
                          if($(this).offset().left > thatLeft) { return; }
                          letter = $(this);
                      });
                  });
              }
              else { // headed south
                  meta = { method: "before", which: "last", where: "end" };
                  if(parent.hasNext() === false) {
                      return;
                  }
                  parent.nextAll().each(function(){
                      if(letter !== undefined) {
                          return;
                      }
                      var thisOffset = $(this).offset();
                      if(thisOffset.top === thatTop) {
                          return;
                      }
                      if($(this).hasClass("carriage")) {
                          thatTop = $(this).next().offset().top - 1; // reset top benchmark
                          return;
                      }
                      if(thisOffset.top - thatTop > height+5) {
                          alert("happens");
                          letter = $(this).prev().find(".letter:last");
                          meta.method = "after";
                          return;
                      }
                      $(this).find(".letter").each(function(){ // loop the letters
                          if(letter !== undefined) { return; }
                          if($(this).offset().left < thatLeft) { return; }
                          letter = $(this);
                      });
                  });
              }
              // and now position the caret
              (letter !== undefined) // I find this syntax appealing
                  ? letter.addCaret(meta.method)
                  : this.tileFocus(this.text.find(".tile:"+meta.which),meta.where);
              this.tileBlur(parent);
          }
      },
      carriageReturn: function() {
          var caret = $("#caret"),
              secondWord = "",
              closest = caret.closest(".tile");
          if(closest.text() === "" && closest.prev().hasClass("carriage")) {
              return;
          }
          if(caret.hasNext() === false && caret.hasPrev() === false) {
              caret.closest(".tile").before(cliches.tile("\n"));
              return;
          }
          if(caret.hasNext() === true) {
              caret.nextAll().each(function(){
                  secondWord += $(this).text();
                  $(this).remove();
              });
          }
          var carriage = cliches.tile("\n");
          var newWord = cliches.tile(secondWord);
          $("#caret").closest(".tile").after(carriage);
          carriage.after(newWord);
          this.tileFocus(newWord,"start");
          this.cleanUp();
      },
      spaceBreak: function() {
          var secondWord = "";
          var caret = $("#caret");
          caret.nextAll(".letter").each(function(){
              secondWord += $(this).text();
              $(this).remove();
          });
          var newTile = cliches.tile(secondWord);
          var parent = caret.closest(".tile");
          if(caret.hasPrev() === false) {
              if(secondWord === "") {
                  return;
              }
              else {
                  parent.after(newTile);
              }
          }
          else {
              parent.after(newTile);
              this.tileFocus(newTile,"start");
              this.tileBlur(parent); // blur the old one (necessary?)
          }
          // couldn't tileFocus just blur whatever had ".focus" before?
      },
      deleteHit: function() {
          var caret = $("#caret"),
              selectedTiles = $(".tile.selected"),
              selectedLetters = $(".letter.selected"),
              prev = caret.prev(".letter");
          if(selectedTiles.length !== 0) {
              selectedTiles.slice(1).remove()
                  .end().removeClass("selected")
                  .find(".word").empty().append(cliches.caret());
          }
          else if(selectedLetters.length !== 0) {
              var candidate = $(selectedLetters[0]),
                  tile = candidate.closest(".tile");
              if(tile.find(".letter").length === tile.find(".selected").length) {
                  this.tileFocus(tile.prev(),"end",false,"prev");
              }
              else if(tile.find(".letter").length > 1) {
                  candidate.addcaret("before");
              }
              else {
                  this.tileFocus(tile.prev(),"end",false,"prev");
              }
              selectedLetters.remove();
              this.cleanUp();
          }
          else if(prev.length !== 0) {
              this.historicize(caret.closest(".tile"));
              prev.remove();
          }
          else {
              var parent = caret.closest(".tile"),
                  letters = caret.nextAll(".letter"),
                  attachTo = parent.prev(".tile");
              if(parent.hasPrev() === false) {
                  return;
              }
              if(attachTo.hasClass("format")) {
                  attachTo.remove();
                  attachTo = parent.prev();
              }
              this.tileFocus(attachTo,"end");
              letters.each(function(){
                  attachTo.find(".word").append($(this));
              });
              parent.remove();
          }
          if(this.text.find(".tile").length === 0) {
              this.tileFocus(
                  this.text.append(cliches.tile(""))
                  .find(".tile"),"start");
          }
      },
      cleanUp: function() {
          var that = this;
          $(".tile").each(function(){
              if($(this).hasClass("format") === false) {
                  that.tileBlur($(this));
              }
          });
      },
      tileBlur: function(tile) {
          if(tile.text() === "" && tile.find("#caret").length === 0) {
              if(tile.prev().hasClass("carriage")) {
                  tile.prev().remove();
              }
              tile.remove();
          }
          if(tile.text() === "--") {
              tile.find(".word").empty().append(cliches.letter("&mdash;"));
              return;
          }
          tile.find(".letter").each(function(){
              if($(this).text() == "\"") {
                  if($(this).hasPrev() === false) {
                      $(this).html("&ldquo;");
                      return;
                  }
                  if($(this).hasNext() === false) {
                      $(this).html("&rdquo;");
                      return;
                  }
              }
          });
      },
      tileFocus: function(tile,at,withShift,direction) {
          if(tile.hasClass("carriage")) {
              this.tileFocus(tile[direction](),at,withShift);
              return;
          }
          if(withShift === true) {
              this.highlightTilesBetween(tile,$("#caret").closest(".tile"));
              return;
          }
          //this.tileBlur($(".tile.focus"));
          $(".tile").removeClass("focus");
          tile.addClass("focus");
          if(at === "start" || at === "end") {
              var action = "append";
              if(at === "start") {
                  action = "prepend";
              }
              tile.find(".word")[action](cliches.caret());
          }
          else {
              var tryLetter = $(tile.find(".letter")[at]);
              if(tryLetter.length !== 0) {
                  tryLetter.before(cliches.caret());
              }
              else {
                  tile.find(".letter:last").before(cliches.caret());
              }
          }
      },
      highlightTilesBetween: function(startTile,endTile) {
          var started = false,
              ended = false;
          $(".tile").each(function(){
              var isBookend = ($(this)[0] == startTile[0] || $(this)[0] == endTile[0]);
              if(started === false && isBookend === true) {
                  started = true;
                  $(this).addClass("selected");
                  return;
              }
              else if(started === true && ended === false) {
                  $(this).addClass("selected");
                  if(isBookend === true) {
                      ended = true;
                  }
              }
              else {
                  $(this).removeClass("selected");
              }
              return;
          });
      }
  };
  
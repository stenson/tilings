
  var keys = Tilings.utils.keys
    , cliches = Tilings.Cliches
    , press = null // a temporary reference to the created press object
    , tiles = document.getElementsByClassName("tile");
  // non-anonymous functions to be bound variously

  function processLetterClick(e) {
    var $t = $(this)
      , over = e.pageX - $t.offset().left
      , pos = $t.prevAll(".letter").length;
    if(over > $t.width()/2)
      pos += 1;
    press.tileFocus($t.closest(".tile"), pos, e.shiftKey);
  }
  
  function insertLetter(letter,isPunct) {
    var selection = $(".selected.tile");
    if(selection.length > 0) {
      var first = selection[0];
      selection.slice(1).remove(); // get rid of the rest
      $(first).find(".word").empty()
        .append(cliches.letter(letter,isPunct))
        .end()
        .removeClass("selected");
      press.tileFocus($(first),"end");
    }
    else {
      $("#caret").before(cliches.letter(letter,isPunct));
    }
  }
  
  function carriageReturn() {
    var caret = $("#caret")
      , _caret = caret[0]
      , tile = caret.closest(".tile")
      , secondWord = "";
    // what happens if you hit enter twice?? (nothing, right?)
    if(_caret.nextSibling) {
      secondWord = _.map(caret.nextAll(),function(el){
        var $el = $(el)
          , text = $el.text();
        return $el.remove(), text;
      }).join("");
    }
    var carriage = cliches.tile("\n")
      , newWord = cliches.tile(secondWord);
    caret.closest(".tile").after(carriage);
    $(carriage).after(newWord);
    press.tileFocus(newWord,"start");
    press.cleanup();
  }
  
  function deleteHit() {
    
  }
  
  function cleanup() {
    _.each(tiles,function(tile){
      if(tile.className.match(/format/) == null) {
        press.tileBlur($(tile));
      }
    });
  }
  
  function tileFocus(tile) {
    
  }
  
  function tileBlur(tile) {
    var text = tile.text();
    if(text === "" && tile.find("#caret").length === 0) {
        return tile.remove();
    }
    if(text === "--") {
        return tile.find(".word").empty().append(cliches.letter("&mdash;"));
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
  }
  
  function setPlainText($el) {
    var el = $el[0]
      , words = $el.text().replace(/^[\n\t\r]+/,"").split(/ /)
      , fragment = document.createDocumentFragment();
    el.innerHTML = "";
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
      press = this; // so...... this isn't object oriented anymore
      this.text = params.textObj;
      this.text.delegate(".letter","click",processLetterClick);
      
      Tilings.Inputs.init(this);
      Tilings.Buffer.init(this,$("#buffer"));
      setPlainText(this.text);
      Tilings.Highlights.init(this.text,this);
    },
    
    insertLetter: insertLetter,
    carriageReturn: carriageReturn,
      
      
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
              this.cleanup();
          }
          else if(prev.length !== 0) {
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
      
      cleanup: cleanup,
      
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
          if($(tile).hasClass("carriage")) {
              this.tileFocus(tile[direction](),at,withShift);
              return;
          }
          if(withShift === true) {
              this.highlightTilesBetween(tile,$("#caret").closest(".tile"));
              return;
          }
          //this.tileBlur($(".tile.focus"));
          $(".tile").removeClass("focus");
          $(tile).addClass("focus");
          if(at === "start" || at === "end") {
              var action = "append";
              if(at === "start") {
                  action = "prepend";
              }
              $(tile).find(".word")[action](cliches.caret());
          }
          else {
              var tryLetter = $(tile.find(".letter")[at]);
              if(tryLetter.length !== 0) {
                  tryLetter.before(cliches.caret());
              }
              else {
                  $(tile).find(".letter:last").before(cliches.caret());
              }
          }
      },
      
      highlightTilesBetween: Tilings.Highlights.highlightBetween
  };
  
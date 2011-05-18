(function(){
    
    var __t = Tilings;
    
    __t.apis = {
        googles: [ // iterable lists of libraries we want to load off the bat
            ["search","1",{nocss:1}]
        ],
        loadGoogleEnvironment: function() {
            for( var i = 0; i < this.googles.length; i += 1 ) {
                google.load.apply(this,this.googles[i]);
            }
        }
    };
    
    /*
    var searcher = new google.search.WebSearch();
    searcher.execute('"'+string+'"');
    var page = 2;
    console.log("\n\n\n");
	searcher.setSearchCompleteCallback(this,function(){
	    var length = searcher.results.length;
	    for(var i = 0; i < length; i += 1) {
	        console.log(searcher.results[i].content);
	    }
	    searcher.gotoPage(page);
	    page += 1;
	},null);
	*/
    // and make the words move-able here
    
})();
(function ( $ ){
	$.slideBrowser = function(dom, onUpdate){
		var that = this;
		$.get({listFolders:1}, function (err, folders){
			if ( err ){
				console.log("Could not fetch folders...");
				return;
			}
			$(that).data(folders);
			
			for(var i in folders){
				var folder = folders[i];
				var domFolder = $("<div>")
				domFolder.addClass("folder");
				for ( var j in folder.slides ){
					var slide = folder.slides[j];
				}
			}
		})
	}
})( jQuery );
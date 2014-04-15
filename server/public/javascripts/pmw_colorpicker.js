(function ( $ ){
	'use strict';
	$.fn.pmwColorPicker = function ( options ){
		var settings = $.extend({
			palette: ["FFFFFF", "CCCCCC","888888","000000","FF0000","00FF00","0000FF",
						"FCE94F","F57900","964B00","008800","94c13c", "07ace2", "e5287b", 
						"75507B", "113F8C", "01A4A4", "61AE24", "D0D102", "32742C", "E54028",
						"b2e7cb","01b053","bfe2fe","27262f"
						],
			element: null,
			callback: function ( color ){
				return;
			}	
		}, options);
		
		this.find(".color-palette").empty();
		
		for(var i in settings.palette){
			var newBox = $("<div>");
			newBox.addClass("color-palette-color-box");
			if ( this.find(".color-box").css('background-color') == '#'+settings.palette[i] ){
				newBox.addClass("selected");
			}
			newBox.css('background-color','#'+settings.palette[i]);
			newBox.data({callback:settings.callback,parent:this,color:settings.palette[i]});
			newBox.click(function (){
				$(this).data("parent").find(".color-palette-color-box").each(function (){
					$(this).removeClass("selected");
				});
				$(this).addClass("selected");
				$(this).data("callback")($(this).data("color"));
			})
			this.find(".color-palette").append(newBox);
		}
	};
}( jQuery ));
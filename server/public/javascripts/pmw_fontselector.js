(function ( $ ){
	'use strict';
	$.fn.pmwFontSelector = function ( options ){
		var settings = $.extend({
			fonts: ["AvantGuarde","Sansation","Unzialish","Champagne"],
			element: null,
			callback: function ( font ){
				return;
			}	
		}, options);
		
		this.find(".fonts-list").empty();
		
		for(var i in settings.fonts){
			var newFont = $("<li>");
			newFont.attr("role","presentation");
			var newFontLink = $("<a>");
			newFont.append(newFontLink);
			newFontLink.attr("role","menuitem")
			newFont.addClass("font-selector-font");
			if ( this.find(".font-box").css('font-family') == settings.fonts[i] ){
				newFont.addClass("selected");
			}
			newFontLink.css('font-family',settings.fonts[i]);
			newFontLink.html(settings.fonts[i]);
			newFont.data({callback:settings.callback,parent:this,font:settings.fonts[i]});
			newFont.click(function (){
				$(this).data("parent").find(".fonts-list-font").each(function (){
					$(this).removeClass("selected");
				});
				$(this).addClass("selected");
				$(this).data("callback")($(this).data("font"));
			})
			this.find(".fonts-list").append(newFont);
		}
	};
}( jQuery ));
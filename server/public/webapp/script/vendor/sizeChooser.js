!function(a){"use strict";a.fn.sizeChooser=function(b){return this.each(function(){var c=a("<div>");c.addClass("btn-group"),c.addClass("dropup");var d=a("<button>");d.attr("type","button"),d.attr("data-toggle","dropdown"),d.addClass("btn btn-default dropdown-toggle"),c.append(d);var e=a("<div>");e.addClass("size-chooser-preview"),d.append(e);var f=a("<span>");f.addClass("caret"),d.append(f),a(this).css("display","none"),a(this).parent().append(c);var g=a("<ul>");g.addClass("dropdown-menu"),c.append(g);var h=a(this).find("select");a(h).find("option").each(function(){var c=a("<li>");c.attr("role","presentation");var d=a("<a>");d.addClass("size-chooser-dot"),d.css("width",a(this).attr("value")+"px"),d.css("height",a(this).attr("value")+"px"),c.append(d),g.append(c);var f=this;a(c).click(function(){console.log(a(f).attr("value")),a(h).val(a(f).attr("value")),e.css("width",a(f).attr("value")),e.css("height",a(f).attr("value")),b()})})})}}(jQuery);
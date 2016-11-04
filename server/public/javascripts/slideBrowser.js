(function ( $ ){
    $.fn.slideBrowser = function(showActions,size,onUpdate,additionalClasses){
        $(this).empty();
        var that = this;
        $.getJSON('/slide',{listFolders:1}, function (folders){
            folders = folders.sort(function (a,b){return (a.name.toLowerCase() > b.name.toLowerCase())?1:-1;});
            $(that).data(folders);
            
            for(var i = 0; i < folders.length; i++ ){
                var folder = folders[i];
                var domFolder = $("<div>")
                domFolder.addClass("folder");
                
                var domFolderName = $("<h3>").addClass("folderName")
                
                var domFolderButton = $('<a>');
                domFolderButton.data("folder",folders[i])
                domFolderButton.data("expanded",false);
                domFolderButton.data("folderDom",domFolder);
                domFolderButton.addClass("groupButton btn btn-default btn-sm")
                
                domFolderButton.droppable({
                    accept: '.thumbnail.slide',
                    hoverClass: 'folderHover',
                    drop: function (event, ui){
                        $(ui.draggable).parent().hide();
                        $.get("/", {slideInFolder:1,slide:$(ui.draggable).attr("slide-id"),folder:$(this).data("folder")._id});
                    }
                });
                
                domFolderButton.html('<span class="right-caret"></span> <span class="glyphicon glyphicon-folder-close"></span>&nbsp;&nbsp;' + folder.name);
                
                domFolderName.prepend(domFolderButton)
                
                $(that).append(domFolderName);
                $(that).append(domFolder)
                
                domFolderButton.click(function (){
                    if ( $(this).data("expanded") == false ){
                        var slides = $(this).data("folder").slides;
                        for ( var j = 0; j < slides.length; j++ ){                          
                            if ( j % (12/size) == 0 && j != 0 ){
                                folder.append($('<div class="row">'));
                            }
                            
                            var slide = slides[j];
                            
                            var wrapper = $("<div>").addClass("col-xs-"+size*2+" col-sm-"+size*2+" col-md-"+size);
                        
                            
                            var thumbnail = $("<div>")
                                            .addClass("thumbnail slide")
                                            .attr("slide-id",slide);
                            wrapper.append(thumbnail);
                            
                            var renderer = $("<div>")
                                            .addClass("renderer_wrapper");
                            thumbnail.append(renderer);
                            thumbnail.addClass(additionalClasses);
                            
                            var canvas = $("<div>")
                                            .addClass("renderer_canvas simulation")
                                            .attr("slide-id",slide);
                            renderer.append(canvas);
                            
                            $(thumbnail).draggable({
                                revert: 'invalid',
                                revertDuration: 200,
                                opacity: 0.5,
                                helper: 'clone',
                                zIndex:10000000,
                                appendTo: 'body',
                                stop:function (){
                                    $(".window").removeClass("window-hovered-valid");
                                    $(".window").removeClass("window-hovered-invalid");
                                }
                            });
                            
                            $.ajax({
                                type: "get",
                                data: {id: slide},
                                url: "/slide",
                                context: canvas,
                                dataType: "json",
                                success: function (data){
                                    //console.log(data);
                                    $(this).attr("window-model",data.windowModel);
                                    $(this).attr("slide-width",data.width);
                                    $(this).attr("slide-height",data.height);
                                    $(this).parents(".thumbnail").attr("slide-width",data.width);
                                    $(this).parents(".thumbnail").attr("slide-height",data.height);
                                    $(this).each(createCanvasForWrapper);
                                    $(this).parents(".thumbnail").append($('<p title="' + data.name + '">' + data.name + '</p>'))
                                    var thumbnail = $(this).parents(".thumbnail");
                                    
                                    var actions = $("<div>")
                                                    .addClass("slide-actions");
                                    var editButton = $("<a>")
                                                        .attr("href","/create?id=" + data._id)
                                                        .attr("title","Modifier")
                                                        .addClass("btn btn-sm btn-default")
                                                        .html('<span class="glyphicon glyphicon-pencil">');
                                    
                                    var deleteButton = $("<a>")
                                                        .attr("href","/?deleteSlide=" + data._id)
                                                        .attr("title","Effacer")
                                                        .addClass("btn btn-sm btn-danger")
                                                        .html('<span class="glyphicon glyphicon-trash">');                  
                                    
                                    actions.append(editButton,deleteButton);
                            
                                    thumbnail.prepend($('<p class="xy">' + data.width + 'x' + data.height + '</p>')) 
                                    thumbnail.prepend($('<p class="id">' + data._id + '</p>')) 
                                    console.log("showActions = " + showActions);
                                    if ( showActions ){
                                        thumbnail.append(actions)
                                    }
                                }
                            });
                            
                            var folder = $(this).data("folderDom");
                            folder.append(wrapper);
                        }
                        $(this).data("expanded",true);
                        $(this).find(".right-caret").removeClass("right-caret").addClass("caret");
                        $(this).find(".glyphicon-folder-close").removeClass("glyphicon-folder-close").addClass("glyphicon-folder-open");
                        
                        folder.append($('<div class="row">'));
                    }else{
                        $(this).find(".caret").removeClass("caret").addClass("right-caret")
                        $(this).data("expanded",false);
                        $(this).data("folderDom").empty();
                        $(this).find(".glyphicon-folder-open").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close");
                    }
                });
            }
        })
    }
})( jQuery );

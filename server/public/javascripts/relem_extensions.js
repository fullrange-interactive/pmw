Marquee = Marquee.extend({
    behind: false,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-text-width" />' + ((this.data.text!='')?this.data.text.substr(0, 20):'Texte défilant') + '</div>';
    },
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        dom.append(fieldSet);
        var relem = this;
        
        var invertedLabel = $("<label class='control-label'>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        var label = $("<label class='control-label'>")
        label.html("Texte:");
        fieldSet.append(label);
        
        var textField = $('<input type="text" class="form-control" placeholder="Entrer le texte ici...">');
        //textField.addClass("span3");
        textField.val(this.data.text);
        textField.on("input",function(){
            relem.data.text = $(this).val();
            redrawRelem();
        })
        fieldSet.append(textField);
        
        var labelShadowDistance = $("<label class='control-label'>")
        //labelShadowDistance.addClass("span3");
        labelShadowDistance.html("Distance de l'ombre:");
        fieldSet.append(labelShadowDistance);

        var shadowDistanceSliderContainer = $('<div>');
        var shadowDistanceSlider = $('<div>');
        //shadowDistanceSlider.addClass("span3");
        shadowDistanceSliderContainer.append(shadowDistanceSlider);
        fieldSet.append(shadowDistanceSliderContainer);
        
        $(shadowDistanceSlider).slider({min:0,max:6});
        $(shadowDistanceSlider).slider("value",relem.data.shadowDistance)
        $(shadowDistanceSlider).on('slidestop',function(){
           relem.data.shadowDistance=$(shadowDistanceSlider).slider("value");
           redrawRelem();
        });
        
        fieldSet.append($("<p>"));//.addClass("span3"));
        
        var labelSpeed = $("<label class='control-label'>")
        //labelSpeed.addClass("span3");
        labelSpeed.html("Vitesse:");
        fieldSet.append(labelSpeed);

        var speedSliderContainer = $('<div>');
        var speedSlider = $('<div>');
        //speedSlider.addClass("span3");
        speedSliderContainer.append(speedSlider);
        fieldSet.append(speedSliderContainer);
        
        $(speedSlider).slider({min:1,max:6});
        $(speedSlider).slider("value",relem.data.speed)
        $(speedSlider).on('slidestop',function(){
           relem.data.speed=$(speedSlider).slider("value");
           redrawRelem();
        });
    }
});

var onlyOnce = false;

StaticText = StaticText.extend({
    behind: false,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '" style="text-overflow:ellipsis;white-space:no-wrap;overflow:hidden"><i class="glyphicon glyphicon-font" />' + ((this.data.text!='')?this.data.text.substr(0, 20):'Texte') + '</div>';
    },
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        var invertedLabel = $("<label class='control-label'>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        var btnGroup = $('<div class="btn-group">');
        var btnLeft = $('<a class="btn-mini btn btn-default"><i class="glyphicon glyphicon-align-left" /></button>');
        var btnCenter = $('<a class="btn-mini btn btn-default"><i class="glyphicon glyphicon-align-center" /></button>');
        var btnRight = $('<a class="btn-mini btn btn-default"><i class="glyphicon glyphicon-align-right" /></button>');
        btnGroup.append(btnLeft,btnCenter,btnRight);
        btnLeft.on('click',function (){
            relem.data.align = 'left';
            redrawRelem();
        });
        btnCenter.on('click',function (){
            relem.data.align = 'center';
            redrawRelem();
        });
        btnRight.on('click',function (){
            relem.data.align = 'right';
            redrawRelem();
        });
        fieldSet.append(btnGroup);        
        
        var label = $("<label class='control-label'>")
        label.html("Texte:");
        fieldSet.append(label);
        
        var textField = $('<textarea class="form-control" placeholder="Entrer le texte ici..."></textarea>');
        //textField.addClass("span3");
        textField.val(this.data.text);
        textField.on("input paste",function(){
			console.log("aa");
            relem.data.text = $(this).val();
            redrawRelem();
        })
        fieldSet.append(textField);
		
        var labelpadding = $("<label class='control-label'>")
        //labelpadding.addClass("span3");
        labelpadding.html("Marge:");
        fieldSet.append(labelpadding);
		
        var paddingSliderContainer = $('<div>');
        var paddingSlider = $('<div>');
        //paddingSlider.addClass("span3");
        paddingSliderContainer.append(paddingSlider);
        fieldSet.append(paddingSliderContainer);
        
        $(paddingSlider).slider({min:0,max:30});
        $(paddingSlider).slider("value",relem.data.padding?relem.data.padding:0)
        $(paddingSlider).on('slidestop',function(){
           relem.data.padding=$(paddingSlider).slider("value");
           redrawRelem();
        });
        
        dom.append(fieldSet);
      
    }
});

Color = Color.extend({
    behind: true,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-th-large" /><span style="color:#' + this.data.color + ';">Couleur</span></div>';
    },
    showProperties:function(dom){
        //<label class='control-label' for="color2">Color 2</label> <input id="color2" type="text" name="color2" value="#FF0000" />
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append($("<p>"));
        dom.append(fieldSet);
        
        fieldSet.append($("<p>"));
        
        var labelOpacity = $("<label class='control-label'>")
        labelOpacity;
        labelOpacity.html("Opacité:");
        fieldSet.append(labelOpacity);

        var opacitySliderContainer = $('<div>');
        var opacitySlider = $('<div>');
        opacitySliderContainer.append(opacitySlider);
        fieldSet.append(opacitySliderContainer);
        
        $(opacitySlider).slider({min:1,max:100});
        $(opacitySlider).slider("value",relem.data.opacity)
        $(opacitySlider).on('slidestop',function(){
           relem.data.opacity=$(opacitySlider).slider("value");
           redrawRelem();
        });
    }
})

Counter = Counter.extend({
    behind: false,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-time" />Compteur</div>';
    },
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        var invertedLabel = $("<label class='control-label'>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        var label = $("<label class='control-label'>")
        label.html("Heure");
        fieldSet.append(label);
        
        var timePicker = $('<div class="input-append input-group" id="datepicker">');
        var timeField = $('<input type="text" class="form-control" value="20:00:00" data-format="hh:mm:ss">');
        var button = $('<span class="add-on input-group-addon">');
        var icon = $('<i data-time-icon="glyphicon glyphicon-time" data-date-icon="glyphicon glyphicon-calendar">');
        timePicker.append(timeField);
        button.append(icon);
        timePicker.append(button);
        timeField.addClass("span2");
        fieldSet.append(timePicker);
        
        dom.append(fieldSet);
        
        timePicker.datetimepicker({pickDate:false});
        timePicker.data('datetimepicker').setLocalDate(new Date(this.data.date));
        timePicker.on('changeDate',function(){
            relem.data.date = $("#datepicker").data('datetimepicker').getLocalDate();
            relem.data.date = relem.data.date.getTime();
            redrawRelem();
        })
    }
});//Les processeurs embarqués dans le véhicule de Lena permettent de le contrôler via un smartphone

StaticImage = StaticImage.extend({
    behind: true,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-picture" /><img src="' + this.data.url + '" style="max-width:100px;max-height:90%"/></div>';
    },
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append($("<p>"));
        
        //$("#fileUpload").fadeIn(300);
        
        
        var label = $("<label class='control-label'>")
        label.html("Lien vers l'image");
        label.css("display","none");
        fieldSet.append(label);
        
        var url = $('<input type="text" class="form-control">');
        url.css("display","none")
        url.attr("id","imageURL")
        url.val(relem.data.url)
        fieldSet.append(url);
		
        var displayModeSelect = $("<select class='form-control'>");
        displayModeSelect.append($('<option value="cover" ' + ((this.data.displayMode=='cover')?'selected':'') + '>Couvrir</option>'));
//        displayModeSelect.append($('<option value="center" ' + ((this.data.displayMode=='center')?'selected':'') + '>Taille réeele</option>'));
        displayModeSelect.append($('<option value="stretch" ' + ((this.data.displayMode=='stretch')?'selected':'') + '>Etirer</option>'));
		displayModeSelect.append($('<option value="fit" ' + ((this.data.displayMode=='fit')?'selected':'') + '>Taille optimale</option>'));
        $(displayModeSelect).on('change',function (){
            relem.data.displayMode = $(this).val();
            redrawRelem();
        })
        fieldSet.append(displayModeSelect);
        
        $("#gallery").fadeIn(100);
		
		var that = this;
		$(".thumbnail").each(function (){
			$(this).removeClass("selectedImage");
			if ( $(this).find("img").attr('src') == that.data.url ){
				$(this).addClass("selectedImage");
			}
		})
        
        
        dom.append(fieldSet);
        
        url.on('change',function(){
            relem.data.url=$(this).val();
            redrawRelem();
        })    
        
    }
});

Video = Video.extend({
    behind: true,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-film" />' + this.data.url.split('/')[4].substr(0,25) + '</div>';
    },
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append($("<p>"));
        
        var invertedLabel = $("<label class='control-label'>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        
        var label = $("<label class='control-label'>")
        label.html("Lien vers la video");
        label.css("display","none");
        fieldSet.append(label);
        
        var url = $('<input type="text" class="form-control">');
        url.css("display","none")
        url.attr("id","videoURL")
        url.val(relem.data.url)
        fieldSet.append(url);
        
        $("#video").fadeIn(100);
        
        dom.append(fieldSet);
        
        url.on('change',function(){
            relem.data.url=$(this).val();
            redrawRelem();
        })    
        
    }
})

DateDisplayer = DateDisplayer.extend({
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append(fieldSet);        
    },
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-calendar" />Date</div>';
    },
})

TimeDisplayer = TimeDisplayer.extend({
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        
        dom.append(fieldSet);        
    },
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-time" />Heure</div>';
    },
})

Drawing = Drawing.extend({
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append($("<p>"));
        
        var labelType = $("<label class='control-label'>")
        labelType.html("Type de dessin:");
        fieldSet.append(labelType);
        
        var typeSelect = $("<select class='form-control'>");
        typeSelect.append($('<option value="new" ' + ((this.data.type=='new')?'selected':'') + '>Nouveau</option>'));
        typeSelect.append($('<option value="random" ' + ((this.data.type=='random')?'selected':'') + '>Aléatoire</option>'));
        typeSelect.append($('<option value="top" ' + ((this.data.type=='top')?'selected':'') + '>Meilleur</option>'));
        $(typeSelect).on('change',function (){
            relem.data.type = $(this).val();
            redrawRelem();
        })
        fieldSet.append(typeSelect);
        
        var labelTimeout = $("<label class='control-label'>")
        labelTimeout.html("Vitesse de changement:");
        fieldSet.append(labelTimeout);

        var timeoutSliderContainer = $('<div>');
        var timeoutSlider = $('<div>');
        timeoutSliderContainer.append(timeoutSlider);
        fieldSet.append(timeoutSliderContainer);
        
        $(timeoutSlider).slider({min:7,max:180});
        $(timeoutSlider).slider("value",relem.data.timeout)
        $(timeoutSlider).on('slidestop',function(){
           relem.data.timeout=$(timeoutSlider).slider("value");
           redrawRelem();
        });
        dom.append(fieldSet);
    },
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-pencil" />Dessin ' + this.data.type + '</div>';
    },
})

MultiText = MultiText.extend({
    behind: false,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '" style="text-overflow:ellipsis;white-space:no-wrap;overflow:hidden"><i class="glyphicon glyphicon-list" />' + ((this.data.texts[0].text!='')?this.data.texts[0].text.substr(0, 20):'Multitexte') + '</div>';
    },
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
		var dom = dom;
        
        var invertedLabel = $("<label class='control-label'>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        var btnGroup = $('<div class="btn-group">');
        var btnLeft = $('<a class="btn-mini btn btn-default"><i class="glyphicon glyphicon-align-left" /></button>');
        var btnCenter = $('<a class="btn-mini btn btn-default"><i class="glyphicon glyphicon-align-center" /></button>');
        var btnRight = $('<a class="btn-mini btn btn-default"><i class="glyphicon glyphicon-align-right" /></button>');
        btnGroup.append(btnLeft,btnCenter,btnRight);
        btnLeft.on('click',function (){
            relem.data.align = 'left';
            redrawRelem();
        });
        btnCenter.on('click',function (){
            relem.data.align = 'center';
            redrawRelem();
        });
        btnRight.on('click',function (){
            relem.data.align = 'right';
            redrawRelem();
        });
        fieldSet.append(btnGroup);
		
        var labelpadding = $("<label class='control-label'>")
        //labelpadding.addClass("span3");
        labelpadding.html("Marge:");
        fieldSet.append(labelpadding);
		
        var paddingSliderContainer = $('<div>');
        var paddingSlider = $('<div>');
        //paddingSlider.addClass("span3");
        paddingSliderContainer.append(paddingSlider);
        fieldSet.append(paddingSliderContainer);
        
        $(paddingSlider).slider({min:0,max:30});
        $(paddingSlider).slider("value",relem.data.padding?relem.data.padding:0)
        $(paddingSlider).on('slidestop',function(){
           relem.data.padding=$(paddingSlider).slider("value");
           redrawRelem();
        });
        
        var label = $("<label class='control-label'>")
        label.html("Texte:");
        fieldSet.append(label);
        
		var textFields = [];
		
		for ( i in this.data.texts ){
			var chickenWrap = $('<div class="input-group" style="margin:3px 0"></div>')
			text = this.data.texts[i].text;
			var id = i;
	        var textField = $('<input type="text" class="form-control" placeholder="Entrer le texte ici..." style="width:80%">');
			textFields.push(textField);
	        //textField.addClass("span3");
	        textField.val(text);
			textField.data('textId',i);
	        textField.on("input",function(){
	            relem.data.texts[$(this).data('textId')].text = $(this).val();
	            redrawRelem();
				setSelected
	        })
	        chickenWrap.append(textField);
			var deleteField = $('<a class="input-group-btn"><button class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button></a>');
			deleteField.data('textId',i);
			deleteField.click(function (){
				relem.data.texts.splice($(this).data('textId'),1);
				redrawRelem();
				dom.empty();
				relem.showProperties(dom);
			})
			var durationFieldWrap = $('<span class"input-group"></span>');
			var durationField = $('<input class="form-control" value="' + this.data.texts[i].duration + '" style="width:20%"/>');
			durationFieldWrap.prepend(durationField);
			durationField.val(relem.data.texts[i].duration);
			console.log('duration ' + relem.data.texts[i].duration);
			durationField.data('textId',i);
			durationField.on("change", function (){
	            relem.data.texts[$(this).data('textId')].duration = parseInt($(this).val());
	            redrawRelem();
			})
			chickenWrap.append(durationField);
			chickenWrap.append($('<span class="input-group-addon">s</span>'));
			chickenWrap.append(deleteField);
			fieldSet.append(chickenWrap);
		}
		var addButton = $('<a class="btn btn-small btn-default"><i class="glyphicon glyphicon-plus"></i> Ajouter texte</a>').css({clear:'both',float:'left'});
		addButton.click(function (){
			relem.data.texts.push({text:'',duration:60});
			redrawRelem();
			dom.empty();
			relem.showProperties(dom);
		})
		fieldSet.append(addButton);
        dom.append(fieldSet);

    }
});

TimeSync = TimeSync.extend({
    behind: true,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><i class="glyphicon glyphicon-time" />TimeSync</div>';
    },
    showProperties:function(dom){
        //<label class='control-label' for="color2">Color 2</label> <input id="color2" type="text" name="color2" value="#FF0000" />
        
    }
})
Marquee = Marquee.extend({
    behind: false,
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        dom.append(fieldSet);
        var relem = this;
        
        var invertedLabel = $("<label>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox span3");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        var label = $("<label>")
        label.html("Texte:");
        fieldSet.append(label);
        
        var textField = $('<input type="text" placeholder="Entrer le texte ici...">');
        textField.addClass("span3");
        textField.val(this.data.text);
        textField.on("input",function(){
            relem.data.text = $(this).val();
            redrawRelem();
        })
        fieldSet.append(textField);
        
        var fontSelector = $('<div id="fontSelect" class="fontSelect">');
        fieldSet.append(fontSelector);
        fontSelector.append($('<div class="arrow-down">'));
        fontSelector.fontSelector({
                'initial' : relem.data.font,
                'selected' : function(style) {
                    var oldFont = relem.data.font;
                    relem.data.font = style;
                    if ( oldFont != style )
                        redrawRelem();
                },
                'fonts' : [
                    'Champagne',
                    'Helvetica',
                    'Sansation',
                    'Unzialish'
                    ]
            });
        
        var colorLabel = $("<label>")
        colorLabel.html("Couleur: ");
        fieldSet.append(colorLabel);
        
        var colorField = $('<input type="text" value="#' + relem.data.color + '">');
        colorField.addClass("span1");
        colorField.change(function(){
            relem.data.color = $(this).val().replace('#','');
            redrawRelem();
        })
        fieldSet.append(colorField);
        
        var shadowColorField = $('<input type="text" value="#' + relem.data.shadowColor + '">');
        shadowColorField.addClass("span1");
        shadowColorField.change(function(){
            relem.data.shadowColor = $(this).val().replace('#','');
            redrawRelem();
        })
        fieldSet.append(shadowColorField);
        
        fieldSet.append($("<p>").addClass("span3"));
        
        var labelShadowDistance = $("<label>")
        labelShadowDistance.addClass("span3");
        labelShadowDistance.html("Distance de l'ombre:");
        fieldSet.append(labelShadowDistance);

        var shadowDistanceSliderContainer = $('<div>');
        var shadowDistanceSlider = $('<div>');
        shadowDistanceSlider.addClass("span3");
        shadowDistanceSliderContainer.append(shadowDistanceSlider);
        fieldSet.append(shadowDistanceSliderContainer);
        
        $(shadowDistanceSlider).slider({min:0,max:6});
        $(shadowDistanceSlider).slider("value",relem.data.shadowDistance)
        $(shadowDistanceSlider).on('slidestop',function(){
           relem.data.shadowDistance=$(shadowDistanceSlider).slider("value");
           redrawRelem();
        });
        
        fieldSet.append($("<p>").addClass("span3"));
        
        var labelSpeed = $("<label>")
        labelSpeed.addClass("span3");
        labelSpeed.html("Vitesse:");
        fieldSet.append(labelSpeed);

        var speedSliderContainer = $('<div>');
        var speedSlider = $('<div>');
        speedSlider.addClass("span3");
        speedSliderContainer.append(speedSlider);
        fieldSet.append(speedSliderContainer);
        
        $(speedSlider).slider({min:1,max:6});
        $(speedSlider).slider("value",relem.data.speed)
        $(speedSlider).on('slidestop',function(){
           relem.data.speed=$(speedSlider).slider("value");
           redrawRelem();
        });
        
        colorField.colorPicker();
        shadowColorField.colorPicker();
    }
});

var onlyOnce = false;

StaticText = StaticText.extend({
    behind: false,
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        var invertedLabel = $("<label>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox span3");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        var label = $("<label>")
        label.html("Texte:");
        fieldSet.append(label);
        
        var textField = $('<textarea placeholder="Entrer le texte ici...">');
        textField.addClass("span3");
        textField.val(this.data.text);
        textField.on("input",function(){
            relem.data.text = $(this).val();
            redrawRelem();
        })
        fieldSet.append(textField);
        
        var fontSelector = $('<div id="fontSelect" class="fontSelect">');
        fieldSet.append(fontSelector);
        fontSelector.append($('<div class="arrow-down">'));
        fontSelector.fontSelector({
                'initial' : relem.data.font,
                'selected' : function(style) {
                    var oldFont = relem.data.font;
                    relem.data.font = style;
                    if ( oldFont != style )
                        redrawRelem();
                },
                'fonts' : [
                    'Champagne',
                    'Helvetica',
                    'Sansation',
                    'Unzialish'
                    ]
            });
        
        
        var colorLabel = $("<label>")
        colorLabel.html("Couleur");
        fieldSet.append(colorLabel);
        
        var colorField = $('<input type="text" value="#' + relem.data.color + '">');
        colorField.addClass("span3");
        colorField.change(function(){
            relem.data.color = $(this).val().replace('#','');
            redrawRelem();
        })
        fieldSet.append(colorField);
        
        dom.append(fieldSet);
        
        colorField.colorPicker();
    }
});

Color = Color.extend({
    behind: true,
    showProperties:function(dom){
        //<label for="color2">Color 2</label> <input id="color2" type="text" name="color2" value="#FF0000" />
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append($("<p>"));
        dom.append(fieldSet);
        
        var label = $("<label>")
        label.html("Couleur");
        fieldSet.append(label);
        
        var colorField = $('<input type="text" value="#' + relem.data.color + '">');
        colorField.addClass("span3");
        colorField.change(function(){
            relem.data.color = $(this).val().replace('#','');
            redrawRelem();
        })
        fieldSet.append(colorField);
        
        fieldSet.append($("<p>").addClass("span3"));
        
        var labelOpacity = $("<label>")
        labelOpacity.addClass("span3");
        labelOpacity.html("Opacité:");
        fieldSet.append(labelOpacity);

        var opacitySliderContainer = $('<div>');
        var opacitySlider = $('<div>');
        opacitySlider.addClass("span3");
        opacitySliderContainer.append(opacitySlider);
        fieldSet.append(opacitySliderContainer);
        
        $(opacitySlider).slider({min:1,max:100});
        $(opacitySlider).slider("value",relem.data.opacity)
        $(opacitySlider).on('slidestop',function(){
           relem.data.opacity=$(opacitySlider).slider("value");
           redrawRelem();
        });
    
        
        colorField.colorPicker();
    }
})

Counter = Counter.extend({
    behind: false,
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        var invertedLabel = $("<label>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox span3");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        dom.append($("<p>"));
        
        var colorLabel = $("<label>")
        colorLabel.html("Couleur: ");
        fieldSet.append(colorLabel);
        
        var colorField = $('<input type="text" value="#' + relem.data.color + '">');
        colorField.addClass("span1");
        colorField.change(function(){
            relem.data.color = $(this).val().replace('#','');
            redrawRelem();
        })
        fieldSet.append(colorField);
        colorField.colorPicker();
        
        var label = $("<label>")
        label.html("Heure");
        fieldSet.append(label);
        
        var timePicker = $('<div class="input-append" id="datepicker">');
        var timeField = $('<input type="text" value="20:00:00" data-format="hh:mm:ss">');
        var button = $('<span class="add-on">');
        var icon = $('<i data-time-icon="icon-time" data-date-icon="icon-calendar">');
        timePicker.append(timeField);
        button.append(icon);
        timePicker.append(button);
        timeField.addClass("span3");
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
});

StaticImage = StaticImage.extend({
    behind: true,
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append($("<p>"));
        
        //$("#fileUpload").fadeIn(300);
        
        
        var label = $("<label>")
        label.html("Lien vers l'image");
        label.css("display","none");
        fieldSet.append(label);
        
        var url = $('<input type="text">');
        url.css("display","none")
        url.attr("id","imageURL")
        url.val(relem.data.url)
        fieldSet.append(url);
        
        $("#gallery").fadeIn(100);
        
        dom.append(fieldSet);
        
        url.on('change',function(){
            relem.data.url=$(this).val();
            redrawRelem();
        })    
        
    }
});

Video = Video.extend({
    behind: true,
    showProperties:function(dom){
        var fieldSet = $("<fieldset>");
        var relem = this;
        
        dom.append($("<p>"));
        
        var invertedLabel = $("<label>");
        invertedLabel.html("À l'envers");
        invertedLabel.addClass("checkbox span3");
        var invertedCheckbox = $('<input type="checkbox">');
        invertedCheckbox.prop("checked",relem.data.flipped)
        invertedCheckbox.change(function(){
            relem.data.flipped=invertedCheckbox.is(":checked");
            redrawRelem();
        });
        invertedLabel.append(invertedCheckbox);
        fieldSet.append(invertedLabel);
        
        
        var label = $("<label>")
        label.html("Lien vers la video");
        label.css("display","none");
        fieldSet.append(label);
        
        var url = $('<input type="text">');
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
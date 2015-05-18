pmw.Controllers = pmw.Controllers || {},
function(global) {
    "use strict";

    function a(a, b) {
        localStorage.removeItem("StrokesPhoto"), d.push({
            points: [{
                x: a,
                y: b
            }, {
                x: a + 1,
                y: b + 1
            }],
            color: g,
            lineWidth: h
        }), localStorage.setItem("StrokesPhoto", JSON.stringify(d))
    }
    var b, c, d, e, f = null,
        g = "#000000",
        h = 10;
    pmw.Controllers.DrawphotoController = pmw.Controllers.AbstractController.extend({
        pageHeadline: "Photo",
        selectionSize: M.Model.create({
            size: 5
        }),
        strokesMin: 10,
        palette: [
            ["FFFFFF", "FF0000", "94c13c", "0000FF"],
            ["000000", "964B00", "07ace2", "F57900"],
            ["e5287b", "75507B", "FCE94F", "888888"],
            ["008800"]
        ],
        background: null,
        _initViews: function() {
            backRoute = "#chooseFeature";
            this.contentView || (this.contentView = pmw.Views.DrawphotoView.create(this, null, !0)), this.headerView || (this.headerView = pmw.Views.BackheaderView.create(this, null, !0)), this._applyViews();
            var a = this,
                b = [];
            for (var c in this.palette)
                for (var d in this.palette[c]) b.push(this.palette[c][d]);
            $(".page-drawphoto .colorpicker.foreground input").spectrum({
                showPaletteOnly: !0,
                showPalette: !0,
                color: g,
                palette: a.palette,
                change: function(a) {
                    g = a.toHexString(), localStorage.setItem("ForegroundPhoto", a.toHexString())
                }
            }), $(".page-drawphoto .selectionSize .selection-list").sizeChooser(this.changeSize), this.newCanvas(), $(".page-drawphoto .camera").prepend('<input type="file" capture="camera" accept="image/*" id="takePictureField">'), $(".page-drawphoto #takePictureField").on("change", this.gotPic.bind(this)), !("url" in window) && "webkitURL" in window && (window.URL = window.webkitURL)
        },
        newCanvas: function() {
            e = '<canvas id="canvasDrawPhoto" width="' + $(window).width() + '" height="' + ($(window).height() - $(".page-drawphoto .toolbarview").height() - $(".page-drawphoto .tools").height()) + '"></canvas>', $(".page-drawphoto .contentCanvas").html(e), e = $(".page-drawphoto .contentCanvas canvas")[0], b = $(".page-drawphoto .contentCanvas canvas")[0].getContext("2d"), console.log(b), window.addEventListener("resize", this.resizeCanvas.bind(this), !1), window.addEventListener("orientationchange", this.resizeCanvas.bind(this), !1), this.resizeCanvas(), null !== localStorage.getItem("StrokesPhoto") ? (d = JSON.parse(localStorage.getItem("StrokesPhoto")), this.repaint()) : d = [], b.strokeStyle = localStorage.getItem("ForegroundPhoto") ? localStorage.getItem("ForegroundPhoto") : g, localStorage.getItem("BackgroundDrawPhoto") && ($(".page-drawphoto canvas").css("background", "url(" + localStorage.getItem("BackgroundDrawPhoto") + ")").css("background-size", "cover").css("background-position", "50% 50%"), this.background = localStorage.getItem("BackgroundDrawPhoto")), b.lineWidth = h, b.lineCap = "round", b.lineJoin = "round", $(".page-drawphoto .contentCanvas canvas").drawTouchPhoto(), $(".page-drawphoto .contentCanvas canvas").drawPointerPhoto(), $(".page-drawphoto .contentCanvas canvas").drawMousePhoto()
        },
        clearDraw: function() {
			$(".drawPhotoCanvas").addClass("drawPhotoCanvasEmpty")
            var a = [];
            for (var b in this.palette)
                for (var c in this.palette[b]) a.push(this.palette[b][c]);
            localStorage.removeItem("StrokesPhoto"), localStorage.removeItem("ForegroundPhoto"), localStorage.removeItem("BackgroundDrawPhoto"), this.newCanvas()
        },
        changeSize: function() {
            h = $(".page-drawphoto .selectionSize select").val(), b.lineWidth = h
        },
        undo: function() {
            d.pop(), this.repaint()
        },
        saveDraw: function() {
            var a = this;
            console.log(a.background), $('<div title="Confirmation">Envoyer le dessin ?</div>').dialog({
                resizable: !1,
                height: 200,
                modal: !0,
                draggable: !1,
                buttons: {
                    Non: function() {
                        $(this).dialog("close")
                    },
                    Oui: function() {
                        var b = d;
                        $.ajax({
                            url: global.pmw.options.serverUrl + "/drawing",
                            type: "post",
                            data: {
                                action: "newDrawing",
                                strokes: b,
                                width: e.width,
                                height: e.height,
								groupId:global.pmw.selectedWindowGroup,
                                background: localStorage.getItem("BackgroundDrawPhoto")
                            }
                        }).done(function(b) {
							a.clearDraw();
                            console.log(a.background), b = jQuery.parseJSON(b), M.Toast.show("ok" == b.responseType ? "Ton dessin a été envoyé! Nos modérateurs vont y jeter un oeil." : "Erreur lors de l'envoi ! :(")
                        }), $(this).dialog("close")
                    }
                }
            })
        },
        drawLine: function(a, c, d, e, f, g) {
            b.beginPath(), b.lineCap = "round", b.lineJoin = "round", b.strokeStyle = a, b.lineWidth = c, b.moveTo(d, e), b.lineTo(f, g), b.stroke(), b.closePath()
        },
        resizeCanvas: function() {
            console.log("resize");
            var a = 1 / 1.206897,
                c = window.innerHeight ? window.innerHeight : $(window).height(),
                d = $(window).width(),
                f = 0,
                g = 0,
                h = $(".page-drawphoto .toolbarview").height() + $(".page-drawphoto .tools").height();
            c -= h, 1 > d / c ? (f = d, g = f * a) : (g = c, f = g / a);
            var i = b.getImageData(0, 0, e.width, e.height);
            e.width = f, e.height = g, $(".page-drawphoto .contentCanvas").height(c), b.putImageData(i, 0, 0);
            this.repaint();
        },
        repaint: function() {
            if (d) {
                b.clearRect(0, 0, e.width, e.height);
                for (var a = 0; a < d.length; a++)
                    for (var c = 0; c < d[a].points.length - 1; c++) this.drawLine(d[a].color, d[a].lineWidth, d[a].points[c].x, d[a].points[c].y, d[a].points[c + 1].x, d[a].points[c + 1].y)
            }
            b.lineWidth = h;
        },
        gotPic: function(a) {
            if (1 == a.target.files.length && 0 == a.target.files[0].type.indexOf("image/")) {
                var b = (URL.createObjectURL(a.target.files[0]), this),
                    c = new FormData;
                c.append("file", a.target.files[0]);
                var d = M.LoaderView.create().render();
                d.show("Chargement"), $.ajax({
                    url: global.pmw.options.serverUrl + "/photo",
                    type: "post",
                    data: c,
                    processData: !1,
                    contentType: !1,
                    responseType: "json"
                }).done(function(a) {
					$(".drawPhotoCanvas").removeClass("drawPhotoCanvasEmpty");
                    console.log("gotPix")
                    this.clearDraw();
                    this.repaint();
                    b.background = JSON.parse(a).url, $(".page-drawphoto canvas").css("background", "url(" + global.pmw.options.serverUrl + "/" + b.background + ")"), $(".page-drawphoto canvas").css("background-size", "cover"), $(".page-drawphoto canvas").css("background-position", "50% 50%"), console.log("background Img : " + b.background), localStorage.setItem("BackgroundDrawPhoto", b.background), d.hide(!0)
                }.bind(this))
            }
        }
    }), $.fn.drawTouchPhoto = function() {
        var e = function(d) {
                d = d.originalEvent, b.beginPath(), b.strokeStyle = g, c = d.changedTouches[0].pageX, f = d.changedTouches[0].pageY - 44, b.moveTo(c, f), a(c, f), M.Logger.log("new stroke")
            },
            h = function(a) {
                a.preventDefault(), a = a.originalEvent, c = a.changedTouches[0].pageX, f = a.changedTouches[0].pageY - 44, b.lineTo(c, f), b.stroke(), d[d.length - 1].points.push({
                    x: c,
                    y: f
                })
            };
        $(this).on("touchstart", e), $(this).on("touchmove", h)
    }, $.fn.drawPointerPhoto = function() {
        var e = function(d) {
                d = d.originalEvent, b.beginPath(), b.strokeStyle = g, c = d.pageX, f = d.pageY - 44, b.moveTo(c, f), a(c, f), M.Logger.log("new stroke")
            },
            h = function(a) {
                a.preventDefault(), a = a.originalEvent, c = a.pageX, f = a.pageY - 44, b.lineTo(c, f), b.stroke(), d[d.length - 1].points.push({
                    x: c,
                    y: f
                })
            };
        $(this).on("MSPointerDown", e), $(this).on("MSPointerMove", h)
    }, $.fn.drawMousePhoto = function() {
        var e = 0,
            h = function(d) {
                e = 1, b.beginPath(), b.strokeStyle = g, c = d.pageX, f = d.pageY - 44, b.moveTo(c, f), a(c, f), M.Logger.log("new stroke")
            },
            i = function(a) {
                e && (c = a.pageX, f = a.pageY - 44, b.lineTo(c, f), b.stroke(), d[d.length - 1].points.push({
                    x: c,
                    y: f
                }))
            },
            j = function() {
                e = 0
            };
        $(this).on("mousedown", h), $(this).on("mousemove", i), $(window).on("mouseup", j)
    }
}(this);
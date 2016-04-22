function getDimensions(points) {
    var smX = null;
    var smY = null;
    var lgX = null;
    var lgY = null;
    for (var i = 1; i <= 4; i++) {
        if (smX === null || points['p' + i].x < smX)
            smX = points['p' + i].x;
        if (lgX === null || points['p' + i].x > lgX)
            lgX = points['p' + i].x;
        if (smY === null || points['p' + i].y < smY)
            smY = points['p' + i].y;
        if (lgY === null || points['p' + i].y > lgY)
            lgY = points['p' + i].y;
    }
    return {
        x: smX,
        y: smY,
        width: lgX - smX,
        height: lgY - smY
    }
}

var defaultWidth = 200;
var defaultHeight = 200;

RendererProjectionMapped = Class.extend({
    onDistort: null,
    transitionObject: null,
    initialize: function(container, serverIp, serverPort, windowId, points) {
        this.currentSlide = null;
        this.rendererGrid = null;
        this.windowId = windowId;
        this.points = {
            p1: points.p1,
            p2: points.p2,
            p3: points.p3,
            p4: points.p4
        };
        this.resizeOnWindowModel = false;

        this.clientConnection = new ClientConnection(serverIp, serverPort, windowId);
        this.clientConnection.onSlide = this.onSlide.bind(this);
        this.clientConnection.onWindowModel = this.onWindowModel.bind(this);

        var dims = getDimensions(points);

        this.bounds = $("<div>").addClass("windowContainer");
        container.append(this.bounds);
    },
    stopDistort: function() {
        this.rendererDom.css(
            "transform", "none"
        );
        this.rendererDom.css(
            "-moz-transform", "none"
        );
        this.rendererDom.css(
            "-webkit-transform", "none"
        );
        this.rendererDom.css(
            "-o-transform", "none"
        );
    },
    distort: function() {
        var dimensions = getDimensions(this.points);
        var matrix = get3dTransformMatrix(
            this.bounds.width(),
            this.bounds.height(), { x: this.points.p1.x, y: this.points.p1.y }, { x: this.points.p2.x, y: this.points.p2.y }, { x: this.points.p3.x, y: this.points.p3.y }, { x: this.points.p4.x, y: this.points.p4.y }
        );

        this.rendererDom.css(
            "transform", "matrix3d(" + matrix.join(",") + ")"
        );
        this.rendererDom.css(
            "-moz-transform", "matrix3d(" + matrix.join(",") + ")"
        );
        this.rendererDom.css(
            "-webkit-transform", "matrix3d(" + matrix.join(",") + ")"
        );
        this.rendererDom.css(
            "-o-transform", "matrix3d(" + matrix.join(",") + ")"
        );
    },
    addDebug: function() {
        var debug = $("<div>").addClass("windowDebug");
        debug.append($("<div>").addClass("windowId").html(this.windowId));
        // debug.append($("<div>").addClass("actions").append($("<a>").addClass("remove").html("X")));
        this.bounds.append(debug);
    },
    // updateDragPoints: function ()
    // {
    //     for (var i in this.dragPoints)
    //     {
    //         var point = this.dragPoints[i];
    //         $(point).css({
    //             'position': 'fixed',
    //             'left': this.points['p' + point.attr('corner')].x + 'px',
    //             'top': this.points['p' + point.attr('corner')].y + 'px'
    //         });
    //     }
    // },
    addDragPoints: function() {
        if (this.dragPoints)
            return;
        this.dragPoints = [];
        for (var i = 1; i <= 4; i++) {
            var point = $("<div>").addClass("corner").attr('corner', i);
            $(point).css({
                'position': 'fixed',
                'left': this.points['p' + i].x + 'px',
                'top': this.points['p' + i].y + 'px'
            });
            $(point).draggable({
                drag: function(pid, event, ui) {
                    this.points['p' + pid].x = ui.position.left;
                    this.points['p' + pid].y = ui.position.top;
                    this.distort();
                }.bind(this, i),
                stop: function(pid, event, ui) {
                    this.points['p' + pid].x = ui.position.left;
                    this.points['p' + pid].y = ui.position.top;
                    this.reinitialize();
                    this.onDistort();
                }.bind(this, i)
            });
            this.bounds.append(point);
            this.dragPoints.push(point);
        }
    },
    reinitialize: function() {
        this.resizeOnWindowModel = false;
        this.dragPoints = null;
        this.stopDistort();
        this.rendererGrid.clearAll();
        this.createRenderer();
        this.addDragPoints();
        this.addDebug();
        this.onSlide(this.currentSlide, this.currentSlide.xStart, this.currentSlide.yStart, this.currentSlide.dateStart, true, 'none');
        this.distort();
    },
    calculateRendererSize: function() {
        var dimensions = getDimensions(this.points);

        var screenWidth = dimensions.width;
        var screenHeight = dimensions.height;

        var width = null;
        var height = null;

        if (screenWidth / screenHeight > this.windowModel.ratio) {
            width = screenWidth;
            height = screenWidth / this.windowModel.ratio;
        } else {
            width = screenHeight * this.windowModel.ratio;
            height = screenHeight;
        }

        return {
            width: width,
            height: height
        };
    },
    createRenderer: function() {
        var rendererDom = $("<div>").addClass("rendererWindow");
        this.bounds.empty();
        this.bounds.append(rendererDom);

        var dimensions = getDimensions(this.points);
        var rendererSize = this.calculateRendererSize();

        rendererDom.width(rendererSize.width);
        rendererDom.height(rendererSize.height);

        var columnsMasksList = new Array();
        var rowsMasksList = new Array();
        for (var x = 0; x < this.windowModel.cols.length; x++) {
            columnsMasksList.push(false);
        }
        for (var y = 0; y < this.windowModel.rows.length; y++) {
            rowsMasksList.push(false);
        }

        this.bounds.css({
            width: rendererSize.width,
            height: rendererSize.height,
            left: dimensions.x + 'px',
            top: dimensions.y + 'px'
        })

        this.rendererGrid = new rElemGrid(
            this.windowModel.cols.length,
            this.windowModel.rows.length,
            this.windowModel.ratio,
            this.windowModel.ratio,
            this.windowModel.cols,
            this.windowModel.rows,
            columnsMasksList,
            rowsMasksList,
            new Array()
        );

        this.rendererGrid.dom = rendererDom.get();

        rendererDom.append(this.rendererGrid.getDOM(rendererDom.width(), rendererDom.height()));
        this.rendererDom = rendererDom;
    },
    onTransitionEnd: function() {
        console.log("finished transition");
        this.transitionObject = null;
        $(this.oldSlideDom).remove();
        this.rendererGrid.removePushedRelems();
    },
    onSlide: function(slide, xStart, yStart, dateStart, force, transition) {
        // this.rendererGrid.clearAll();

        this.stopDistort();
        // Slide position in window group
        slide.xStart = xStart;
        slide.yStart = yStart;
        slide.dateStart = new Date(dateStart);

        if (!force &&
            this.currentSlide !== null &&
            slide._id == this.currentSlide._id &&
            slide.lastEdit == this.currentSlide.lastEdit &&
            slide.xStart == this.currentSlide.xStart &&
            slide.yStart == this.currentSlide.yStart &&
            slide.dateStart == this.currentSlide.dateStart) {
            console.error('[Client] same slide received twice, ignoring');
            newGrid = false;
            return;
        }

        // console.error('[Client] Queuing slide');

        var slideDom = $("<div>").addClass("slide");
        slideDom.css({
            width: $(this.rendererGrid.dom).width() + 'px',
            height: $(this.rendererGrid.dom).height() + 'px',
        })
        var relemsToLoad = slide.relems.length;

        if (this.transitionObject !== null){
            // Cancel this transition
            this.transitionObject.cancelTransition();
            this.onTransitionEnd();
            console.log("Cancelled transition");
        }
        var transitionObject = new transitions[transition]();
        this.transitionObject = transitionObject;

        if (!this.currentSlideDom)
            this.currentSlideDom = $("<div>"); // Create a dummy dom for the first slide
        this.oldSlideDom = this.currentSlideDom;
        this.currentSlideDom = slideDom;
        $(this.rendererGrid.dom).append(slideDom);

        transitionObject.initializeTransition(this.oldSlideDom, this.currentSlideDom);

        this.rendererGrid.pushCurrentRelems();
        
        this.currentSlide = slide;

        for (var i in slide.relems) {
            var relem = slide.relems[i];

            this.rendererGrid.newRelem(
                relem.x,
                relem.y,
                relem.width,
                relem.height,
                relem.type,
                (typeof(relem.displayMode) != 'undefined' ? relem.displayMode : relem.z),
                relem.data,
                false,
                slideDom,
                function relemLoaded() {
                    relemsToLoad--;
                    if (relemsToLoad === 0 && !transitionObject.cancelled) {
                        console.log("all relems ready, transitioning");
                        transitionObject.startTransition(this.oldSlideDom, this.currentSlideDom, this.onTransitionEnd.bind(this));
                    }
                }.bind(this)
            );
        }
        this.distort();
    },
    onWindowModel: function(windowModel) {
        var first = false;
        if (!this.windowModel)
            first = true;
        this.windowModel = windowModel;
        if (this.resizeOnWindowModel) {
            var size = this.calculateRendererSize();
            // Reset the distortion upon new window model creation...
            this.points = {
                p1: { x: this.points.p1.x, y: this.points.p1.y },
                p2: { x: this.points.p1.x + size.width, y: this.points.p1.y },
                p3: { x: this.points.p1.x, y: this.points.p1.y + size.height },
                p4: { x: this.points.p1.x + size.width, y: this.points.p1.y + size.height }
            }
        }
        this.createRenderer();
        if (first) {
            this.addDragPoints();
            this.addDebug();
        }
        this.distort();
    },
    remove: function() {
        this.rendererGrid.clearAll();
        delete this.rendererGrid;
        this.clientConnection.end();
        delete this.clientConnection;
        this.bounds.remove();
        delete this.bounds;
    }
})

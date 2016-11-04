exports.rElem = {
  type: 'generic',
  needRedraw: true,
  firstDraw: true,
  deleting: false,
  sameCanvas: true,
  redrawZones: null,
  drawCounter: 0,
  rem: function(x, y)
  {
    return (x % y < 0) ? y - (x % y) : x % y;
  },
  initialize: function(
    windowStartX,
    windowStartY,
    globalBaseX,
    globalBaseY,
    localBaseX,
    localBaseY,
    gridWidth,
    gridHeight,
    truncLocalBaseX,
    truncLocalBaseY,
    truncLocalEndX,
    truncLocalEndY,
    globalEndX,
    globalEndY,
    localEndX,
    localEndY,
    cellList,
    zIndex,
    startTime,
    data)
  {
    this.instanceName = ++instance;
    this.windowStartX = windowStartX;
    this.windowStartY = windowStartY;
    this.globalBaseX = globalBaseX;
    this.globalBaseY = globalBaseY;
    this.localBaseX = localBaseX;
    this.localBaseY = localBaseY;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.globalEndX = globalEndX;
    this.globalEndY = globalEndY;
    this.localEndX = localEndX;
    this.localEndY = localEndY;
    this.cellList = cellList;
    this.truncLocalBaseX = truncLocalBaseX;
    this.truncLocalBaseY = truncLocalBaseY;
    this.z = zIndex;
    this.startTime = new Date(startTime);
    this.data = data;

    this.width = 0;
    this.height = 0;
    this.left = 0;
    this.top = 0;

    this.localWidth = 0;
    this.localHeight= 0;

    this.hasLeftNeighbor = this.localBaseX < 0;
    this.hasTopNeighbor = this.localBaseY < 0;
    this.hasRightNeighbor = this.localEndX > mainGrid.gridSizeX;
    this.hasBottomNeighbor = this.localEndY > mainGrid.gridSizeY;

    this.hasRightTopNeighbor = this.hasRightNeighbor && this.hasTopNeighbor;
    this.hasRightBottomNeighbor = this.hasRightNeighbor && this.hasBottomNeighbor;
    this.hasLeftBottomNeighbor = this.hasLeftNeighbor && this.hasBottomNeighbor;
    this.hasLeftTopNeighbor = this.hasLeftNeighbor && this.hasTopNeighbor;

    console.log("[rElem.init] Global: bx=" + this.globalBaseX + " by=" + this.globalBaseY + " ex=" + this.globalEndX + " ey=" + this.globalEndY);
    console.log("[rElem.init] Local: bx=" + this.localBaseX + " by=" + this.localBaseY + " ex=" + this.localEndX + " ey=" + this.localEndY); 
    console.log("[rElem.init] Local truncated size: "+truncLocalBaseX+","+truncLocalEndX+" "+truncLocalBaseY+","+truncLocalEndY);   
    console.log("[rElem.init] grid size: " + mainGrid.gridSizeX + "x" + mainGrid.gridSizeY + " Window offset in group:" + this.windowStartX + ":" + this.windowStartY);

    // this._calculateSize();
    this.redrawZones = [];
    this._calculateSize();
    // setTimeout(this._calculateSize.bind(this), 5000);
  },
  _calculateSize: function()
  {
    var marginX = mainGrid.margins.x * mainGrid.wrapper.width;
    var marginY = mainGrid.margins.y * mainGrid.wrapper.height;

    console.log("[relem.init] Absolute margins: " + marginX + "," + marginY);

    // calculate the global grid ratio
    var gridW = 0;
    var gridH = 0;
    var gridCols = 0;
    var gridRows = 0;
    for (var y = 0; y < mainGrid.neighborsMap.length; y++) {
      gridH += 1;
      gridRows += mainGrid.neighborsMap[y][0].rows.length;
      for (var x = 0; x < mainGrid.neighborsMap[y].length; x++) {
        var win = mainGrid.neighborsMap[y][x];
        var thisWinH = 1 / (win.margin.top + 1 + win.margin.bottom);
        console.log("Adding " + thisWinH * win.ratio);
        var w = thisWinH * win.ratio;
        gridW += w;
        gridW += w * win.margin.left;
        gridW += w * win.margin.right;
        gridCols += win.cols.length;
      }
    }
    var gridRatio = gridW/gridH;

    // calculate the relem dimensions and offsets (in percents)
    var relemW = ((this.globalEndX - this.globalBaseX + 1) / gridCols) * gridW;
    var relemH = ((this.globalEndY - this.globalBaseY + 1) / gridRows) * gridH;
    var relemX = (this.globalBaseX / gridCols) * gridW;
    var relemY = (this.globalBaseY / gridRows) * gridH;

    // Calculate our position and size
    var winY = 0;
    var winH = 0;
    for (var y = 0; y < this.windowStartY; y++) {
      winY += 1;
    }
    winY += mainGrid.margins.top / (mainGrid.margins.top + 1 + mainGrid.margins.bottom);
    winH = 1 / (mainGrid.margins.top + 1 + mainGrid.margins.bottom);

    var winX = 0;
    var winW = 1;
    for (var x = 0; x < this.windowStartX; x++) {
      var win = mainGrid.neighborsMap[this.windowStartY][x];
      var thisWinH = 1 / (win.margin.top + 1 + win.margin.bottom);
      winX += thisWinH * win.ratio;
      winX += thisWinH * win.ratio * win.margin.left;
      winX += thisWinH * win.ratio * win.margin.right;
    }

    winX += mainGrid.margins.left * winH * mainGrid.ratioGrid;
    winW = winH * mainGrid.ratioGrid;

    // THIS IS CORRECT WITHOUT WRAPPER BASE X AND Y
    this.width = relemW * mainGrid.wrapper.width * (1 / winW);
    this.height = relemH * mainGrid.wrapper.height * (1 / winH);

    this.left = (relemX - winX) * mainGrid.wrapper.width * (1 / winW);
    this.top =  (relemY - winY) * mainGrid.wrapper.height * (1 / winH);

    // var relativeBaseX = mainGrid.wrapper.base.x / mainGrid.screenWidth;
    // var relativeBaseY = mainGrid.wrapper.base.y / mainGrid.screenHeight;
    // this.width = relemW * mainGrid.wrapper.width * (1 / winW) + relativeBaseX * mainGrid.wrapper.width;
    // this.height = relemH * mainGrid.wrapper.height * (1 / winH) + relativeBaseY * mainGrid.wrapper.height;

    // this.left = (relemX - winX) * mainGrid.wrapper.width * (1 / winW) - mainGrid.wrapper.base.x * (1 / winW);
    // this.top =  (relemY - winY) * mainGrid.wrapper.height * (1 / winH) - mainGrid.wrapper.base.y * (1 / winH);

    console.log("[relem.calculateSize] gridCols=" + gridCols + " gridRows=" + gridRows);
    console.log("[relem.calculateSize] gridW=" + gridW + " gridH=" + gridH);
    console.log("[relem.calculateSize] relemX=" + relemX + " relemY=" + relemY);
    console.log("[relem.calculateSize] relemW=" + relemW + " relemH=" + relemH);
    console.log("[relem.calculateSize] winX=" + winX + " winY=" + winY)
    console.log("[relem.calculateSize] winW=" + winW + " winH=" + winH); 

    // var rem = 0;
    // var oldrem = 0;

    // for (var i = this.truncLocalBaseX; i < this.truncLocalEndX; i++)
    //   this.localWidth += mainGrid.relemGrid[i][0].dimensions.x;

    // console.log("[relem.init] localWidth " + this.localWidth);    
    
    // for (var i = this.truncLocalBaseY; i < this.truncLocalEndY; i++)
    //   this.localHeight += mainGrid.relemGrid[0][i].dimensions.y;    
    

    // console.log("[relem.init] localHeight " + this.localHeight);    

    // for (var i = this.globalBaseX; i <= this.globalEndX; i++)
    // {
    //   rem = this.rem(i, mainGrid.gridSizeX);
    //   //             console.log("[relem.init] cRem:"+rem);
    //   this.width += mainGrid.relemGrid[rem][0].dimensions.x;
    //   //             console.log("[relem.init] ---");

    //   if (rem == 0 && oldrem > 0)
    //     this.width += marginX * 2;// + mainGrid.wrapper.base.x * 2;

    //   oldrem = rem;
    // }

    // oldrem = 0;

    // for (i = this.globalBaseY; i <= this.globalEndY; i++)
    // {
    //   rem = this.rem(i, mainGrid.gridSizeY);
    //   //             console.log("[relem.init] cRem:"+rem);
    //   this.height += mainGrid.relemGrid[0][rem].dimensions.y;
    //   //             console.log("[relem.init] ---");
    //   if (rem == 0 && oldrem > 0)
    //     this.height += marginY * 2;// + mainGrid.wrapper.base.y * 2;

    //   oldrem = rem;
    // }

    // var saintGraalX = (Math.floor(-this.localBaseX / (mainGrid.gridSizeX + 1)) + 1);
    // var saintGraalY = (Math.floor(-this.localBaseY / (mainGrid.gridSizeY + 1)) + 1);

    // this.left = mainGrid.relemGrid[this.globalBaseX % mainGrid.gridSizeX][0].positions.x;
    // if (this.localBaseX < 0) {
    //   this.left -= saintGraalX * mainGrid.wrapper.width;
    //   //         for(i=globalBaseX;i>0;
    //   //         this.left       -= this.windowStartX*mainGrid.wrapper.width;
    //   //          this.left       -= localBaseX >= 0 ? 0 :windowStartX*mainGrid.wrapper.base.x;

    //   this.left -= saintGraalX * 2 * marginX;
    //   //this.left -= (saintGraalX - 1) * 2 * mainGrid.wrapper.base.x + 2 * mainGrid.wrapper.base.x;
    // }

    // this.top = mainGrid.relemGrid[0][this.globalBaseY % mainGrid.gridSizeY].positions.y;
    // if (this.localBaseY < 0) {
    //   this.top -= saintGraalY * mainGrid.wrapper.height;
    //   //         this.top        -= this.windowStartY*mainGrid.wrapper.base.y;
    //   //         this.top        -= this.windowStartY*2*marginY; 
    //   //          this.top       -= localBaseY >= 0 ? 0 :windowStartY*mainGrid.wrapper.base.y;

    //   //this.top -= (saintGraalY - 1) * 2 * mainGrid.wrapper.base.y + 2 * mainGrid.wrapper.base.y;
    //   this.top -= saintGraalY * 2 * marginY;
    // }

    console.log("[relem.init] Left/Top: " + this.left + "," + this.top);

    console.log("[relem.init] Size: [" + this.width + "x" + this.height + "]");
    console.log("[relem.init] Coord: [" + this.left + ":" + this.top + "]");
  },
  beginCanvasMask: function(ctx)
  {
    //         console.trace();
    // Save the state, so we can undo the clipping
    ctx.save();

    // Clip to allowed drawing zone
    ctx.beginPath();
    ctx.rect(this.left, this.top, this.width, this.height);

    // Clip to the current path
    ctx.clip();

  },
  endCanvasMask: function(ctx)
  {
    //         console.trace();
    ctx.restore();
  },
  loadParent: function(callback)
  {
    if (this.load) {
      this.load(callback);
    }
  },
  load: function(callback)
  {
    callback();
  },
  addRedrawZone: function(x, y)
  {
    var contiguous = false;

    /*
     * Trying to group continuous zones...
     */
    for (var i in this.redrawZones)
    {
      if ((y >= this.redrawZones[i].y && y < this.redrawZones[i].y + this.redrawZones[i].height) &&
        (x >= this.redrawZones[i].x && x < this.redrawZones[i].x + this.redrawZones[i].width)
      )
        contiguous = true;
      if ((x == this.redrawZones[i].x + this.redrawZones[i].width || x == this.redrawZones[i].x - 1) && (y >= this.redrawZones[i].y && y < this.redrawZones[i].y + this.redrawZones[i].height))
      {
        contiguous = true;
        this.redrawZones[i].width++;

        if (x == this.redrawZones[i].x - 1)
        {
          this.redrawZones[i].x--;
        }

      }
      if ((y == this.redrawZones[i].y + this.redrawZones[i].height || y == this.redrawZones[i].y - 1) && (x >= this.redrawZones[i].x && x < this.redrawZones[i].x + this.redrawZones[i].width))
      {
        contiguous = true;
        this.redrawZones[i].height++;
        if (y == this.redrawZones[i].y - 1)
          this.redrawZones[i].y--;


      }
      if (contiguous)
        break;
    }

    if (!contiguous)
      this.redrawZones.push(
      {
        x: x,
        y: y,
        width: 1,
        height: 1
      });

  },
  drawZone: function(ctx, x, y, width, height)
  {
    ctx.save();

    ctx.beginPath();
    ctx.rect(x, y, width, height);

    // Clip to the current path
    ctx.clip();
    this.draw(ctx);

    // Restore canvas
    ctx.restore();
  },
  smartDraw: function(ctx)
  {
    //         console.log(".");
    var neededRedraw = this.needRedraw;
    this.needRedraw = false;

    if ((this.redrawZones.length == 0 || this.firstDraw == true || neededRedraw) /* && !this.deleting*/ )
    {
      //             if(this.endX >= this.gridWidth)

      //                    console.log("drawFull");

      this.draw(ctx);

      //                 if(this.drawCounter < 5)
      //                 {
      //                     ctx.beginPath();
      //                     ctx.rect(this.left+10,this.top+10,this.width-20,this.height-20); 
      //                     ctx.strokeStyle="#0000FF";
      //                     ctx.stroke();
      //                 }
      //         //        console.log("drawZone");
      // 
      //                 this.drawCounter = this.drawCounter > 10 ? 0 : this.drawCounter+1;
      //             
      this.firstDraw = false;
    }
    else
    {
      //              console.log("[relem]["+this.instanceName+"] Zones Draw "+this.redrawZones.length+" zones of type "+this.type);

      for (var i in this.redrawZones)
      {
        //              console.log("[relem.smartDraw] Translating redrawZone ["+this.redrawZones[i].width+"x"+this.redrawZones[i].height+"] @ ["+this.redrawZones[i].x+":"+this.redrawZones[i].y+"]");
        var absX = mainGrid.relemGrid[this.redrawZones[i].x][this.redrawZones[i].y].positions.x;
        var absY = mainGrid.relemGrid[this.redrawZones[i].x][this.redrawZones[i].y].positions.y;
        var absWidth = 0;
        var absHeight = 0;

        for (var j = 0; j < this.redrawZones[i].width; j++)
        {
          //             console.log(j+this.redrawZones[i].x);

          absWidth += mainGrid.relemGrid[j + this.redrawZones[i].x][0].dimensions.x;
        }

        for (var j = 0; j < this.redrawZones[i].height; j++)
          absHeight += mainGrid.relemGrid[0][j + this.redrawZones[i].y].dimensions.y;

        this.redrawZones[i].x = absX;
        this.redrawZones[i].y = absY;
        this.redrawZones[i].width = absWidth;
        this.redrawZones[i].height = absHeight;
      }
      for (var i in this.redrawZones)
      {
        //                 if(this.drawCounter < 5)
        //                 {
        //                     ctx.beginPath();
        //                     ctx.rect(~~this.redrawZones[i].x+10,~~this.redrawZones[i].y+10, ~~this.redrawZones[i].width-20,~~this.redrawZones[i].height-20); 
        //                     ctx.strokeStyle="#FF0000";
        //                     ctx.stroke();
        //                 }
        //         //        console.log("drawZone");
        // 
        //                 this.drawCounter = this.drawCounter > 10 ? 0 : this.drawCounter+1;
        //                 
        this.drawZone(
          ctx, ~~this.redrawZones[i].x, ~~this.redrawZones[i].y, ~~this.redrawZones[i].width, ~~this.redrawZones[i].height
        );
      }
    }

    this.redrawZones = [];
  },
  //     fadeIn : function(){
  //     },
  //     fadeOut : function(cleanup){
  //         if(cleanup)
  //             this.cleanup();
  //     },
  parentCleanup: function()
  {
    this.deleting = true;

    if (typeof(this.cleanup) == "function")
      this.cleanup();
  }
};

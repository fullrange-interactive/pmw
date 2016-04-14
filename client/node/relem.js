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
    this.z = zIndex;
    this.startTime = new Date(startTime);
    this.data = data;

    this.width = 0;
    this.height = 0;
    this.left = 0;
    this.top = 0;

    this.hasLeftNeighbor = this.localBaseX < 0;
    this.hasTopNeighbor = this.localBaseY < 0;
    this.hasRightNeighbor = this.localEndX > mainGrid.gridSizeX;
    this.hasBottomNeighbor = this.localEndY > mainGrid.gridSizeY;

    this.hasRightTopNeighbor = this.hasRightNeighbor && this.hasTopNeighbor;
    this.hasRightBottomNeighbor = this.hasRightNeighbor && this.hasBottomNeighbor;
    this.hasLeftBottomNeighbor = this.hasLeftNeighbor && this.hasBottomNeighbor;
    this.hasLeftTopNeighbor = this.hasLeftNeighbor && this.hasTopNeighbor;


    console.log("[rElem.init] bx=" + this.globalBaseX + " by=" + this.globalBaseX + " ex=" + this.globalEndX + " ey=" + this.globalEndY);
    console.log("[rElem.init] grid size: " + mainGrid.gridSizeX + "x" + mainGrid.gridSizeY + " Window offset in group:" + this.windowStartX + ":" + this.windowStartY);

    var marginX = mainGrid.margins.x * mainGrid.wrapper.width;
    var marginY = mainGrid.margins.y * mainGrid.wrapper.height;

    console.log("[relem.init] Absolute margins: " + marginX + "," + marginY);

    var rem = 0;
    var oldrem = 0;

    for (var i = globalBaseX; i <= globalEndX; i++)
    {
      rem = this.rem(i, mainGrid.gridSizeX);
      //             console.log("[relem.init] cRem:"+rem);
      this.width += mainGrid.relemGrid[rem][0].dimensions.x;
      //             console.log("[relem.init] ---");

      if (rem == 0 && oldrem > 0)
        this.width += marginX * 2 + mainGrid.wrapper.base.x * 2;

      oldrem = rem;
    }

    oldrem = 0;

    for (i = globalBaseY; i <= globalEndY; i++)
    {
      rem = this.rem(i, mainGrid.gridSizeY);
      //             console.log("[relem.init] cRem:"+rem);
      this.height += mainGrid.relemGrid[0][rem].dimensions.y;
      //             console.log("[relem.init] ---");
      if (rem == 0 && oldrem > 0)
        this.height += marginY * 2 + mainGrid.wrapper.base.y * 2;

      oldrem = rem;
    }

    var saintGraalX = (Math.floor(-localBaseX / (mainGrid.gridSizeX + 1)) + 1);
    var saintGraalY = (Math.floor(-localBaseY / (mainGrid.gridSizeY + 1)) + 1);

    this.left = mainGrid.relemGrid[globalBaseX % mainGrid.gridSizeX][0].positions.x;
    this.left -= localBaseX >= 0 ? 0 : saintGraalX * mainGrid.wrapper.width;
    //         for(i=globalBaseX;i>0;

    //         this.left       -= this.windowStartX*mainGrid.wrapper.width;

    //          this.left       -= localBaseX >= 0 ? 0 :windowStartX*mainGrid.wrapper.base.x;

    this.left -= localBaseX >= 0 ? 0 : saintGraalX * 2 * marginX;
    this.left -= localBaseX >= 0 ? 0 : (saintGraalX - 1) * 2 * mainGrid.wrapper.base.x + 2 * mainGrid.wrapper.base.x;

    this.top = mainGrid.relemGrid[0][globalBaseY % mainGrid.gridSizeY].positions.y;
    this.top -= localBaseY >= 0 ? 0 : saintGraalY * mainGrid.wrapper.height;
    //         this.top        -= this.windowStartY*mainGrid.wrapper.base.y;
    //         this.top        -= this.windowStartY*2*marginY; 

    //          this.top       -= localBaseY >= 0 ? 0 :windowStartY*mainGrid.wrapper.base.y;

    this.top -= localBaseY >= 0 ? 0 : (saintGraalY - 1) * 2 * mainGrid.wrapper.base.y + 2 * mainGrid.wrapper.base.y;
    this.top -= localBaseY >= 0 ? 0 : saintGraalY * 2 * marginY;

    console.log("[relem.init] Left/Top: " + this.left + "," + this.top);


    this.redrawZones = new Array();

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
    if (this.load)
      this.load(callback);
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

exports.rElem = { 
    type        : 'generic',
    needRedraw  : true,
    firstDraw   : true,
    deleting    : false,
    sameCanvas  : true,
    redrawZones : null,
    drawCounter : 0,
    rem         : function(x,y)
    {
        return (x%y < 0) ? y-(x%y):x%y;
    },
    initialize  : function(
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
        this.instanceName       = ++instance;
        this.windowStartX       = windowStartX;
        this.windowStartY       = windowStartY;
        this.globalBaseX        = globalBaseX;
        this.globalBaseY        = globalBaseY;
        this.localBaseX         = localBaseX;
        this.localBaseY         = localBaseY;
        this.gridWidth          = gridWidth;
        this.gridHeight         = gridHeight;
        this.globalEndX         = globalEndX;
        this.globalEndY         = globalEndY;
        this.localEndX          = localEndX;
        this.localEndY          = localEndY;
        this.cellList           = cellList;
        this.z                  = zIndex;
        this.startTime          = new Date(startTime);
        this.data               = data;
        
        this.x                  = this.localBaseX;
        this.y                  = this.localBaseY;
            
        this.width              = 0;
        this.height             = 0;
        this.left               = 0;
        this.top                = 0;
        
        //console.log("[rElem.init] bx=" + this.globalBaseX + " by=" + this.globalBaseX + " ex=" + this.globalEndX + " ey=" + this.globalEndY);
        
        var winX = 0;
        var winY = 0;
        var oneX = false;
        var oneY = false;

        var rElemCellHeight      = this.globalEndY-this.globalBaseY+1;        
        var rElemCellWidth     = this.globalEndX-this.globalBaseX+1;
        
//         for(var i = 0; i <= this.globalEndX; i++){
//             if ( i < this.globalBaseX ){
//                 this.left += mainGrid.relemGrid[this.rem(i,mainGrid.gridSizeX)][0].dimensions.x;
//             }
//             if ( i >= this.globalBaseX && i <= this.globalEndX ){
//                 this.width += mainGrid.relemGrid[this.rem(i,mainGrid.gridSizeX)][0].dimensions.x;
//             }
//             if ( this.rem(i,mainGrid.gridSizeX) == 0 && i != 0 ){
//                 this.width += mainGrid.wrapper.width*mainGrid.margins.x*2 + 2*mainGrid.wrapper.base.x;
//             } 
//             if ( this.localBaseX < 0 && this.rem(i,mainGrid.gridSizeX) == 0 && i != 0 ){
//                 console.log("marginx");
//                 if ( oneX ){3
//                     winX += parseFloat(mainGrid.wrapper.width) + parseFloat(mainGrid.wrapper.width * mainGrid.margins.x) + 2*mainGrid.wrapper.base.x;
//                 }else{
//                     winX += parseFloat(mainGrid.wrapper.width) + 2*parseFloat(mainGrid.wrapper.width * mainGrid.margins.x) + 2*mainGrid.wrapper.base.x;
//                 }
//                 oneX = true;
//             }
//         }
//         
//         for(var i = 0; i <= this.globalEndY; i++){
//             if ( i < this.globalBaseY ){
//                 this.top += mainGrid.relemGrid[0][this.rem(i,mainGrid.gridSizeY)].dimensions.y;
//             }
//             if ( i >= this.globalBaseY && i <= this.globalEndY ){
//                 this.height += mainGrid.relemGrid[0][this.rem(i,mainGrid.gridSizeY)].dimensions.y;
//             }
//             if ( this.rem(i,mainGrid.gridSizeY) == 0 && i != 0 ){
//                 this.height += mainGrid.wrapper.height*mainGrid.margins.y*2  + 2*mainGrid.wrapper.base.y;
//             } 
//             if ( this.localBaseY < 0 && this.rem(i,mainGrid.gridSizeY) == 0 && i != 0 ){
//                 if ( oneY ){
//                     winY += parseFloat(mainGrid.wrapper.height) + parseFloat(mainGrid.wrapper.height * mainGrid.margins.y) - 2*mainGrid.wrapper.base.y;
//                 }else{
//                     winY += parseFloat(mainGrid.wrapper.height) + 2*parseFloat(mainGrid.wrapper.height * mainGrid.margins.y) - 2*mainGrid.wrapper.base.y;
//                 }
//                 oneY = true;
//             }
//         }
        
/*        this.left -= winX - mainGrid.wrapper.base.x;
        this.top -= winY - mainGrid.wrapper.base.y;
     */   /*
        for(var i = 0; i <= this.globalEndY; i++){
            if ( i < this.globalBaseY && i > 0 ){
                
            }
        }*/
        
        this.left = Math.floor(this.globalBaseX/mainGrid.gridSizeX)*(1+2*mainGrid.margins.x)+mainGrid.relemGrid[this.rem(this.globalBaseX,mainGrid.gridSizeX)][0].positions.x;
        
        this.top = Math.floor(this.globalBaseY/mainGrid.gridSizeY)*(1+2*mainGrid.margins.x)+mainGrid.relemGrid[0][this.rem(this.globalBaseY,mainGrid.gridSizeY)].positions.y;
        /*
         * Computing real local size in px
         */
        var nWindowsX = Math.ceil(rElemCellWidth/mainGrid.gridSizeX);
        var horizontalWindowOffset    = ~~(-localBaseX/mainGrid.gridSizeX);
        var marginX                   = ~~(horizontalWindowOffset*mainGrid.wrapper.width*mainGrid.margins.x*2);
        var totalMarginX              = ~~(nWindowsX - 1)*mainGrid.wrapper.width*mainGrid.margins.x*2;
        
        var nWindowsY = Math.ceil(rElemCellHeight/mainGrid.gridSizeY);
        var verticalWindowOffset      = ~~(-localBaseY/mainGrid.gridSizeY);
        var marginY                   = ~~(verticalWindowOffset*mainGrid.wrapper.height*mainGrid.margins.y*2);
        var totalMarginY              = ~~(nWindowsY-1)*mainGrid.wrapper.width*mainGrid.margins.x*2;

        for(var i=this.globalBaseX;i<=this.globalEndX;i++)
            this.width += mainGrid.relemGrid[this.rem(i,mainGrid.gridSizeX)][0].dimensions.x;
       
        this.width += (nWindowsX-1)*mainGrid.wrapper.base.x*2;
        this.height += (nWindowsY-1)*mainGrid.wrapper.base.y*2;
        
        this.width += totalMarginX;
  
        for(var i=this.globalBaseY;i<=this.globalEndY;i++)
            this.height += mainGrid.relemGrid[0][this.rem(i,mainGrid.gridSizeY)].dimensions.y;
        
        this.height += totalMarginY;
                 
        if(this.localBaseX >= 0 && this.localBaseX < mainGrid.gridSizeX) // Relem starts inside our window
            this.left               = Math.round(mainGrid.relemGrid[this.x][0].positions.x);
        else // Relem starts on our left
        {


            console.log("[relem.init] HorizontalWindowOffset: "+horizontalWindowOffset+" Margin: "+marginX);
            
            this.left    -= this.windowStartX*mainGrid.wrapper.width*(1+2*mainGrid.margins.x);
            this.left    += (nWindowsX-1)*mainGrid.wrapper.base.x*2
            //this.left    -= mainGrid.relemGrid[(this.localEndX+1)%mainGrid.gridSizeX][0].positions.x;

            //this.left    -= marginX;
//             this.width   += marginX*2;
            
            console.log("[relem.init] "+marginX);
        }

        if(this.localBaseY >= 0 && this.localBaseY < mainGrid.gridSizeY) // Relem starts inside our window
            this.top               = Math.round(mainGrid.relemGrid[0][this.y].positions.y);
        else // Relem starts above us
        {
            console.log("[relem.init]["+rElemCellWidth+"x"+rElemCellHeight+"] Cells.");
            
            console.log("[relem.init] verticalWindowOffset: "+verticalWindowOffset+" Margin: "+marginY);
            
            this.top    -= this.windowStartY*mainGrid.wrapper.height*(1+2*mainGrid.margins.y);
            this.top    += (nWindowsY-1)*mainGrid.wrapper.base.y*2;
            //this.top    -= mainGrid.relemGrid[0][(this.localEndY+1)%mainGrid.gridSizeY].positions.y;

            //this.top    -= marginY;
//             this.height += marginY*2;
           
            console.log("[relem.init] "+marginY);            
        }
        
        
        this.redrawZones        = new Array();
              

        this.width = ~~Math.round(this.width);
        this.height = ~~Math.round(this.height);
        
        console.log("[relem.init] Size: ["+this.width+"x"+this.height+"]");
        console.log("[relem.init] Coord: ["+this.left+":"+this.top+"]");
        
    },
    beginCanvasMask : function(ctx)
    {
//         console.trace();
        // Save the state, so we can undo the clipping
        ctx.save();

        // Clip to allowed drawing zone
        ctx.beginPath();
        ctx.rect(this.left,this.top,this.width,this.height); 
        
        // Clip to the current path
        ctx.clip();

    },
    endCanvasMask : function(ctx)
    {
//         console.trace();
        ctx.restore();
    },
    loadParent          : function(callback){
        if ( this.load )
            this.load(callback);
    },
    load                : function(callback){
        callback();
    },
    addRedrawZone       : function(x,y)
    { 
        var contiguous = false;
        
        /*
         * Trying to group continuous zones...
         */
        for(var i in this.redrawZones)
        {
            if((y >= this.redrawZones[i].y && y < this.redrawZones[i].y +this.redrawZones[i].height)
                &&
                (x >= this.redrawZones[i].x && x < this.redrawZones[i].x +this.redrawZones[i].width)
              )
                contiguous = true;
            if((x == this.redrawZones[i].x+this.redrawZones[i].width || x == this.redrawZones[i].x-1) 
                && (y >= this.redrawZones[i].y && y < this.redrawZones[i].y +this.redrawZones[i].height))
            {
                contiguous = true;
                this.redrawZones[i].width++;
                
                if(x == this.redrawZones[i].x-1)
                {
                    this.redrawZones[i].x--;
                }
                
            }
            if((y == this.redrawZones[i].y+this.redrawZones[i].height || y == this.redrawZones[i].y-1) 
                && (x >= this.redrawZones[i].x && x < this.redrawZones[i].x +this.redrawZones[i].width))
            {
                contiguous = true;
                this.redrawZones[i].height++;
                if(y == this.redrawZones[i].y-1)
                    this.redrawZones[i].y--;
                

            }
            if(contiguous)
                break;
        }
     
        if(!contiguous)
            this.redrawZones.push({x:x,y:y,width:1,height:1});

    },
//     beginCanvasMask : function(ctx)
//     {
// //         console.trace();
//         // Save the state, so we can undo the clipping
//         ctx.save();
// 
//         // Clip to allowed drawing zone
//         ctx.beginPath();
//         ctx.rect(this.left,this.top,this.width,this.height); 
//         
//         // Clip to the current path
//         ctx.clip();
// 
//     },
    drawZone : function(ctx,x,y,width,height)
    {
//          console.log("[relem] Default drawzone ["+width+"x"+height+"] @ ["+x+":"+y+"]");
        // Save the state, so we can undo the clipping
        ctx.save();

        // Clip to allowed drawing zone
//                              ctx.fillColor = "#FF0000";
//         ctx.drawRect(x,y,width,height);
        
        ctx.beginPath();
        ctx.rect(x,y,width,height);
        
        

        
        // Clip to the current path
        ctx.clip();
        
        this.draw(ctx);
       

        
        // Restore canvas
        ctx.restore();
    },
    smartDraw : function(ctx)
    {
        var neededRedraw = this.needRedraw;
        this.needRedraw = false;
        
        if((this.redrawZones.length == 0 || this.firstDraw == true || neededRedraw)/* && !this.deleting*/)
        {
//             if(this.endX >= this.gridWidth)
                
//                    console.log("drawFull");

            this.draw(ctx);
            
                if(this.drawCounter < 5)
                {
                    ctx.beginPath();
                    ctx.rect(this.left+10,this.top+10,this.width-20,this.height-20); 
                    ctx.strokeStyle="#0000FF";
                    ctx.stroke();
                }
        //        console.log("drawZone");

                this.drawCounter = this.drawCounter > 10 ? 0 : this.drawCounter+1;
            
            this.firstDraw = false;
        }
        else
        {
//              console.log("[relem]["+this.instanceName+"] Zones Draw "+this.redrawZones.length+" zones of type "+this.type);

            for(var i in this.redrawZones)
            {
    //              console.log("[relem.smartDraw] Translating redrawZone ["+this.redrawZones[i].width+"x"+this.redrawZones[i].height+"] @ ["+this.redrawZones[i].x+":"+this.redrawZones[i].y+"]");
                var absX            = mainGrid.relemGrid[this.redrawZones[i].x][this.redrawZones[i].y].positions.x;
                var absY            = mainGrid.relemGrid[this.redrawZones[i].x][this.redrawZones[i].y].positions.y;
                var absWidth        = 0;
                var absHeight       = 0;
                
                for(var j=0;j<this.redrawZones[i].width;j++)
                {
    //             console.log(j+this.redrawZones[i].x);

                    absWidth += mainGrid.relemGrid[j+this.redrawZones[i].x][0].dimensions.x;
                }
      
                for(var j=0;j<this.redrawZones[i].height;j++)
                    absHeight += mainGrid.relemGrid[0][j+this.redrawZones[i].y].dimensions.y;
                
                this.redrawZones[i].x = absX;
                this.redrawZones[i].y = absY;
                this.redrawZones[i].width = absWidth;
                this.redrawZones[i].height = absHeight;
            }
            for(var i in this.redrawZones)
            {   
                if(this.drawCounter < 5)
                {
                    ctx.beginPath();
                    ctx.rect(~~this.redrawZones[i].x+10,~~this.redrawZones[i].y+10, ~~this.redrawZones[i].width-20,~~this.redrawZones[i].height-20); 
                    ctx.strokeStyle="#FF0000";
                    ctx.stroke();
                }
        //        console.log("drawZone");

                this.drawCounter = this.drawCounter > 10 ? 0 : this.drawCounter+1;
                
                this.drawZone(
                    ctx,
                    ~~this.redrawZones[i].x,
                    ~~this.redrawZones[i].y,
                    ~~this.redrawZones[i].width,
                    ~~this.redrawZones[i].height
                );
            }
        }

        this.redrawZones = [];
    },
    fadeIn : function(){
    },
    fadeOut : function(cleanup){
        if(cleanup)
            this.cleanup();
    },
    parentCleanup : function(){
        this.deleting = true;
        
        if(typeof(this.cleanup) == "function")
            this.cleanup();
    }
};

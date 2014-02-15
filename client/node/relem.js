exports.rElem = {
    needRedraw : true,
    firstDraw:true,
    deleting:false,
    sameCanvas:true,
    redrawZones:null,
    initialize : function(
        baseX,
        baseY,
        gridX,
        gridY,
        gridWidth,
        gridHeight,
        iendX,
        iendY,
        icellList,
        izIndex,
        idata)
    {
        this.instanceName       = ++instance;
        this.x                  = baseX;
        this.y                  = baseY;
        this.endX               = iendX;
        this.endY               = iendY;
        this.gridX              = gridX;
        this.gridY              = gridY;
        this.gridWidth          = gridWidth;
        this.gridHeight         = gridHeight;
        this.cellList           = icellList;
        this.z                  = izIndex;
        this.data               = idata;
        
        this.left               = Math.round(mainGrid.relemGrid[this.x][this.y].positions.x);
        this.top                = Math.round(mainGrid.relemGrid[this.x][this.y].positions.y);
        this.width              = 0;
        this.height             = 0;  
        
        this.redrawZones        = new Array();
              
        for(var i=this.x;i<=this.endX;i++)
            this.width += mainGrid.relemGrid[i][0].dimensions.x;
  
        for(var i=this.y;i<=this.endY;i++)
            this.height += mainGrid.relemGrid[0][i].dimensions.y;
        
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        
    },
    loadParent : function(callback){
        if ( this.load )
        {
            this.load(callback);
        }
    },
    load : function(callback){
        callback();
    },
    addRedrawZone : function(x,y)
    {
       
//         console.log("[relem.addRedrawZone] Adding coord ["+x+":"+y+"]");
 
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
//                     console.log(x+" =="+(this.redrawZones[i].x-1));
//                      console.log(x+"=="+(this.redrawZones[i].x+this.redrawZones[i].width)+" || "+x+" == "+(this.redrawZones[i].x-1))

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

//         for(var i in this.redrawZones)
//         {
//              console.log("[relem.addRedrawZone] redrawZone Status ["+this.redrawZones[i].width+"x"+this.redrawZones[i].height+"] @ ["+this.redrawZones[i].x+":"+this.redrawZones[i].y+"]");
//         }

//          console.log("[relem.addRedrawZone] "+this.redrawZones.length+" zones")
                
        
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
        this.needRedraw = false;
        ctx.globalAlpha = 1;

        // Translating to absolute position / size
        
        if((this.redrawZones.length == 0 || this.firstDraw == true) && !this.deleting)
        {
            
//             console.log("[relem] Full Draw "+this.type+" ["+this.width+"x"+this.height+"] @ ["+this.left+":"+this.top+"] ");
            this.draw(ctx);
            this.firstDraw = false;
        }
        else
        {
//             console.log("[relem] Zones Draw "+this.redrawZones.length+" zones of type "+this.type);

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
                this.drawZone(
                    ctx,
                    ~~this.redrawZones[i].x,
                    ~~this.redrawZones[i].y,
                    ~~this.redrawZones[i].width,
                    ~~this.redrawZones[i].height
                );
        }

        this.redrawZones = [];
    },
    endCanvasMask : function(ctx)
    {
//         console.trace();
        ctx.restore();
    },
    fadeIn : function(){
    },
    fadeOut : function(cleanup){
        if(cleanup)
            this.cleanup();
    },
    cleanup : function(){}
};
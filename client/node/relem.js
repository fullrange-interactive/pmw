exports.rElem = {
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
        this.zIndex             = izIndex;
        this.data               = idata;
        
        this.left               = mainGrid.relemGrid[this.x][this.y].positions.x;
        this.top                = mainGrid.relemGrid[this.x][this.y].positions.y;
        this.width              = 0;
        this.height             = 0;  
              
        for(var i=this.x;i<=this.endX;i++)
            this.width += mainGrid.relemGrid[i][0].dimensions.x;
  
        for(var i=this.y;i<=this.endY;i++)
            this.height += mainGrid.relemGrid[0][i].dimensions.y;
                
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
    beginCanvasMask : function(ctx)
    {
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
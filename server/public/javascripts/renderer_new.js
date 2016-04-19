var rElem = Class.extend({
    initialize : function(baseX,baseY,gridX,gridY,gridWidth,gridHeight,iendX,iendY,icellList,izIndex,idata,uniqueId)
    {
        this.instanceName       = Math.round(Math.random()*100000);
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
        this.uniqueId           = uniqueId;
        this.locked             = false;
                
        ////console.log("["+this.instanceName+" rElem.init] "+this.x+":"+this.y);
        
        this.xPx=$("#relem_"+this.uniqueId+'_'+this.x+"_"+this.y).position().left;
        this.yPx=$("#relem_"+this.uniqueId+'_'+this.x+"_"+this.y).position().top;
        //console.log($("#layer_"+this.uniqueId))
        this.getOffsetSize();

    },
    getOffsetSize : function(){
        this.height = this.width = 0;

        for(var x=this.x;x<this.endX;x++)
            this.width += $("#relem_"+this.uniqueId+'_'+x+"_0").outerWidth();
        
        for(var y = this.y;y<this.endY;y++)
            this.height += $("#relem_"+this.uniqueId+"_0_"+y).outerHeight();
        
        ////console.log("["+this.instanceName+" rElem.getOffsetSize] "+this.width+"x"+this.height);

    },
    createDom : function()
    {
         this.viewPort = $("<div>").css({
             height:this.height+'px',
             width:this.width+'px',
             zIndex:this.zIndex,
             top:this.yPx+'px',
             left:this.xPx+'px'
        }).addClass("layer").attr('id',"layer_"+this.instanceName);
        console.log(this.zIndex)
         $(this.grid.dom).append(this.viewPort);
    },
    loadParent : function(callback){
        if ( this.load )
            this.load(callback);
    },
    load : function(callback){
        callback();
    },
    fadeIn : function(){
    },
    fadeOut : function(cleanup){
        if(cleanup)
            this.cleanup();
    },
    remove : function(){
        ////console.log("["+this.instanceName+" rElem.cleanUp] ");
        this.cleanup();
        $("#layer_"+this.instanceName).remove();
    },
    cleanup: function (){},
    grid: null
});

var lastId = Math.floor(Math.random()*1000);
var rElemGrid = Class.extend({
    initialize: function(
        isizeX,                     // Horiz size of the grid 
        isizeY,                     // Vert size of the grid (0,0 is top left)
        iratioGrid,                 // Grid global ratio
        iratioScreen,               // Screen global ratio
        icolumnRatioList,           // List of columns ratios
        irowRatioList,              // List of rows ratio
        icolumnMaskList,            // List of mask columns
        irowMaskList,             // List of mask rows
        icellMaskList             // List of isolated mask cells
    ){
        // Grid constructor
        this.gridSizeX          = isizeX;
        this.gridSizeY          = isizeY;
        this.ratioGrid          = iratioGrid;
        this.ratioScreen        = iratioScreen;
        this.columnRatioList    = icolumnRatioList;
        this.rowRatioList       = irowRatioList;
        this.columnMaskList     = icolumnMaskList;
        this.rowMaskList        = irowMaskList;
        this.cellMaskList       = icellMaskList;

        this.backgroundImage    = false;
        this.overlayImage       = false;

        this.relemGrid          = new Array();
        
        this.uniqueId = lastId++;
        
        var x,y;
        x = y = 0;
        
        for(;x < this.gridSizeX; x++)
        {
            this.relemGrid.push(new Array());
            for(y=0;y < this.gridSizeY;y++)
            {
                this.relemGrid[x].push({
                    relemList:(new Array()),
                });
            }
        }
    },
    /*
     * Return if a cell is an isolated mask cell
     */
    dom: null,
    cells: [],
    isMaskCell: function(x,y)
    {
        return (typeof(this.cellMaskList.filter(function(source,x,y){ return source.x==x && source.y==y;})[0])  != 'undefined');  
    },
    getGridXY: function(x,y)
    {
        var x = x;
        var y = y;
        var found = null;
        $(".gridCell").each(function(){
            if( $(this).hasClass("mask") )
                return;
            if (   x > $(this).offset().left 
                && x < $(this).offset().left + $(this).width() 
                && y > $(this).offset().top
                && y < $(this).offset().top + $(this).height() 
                ){
                    found = this;
                    return;
                }
        });
        return found;
    },
    removeRelem: function(rElem)
    {
        for(x = 0; x < this.relemGrid.length; x++ ){
            for(y = 0; y < this.relemGrid[x].length; y++ ){
                for(z = 0; z < this.relemGrid[x][y].relemList.length; z++ ){
                    if ( this.relemGrid[x][y].relemList[z] == rElem ){
                        this.relemGrid[x][y].relemList[z].remove();
                        this.relemGrid[x][y].relemList.splice(z,1);
                    }
                }
            }
        }
    },
    removeAll: function()
    {
        for(x = 0; x < this.relemGrid.length; x++ ){
            for(y = 0; y < this.relemGrid[x].length; y++ ){
                for(z = 0; z < this.relemGrid[x][y].relemList.length; z++ ){
                    this.relemGrid[x][y].relemList[z].remove();
                }
                this.relemGrid[x][y].relemList = [];
            }
        }
    },        /*
     * Clears everything
     */
    clearAll: function()
    {
        //console.log("clearAll");
        for(x = 0; x < this.relemGrid.length; x++ ){
            for(y = 0; y < this.relemGrid[x].length; y++ ){
                for(z = 0; z < this.relemGrid[x][y].relemList.length; z++ ){
                    this.relemGrid[x][y].relemList[z].remove();
                    
                }
                this.relemGrid[x][y].relemList = [];
            }
        }
    },

    /*
     * Clear rElem at given coordinates
     */
    clearRelem: function(cellList,exception)
    {
        ////console.log("[rElemGrid.clearRelem] Deleting relem... except "+exception.instanceName);
        for(var i in cellList)
            for(var z=0;z<this.relemGrid[cellList[i].x][cellList[i].y].relemList.length;z++)
            {
                if(exception.instanceName != this.relemGrid[cellList[i].x][cellList[i].y].relemList[z].instanceName)
                {
                    ////console.log("[rElemGrid.clearRelem] Deleting relem at "+cellList[i].x+":"+cellList[i].y);
                    this.relemGrid[cellList[i].x][cellList[i].y].relemList[z].fadeOut(true);
                    this.relemGrid[cellList[i].x][cellList[i].y].relemList.filter(function(value,index){return index != z;});
                }
            }
    },
    isValid: function (baseX,baseY,sizeX,sizeY)
    {
        var x = y = 0;

        var gridX = baseX;
        var gridY = baseY;

        if ( sizeX <= 0 || sizeY <= 0 ){
            console.error("[rElemGrid.isValid] negative or zero dimensions");
            return false;
        }

        /*
         * Computing real baseX, baseY
         */
        for(x=0;x<=baseX;x++)
            if(this.columnMaskList[x])
                baseX++;
        for(y=0;y<=baseY;y++)
            if(this.rowMaskList[y])
                baseY++;

//         If the base postion is invalid, return immediately
        if(this.rowMaskList[baseX] || this.columnMaskList[baseY] || this.isMaskCell(baseX,baseY) || baseX >= this.gridSizeX || baseY >= this.gridSizeY)
        {
            console.error("[rElemGrid.isValid] Invalid base coordinates");
            return false;
        }

        var endX = baseX + sizeX;
        var endY = baseY + sizeY;

        ////console.log("[rElemGrid.isValid] baseX,baseY : "+baseX+":"+baseY+" endX,endY : "+endX+":"+endY);

        /*
         * Computing real cell list and z-Index, expanding over mask cells
         */
        var cellList = new Array();
        var minZindex = maxZindex = 100; 

        for(x=baseX;x < endX; x++)
        {
            if(x >= this.gridSizeX)
            {
                console.error("[rElemGrid.isValid] rElem too wide to fit at "+baseX+":"+baseY);
                return false;
            }
            // If current column is mask, expected end is one cell further on X
            if(this.columnMaskList[x])
            {
                endX++;
                continue;
            }

            for(endY = baseY + sizeY,y=baseY;y < endY; y++)
            {
                if(y >= this.gridSizeY)
                {
                    console.error("[rElemGrid.isValid] rElem too tall to fit at "+baseX+":"+baseY);
                    return false;
                }
                // If current row is mask, expected end is one cell further on Y
                if(this.rowMaskList[y])
                {
                    endY++;
                    continue;
                }  
                cellList.push({x:x,y:y});
            }
        }
        return true;       
    },
    /*
     * Add a new relem at given coordinate
     */
    newRelem: function (baseX,baseY,sizeX,sizeY,className,displayMode,data)
    {
        ////console.log("[rElemGrid.newRelem] Creating new relem");

        var x = y = 0;

        var gridX = baseX;
        var gridY = baseY;
        
        if ( baseX < 0 || baseY < 0 )
            return null;
        if ( sizeX > this.gridSizeX ){
            sizeX = this.gridSizeX;
        }
        if ( sizeY > this.gridSizeY ){
            sizeY = this.gridSizeY;
        }

        /*
         * Computing real baseX, baseY
         */
         if ( sizeX <= 0 || sizeY <= 0 ){
             console.error("[rElemGrid.newRelem] negative or zero dimensions");
             return false;
         }
        for(x=0;x<=baseX;x++)
            if(this.columnMaskList[x])
                baseX++;
        for(y=0;y<=baseY;y++)
            if(this.rowMaskList[y])
                baseY++;

//         If the base postion is invalid, return immediately
        if(this.rowMaskList[baseX] || this.columnMaskList[baseY] || this.isMaskCell(baseX,baseY) || baseX >= this.gridSizeX || baseY >= this.gridSizeY)
        {
            console.error("[rElemGrid.newRelem] Invalid base coordinates");
            return false;
        }

        var endX = baseX + sizeX;
        var endY = baseY + sizeY;

        ////console.log("[rElemGrid.newRelem] baseX,baseY : "+baseX+":"+baseY+" endX,endY : "+endX+":"+endY);

        /*
         * Computing real cell list and z-Index, expanding over mask cells
         */
        var cellList = new Array();
        var minZindex = maxZindex = 100; 
        
        for(x=0; x < this.relemGrid.length; x++)
            for( y=0; y < this.relemGrid[x].length; y++)
                for(var z = 0;z < this.relemGrid[x][y].relemList.length;z++)
                {
                    if(this.relemGrid[x][y].relemList[z].zIndex >= maxZindex){
                        maxZindex = this.relemGrid[x][y].relemList[z].zIndex+1;
                    }
                    if(this.relemGrid[x][y].relemList[z].zIndex <= minZindex)
                        minZindex = this.relemGrid[x][y].relemList[z].zIndex-1;
                }

        for(x=baseX;x < endX; x++)
        {
            if(x >= this.gridSizeX)
            {
                console.error("[rElemGrid.newRelem] rElem too wide to fit at "+baseX+":"+baseY);
                return false;
            }
            // If current column is mask, expected end is one cell further on X
            if(this.columnMaskList[x])
            {
                endX++;
                continue;
            }

            for(endY = baseY + sizeY,y=baseY;y < endY; y++)
            {
                if(y >= this.gridSizeY)
                {
                    console.error("[rElemGrid.newRelem] rElem too tall to fit at "+baseX+":"+baseY);
                    return false;
                }
                // If current row is mask, expected end is one cell further on Y
                if(this.rowMaskList[y])
                {
                    endY++;
                    continue;
                }  
                cellList.push({x:x,y:y});

                for(var z = 0;z < this.relemGrid[x][y].relemList.length;z++)
                {
                    if(this.relemGrid[x][y].relemList[z].zIndex >= maxZindex)
                        maxZindex = this.relemGrid[x][y].relemList[z].zIndex+1;
                    if(this.relemGrid[x][y].relemList[z].zIndex <= minZindex)
                        minZindex = this.relemGrid[x][y].relemList[z].zIndex-1;
                }
            }
        }

        console.log("DisplayMOde:"+displayMode);

        var newRelem = new window[className](
            baseX,      // Start X coord of display
            baseY,      // Start Y coord of display
            gridX,
            gridY,
            sizeX,
            sizeY,
            endX,       // End X coord of display, expanded over masked cells
            endY,       // End Y coord of display, expanded over masked cells
            cellList,   // List of non-masked display cells
            zIndex = (displayMode == 'front' ? maxZindex : displayMode == 'back' ? minZindex : displayMode),
            data,
            this.uniqueId
        );
        newRelem.grid = this;

        // Copying this rElem reference to every used cell
        for(x=baseX;x < endX; x++)
            for(y=baseY;y < endY; y++)
                this.relemGrid[x][y].relemList.push(newRelem);

        // Synchronous loading
        if(newRelem.isReady)
        {
           ////console.log("[rElemGrid.newRelem] sync");

           // If replace mode, asking each present rElem to leave
           if(displayMode == 'replace')
               this.clearRelem(cellList,newRelem);

           newRelem.fadeIn();
        }
        else // Async loading
        {
            ////console.log("[rElemGrid.newRelem] async");

            newRelem.loadParent(function(){
              if(displayMode == 'replace')
              {
                   mainGrid.clearRelem(cellList,newRelem);
              }
              newRelem.fadeIn();
            });
        }
        // Display all the layers in the box when it is created.
        return newRelem;
    },

    /*
     * Get the grid DOM
     */
    getDOM: function(w,h){

        var wrapperWidth     = this.ratioGrid>this.ratioScreen ? 1 : this.ratioScreen/this.ratioGrid;
        var wrapperHeight    = this.ratioGrid<this.ratioScreen ? 1 : this.ratioScreen/this.ratioGrid;
        
        var wrapper             = document.createElement('table');
        wrapper.style.width     = "100%";
        wrapper.style.height    = "100%";
        wrapper.cellPadding     = "0";
        wrapper.cellSpacing     = "0";
        wrapper.border          = "0";
        wrapper.className              = 'grid_wrapper';
        var gridY = 0;
        for(var y =0;y < this.gridSizeY; y++)
        {
            var curRow = document.createElement('tr');

            //curRow.style.height= this.rowRatioList[y]*100+'px';
            curRow.style.height = this.rowRatioList[y]*h + "px";
            var gridX = 0;
            for(var x=0;x < this.gridSizeX;x++)
            {
                var curCell = document.createElement('td');
                //if ( this.columnMaskList[x] == false )
                  //  gridX++;

                //curCell.style.width = this.columnRatioList[x]*100+'px';
                ////console.log("x " + this.columnRatioList[x])
                curCell.style.width = this.columnRatioList[x]*w + "px";
                curCell.id = 'relem_'+this.uniqueId+'_'+x+'_'+y;
                $(curCell).attr('grid-x',x);
                $(curCell).attr('grid-y',y);

                if(this.rowMaskList[y] || this.columnMaskList[x] || this.isMaskCell(x,y))
                    curCell.className = 'mask gridCell';
                else
                    curCell.className = 'gridCell';
                curCell.gridX = x;
                curCell.gridY = Math.floor(y);    
                var that = this;
                
                curRow.appendChild(curCell);
            }

            wrapper.appendChild(curRow);
        }
        return wrapper;
    },

    getAllRelems:function(){
        var retArray = new Array();
        for(x = 0; x < this.relemGrid.length; x++ )
            for(y = 0; y < this.relemGrid[x].length; y++ )
                for(z = 0; z < this.relemGrid[x][y].relemList.length; z++ )
                    if ( retArray.indexOf(this.relemGrid[x][y].relemList[z]) == -1 )
                        retArray.push(this.relemGrid[x][y].relemList[z]);
        return retArray;
    },

    getRelem: function ( instanceName ) {
        if (instanceName) {
            var rElems = this.getAllRelems();
            for( nbrRelem = 0; nbrRelem < rElems.length; nbrRelem++) {
                 if( rElems[nbrRelem].instanceName == instanceName )
                        return rElems[nbrRelem];
            }
        }
       
        return false; 
    }
});

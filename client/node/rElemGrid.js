 
exports.rElemGrid = function(
    iavailableRelems,
    iavailableTransitions,
    iscreenSize,
    isize,                      // size of the grid 
    iratioGrid,                 // Grid global ratio
    iratioScreen,               // Screen global ratio
    icolumnRatioList,           // List of columns ratios
    irowRatioList,              // List of rows ratio
    ioffset                     // Manual offset
){
    /*
     * Clean all relems
     */
    this.clearAll       = function()
    {
        console.log("[rElemgrid.clearAll]");
        
        // Removing all relems
        for(x = 0; x < this.globalRelemList.length; x++)
            this.removeRelem(this.globalRelemList[x],true);
        
        // Cleaning the grid
        for(x = 0; x < this.relemGrid.length; x++ ){
            for(y = 0; y < this.relemGrid[x].length; y++ ){
                this.relemGrid[x][y].relemList = new Array();
            }
        }
        this.globalRelemList = new Array();
    }
    /*
     * Remove given relem
     */
    this.removeRelem    = function(rElem,allIsClearing)
    {
        if(allIsClearing)
        {
            rElem.parentCleanup();
            return;
        }
        
        this.globalRelemList = this.globalRelemList.filter(function(value,index){return value.instanceName != rElem.instanceName;});
 
        for(var cellId in rElem.cellList)
        {
            var x= rElem.cellList[cellId].x;
            var y= rElem.cellList[cellId].y;
            
            console.log("[rElemgrid.removeRelem] Removing rElem at coordinates ["+x+":"+y+"]");
            
            for(var z = 0;z < this.relemGrid[x][y].relemList.length;z++)
                if ( this.relemGrid[x][y].relemList[z].instanceName == rElem.instanceName ){
                    this.relemGrid[x][y].relemList[z].parentCleanup();
                    this.relemGrid[x][y].relemList.splice(z,1);
                    continue;
                    
                }
               
        }
    }
    /*
     * Clear cell, except given relem
     */
    this.clearCells = function(cellList,exception)
    {

        for(var i in cellList)
        {
            var x = cellList[i].x;
            var y = cellList[i].y;
            
                    console.log("[rElemgrid.clearCells] Clearing cell "+x+":"+y);

            for(var z=0;z<this.relemGrid[x][y].relemList.length;z++)
            {
                // If the relem is the new relem, don't destroy it
                if(exception.instanceName != this.relemGrid[x][y].relemList[z].instanceName){
                    this.removeRelem(this.relemGrid[cellList[i].x][cellList[i].y].relemList[z],false);
                }
            }
        }  
    }
    /*
     * Add a new relem at given coordinate
     */
    this.newRelem = function(baseX,baseY,sizeX,sizeY,className,zIndex,displayMode,data)
    {
        var x = y = 0;
        
        var gridX = baseX;
        var gridY = baseY;
         
        // If the base postion is invalid, return immediately
        if(baseX >= this.gridSizeX || baseY >= this.gridSizeY)
        {
            console.error("[rElemGrid.newRelem] Invalid base coordinates");
            return false;
        }
            
       console.log("[rElemGrid.newRelem] Real base coordinates: ["+baseX+":"+baseY+"]");
            
        var endX = baseX + sizeX-1;
        var endY = baseY + sizeY-1;
            
       console.log("[rElemGrid.newRelem] Real end coordinates: ["+endX+":"+endY+"]");

        if(endX >= this.gridSizeX)
        {
            console.error("[rElemGrid.newRelem] rElem too wide to fit at "+baseX+":"+baseY);
            return false;
        }
        
        if(endY >= this.gridSizeY)
        {
            console.error("[rElemGrid.newRelem] rElem too tall to fit at "+baseX+":"+baseY);
            return false;
        }

        /*
         * Computing real cell list and z-Index, expanding over mask cells
         */
        var cellList = new Array();
        var minZindex = 0;
        var maxZindex = 0; 

        for(x=baseX;x <= endX; x++)
        {
            for(y=baseY;y <= endY; y++)
            {
                // Adding reference to relem to every covered cell
                cellList.push({x:x,y:y});
                
                // Computing min and max zIndex if necessary
                if(displayMode == 'front'  || displayMode == 'back')
                    for(var z = 0;z < this.relemGrid[x][y].relemList.length;z++)
                    {
                        if(this.relemGrid[x][y].relemList[z].z >= maxZindex)
                            maxZindex = this.relemGrid[x][y].relemList[z].z+1;
                        if(this.relemGrid[x][y].relemList[z].z <= minZindex)
                            minZindex = this.relemGrid[x][y].relemList[z].z-1;
                    }
            }
        }
        
        var z = (displayMode == 'front' ? maxZindex : displayMode == 'back' ? minZindex : zIndex);
                
        try
        {
            var newRelem = new this.availableRelems[className](baseX,baseY,gridX,gridY,sizeX,sizeY,endX,endY,cellList,z,data);
        }
        catch(e)
        {
            console.log("[rElemGrid.NewRelem] Unknown relem "+className);
            return;
        }
        
            console.log("[rElemGrid.NewRelem]["+className+"] displayMode "+displayMode+" zIndex "+z);

            // Copying this rElem reference to every used cell
            for(var cell in cellList)
            {
                this.relemGrid[cellList[cell].x][cellList[cell].y].relemList.push(newRelem);
                this.relemGrid[cellList[cell].x][cellList[cell].y].relemList.sort(function(a,b){return a.z < b.z ? -1 : a.z > b.z ? 1 : 0});
            }
                
                
            // And to the flat list
            this.globalRelemList.push(newRelem);
            
            // And sort it by zIndex
            this.globalRelemList.sort(function(a,b){return a.z < b.z ? -1 : a.z > b.z ? 1 : 0});
                    
            // Synchronous loading
            if(newRelem.isReady)
            {
            console.log("[relemGrid.NewRelem "+className+"] already loaded");
               // If replace mode, asking each present rElem to leave
               if(displayMode == 'replace')
               {
                   this.clearCells(cellList,newRelem);
               }
               newRelem.fadeIn();
            }
            else // Async loading
            {
                
                console.log("[relemGrid.NewRelem "+className+"] loading...");
                newRelem.loadParent(function(){
                                console.log("[relemGrid.NewRelem]["+className+"] Loading done");

               if(displayMode ==  'replace')
                  {
                       mainGrid.clearCells(cellList,newRelem);
                  }
                  newRelem.fadeIn();
                });
            }
            return newRelem;
        

    }
    this.clearNextSlideRelemsQueue = function()
    {}
    /*
     * Queue relem in next slide relems queue
     */
    this.queueRelem = function(
        startX,         // This window position in the windowset 
        startY,         // 
        BaseX,          // This relem position in this window
        BaseY,          //
        sizeX,          // This relem size in this windowset
        sizeY,          //
        className,
        zIndex,
        displayMode,
        data,
        startTime,
        callback
    )
    {
         console.log("[rElemGrid.queueRelem] Size: ["+sizeX+":"+sizeY+"]");

        // Base coords relative to the whole windowset
        var globalBaseX         = BaseX;
        var globalBaseY         = BaseY;
        var localBaseX          = BaseX-this.gridSizeX*startX;        
        var localBaseY          = BaseY-this.gridSizeY*startY;
        var truncLocalBaseX     = localBaseX < 0 ? 0 : localBaseX;
        var truncLocalBaseY     = localBaseY < 0 ? 0 : localBaseY;
        
        var globalEndX          = BaseX+sizeX-1;
        var globalEndY          = BaseY+sizeY-1;
        var localEndX           = localBaseX+sizeX-1;
        var localEndY           = localBaseY+sizeY-1;        
        var truncLocalEndX      = localEndX >= this.gridSizeX ? this.gridSizeX-1 : localEndX;
        var truncLocalEndY      = localEndY >= this.gridSizeY ? this.gridSizeY-1 : localEndY;
        
        var z                   = zIndex;
        
       // If the relem is not even partially in our window
        if(localBaseX+sizeX <=0 || localBaseY+sizeY <=0 || localBaseX >= this.gridSizeX || localBaseY >= this.gridSizeY )
        {
            console.error("[rElemGrid.queueRelem] rElem is out of our window, Ignoring.");
            return false;
        }

        console.log("[rElemGrid.queueRelem] Size: ["+sizeX+":"+sizeY+"]");
        console.log("[rElemGrid.queueRelem] Local base coordinates: ["+localBaseX+":"+localBaseY+"]");
        console.log("[rElemGrid.queueRelem] Global base coordinates: ["+globalBaseX+":"+globalBaseY+"]");
        console.log("[rElemGrid.queueRelem] Local end coordinates: ["+localEndX+":"+localEndY+"]");
        console.log("[rElemGrid.queueRelem] Global end coordinates: ["+globalEndX+":"+globalEndY+"]");
        console.log("[rElemGrid.queueRelem] Trunc coordinates: ["+truncLocalBaseX+":"+truncLocalBaseY+"]");
        console.log("[rElemGrid.queueRelem] Trunc coordinates: ["+truncLocalEndX+":"+truncLocalEndY+"]");

//         if(endX >= this.gridSizeX || endY >= this.gridSizeY)
//             console.log("[rElemGrid.queueRelem] rElem is multi screen");
        
//         if(globalEndX >= this.gridSizeX+startX*this.gridSizeX)
//         {
//             console.error("[rElemGrid.queueRelem] rElem too wide to fit at "+baseX+":"+baseY);
//             return false;
//         }
//         
//         if(globalEndY >= this.gridSizeY+startY*this.gridSizeY)
//         {
//             console.error("[rElemGrid.queueRelem] rElem too tall to fit at "+baseX+":"+baseY);
//             return false;
//         }
        
        var cellList = new Array();

        var x = y = 0;
        
        for(x=truncLocalBaseX;x <= truncLocalEndX; x++)
            for(y=truncLocalBaseY;y <= truncLocalEndY; y++)
                // Adding reference to relem to every covered cell
                cellList.push({x:x,y:y});

            
        
        try
        {
            var newRelem = new this.availableRelems[className](globalBaseX,globalBaseY,localBaseX,localBaseY,sizeX,sizeY,globalEndX,globalEndY,localEndX,localEndY,cellList,z,startTime,data);
        }
        catch(e)
        {
            console.log("[rElemGrid.queueRelem] Unknown relem "+className+" (err:"+e+")");
            return;
        }
        
        this.nextSlideGlobalRelemList.push(newRelem);
        
        if(!newRelem.isReady)
            newRelem.loadParent(callback); 
        
        return true;
    }
    /*
     * Calculate positions of each zone depending on the ratioList provided
     */
    this.computePositions = function()
    {
        /* ratioGrid > ratioScreen means grid is more landscape format */
        
        console.log("[rElemGrid.computePositions] ratio: Screen "+ratioScreen+" Grid: "+ratioGrid);
        
        this.wrapper            = {height:0,width:0,base:{x:0,y:0}};
        
        // Screen       > Grid          => Screen is more landscape
        // Grid         > Screen        => Grid is more landscape
        
        this.wrapper.width      = ratioGrid     > ratioScreen   ? this.screenWidth  : ratioGrid/ratioScreen * this.screenWidth;
        this.wrapper.height     = ratioScreen   > ratioGrid     ? this.screenHeight : ratioGrid/ratioScreen * this.screenHeight;
        this.wrapper.base.x     = (this.screenWidth-this.wrapper.width)/2;
        this.wrapper.base.y     = (this.screenHeight-this.wrapper.height)/2;
        
        console.log("[rElemGrid.computePositions] screen: ["+this.screenWidth+"x"+this.screenHeight+"] wrapper: ["+this.wrapper.width+"x"+this.wrapper.height+"] @ ["+this.wrapper.base.x+":"+this.wrapper.base.y+"]");
  
        var cursor           = {x:this.wrapper.base.x,y:this.wrapper.base.y};
        
        for(var y =0;y < this.gridSizeY; y++)
        {          
            cursor.x = this.wrapper.base.x;
            for(var x=0;x < this.gridSizeX;x++)
            {  
                
                this.relemGrid[x][y].positions  =       {x:cursor.x,y:cursor.y};
                this.relemGrid[x][y].dimensions =       {x:columnRatioList[x]*this.wrapper.width,y:rowRatioList[y]*this.wrapper.height};

                cursor.x += columnRatioList[x]*this.wrapper.width;
            }
            cursor.y += rowRatioList[y]*this.wrapper.height;

        }
        
    }
    /*
     * Return true if next slide is ready
     */
    this.isNextSlideReady = function()
    {
        for(var i in  this.nextSlideGlobalRelemList)
            if(!this.nextSlideGlobalRelemList[i].isReady)
            {
                console.log("[rElemGrid.isNextSlideReady] relem "+this.nextSlideGlobalRelemList[i].type+" not ready");
                return false;
            }
            
        return true;
    }
    /*
     * Display next preloaded slide
     */
    this.nextSlide = function(ctx,transition,waitForRelemsToBeReady)
    {        
        if(waitForRelemsToBeReady && !this.isNextSlideReady())
        {
            return;
        }
        
                
        try
        {          
            var that = this;
            
            this.transition = new this.availableTransitions[transition](ctx,this.globalRelemList,this.nextSlideGlobalRelemList,this.wrapper);
            this.transition.setFinishCallback(function(){that.endTransition();});
            this.crossfading = true;
            console.log("[rElemGrid.nextSlide] Using transition "+transition);

        }
        catch(e)
        {
            console.log("[rElemGrid.nextSlide] Unknown transition "+transition+". Proceeding without transition.");
            this.endTransition();
        }
    }
    
    this.endTransition = function()
    {
        console.log("[rElemGrid.endTransition] Finished, clearing.");

        this.clearAll();
        
        // Copy new relems cells in maingrid cells
        for(var rIndex in this.nextSlideGlobalRelemList)
        {
            var relem       = this.nextSlideGlobalRelemList[rIndex];
            var cellList    = relem.cellList;
            
            
            // Update globalRelemList
            this.globalRelemList.push(relem);
            
            // Copy reference to this relem in every covered cell
            for(var cell in cellList)
            {
                this.relemGrid[cellList[cell].x][cellList[cell].y].relemList.push(this.globalRelemList[this.globalRelemList.length-1]);
            }
            
//             console.log("::"+this.relemGrid[cellList[cell].x][cellList[cell].y].relemList[this.globalRelemList.length-1].cellList.length+":");
        }

        this.nextSlideGlobalRelemList = new Array();        
        this.crossfading = false;
    }
    /*
     * Dessine les relems sur le canvas
     */
    this.drawRelems = function(ctx)
    {
     
       // Applying redraw depedencies
       
       if(!(this.forceFullDraw || (this.crossfading && this.transition.forceFullDraw)))
           for(var i in this.globalRelemList)
           {

               if(this.globalRelemList[i].needRedraw)
               {

                                  
                   for(var j in this.globalRelemList[i].cellList)
                   {    

                       for(var k in this.globalRelemList[i].cellList[j])
                       {
                           var x = this.globalRelemList[i].cellList[j].x;
                           var y = this.globalRelemList[i].cellList[j].y;

                           for(var l in  this.relemGrid[x][y].relemList)
                           {
                              /*
                               * If same relem, of current relem is opaque and in front of the analysed relem, or if relem is not ready
                               */
                              if(
                                      this.globalRelemList[i].instanceName == this.relemGrid[x][y].relemList[l].instanceName                                                   
                                  || (this.globalRelemList[i].opaque && this.globalRelemList[i].z > this.relemGrid[x][y].relemList[l].z )
                                  || !this.relemGrid[x][y].relemList[l].isReady
                              )
                              continue;
                              this.relemGrid[x][y].relemList[l].addRedrawZone(x,y);
                           }
                       }
                   }
               }
            }
            
        if(this.crossfading)
            this.transition.parentBeforeDraw();
            
        for(var i in this.globalRelemList)
        {
           if(((this.globalRelemList[i].needRedraw || this.globalRelemList[i].redrawZones.length > 0)
               && this.globalRelemList[i].isReady) || this.forceFullDraw ||
               (this.crossfading && this.transition.forceFullDraw))
           {
//             console.log("[rElemGrid.drawRelems][rElem "+this.globalRelemList[i].type+":"+this.globalRelemList[i].instanceName+"] Smart draw");
               this.globalRelemList[i].smartDraw(ctx);
           }
        }
        
        if(this.crossfading)
            this.transition.parentAfterDraw();    
    }
    
    this.gridSizeX          = isize.w;
    this.gridSizeY          = isize.h;
    var ratioGrid          = iratioGrid;
    var ratioScreen        = iratioScreen;
    var columnRatioList    = icolumnRatioList;
    var rowRatioList       = irowRatioList;
    
    this.forceFullDraw     = false;
    
    this.offset            = ioffset;
    this.screenWidth       = iscreenSize.w;
    this.screenHeight      = iscreenSize.h;
    this.availableRelems   = iavailableRelems;
    this.availableTransitions = iavailableTransitions;
    
    var backgroundImage    = false;
    var overlayImage       = false;
    
    this.relemGrid          = new Array();
    this.globalRelemList    = new Array();
    
    this.nextSlideGlobalRelemList = new Array();

    var x,y;
    x = y = 0;
    
    for(;x < this.gridSizeX; x++)
    {
        this.relemGrid.push(new Array());
        
        for(y=0;y < this.gridSizeY;y++)
        {
                this.relemGrid[x].push({
                    relemList:(new Array()),
                    positions:{},
                    dimensions:{}
                });
               
        }
    }
};


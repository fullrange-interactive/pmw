
exports.rElemGrid = function(
    iavailableRelems,
    iscreenSize,
    isize,                     // size of the grid 
    iratioGrid,                 // Grid global ratio
    iratioScreen,               // Screen global ratio
    icolumnRatioList,           // List of columns ratios
    irowRatioList,              // List of rows ratio
    icolumnMaskList,            // List of mask columns
    irowMaskList,             // List of mask rows
    icellMaskList,             // List of isolated mask cells
    ioffset
){
    
    /*
     * Return if a cell is an isolated mask cell
     */
    var isMaskCell = function(x,y)
    {
        return (typeof(cellMaskList.filter(function(source,x,y){ return source.x=x && source.y=y;})[0])  != 'undefined');  
    }
    
    /*
     * Clean all relems
     */
    this.clearAll       = function()
    {
        console.log("[ClearAll]");

        for(x = 0; x < this.relemGrid.length; x++ ){
            for(y = 0; y < this.relemGrid[x].length; y++ ){
                for(var i in this.relemGrid[x][y].relemList){
                        this.removeRelem(this.relemGrid[x][y].relemList[i]);
//                        this.relemGrid[x][y].relemList[0].cleanup();
//                        this.relemGrid[x][y].relemList.splice(0,1);
                }
            }
        }                                          
        //this.globalRelemList = new Array();
    }
    
    /*
     * Remove given relem
     */
    this.deleteQueue = function()
    {
        for(var i in this.toDeleteQueue){
            var rElem = this.toDeleteQueue[i];

            for(var cellId in rElem.cellList)
            {
                var x= rElem.cellList[cellId].x;
                var y= rElem.cellList[cellId].y;
                console.log("[ClearRelem] "+x+":"+y);
                for(var z = 0;z < this.relemGrid[x][y].relemList.length;z++)
                    if ( this.relemGrid[x][y].relemList[z].instanceName == rElem.instanceName ){
                        this.relemGrid[x][y].relemList[z].cleanup();
                        this.relemGrid[x][y].relemList.splice(z,1);
                        z--;
                    }
            }
            this.globalRelemList = this.globalRelemList.filter(function(value,index){return value.instanceName != rElem.instanceName;});
        }
        this.toDeleteQueue = [];
    },
    this.removeRelem    = function(rElem)
    {
        if ( this.toDeleteQueue.indexOf(rElem) == -1 ){
            rElem.deleting = true;
            this.toDeleteQueue.push(rElem);
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
            
                    console.log("[ClearCells] "+x+":"+y);

            for(var z=0;z<this.relemGrid[x][y].relemList.length;z++)
            {
                // If the relem is the new relem, don't destroy it
                if(exception.instanceName != this.relemGrid[x][y].relemList[z].instanceName){
                    this.removeRelem(this.relemGrid[cellList[i].x][cellList[i].y].relemList[z]);
                }
            }
        }
        
        var debug = '[';
        for(var i in this.globalRelemList)
            debug+=this.globalRelemList[i].instanceName+' ';
           
  
         
    }
    /*
     * Add a new relem at given coordinate
     */
    this.newRelem = function(baseX,baseY,sizeX,sizeY,className,displayMode,data)
    {
//         
        var x = y = 0;
        
        var gridX = baseX;
        var gridY = baseY;

        /*dimensions
         * Computing real baseX, baseY
         */
        for(x=0;x<=baseX;x++)
            if(columnMaskList[x])
                baseX++;
            
        for(y=0;y<=baseY;y++)
            if(rowMaskList[y])
                baseY++;
            
//         If the base postion is invalid, return immediately
        if(rowMaskList[baseX] || columnMaskList[baseY] || isMaskCell(baseX,baseY) || baseX >= gridSizeX || baseY >= gridSizeY)
        {
            console.error("[rElemGrid.newRelem] Invalid base coordinates");
            return false;
        }
            
       console.log("[rElemGrid.newRelem] Real base coordinates: ["+baseX+":"+baseY+"]");
            
        var endX = baseX + sizeX-1;
        var endY = baseY + sizeY-1;
   
        
        /*dimensions
         * Computing real endX, endY
         */
        for(x=baseX;x<=endX;x++)
            if(columnMaskList[x])
                endX++;
            
        for(y=baseY;y<=endY;y++)
            if(rowMaskList[y])
                endY++;
            
       console.log("[rElemGrid.newRelem] Real end coordinates: ["+endX+":"+endY+"]");

            
        if(endX >= gridSizeX)
        {
            console.error("[rElemGrid.newRelem] rElem too wide to fit at "+baseX+":"+baseY);
            return false;
        }
        
        if(endY >= gridSizeY)
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
//             if(x >= gridSizeX)
//             {
//                 console.error("[rElemGrid.newRelem]dimensions rElem too wide to fit at "+baseX+":"+baseY);
//                 return false;
//             }
            // If current column is mask, expected end is one cell further on X
            if(columnMaskList[x])
            {
                    

//                 endX++;
                continue;
            }

            for(y=baseY;y <= endY; y++)
            {
//                 if(y >= gridSizeY)
//                 {
//                     console.error("[rElemGrid.newRelem] rElem too tall to fit at "+baseX+":"+baseY);
//                     return false;
//                 }
                // If current row is mask, expected end is one cell further on Y
                if(rowMaskList[y])
                {
                    

//                     endY++;
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
        var zIndex = (displayMode == 'front' ? maxZindex : displayMode == 'back' ? minZindex : 0);
        
//         var newRelem = '';
        
        try
        {
            var newRelem = new this.availableRelems[className](baseX,baseY,gridX,gridY,sizeX,sizeY,endX,endY,cellList,zIndex,data);
        }
        catch(e)
        {
            console.log("[NewRelem] Unknown relem "+className);
            return;
        }
        
            console.log("[NewRelem "+className+"] displayMode "+displayMode+" zIndex "+zIndex);

            // Copying this rElem reference to every used cell
            for(var cell in cellList)
                this.relemGrid[cellList[cell].x][cellList[cell].y].relemList.push(newRelem);
                
                
            // And to the flat list
            this.globalRelemList.push(newRelem);
            
            // And sort it by zIndex
            this.globalRelemList.sort(function(a,b){return a.zIndex < b.zIndex ? -1 : a.zIndex > b.zIndex ? 1 : 0});
                    
              

            // Synchronous loading
            if(newRelem.isReady)
            {
               // If replace mode, asking each present rElem to leave
               if(displayMode == 'replace')
               {
                   this.clearCells(cellList,newRelem);
               }
                            
               newRelem.fadeIn();
            }
            else // Async loading
            {
                
                
                newRelem.loadParent(function(){
               if(displayMode ==  'replace')
                  {
                       mainGrid.clearCells(cellList,newRelem);
                  }
                  newRelem.fadeIn();
                });
            }
            return newRelem;
        

    }
    
    
    this.computePositions = function()
    {
        /* ratioGrid > ratioScreen means grid is more landscape format */
        
        this.wrapperWidth     = ratioGrid>ratioScreen ? this.screenWidth : ratioScreen/ratioGrid * this.screenWidth;
        this.wrapperHeight    = ratioGrid<ratioScreen ? this.screenHeight : ratioScreen/ratioGrid * this.screenHeight;
        this.wrapperBaseX     = ratioGrid>ratioScreen ? 0 :(this.screenWidth-this.wrapperWidth)/2;
        this.wrapperBaseY     = ratioGrid<ratioScreen ? 0 : (this.screenHeight-this.wrapperHeight)/2;
        
        console.log("[rElemGrid.computePositions] screen: ["+this.screenWidth+"x"+this.screenHeight+"] wrapper: ["+this.wrapperWidth+"x"+this.wrapperHeight+"] @ ["+this.wrapperBaseX+":"+this.wrapperBaseY+"]");
  
//         this.wrapperWidth     = this.screenWidth-this.offset.left-this.offset.right;
//         this.wrapperHeight    = this.screenHeight-this.offset.top-this.offset.bottom;
//         
//         this.wrapperBaseX     = this.offset.left;
//         this.wrapperBaseY     = this.offset.top;
        
//        var scaleX       =       ratioGrid>ratioScreen  
//        var scaleY       =       ratioGrid>ratioScreen
//        
// //         var scaleX            = (this.wrapperWidth-offset.left-offset.right)/this.wrapperWidth;
// //         var scaleY            = (this.wrapperHeight-offset.top-offset.bottom)/this.wrapperHeight;
// 
//         this.wrapperWidth     *= scaleX;
//         this.wrapperHeight    *= scaleY;

//         var scaleY            = 1;
        
        

        
        var cursor           = {x:this.wrapperBaseX,y:this.wrapperBaseY};
        
        for(var y =0;y < gridSizeY; y++)
        {          
            cursor.x = this.wrapperBaseX;
            for(var x=0;x < gridSizeX;x++)
            {  
                
                this.relemGrid[x][y].positions  =       {x:cursor.x,y:cursor.y};
                this.relemGrid[x][y].dimensions =       {x:columnRatioList[x]*this.wrapperWidth,y:rowRatioList[y]*this.wrapperHeight};

                cursor.x += columnRatioList[x]*this.wrapperWidth;
            }
            cursor.y += rowRatioList[y]*this.wrapperHeight;

        }
        
    }
    
    /*
     * Draw the grid on canvas
     */
    this.draw = function(ctx){
        

        
//        
//        
       
        for(var y =0;y < gridSizeY; y++)
        {          
            if(rowMaskList[y])
                ctx.fillRect(this.wrapperBaseX,this.relemGrid[0][y].positions.y,this.wrapperWidth,this.relemGrid[0][y].dimensions.y);
        }
        for(var x=0;x < gridSizeX;x++)
        {
            if(columnMaskList[x])
                ctx.fillRect(this.relemGrid[x][0].positions.x,this.wrapperBaseY,this.relemGrid[x][0].dimensions.x,this.wrapperHeight);
        }
//         ctx.drawImage(this.arcImg,this.wrapperBaseX,this.wrapperBaseY);


    };
    
    this.getAllRelems = function(){
        var retArray = new Array();
        for(x = 0; x < this.relemGrid.length; x++ )
            for(y = 0; y < this.relemGrid[x].length; y++ )
                for(z = 0; z < this.relemGrid[x][y].relemList.length; z++ )
                    if ( retArray.indexOf(this.relemGrid[x][y].relemList[z]) == -1 )
                        retArray.push(this.relemGrid[x][y].relemList[z]);
        return retArray;
    }
    
    // Grid constructor
    var gridSizeX          = isize.w;
    var gridSizeY          = isize.h;
    var ratioGrid          = iratioGrid;
    var ratioScreen        = iratioScreen;
    var columnRatioList    = icolumnRatioList;
    var rowRatioList       = irowRatioList;
    var columnMaskList     = icolumnMaskList;
    var rowMaskList        = irowMaskList;
    var cellMaskList       = icellMaskList;
    
    this.offset            = ioffset;
    this.screenWidth       = iscreenSize.w;
    this.screenHeight      = iscreenSize.h;
    this.availableRelems   = iavailableRelems;
    this.toDeleteQueue     = [];
    
    var backgroundImage    = false;
    var overlayImage       = false;
    
    var Canvas              = require('/home/pi/pmw/client/node//node_modules/openvg-canvas/lib/canvas.js');
    var fs                  = require('fs');
    var arc                 = fs.readFileSync('/home/pi/pmw/client/node/mask.png');
    this.arcImg             = new Canvas.Image();
    
    this.arcImg.src         = arc;

    this.relemGrid          = new Array();
    this.globalRelemList    = new Array();

    var x,y;
    x = y = 0;
    
    for(;x < gridSizeX; x++)
    {
        this.relemGrid.push(new Array());
        for(y=0;y < gridSizeY;y++)
        {
                this.relemGrid[x].push({
                    relemList:(new Array()),
                    positions:{},
                    dimensions:{}
                });
               
        }
    }
};


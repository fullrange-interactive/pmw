exports.class = {
    type:'Fireworks',
    offset:0,
    gravity:0.8,
    friction:0.99,
    boomId:0,
    draw:function(ctx)
    {
        var now = (new Date()).getTime();

        if(now-this.lastBoom > 1000)
        {
            this.boom();
            this.lastBoom = now;
        }
        for(var i in this.rockets)
        {
            ctx.fillStyle = "rgb("+this.rockets[i].r+","+this.rockets[i].g+","+this.rockets[i].b+")";

            for(var j in this.rockets[i].particles)
            {
                if(this.rockets[i].particles[j].ttl !=0)
                {
                    ctx.fillRect(this.rockets[i].particles[j].x,this.rockets[i].particles[j].y, 2, 2 );
                    this.rockets[i].particles[j].x += this.rockets[i].particles[j].vx;
                    this.rockets[i].particles[j].y += this.rockets[i].particles[j].vy;
                    this.rockets[i].particles[j].vx *=  this.friction
                    this.rockets[i].particles[j].vy += this.gravity; 
                    this.rockets[i].particles[j].ttl--;
                }
            }
        }
    },
//     animate:function(context)
//     {
//         
//         for(var i in context.rockets)
//             for(var j in context.rockets[i].particles)
//             {
// 
//                 
//             }
//             
//         setTimeout(this.animate(context),30);
// 
//     },
    boom:function()
    {

        this.rockets[this.boomId].time=(new Date().getTime());
        this.rockets[this.boomId].r=255;
        this.rockets[this.boomId].g=255;
        this.rockets[this.boomId].b=255;
        this.rockets[this.boomId].x=getRandomInt(this.left,this.left+this.width);
        this.rockets[this.boomId].y=getRandomInt(this.top,this.top+this.height);

        for(var i in this.rockets[this.boomId].particles)
        {
            this.rockets[this.boomId].particles[i].x = this.rockets[this.boomId].x;
            this.rockets[this.boomId].particles[i].y=this.rockets[this.boomId].y;
            this.rockets[this.boomId].particles[i].vx=getRandomInt(-10,10);
            this.rockets[this.boomId].particles[i].vy=getRandomInt(-10,5);
            this.rockets[this.boomId].particles[i].ttl=getRandomInt(5,150);
        }
        
        this.boomId = (this.boomId+1) % this.rockets.length;
        
    },
    isReady:false,
    load:function(callback){
        
        this.rockets = new Array();
        this.lastBoom = (new Date()).getTime();
        this.boomId = 0;
        for(var i=0;i<5;i++)
        {
            this.rockets.push({
                time:0,
                r:0,
                g:0,
                b:0,
                x:0,
                y:0
            });
            this.rockets[i].particles = new Array();
            for(var j=0;j<20;j++)
            {
               this.rockets[i].particles.push({
                  x:0,
                  y:0,
                  vx:0,
                  vy:0,
                  ttl:0
                });    
            }
        }
        

        var that = this;
//         setTimeout(this.animate(this),100);
// this.boom();
         setInterval(function(){that.boom()},1000);
        callback();
    }
};
import Symbol from './Symbol'
import * as DrawUtils from './DrawUtils'
import NotePaintContext from './NotePaintContext'

class Rest extends Symbol
{
    doDraw: ((ctx: CanvasRenderingContext2D)=>void) | null = null;
    dots :number = 0;
    
    constructor(power: number, x: number, context: NotePaintContext)
    {
        super(x, context);
        switch (power)
        {
            case 0:
            {
                //rest 1
                this.doDraw = (ctx: CanvasRenderingContext2D)=>{ ctx.fillRect(-0.7, -1, 1.4, 0.5); };
                this.centerY = -this.context.space;
                this.bb.x = -0.7*this.context.space;
                this.bb.w = 1.4*this.context.space;
                this.bb.y = 0;
                this.bb.h = 0.5*this.context.space;
                break;
            }
            case -1:
            {
                //rest 1
                this.doDraw = (ctx: CanvasRenderingContext2D)=>{ ctx.fillRect(-0.7, -0.5, 1.4, 0.5); };
                this.centerY = 0;
                this.bb.x = -0.7*this.context.space;
                this.bb.w = 1.4*this.context.space;
                this.bb.y = -0.5*this.context.space;
                this.bb.h = 0.5*this.context.space;
                break;
            }
            case -2:            
            {
                this.doDraw = (ctx: CanvasRenderingContext2D)=>
                {
                    //rest 1/4
                    ctx.lineWidth = 0.1;
                    ctx.beginPath();
                    ctx.moveTo(0.1, 1.2);
                    ctx.bezierCurveTo( -0.4,0.4, -0.1,0.3, 0.5,0.5 );
                    ctx.bezierCurveTo( -1.0,-1.0, 1.6, 0.3, -0.3,-1.5 );
                    ctx.bezierCurveTo( 1.0, 0.0, -1.5,-1.0, 0.3, 0.3 );
                    ctx.bezierCurveTo( -0.4,0.2, -0.6,0.1, 0.1, 1.2 );
                    
                    ctx.fill();
                    ctx.stroke();
                };
                this.centerY = 0;
                this.bb.x = -0.5*this.context.space;
                this.bb.w = this.context.space;
                this.bb.y = -this.context.space;
                this.bb.h = 2.0*this.context.space;
                break;
            }
            case -3:
            {
                this.doDraw = (ctx: CanvasRenderingContext2D)=>
                {
                    ctx.translate(0, 0);
                    this.drawSquigglyRest(1, ctx);
                }
                this.centerY = 0;
                this.bb.x = -0.5*this.context.space;
                this.bb.w = this.context.space;
                this.bb.y = -this.context.space;
                this.bb.h = 2.0*this.context.space;
                break;
            }
            case -4:
            {
                this.doDraw = (ctx: CanvasRenderingContext2D)=>
                {
                    ctx.translate(0, 1);
                    this.drawSquigglyRest(2, ctx);
                }
                this.centerY = 0;
                this.bb.x = -0.5*this.context.space;
                this.bb.w = this.context.space;
                this.bb.y = -this.context.space;
                this.bb.h = 3.0*this.context.space;
                break;
            }
            case -5:
            {
                this.doDraw = (ctx: CanvasRenderingContext2D)=>
                {
                    ctx.translate(0, 1);
                    this.drawSquigglyRest(3, ctx);
                }
                this.centerY = -this.context.space;
                this.bb.x = -0.5*this.context.space;
                this.bb.w = this.context.space;
                this.bb.y = -this.context.space;
                this.bb.h = 4.0*this.context.space;
                break;
            }
            case -6:
            {
                this.doDraw = (ctx: CanvasRenderingContext2D)=>
                {
                    ctx.translate(0, 2);
                    this.drawSquigglyRest(4, ctx);
                }
                this.centerY = -this.context.space;
                this.bb.x = -0.5*this.context.space;
                this.bb.w = this.context.space;
                this.bb.y = -2.0*this.context.space;
                this.bb.h = 5.0*this.context.space;
                break;
            }
        }
    }
    
    drawCurl = (x :number, y :number, ctx: CanvasRenderingContext2D) =>
    {
        ctx.bezierCurveTo(x-0.1,y+0.6, x-0.1,y+0.6, x-0.9,y+0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc( x-0.7,y+0.2, 0.25,0,2*Math.PI);
        ctx.fill();
    }
    
    drawSquigglyRest = (n: number, ctx: CanvasRenderingContext2D) =>
    {
        ctx.lineWidth = 0.2;
        ctx.beginPath();
        var startX = 0;
        var startY = 0.9;
        ctx.moveTo(startX, startY);
        
        var x = 0.5;
        var y = -0.7;
        var incl = (x-startX) / (y-startY);
        
        x -= (n-1)*incl;
        y -= (n-1);
        ctx.lineTo( x,y );
        this.drawCurl(x,y,ctx);
        
        for (let i=1; i<n; ++i)
        {
            ctx.beginPath();
            y+=1;
            x+=incl;
            ctx.moveTo(x,y);
            this.drawCurl(x,y,ctx);
        }
    }
    
    
    draw = (ctx: CanvasRenderingContext2D) :void =>
    {
        ctx.save();
        ctx.translate(this.centerX, 0);
        ctx.scale(this.context.space, this.context.space);
        
        if ( this.doDraw)
        {
            this.doDraw(ctx);
        }
        
        DrawUtils.drawDots(1, 0, this.dots, ctx);
        ctx.restore();
    }
};

export default Rest
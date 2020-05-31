import NotePaintContext from './NotePaintContext'
import Symbol from './Symbol'
import * as DrawUtils from './DrawUtils'

class Note extends Symbol
{
    pitch :number;
    alt :number;
    centerY :number;
    power :number;
    drawFlag = true;
    stem :{x:number, y:number, h:number}|null = null;
    dots :number = 0;

    constructor (power: number, note: number, alt: number, cursor: number, context: NotePaintContext)
    {
        super(0, context);

        this.pitch = note;
        this.alt = alt;
        this.power = power;
        this.context = context;  
        this.centerX = cursor;
        this.centerY = context.space * 3 - this.pitch * context.space/2;
        if ( this.power < 0 )
        {
            this.setstemH( this.centerY > 0 ? -context.space*3.7 : context.space*3.7 );
        }
        else
        {
            this.updateBB();
        }
    }    
    
    updateBB = () =>
    {
        this.bb.y = -this.context.space/2;
        this.bb.h = this.context.space;
        if ( this.stem )
        {
            this.bb.extendToPoint(0, this.stem.h);
        }
    }
    
    getstemX = (above :boolean) :number =>
    {
        return above ? 0.6*this.context.space : -0.6*this.context.space;
    };
    
    setstemH = (hstem :number) :void =>
    {
        if ( hstem > 0 )
        {
            this.stem = {x:this.getstemX(false), y:0, h:hstem};  
        }
        else if ( hstem < 0 )
        {
            this.stem = {x:this.getstemX(true), y:0, h:hstem};            
        }   
        else
        {
            this.stem = null;
        }
        this.updateBB();
    };
       
    
    draw = (ctx: CanvasRenderingContext2D) =>
    {
        //debug draw bounding box
        //ctx.beginPath();
        //ctx.lineWidth = 1;
        //ctx.rect(this.bb.Left(), this.bb.Top(), 2, this.bb.h);
        //ctx.stroke();
        ctx.lineWidth = 1;
        
        let y = this.context.space * 3 - this.pitch * this.context.space/2;
        
        
        //strokes under/above staff
        if ( this.pitch <=0 )
        {
            for ( let pitchLine = 0; pitchLine >= this.pitch; pitchLine -= 2 )
            {
                let yLine = this.context.space * 3 - pitchLine * this.context.space/2;
                ctx.beginPath();
                ctx.moveTo(this.centerX-this.context.space*1.1, yLine);
                ctx.lineTo(this.centerX+this.context.space*1.1, yLine);
                ctx.stroke();
            }
        }
        if ( this.pitch >= 12 )
        {
            for ( let pitchLine = 12; pitchLine <= this.pitch; pitchLine += 2 )
            {
                let yLine = this.context.space * 3 - pitchLine * this.context.space/2;
                ctx.beginPath();
                ctx.moveTo(this.centerX-this.context.space*1.1, yLine);
                ctx.lineTo(this.centerX+this.context.space*1.1, yLine);
                ctx.stroke();
            }
        }
            
        ctx.save();
        
        //Draw stem
        if (this.stem)
        {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.centerX + this.stem.x, this.centerY + this.stem.y);
            ctx.lineTo(this.centerX + this.stem.x, this.centerY + this.stem.y + this.stem.h);
            ctx.stroke();
            
            //draw flags
            if ( this.drawFlag && this.power < -2 )
            {
                let flags = -this.power -2;
                
                let xFlag = this.centerX + this.stem.x;
                let yFlag = this.centerY + this.stem.y + this.stem.h;
                let dirY = (this.stem.h > 0 ? -this.context.space : this.context.space);
                
                ctx.save();
                ctx.translate(xFlag,yFlag);
                ctx.scale(this.context.space,dirY);
                    
                for (let i = 0; i < flags; ++i)
                {
                    ctx.lineWidth = 0.1;
                    ctx.beginPath()
                    ctx.moveTo(0,0);
                    ctx.bezierCurveTo(0.4,1.5, 1.1,0.8, 1,2.5);
                    ctx.bezierCurveTo(1.2,1.5,  0.2,0.8, 0,1);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                    
                    ctx.translate(0,0.7);                
                }
                ctx.restore();
            }
        }
        
        ctx.lineWidth = 0.1;
        
        ctx.translate(this.centerX, y);
        ctx.scale(this.context.space, this.context.space);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, 0.60, 0.32, -0.2, 0, Math.PI*2);
        
        if (this.power >= -1 )
        {
            ctx.ellipse(0, 0, 0.40, 0.29, -0.2, 0, Math.PI*2, true);
        }
        ctx.fill();
        ctx.stroke();
        
        DrawUtils.drawDots(1.3, this.pitch, this.dots, ctx);
        
        // Draw sharp/flat
        if ( this.alt === -1 )
        {
            ctx.translate(-1.8,0.2);
            DrawUtils.drawFlat(ctx);
        }
        else if ( this.alt === 1 )
        {
            ctx.translate(-1.8,0);
            DrawUtils.drawSharp(ctx);
        }
       
        ctx.restore();
    };
};

export default Note
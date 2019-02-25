import {Symbol} from './Symbol';
import { Note } from './Note';
import {NotePaintContext} from './NotePaintContext';

export class Tie extends Symbol
{
    dX :number;
    dY :number;

    constructor(note1 :Note, note2 :Note, context :NotePaintContext)
    {
        super(note1.centerX + context.space*0.8, context);
        this.dX = note2.centerX - context.space*0.8 - this.centerX;
        this.centerY = note1.centerY - context.space*0.2;
        this.dY = note2.centerY - context.space*0.2 - this.centerY;
        this.bb.extendToPoint( this.dX, this.dY );
    }
        
    draw = (ctx : CanvasRenderingContext2D) :void =>
    {
        ctx.beginPath();
        let x3 = this.centerX + this.dX*0.2;
        let x4 = this.centerX + this.dX*0.8;
        let y3 = this.centerY + this.dY*0.2 - this.dX * 0.3;
        let y4 = this.centerY + this.dY*0.8 - this.dX * 0.3;
        let y5 = this.centerY + this.dY*0.2 - this.dX * 0.25;
        let y6 = this.centerY + this.dY*0.8 - this.dX * 0.25;
        
        ctx.moveTo(this.centerX, this.centerY);
        ctx.bezierCurveTo( x3,y3, x4,y4, this.centerX+this.dX, this.centerY+this.dY);
        ctx.bezierCurveTo( x4,y6, x3,y5, this.centerX, this.centerY);
        
        ctx.fill();
        ctx.stroke();
    }
};

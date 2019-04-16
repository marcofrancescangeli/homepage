import {Symbol} from './Symbol';
import { Note } from './Note';
import {NotePaintContext} from './NotePaintContext';

export class Staff extends Symbol
{
    constructor(context :NotePaintContext)
    {
        super(0, context);
    }
        
    draw = (ctx : CanvasRenderingContext2D) :void =>
    {
        ctx.lineWidth = 0.6;
      
        ctx.beginPath();
        
        for ( let i = 0; i < 5; ++i )
        {
            var y = (i-2) * this.context.space;
            ctx.moveTo(0, y);
            ctx.lineTo(10000, y);
        }
        ctx.stroke();
    }
}
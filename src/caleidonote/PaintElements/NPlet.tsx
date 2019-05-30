import NotePaintContext from './NotePaintContext'
import Symbol from './Symbol'
import * as Utils from './Utils'
import Note from './Note'
import Line from './Line'

// Triplets and such. All of the notes have to be passed
class NPlet extends Symbol
{
    above :boolean;
    notes :Note[];
    line :Line;
    
    constructor(notes :Note[], context :NotePaintContext)
    {
        super(0, context);
        this.above = true;    
        this.notes = notes;
        var halfNotes = Math.floor(notes.length / 2);

        let yFunc: (i :number)=>number;
        if ( this.above )
        {
            yFunc = (i :number): number =>{ return notes[i].bb.top(); }
        }
        else
        {
            yFunc = (i :number): number =>{ return notes[i].bb.bottom(); }
        }

        var avgYLeft = Utils.average(0, halfNotes, yFunc);
        var avgYRight = Utils.average(halfNotes, notes.length, yFunc);
        var avgY = (avgYLeft + avgYRight)/2;
        
        var avgXLeft = Utils.average(0, halfNotes, function(i){ return notes[i].centerX; });
        var avgXRight = Utils.average(halfNotes, notes.length, function(i){ return notes[i].centerX; });
        
        //line in global coordinates
        this.line = new Line(avgXLeft, avgYLeft, avgXRight, avgYRight);
        this.line.moveEnds( notes[0].centerX, notes[notes.length-1].centerX );
        
        if (notes.length > 0)
        {
            var minH = context.space*1.5;
            if (this.above)
            {
                minH = -minH;
            }
            
            for ( var i = 0; i < notes.length; ++i)
            {
                var y = this.line.getY(notes[i].centerX + notes[i].getstemX(this.above));
                //relative Y of top and botton ends of note, compared to the current line
                var yWithMinMargin = (yFunc(i)+minH);
                
                //move line so that it's above the top end
                if (( this.above && yWithMinMargin < y )
                    || ( !this.above && yWithMinMargin > y ))
                {
                    this.line.move(0, yWithMinMargin - y );
                }
            }
        }
    
        this.centerX = (this.line.x1 + this.line.x2)/2;
        this.centerY = (this.line.y1 + this.line.y2)/2;
        this.line.move(-this.centerX, -this.centerY);
        
        this.bb.extendToPoint(this.line.x1, this.line.y1);
        this.bb.extendToPoint(this.line.x2, this.line.y2);
    }
    
    draw = (ctx :CanvasRenderingContext2D) :void =>
    {
        ctx.font = "15px serif";
        ctx.fillText(this.notes.length.toString(), this.centerX, this.centerY);
    };
};

export default NPlet
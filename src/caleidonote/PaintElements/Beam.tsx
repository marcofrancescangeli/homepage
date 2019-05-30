import Symbol, {BBox} from './Symbol'
import Line from './Line'
import Note from './Note'
import NotePaintContext from './NotePaintContext';
import * as Utils from './Utils'


export class Beam extends Symbol
{
    notes :Note[];
    line: Line;
    barAbove: boolean;

    constructor( notes :Note[], context :NotePaintContext )
    {
        super(0, context);
        this.notes = notes;
        this.line = Beam.findNotesLine(notes);
        this.centerX = (this.line.x1 + this.line.x2)/2;
        this.centerY = (this.line.y1 + this.line.y2)/2;
        this.barAbove = false;
        // convert to local coordinates
        this.line.move( -this.centerX, -this.centerY );
        this.bb = new BBox(this.line.x1, this.line.y1, this.line.x2-this.line.x1, this.line.y2-this.line.y2);


        if (notes.length > 0)
        {
            this.barAbove = (this.centerY > 0);
            
            var minH = context.space*1.5;
            if (this.barAbove)
            {
                minH = -minH;
            }
            
            var h = context.space * 4;
            if (this.barAbove) h = -h;
            
            this.line.move(0,h);
            
            for ( var i = 0; i < notes.length; ++i)
            {
                var y = this.getY(notes[i].centerX + notes[i].getstemX(this.barAbove));
                var hForNote = y - notes[i].centerY;
                if ( (this.barAbove && hForNote > minH) || (!this.barAbove && hForNote < minH) )
                {
                    this.line.move(0,minH - hForNote);
                }
            }
            
            for ( var i = 0; i < notes.length; ++i)
            {
                var y = this.getY(notes[i].centerX + notes[i].getstemX(this.barAbove));
                var hForNote = y - notes[i].centerY;
                notes[i].setstemH(hForNote);
            }
            let x1 = notes[0].centerX-0.5;
            let x2 = notes[notes.length-1].centerX + 0.5;
            if (notes[0].stem)
            {
                x1+= notes[0].stem.x;
            }
            let s = notes[notes.length-1].stem;
            if (s)
            {
                x2+= s.x;
            }

            this.moveEnds(x1,x2);
            
            this.bb.extendToPoint( this.line.x1, this.line.y1 );
            this.bb.extendToPoint( this.line.x2, this.line.y2 );
        }
    }
    
    private static findNotesLine = (notes: Note[]) =>
    {
        var halfNotes = Math.floor(notes.length / 2);
    
        var avgYLeft = Utils.average(0, halfNotes, function(i){ return notes[i].centerY; });
        var avgYRight = Utils.average(halfNotes, notes.length, function(i){ return notes[i].centerY; });
        var avgY = (avgYLeft + avgYRight)/2;
        
        //straighten it up a bit
        avgYLeft += (avgY-avgYLeft)/2;
        avgYRight += (avgY-avgYRight)/2;
        
        var avgXLeft = Utils.average(0, halfNotes, function(i){ return notes[i].centerX; });
        var avgXRight = Utils.average(halfNotes, notes.length, function(i){ return notes[i].centerX; });
        
        return new Line(avgXLeft, avgYLeft, avgXRight, avgYRight);
    }

    getY = (x: number) :number =>
    {
        return this.line.getY( x - this.centerX ) + this.centerY;  
    };
    
    moveEnds = (x1 :number, x2 :number) :void =>
    {
        this.line.moveEnds( x1 - this.centerX, x2 - this.centerX );  
    };
    
    draw = (ctx: CanvasRenderingContext2D) =>
    {
        ctx.save();
        var incl = (this.line.y2-this.line.y1)/(this.line.x2-this.line.x1);
        
        ctx.transform(1,incl, 0,1, this.centerX+this.line.x1,this.centerY+this.line.y1);
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.line.x2-this.line.x1,0);
        ctx.stroke();
        ctx.restore();
    };
}

export default Beam
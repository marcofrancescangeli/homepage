import {Beam} from './Beam'
import {Line} from './Line'
import {Note} from './Note'
import {NotePaintContext} from './NotePaintContext'

export class BeamUnderBeam extends Beam
{
    constructor(otherBeam :Beam, n1: Note|null, n2: Note|null, context: NotePaintContext)
    {
        super(otherBeam.notes, context);
        
        this.barAbove = otherBeam.barAbove;
        this.line = new Line(otherBeam.line.x1, otherBeam.line.y1, otherBeam.line.x2, otherBeam.line.y2);
        //to global coordinates
        this.line.move(otherBeam.centerX, otherBeam.centerY);
        this.line.move(0,this.barAbove ? context.space*0.6 : -context.space*0.6);
        if (n1 || n2)
        {
            let x1;
            let x2;
            if (n1)
            {
                x1 = n1.centerX + n1.stem.x;
            }
            if (n2)
            {
                x2 = n2.centerX + n2.stem.x;
            }
            if (!n1)
            {
                x1 = x2 - context.space;
            }
            if (!n2)
            {
                x2 = x1 + context.space;
            }
            this.line.moveEnds(x1, x2);
        }
        //now back to local coordinates
        this.centerX = (this.line.x1 + this.line.x2)/2;
        this.centerY = (this.line.y1 + this.line.y2)/2;
        this.line.move(-this.centerX, -this.centerY);
        //update bb
        this.bb.extendToPoint(this.line.x1, this.line.y1);
        this.bb.extendToPoint(this.line.x2, this.line.y2);
    }
}

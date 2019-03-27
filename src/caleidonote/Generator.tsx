import * as NC from "./NoteCreator";
import { ChordType } from "./PaintElements/Chord";

export interface Generator
{
    generate:(nc: NC.NoteCreator)=>void;    
}


export class GeneratePattern implements Generator
{
    stepN=0;
    
    dirTranspose = 1;
    currTranspose = 0;
    generate = (nc: NC.NoteCreator) : void =>
    {
        ++this.stepN;
        
        if ( this.currTranspose > 12 )
        {
            this.dirTranspose = -this.dirTranspose;
        }
        if ( this.currTranspose < 0 )
        {
            this.dirTranspose = -this.dirTranspose;
        }
        this.currTranspose += this.dirTranspose;
        
        nc.setTranspose(this.currTranspose);
        
        nc.chord( NC.C, +0, ChordType.maj );
        nc.length(16);
        nc.group.start();
        nc.note(NC.C);
        nc.note(NC.D);
        nc.note(NC.E);
        nc.note(NC.G);
        nc.group.end();
        //s.AddSymbol( new Chord(Math.floor(Math.random()*7*100) % 7, stepN%3 - 1, stepN%20, s.cursor ));
        /*
        nc.Group.Start();
        
        nc.Length(16,1);
        nc.HalfTone( newHalftone() );
        nc.Note();
        //nc.Tie.End();
        
        nc.HalfTone( newHalftone() );
        nc.Note();
        
        nc.Length(8);
        nc.HalfTone( newHalftone() );
        nc.Note();
        
        //nc.Tie.Start();
        nc.Length(16);
        nc.HalfTone( newHalftone() );
        nc.Note();
        
        nc.Group.End();
        
        nc.Group.Start(nc_nplet);
        nc.Length(8);
        nc.HalfTone( newHalftone() );
        nc.Note();
        nc.HalfTone( newHalftone() );
        nc.Note();
        nc.HalfTone( newHalftone() );
        nc.Note();
        nc.Group.End();
        */
    };
}

import * as NC from "./NoteCreator";
import { ChordType } from "./PaintElements/Chord";
import { Signal } from "./Signal";

export interface Generator
{
    generate:(nc: NC.NoteCreator)=>void;
}

export class GeneratePattern implements Generator
{
    public onGeneratorStringChanged = new Signal();

    set generatorString( generatorString : string )
    {
        if (generatorString !== this.m_generatorString)
        {
            this.m_generatorString = generatorString;
            this.onGeneratorStringChanged.fire();
        }
    }

    get generatorString() : string { return this.m_generatorString; }

    private m_generatorString : string = "CDEF";

    function* generator() : Generator<number, string, boolean>{

    }

    
    private stepN=0;
    
    private dirTranspose = 1;
    private currTranspose = 0;

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
        
        // in theory I should be able to write the next as
        // [Cmaj] 16(CDEG)

        nc.chord( NC.C, +0, ChordType.maj );
        nc.length(16);
        nc.group.start();
        nc.note(NC.C);
        nc.note(NC.D);
        nc.note(NC.E);
        nc.note(NC.G);
        nc.group.end();

        // or [Cmaj] C16 DEF
        // 
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

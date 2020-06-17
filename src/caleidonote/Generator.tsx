import * as NC from "./NoteCreator";
import { ChordType } from "./PaintElements/Chord";
import { Signal } from "./Signal";
import Symbol from "./PaintElements/Symbol"

export interface Generator
{
    fetchSymbol:()=>{s: Symbol, linkedToPrevious: boolean} | undefined;
    getBackgroundSymbols:()=>Symbol[];
    applyOffset:(offset: number)=>void;
}

export class GeneratePattern implements Generator
{
    private m_generator : globalThis.Generator<Symbol>= this.generator();
    
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

    private noteCreator : NC.NoteCreator;

    constructor (c :NC.NoteCreator)
    {
        this.noteCreator = c;
    }

    getBackgroundSymbols = () : Symbol[] =>
    {
        return [this.noteCreator.createStaff()];
    }
    
    fetchSymbol = () : {s: Symbol, linkedToPrevious: boolean} | undefined =>
    {
        let n = this.m_generator.next();
        if ( n.done || !n.value )
        {
            return undefined;
        }
        return {s: n.value, linkedToPrevious: this.noteCreator.isLinkedToPrevious()};
    }

    applyOffset = (offset: number) : void=>
    {
        this.noteCreator.moveCursor(offset);
    }

    *generator()
    {
        let nc = this.noteCreator;
        
        let dirTranspose = 1;
        let currTranspose = 0;

        while (true)
        {
            if ( currTranspose > 12 )
            {
                dirTranspose = -dirTranspose;
            }
            if ( currTranspose < 0 )
            {
                dirTranspose = -dirTranspose;
            }
            currTranspose += dirTranspose;
            
            nc.setTranspose(currTranspose);
            
            // in theory I should be able to write the next as
            // [Cmaj] 16(CDEG)

            yield* nc.generateChord( NC.C, +0, ChordType.maj );
            nc.length(16);
            nc.startGroup();
            yield* nc.generateNote(NC.C);
            yield* nc.generateNote(NC.D);
            yield* nc.generateNote(NC.E);
            yield* nc.generateNote(NC.G);
            yield* nc.endGroup();
        }
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

export default Generator;
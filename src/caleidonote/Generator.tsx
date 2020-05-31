import * as NC from "./NoteCreator";
import { ChordType } from "./PaintElements/Chord";
import { Signal } from "./Signal";
import Symbol from "./PaintElements/Symbol"
import Queue from "./Queue";

export interface Generator
{
    fetchSymbol:()=>Symbol | undefined;
    getBackgroundSymbols:()=>Symbol[];
    moveCursor:(offset:number)=>void;
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

    private noteCreator : NC.NoteCreator;

    private m_generator : globalThis.Generator<Symbol>= this.generator();
    private endOfGenerator = false;
    private m_buffer = new Queue<Symbol>(256);

    constructor (c :NC.NoteCreator)
    {
        this.noteCreator = c;
        this.fetchToBuffer();
    }

    getBackgroundSymbols = () : Symbol[] =>
    {
        return [this.noteCreator.createStaff()];
    }
    
    fetchSymbol = () : Symbol | undefined =>
    {
        if (this.m_buffer.size() <= 1 && !this.endOfGenerator)
        {
            // make sure that we retrieve a whole chain of linked symbols after the one we have already
            do{
                this.fetchToBuffer();
            } while(this.noteCreator.isLinkedToPrevious() && !this.endOfGenerator);
        }

        if (!this.m_buffer.isEmpty())
        {
            let toReturn = this.m_buffer.front();
            this.m_buffer.popFront();
            return toReturn;
        }
        else
        {
            return undefined;
        }
    }

    private fetchToBuffer = () =>{
        let next = this.fetchSymbolInternal();
        if (next)
        {
            this.m_buffer.pushBack(next);
        }
    }

    private fetchSymbolInternal = () : Symbol | null=>
    {
        let n = this.m_generator.next();
        if ( n.done )
        {
            this.endOfGenerator = true;
            return null;
        }
        return n.value;
    }

    moveCursor = (offset: number) : void=>
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

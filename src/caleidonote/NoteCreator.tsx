import Beam from './PaintElements/Beam'
import BeamUnderBeam from './PaintElements/BeamUnderBeam'
import NotePaintContext from './PaintElements/NotePaintContext'
import Note from './PaintElements/Note'
import Rest from './PaintElements/Rest'
import Chord, {ChordType} from './PaintElements/Chord'
import Tie from './PaintElements/Tie'
import NPlet from './PaintElements/NPlet'
import Symbol from './PaintElements/Symbol'
import * as Utils from './PaintElements/Utils'
import Staff from './PaintElements/Staff'
import NoteGroup from './NoteGroup'

export const flat = -1;
export const sharp = 1;
export const natural = 0;

export const A = 5;
export const B = 6;
export const C = 0;
export const D = 1;
export const E = 2;
export const F = 3;
export const G = 4;

export const  majorScale = [0,2,4,5,7,9,11];

export const  toneToDegree = [
    [C, C, D, D, E, F, F, G, G, A, A, B], //all sharps
    [C, C, D, E, E, F, F, G, G, A, B, B], //some sharps some flats
    [C, D, D, E, E, F, G, G, A, A, B, B], //all flats
];
/*
function getNote(semitone: number, conversion:number[]=toneToDegree[0]) : {degree:number, alt:number}
{
    let degree = conversion[semitone];
    let alt = semitone-majorScale[degree];
    return {degree,alt};
}
*/
export const  transposePreferredNote = [ C, D, D, E, E, F, G, G, A, A, B, B];

var nc_nplet = 111;



export interface NoteAdder
{
    addSymbol: (s:Symbol)=>void;
    addBackgroundSymbol: (s: Symbol)=>void;
    getCursor: ()=>number;
    moveCursor: (offset:number)=>number;
}

export class NoteCreator 
{
    private adder: NoteAdder;
    private conversion : number[] = toneToDegree[0];
    private power = -2;
    private currNote = 0;
    private alt = 0;
    private noteDistance = 45;
    private dots :number = 0;
    private transpose :number = 0;
    private context: NotePaintContext = {space: 10};
    
    public group: NoteGroup;
    public tie: NoteGroup;
    public nplet: NoteGroup;

    // make this based on a flat list of commands, and have a big switch.
    // the second step is to do a string interpreter of those commands (simple forward syntax check)
    // and call the big switch thingy.
    // I need to store the symbols created as a queue and return a generator consuming this queue, and from the actual
    // generator I'll have to call the next note creator method only after the queue is all yielded.
    /*
    I'd like this to be used by the generators.
    Say I keep this as it is. Using this adder to be called whwnever there is a new symbol to add.
    From outside I have a generator function which has the adder implementation calling yield with the symbol.

    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*

    This means I can have every single function in NoteCreator returning a function*, and the real generator will
    call yield* noteAdder.f() for each one. This is amazing :-)
    */
    
    constructor(adder: NoteAdder)
    {
        this.adder = adder;
        this.adder.addBackgroundSymbol(new Staff(this.context));
        
        this.group = new NoteGroup(
            (notes: Note[], args: Array<any>) => {
            //first beam. 1/8
            if ( notes.length === 1 )
            {
                notes[0].drawFlag = true;
            }
            else if ( notes.length > 1 )
            {
                var beam = new Beam(notes, this.context);
                
                this.adder.addSymbol( beam );
                
                this.createSubBeam(beam, notes, 0, notes.length, -4);
                
                if (args.length > 0 && args[0] === nc_nplet)
                {
                    this.adder.addSymbol( new NPlet(notes, this.context) );
                }
            }
        });
        
        this.group.onNewNote = (note: Note) : boolean =>
        {
            if ( this.power >= -2 )
            {
                //1/4, can't use beam. stop and restart beam
                return false;
            }
            else
            {
                note.drawFlag = false;
                return true;            
            }
        };

        this.tie = new NoteGroup((notes: Note[]):void=>{
            if (notes.length > 1)
            {
                this.adder.addSymbol(new Tie(notes[0],notes[notes.length-1], this.context));                    
            }
        });
        
        this.nplet = new NoteGroup((notes: Note[]):void =>{
            this.adder.addSymbol(new NPlet(notes, this.context));  
        });
    }
  
    setNoteDistance = ( noteDistance: number ) :void =>
    {
        this.noteDistance = noteDistance;
    }
    
    length = ( denominator: number, dots: number = 0) :void => 
    {
        switch(denominator)
        {
            case 1: this.power = 0; break;
            case 2: this.power = -1; break;
            case 4: this.power = -2; break;
            case 8: this.power = -3; break;
            case 16: this.power = -4; break;
            case 32: this.power = -5; break;
            case 64: this.power = -6; break;
        }
        this.dots = dots;
    }
 
    setTranspose = ( transpose: number ) :void =>
    {
        this.transpose = transpose;
    }
    
    createSubBeam = (beam: Beam, notesInBeam: Note[], fromIndex: number, toIndex: number, power: number) =>
    {
        let firstNote = -1;
        let markBeam = ( index: number, inBeam: boolean ) =>
        {
            if ( inBeam )
            {
                if ( firstNote === -1 )
                {
                    firstNote = i;
                }
            }
            else
            {
                if ( firstNote >= 0 )
                {
                    var subBeam;
                    var lastNote = index-1;
                    if ( firstNote === lastNote )
                    {
                        if ( i === 0 )
                        {
                            subBeam = new BeamUnderBeam( beam, notesInBeam[firstNote], null, this.context );
                        }
                        else
                        {
                            subBeam = new BeamUnderBeam( beam, null, notesInBeam[lastNote], this.context );
                        }
                    }
                    else
                    {
                        subBeam = new BeamUnderBeam( beam, notesInBeam[firstNote], notesInBeam[lastNote], this.context );
                    }

                    this.adder.addSymbol(subBeam);
                    if ( power > -6 )
                    {
                        this.createSubBeam( subBeam, notesInBeam, firstNote, index, power - 1 );
                    }
                    firstNote = -1;
                }
            }
        }
        for (var i = fromIndex; i < toIndex; ++i)
        {
            markBeam( i, notesInBeam[i].power <= power );
        }
        markBeam( toIndex, false );
    }
    
    degreeToTone = ( n: number ) :number =>
    {
        var octave = Math.floor(n/7);
        var note = Utils.mod(n,7);
        return octave*12 + majorScale[note];
    }
    
    tone = ( tone: number ) :void =>
    {
        //halftone += _transpose;
        //what's the closest note in the major scale
        var octave = Math.floor((tone+12)/12) - 1;
        var toneInScale = Utils.mod(tone,12);
        var degree = this.conversion[toneInScale];
        var toneNoAlt = majorScale[degree];

        this.deg( octave * 7 + degree, tone - (toneNoAlt+octave*12) );
    }
    
    deg = ( degree: number, alt: number ) :void =>
    {
        if ( alt === undefined )
        {
            alt = 0;
        }
        this.currNote = degree;
        this.alt = alt;
        let targetTone = this.degreeToTone( this.currNote ) + this.alt + this.transpose;
        let deltaNote = transposePreferredNote[ Utils.mod(this.transpose, 12) ] + Math.floor( this.transpose/12 )*7;
        this.currNote += deltaNote;
        var resultingTone = this.degreeToTone( this.currNote ) + this.alt; 
        this.alt = targetTone-resultingTone;
    }
    
    /*
    setConversionType = (i :number) :void =>
    {
        this.conversion = halftonesToScale[i];
    }
    */
    
    note = (deg :number, alt :number=0) :Note =>
    {
        if ( !(deg === undefined) )
        {
            this.deg(deg, alt);
        }
        var note = new Note(this.power, this.currNote, this.alt, this.adder.getCursor(), this.context);
        if (this.dots > 0)
        {
            note.dots = this.dots; 
        }
        this.adder.moveCursor(this.noteDistance);
        
        this.tie.note(note);
        this.group.note(note);
        this.nplet.note(note);
        
        this.adder.addSymbol(note);
        return note;
    }
    
    rest = () :Rest =>
    {
        var rest = new Rest(this.power, this.adder.getCursor(), this.context);
        if (this.dots > 0)
        {
            rest.dots = this.dots;
        }
        this.adder.moveCursor(this.noteDistance);
        this.adder.addSymbol(rest);
        return rest;
    }
    
    chord = (note: number, alt=0, type= ChordType.maj) =>
    {
        if ( alt === undefined )
        {
            type = note;
        }
        else if ( type === undefined )
        {
            this.deg(note, 0);
        }
        else
        {
            this.deg(note, alt);
        }
        var chord = new Chord( this.currNote, this.alt, type, this.adder.getCursor(), this.context);
        
        this.adder.addSymbol(chord);
        return chord;
    }
};

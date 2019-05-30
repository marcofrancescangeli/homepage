import Painter from './Painter'
import Symbol from './PaintElements/Symbol';
import Queue from './Queue';
import {NoteCreator, NoteAdder} from './NoteCreator';
import { Generator, GeneratePattern } from './Generator';

class PainterNote implements Painter, NoteAdder
{
    leftmost: number = 0;
    offset: number = 0;
    rightmost: number = 0;
    cursor: number = 0;
    creator: NoteCreator;

    backgroundElements = new Array<Symbol>(10);
    elementList: Queue<Symbol> = new Queue<Symbol>(1000);
    lastElementDrawn: number = 0;

    generator: Generator = new GeneratePattern();

    constructor()
    {
        this.creator = new NoteCreator(this);
    }

    //paint new elements and return the rightmost coordinate (in canvas X)
    paint = (context: CanvasRenderingContext2D) : number =>
    {
        if ( this.lastElementDrawn==this.elementList.end) 
        {
            this.generator.generate(this.creator);
        }
        let res = this.rightmost;
        this.elementList.forRange(this.lastElementDrawn, this.elementList.end, (s: Symbol)=>
        {   
            s.draw(context);
            let right = s.centerX + s.bb.right();
            if (right > res)
            {
                res = right;
            }
        });
        this.lastElementDrawn = this.elementList.end;
        return res;
    }

    //this notifies that the canvas is going out of sight (in canvas X)
    unpaint = ( upToX: number ) : void =>
    {
        while( !this.elementList.isEmpty())
        {
            let f = this.elementList.front();
            if (f && f.centerX+f.bb.right() < upToX)
            {
                this.elementList.popFront();
            }
            else
            {
                break;
            }
        }        
    }

    // apply new offset to the graphics stuff and return the new rightmost coordinate (in canvas X)
    applyOffset = (offset: number, context: CanvasRenderingContext2D) : number =>
    {
        this.leftmost += offset;
        this.rightmost += offset;
        this.elementList.forRange(this.elementList.begin, this.elementList.end, (s: Symbol)=>
        {
            s.centerX += offset;            
        });
        
        this.lastElementDrawn = this.elementList.begin;
        this.cursor += offset;
        return this.leftmost;
    }

    addBackgroundSymbol = (symbol: Symbol) : void =>
    {
        this.backgroundElements.push(symbol);
    }

    paintBackground = (context: CanvasRenderingContext2D) =>
    {
        this.backgroundElements.forEach( e=>{ e.draw(context)});
    }

    addSymbol = (symbol :Symbol) : number =>
    {
        this.elementList.pushBack(symbol);
        let symbolLeft = symbol.centerX+symbol.bb.left();
        if ( this.rightmost < symbolLeft )
        {
            this.rightmost = symbolLeft;
        }
        return this.rightmost;
    }

    getCursor = ():number => 
    {
        return this.cursor;
    }

    moveCursor= (offset:number) : number =>
    {
        this.cursor += offset;
        return this.getCursor();
    }
}

export default PainterNote;
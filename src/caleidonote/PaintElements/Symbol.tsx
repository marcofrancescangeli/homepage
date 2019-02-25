import {NotePaintContext} from './NotePaintContext'

export class BBox
{
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    top = () => { return this.y; }
    bottom = () => { return this.y + this.h; }
    left = () => { return this.x; }
    right = () => { return this.x + this.w; }
    midX = () => { return this.x + this.w/2; }
    midY = () => { return this.y + this.h/2; }

    extendToPoint = (x :number, y :number) =>
    {
        if ( x < this.left() )
        {
            let r = this.right();
            this.x = x;
            this.w = r-x;
        }
        if ( y < this.top() )
        {
            let b = this.bottom();
            this.y = y;
            this.h = b-y;
        }
        if ( x > this.right() )
        {
            this.w += x - this.right();
        }
        if ( y > this.bottom() )
        {
            this.h += y - this.bottom();
        }
    }
}


export class Symbol
{
    bb = new BBox(0,0,0,0);
    centerX :number;
    centerY :number= 0;
    context :NotePaintContext;
        
    constructor( x: number, context: NotePaintContext )
    {
        this.centerX = x;
        this.context = context;
    }
    
    scroll = ( dx: number ) =>
    {
        this.centerX -= dx;
    };
        
    isLeftOf = (x :number) :boolean =>
    {
        return this.bb.right() + this.centerX < x;
    };

    draw = (ctx: CanvasRenderingContext2D) :void => {}
}

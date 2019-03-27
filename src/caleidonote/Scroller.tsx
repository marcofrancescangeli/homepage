import * as React from 'react';
import './App.css'


export interface Painter
{
    //paint new elements and return the rightmost coordinate (in canvas X)
    paint(context: CanvasRenderingContext2D) : number;

    //this notifies that the canvas is going out of sight (in canvas X)
    unpaint( upToX: number ) : void;

    // apply new offset to the graphics stuff and return the new rightmost coordinate (in canvas X)
    applyOffset(shiftLeft: number, context: CanvasRenderingContext2D) : number;
}

type ScrollerProps =
{
    zoom: number,
    speed: number,
    painter: Painter
}

type ScrollerState =
{
    width: number;
    height: number;
};

export class Scroller extends React.Component<ScrollerProps, ScrollerState>
{
    mainDiv : React.RefObject<HTMLDivElement>;
    canvas : React.RefObject<HTMLCanvasElement>;

    constructor(props : any)
    {
        super(props);
        this.mainDiv = React.createRef();                
        this.canvas = React.createRef();
        this.lastTime = window.performance.now();
    }

    onResize()
    {    
        if (this.mainDiv)     
        {
            let m = this.mainDiv.current;
            if (m)
            {            
                this.setState( {width: m.clientWidth, height: m.clientHeight});
            }
        }
    }

    componentDidMount()
    {
        window.addEventListener("resize", this.onResize);
        this.onResize();
        requestAnimationFrame(this.step);
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.onResize);
    }

    componentWillReceiveProps( newProps: ScrollerProps )
    {
        this.reset();
    }

    private lastTime : number;

    private leftMargin: number = 10;
    private rightMargin: number = 10;

    // relative scroll of the canvas
    private scrollX: number = 0;
    private offsetX: number = 0;
    private rightmostDrawn: number = 0;

    reset = () : void =>
    {
        let offsetX = this.scrollX/this.props.zoom;
        this.scrollX = 0;

        let c = this.canvas.current;
        if ( c )
        {
            c.style.left = "0px";
            let ctx = c.getContext("2d");
            
                                
            if(this.props.painter && ctx)
            {
                ctx.clearRect(0,0,this.state.width*2, this.state.height);
                this.rightmostDrawn = this.props.painter.applyOffset(-offsetX, ctx);
                this.props.painter.unpaint(0);
                this.paintInternal(ctx);
                
                let rightWindow = this.state.width + this.rightMargin;
            }
        }
    }


    private paintInternal = (ctx: CanvasRenderingContext2D)=>
    {
        ctx.save();
        ctx.translate(0,this.state.height/2);
        ctx.scale(this.props.zoom, this.props.zoom);
        this.rightmostDrawn = this.props.painter.paint(ctx);
        ctx.restore();
    }


    step  = ( time : number ) =>
    {
        window.requestAnimationFrame(this.step);
    
        var elapsedtime = (time - this.lastTime)/1000.0;
        this.lastTime = time;
        var scrollamount = this.props.speed * elapsedtime;
        
        let rightWindow = this.state.width + this.rightMargin;

        if (this.scrollX < -rightWindow)
        {
            this.reset();
        }
        
        let zoom = this.props.zoom;
        //scroll the canvas, so there is no need to redraw the notes
        this.scrollX -= scrollamount * zoom;
        
        let c = this.canvas.current;
        if ( c )
        {
            c.style.left = this.scrollX + "px";
            
            //remove notes out of sight    
            //var lastSymbol = symbols.end;
            if(this.props.painter)
            {
                this.props.painter.unpaint((-this.leftMargin - this.scrollX)/zoom);        
                let ctx = c.getContext("2d");
                if (ctx)
                {
                    this.paintInternal(ctx);
                }
            }
        }
    }

    render()
    {
        //console.log(this.state);
        return (
        <div ref={this.mainDiv} className="parentDiv">
        {this.state && <canvas ref={this.canvas} className="scrollingDiv" width={this.state.width*2.5} height={this.state.height}/> }
        </div>
        );
    }
}

export default Scroller;
import * as React from 'react';
import './App.css'
import Painter from './Painter'

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
        this.reset();
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.onResize);
    }

    

    componentDidUpdate( prevProps: ScrollerProps )
    {
        if (this.props.zoom !== prevProps.zoom)
        {
            this.reset();
        }
    }

    private lastTime : number;

    private leftMargin: number = 10;
    private rightMargin: number = 10;

    // relative scroll of the canvas
    private scrollX: number = 0;
    private rightmostDrawn: number = 0;
    private toReset = true;

    private paintBackground = (ctx: CanvasRenderingContext2D) : void =>
    {
        ctx.clearRect(0,0,this.state.width*2, this.state.height);
        ctx.save();
        ctx.translate(0,this.state.height/2);
        ctx.scale(this.props.zoom, this.props.zoom);
        this.props.painter.paintBackground(ctx);
        ctx.restore();
    }

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
                this.paintBackground(ctx);
                this.rightmostDrawn = this.props.painter.applyOffset(offsetX, ctx);
                this.props.painter.unpaint(0);
                
                let rightWindow = this.state.width + this.rightMargin;
                this.paintInternal(ctx, (rightWindow  - this.scrollX)/ this.props.zoom);
            }
        }
    }


    private paintInternal = (ctx: CanvasRenderingContext2D, untilX: number)=>
    {
        ctx.save();
        ctx.translate(0,this.state.height/2);
        ctx.scale(this.props.zoom, this.props.zoom);
        while (this.rightmostDrawn < untilX)
        {
            this.rightmostDrawn = this.props.painter.paint(ctx);
        }
        ctx.restore();
    }


    step  = ( time : number ) =>
    {
        window.requestAnimationFrame(this.step);

    
        var elapsedtime = (time - this.lastTime)/1000.0;
        this.lastTime = time;
        var scrollamount = this.props.speed * elapsedtime;
        
        let rightWindow = this.state.width + this.rightMargin;
       
        let zoom = this.props.zoom;
        //scroll the canvas, so there is no need to redraw the notes
        this.scrollX -= scrollamount * zoom;

        if (this.toReset )
        {
            this.toReset = false;
            this.reset();
        }
        
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
                    this.paintInternal(ctx, (rightWindow  - this.scrollX)/ zoom);
                }
            }
        }

        if (this.scrollX < -rightWindow)
        {
            this.toReset = true;
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
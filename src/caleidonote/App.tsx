import * as React from 'react';
//import 'rc-slider/assets/index.css';
import Slider from '@material-ui/lab/Slider';
import {Scroller, Painter} from './Scroller'
import Button from '@material-ui/core/Button';
import './App.css';
import { FaPlay, FaStop } from 'react-icons/fa';
import SimpleSlider from './SimpleSlider';
import {Symbol} from './PaintElements/Symbol';
import Queue from './Queue'

type AppState = {
    zoom: number,
    speed: number,
    playing: boolean
}


class PainterNote implements Painter
{
    leftmost: number = 0;
    offset: number = 0;
    rightmost: number = 0;
        
    //this should be a queue?
    elementList: Queue<Symbol> = new Queue<Symbol>(1000);
    lastElementDrawn: number = 0;
    
    //paint new elements and return the rightmost coordinate (in canvas X)
    paint = (context: CanvasRenderingContext2D) : number =>
    {
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
    applyOffset = (shiftLeft: number, context: CanvasRenderingContext2D) : number =>
    {
        this.leftmost -= shiftLeft;
        this.elementList.forRange(this.elementList.begin, this.elementList.end, (s: Symbol)=>
        {
            s.centerX += shiftLeft;            
        });
        
        this.lastElementDrawn = this.elementList.begin;

        return this.leftmost;
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
}


class App extends React.Component<{},AppState>
{
    painter: PainterNote = new PainterNote;

    constructor(props: any)
    {
        super(props);
        this.state = 
        {
            zoom: 1,
            speed: 70,
            playing: true
        }
    }

    onTogglePlay = () =>
    {
        this.setState({playing:!this.state.playing});
    }

    onSpeedChange = (event:any, value:number) => {
        this.setState({ speed: value });
    };

    onZoomChange = (event:any, value:number) => {
        this.setState({ zoom: value });
    };

    render()
    {
        /* 
            <input id="playstop" type="button" style={{width:"100px"}}><br/>
            Speed <input id="fader" type="range" min="0" max="400" value="70">
            <output for="fader" id="speedLabel">100</output><br>
            Zoom <input id="scaleFader" type="range" min="0" max="100" value="30">
            <output for="scaleFader" id="scaleLabel">1.0</output>
        */

        return (
            <div>
                <Scroller zoom={1} speed={1} painter={this.painter}/>
                <Button variant="contained" color="primary" onClick={this.onTogglePlay}>{this.state.playing?<FaPlay/>:<FaStop/>}</Button>
                <SimpleSlider name= "Speed" vertical={false} min={1} max={100} value={this.state.speed} onChange={this.onSpeedChange}/>
                <SimpleSlider name="zoom" vertical={false} min={1} max={100} value={this.state.zoom} onChange={this.onZoomChange}/>
            </div>
        );
    }
}

export default App;
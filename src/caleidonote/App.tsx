import * as React from 'react';
//import 'rc-slider/assets/index.css';
import Slider from '@material-ui/lab/Slider';
import {Scroller, Painter} from './Scroller'
import './App.css';

type AppState = {
    zoom: number,
    speed: number,
    playing: boolean
}

interface PaintElement
{
    x: number;
    y: number;
    width: number;
}

class PainterNote implements Painter
{
    leftmost: number = 0;
    offset: number = 0;

    //this should be a queue?
    elementList: Array<PaintElement> = new Array<PaintElement>();
    
    //paint new elements and return the rightmost coordinate (in canvas X)
    paint(context: CanvasRenderingContext2D) : number
    {
        this.leftmost += 10;
        return this.leftmost;
    }

    //this notifies that the canvas is going out of sight (in canvas X)
    unpaint( upToX: number ) : void
    {
        //don't do anything for now
    }

    // apply new offset to the graphics stuff and return the new rightmost coordinate (in canvas X)
    applyOffsetAndRepaint(newOffset: number, context: CanvasRenderingContext2D) : number
    {
        this.leftmost -= (newOffset - this.offset);
        this.offset = newOffset;
        //repaint stuff
        return this.leftmost;
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

    onTogglePlay()
    {
        this.setState({playing:!this.state.playing});
    }

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
                <a onClick={this.onTogglePlay.bind(this)}>{this.state.playing?"Play":"Stop"}</a>
                Speedossf<br/><br/><br/><br/>
                <div><Slider style={{height:200, width:300}} vertical={false} min={1} max={100} value={50}/></div>
            </div>
        );
    }
}

export default App;
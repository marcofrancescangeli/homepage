import * as React from 'react';
//import 'rc-slider/assets/index.css';
import Scroller from './Scroller'
import PainterNote from './PainterNote'
import SimpleSlider from './SimpleSlider'
import Button from '@material-ui/core/Button'
import './App.css';
import { FaPlay, FaStop } from 'react-icons/fa';

type AppState = {
    zoom: number,
    speed: number,
    playing: boolean
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
        return (
            <div>
                <Scroller zoom={this.state.zoom} speed={this.state.speed} painter={this.painter}/>
                <Button variant="contained" color="primary" onClick={this.onTogglePlay}>{this.state.playing?<FaPlay/>:<FaStop/>}</Button>
                <SimpleSlider name= "Speed" vertical={false} min={10} max={1000} value={this.state.speed} onChange={this.onSpeedChange}/>
                <SimpleSlider name="zoom" vertical={false} min={0.1} max={3} value={this.state.zoom} onChange={this.onZoomChange}/>
            </div>
        );
    }
}

export default App;
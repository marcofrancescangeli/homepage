import * as React from 'react';
//import 'rc-slider/assets/index.css';
import Scroller from './Scroller'
import PainterNote from './PainterNote'
import SimpleSlider from './SimpleSlider'
import { Button, Input } from '@material-ui/core'
import './App.css';
import { FaPlay, FaStop } from 'react-icons/fa';
import { GeneratePattern } from './Generator';
import { NoteCreator } from './NoteCreator';

type AppState = {
    zoom: number,
    speed: number,
    playing: boolean,
    generator: string
}


class App extends React.Component<{},AppState>
{   
    generator: GeneratePattern = new GeneratePattern(new NoteCreator());
    painter: PainterNote = new PainterNote(this.generator);
    
    constructor(props: any)
    {
        super(props);
        this.state = 
        {
            zoom: 1,
            speed: 70,
            playing: true,
            generator: this.generator.generatorString
        }

        this.generator.onGeneratorStringChanged.subscribe( ()=>{this.setState({generator:this.generator.generatorString});});
    }

    private onTogglePlay = () =>
    {
        this.setState({playing:!this.state.playing});
    }

    private onSpeedChange = (event:any, value:number) => {
        this.setState({ speed: value });
    };

    private onZoomChange = (event:any, value:number) => {
        this.setState({ zoom: value });
    };

    private onChangeGenerator = (event:React.ChangeEvent<HTMLInputElement>) => {
        let newVal = event.target.value;
        this.generator.generatorString = newVal;
    }

    render()
    {
        return (
            <div>
                <Scroller zoom={this.state.zoom} speed={this.state.speed} painter={this.painter}/>
                <Button variant="contained" color="primary" onClick={this.onTogglePlay}>{this.state.playing?<FaPlay/>:<FaStop/>}</Button>
                <SimpleSlider name= "Speed" vertical={false} min={10} max={1000} value={this.state.speed} onChange={this.onSpeedChange}/>
                <SimpleSlider name="zoom" vertical={false} min={0.1} max={3} value={this.state.zoom} onChange={this.onZoomChange}/>
                <Input onChange={this.onChangeGenerator} value={this.state.generator}></Input>
            </div>
        );
    }
}

export default App
import * as React from 'react';

type SliderProps =
{
    min : number,
    max : number,
    default : number,
    stepSize? : number,
    visibleStepSize? : number
}

type SliderState =
{
    value : number
}

class Slider extends React.Component<SliderProps, SliderState >
{
    render()
    {
        return (
            <div style={{width:200}}>
            
            </div>
        );
    }
}
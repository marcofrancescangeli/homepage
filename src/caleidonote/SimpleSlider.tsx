import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import {SliderProps} from '@material-ui/lab/Slider';

const styles = {
  root: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};

type Props = {
  name: string,
  classes: any
};

type State = {
  value: number
}

class SimpleSlider extends React.Component<Props & SliderProps>{
  render() {
    const { classes } = this.props;

    const {name, ...props} = this.props;
    return (
      <div className={classes.root}>
        <Typography id="label">{name}</Typography>
        <Slider {...props}
          classes={{ container: classes.slider }}
          aria-labelledby="label"          
        />
      </div>
    );
  }
}

export default withStyles(styles)(SimpleSlider);
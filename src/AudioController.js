import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import {PLAY_MODE} from './Constants.js'

import './AudioController.css';

class AudioController extends React.Component {
  formatSecond(duration) {
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;
    return (mins < 10 ? `0${mins}` : mins) + ":" + (secs < 10 ? `0${secs}` : secs);
  }
  render() {
    let playButton = null;
    if (this.props.playing) {
      playButton = <IconButton onClick={() => this.props.onClickPlayPause(false)}><PauseIcon/></IconButton>;
    } else {
      playButton = <IconButton onClick={() => this.props.onClickPlayPause(true)}><PlayArrowIcon/></IconButton>;
    }
    return <div className="player-controller">
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={10}>
              <Slider
                value={this.props.currentTime} max={this.props.duration}
                onChangeCommitted={(e, v) => this.props.onCurrentTimeChange(v)} aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item xs={2}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Chip size="small" label={this.formatSecond(this.props.currentTime) + '/' + this.formatSecond(this.props.duration)} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Tooltip title="Repeat All">
                <IconButton
                  color={this.props.mode === PLAY_MODE.REPEAT_ALL ? 'primary' : 'default'}
                  onClick={() => this.props.onChangeMode(PLAY_MODE.REPEAT_ALL)}>
                  <RepeatIcon/>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Shuffle">
                <IconButton
                  color={this.props.mode === PLAY_MODE.SHUFFLE ? 'primary' : 'default'}
                  onClick={() => this.props.onChangeMode(PLAY_MODE.SHUFFLE)}>
                  <ShuffleIcon/>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Repeat One">
                <IconButton
                  color={this.props.mode === PLAY_MODE.REPEAT_ONE ? 'primary' : 'default'}
                  onClick={() => this.props.onChangeMode(PLAY_MODE.REPEAT_ONE)}>
                  <RepeatOneIcon/>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <IconButton onClick={() => this.props.onClickPreviousNext(-1)}>
                <SkipPreviousIcon/>
              </IconButton>
            </Grid>
            <Grid item>
              {playButton}
            </Grid>
            <Grid item>
              <IconButton onClick={() => this.props.onClickPreviousNext(1)}>
                <SkipNextIcon/>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <IconButton onClick={() => this.props.onStepChangeVolume(-5)}>
                <VolumeDown/>
              </IconButton>
            </Grid>
            <Grid item xs>
              <Slider
                value={this.props.volume} max={100}
                onChangeCommitted={(e, v) => this.props.onVolumeChange(v)} aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item>
              <IconButton onClick={() => this.props.onStepChangeVolume(5)}>
                <VolumeUp/>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>;
  }
}

export default AudioController;

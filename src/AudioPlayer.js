import React from 'react';
import AudioController from './AudioController.js';
import {PLAY_MODE} from './Constants.js'
import AudioVisualization from './AudioVisualization.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.songs = [
      'https://api.tomo.wang/audio/21312012.mp3', // While Your Lips Are Still Red
      'https://api.tomo.wang/audio/31654478.mp3', // Star Sky
      'https://api.tomo.wang/audio/5271858.mp3', // 难念的经
      'https://api.tomo.wang/audio/36990266.mp3', // Faded
      'https://api.tomo.wang/audio/27937429.mp3', // 盛夏的果实
      'https://api.tomo.wang/audio/94689.mp3', // 海浪
      'https://api.tomo.wang/audio/5113327.mp3', // The Sound Of Silence
      'https://api.tomo.wang/audio/536096151.mp3', // 左手指月
      'https://api.tomo.wang/audio/1437405183.mp3', // Wicked Games (From Westworld: Season 3)
      'https://api.tomo.wang/audio/4208658.mp3', // Ghost Love Score
    ];
    this.shuffleSongs = shuffle(this.songs);
    this.current = 0;
    this.currentSong = this.songs[this.current];

    this.state = {
      mode: PLAY_MODE.REPEAT_ALL,
      volume: 50,
      duration: 0,
      currentTime: 0,
      playing: false,
      width: 0,
      height: 0,
      analyser: null,
    };
    this.audio = null;
    this.source = null;
    this.audioCtx = null;
    this.analyser = null;

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.onCurrentTimeChange = this.onCurrentTimeChange.bind(this);
    this.onClickPlayPause = this.onClickPlayPause.bind(this);
    this.onClickPreviousNext = this.onClickPreviousNext.bind(this);
    this.onStepChangeVolume = this.onStepChangeVolume.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  onVolumeChange(volume) {
    this.setState({ volume });
    if (this.audio) this.audio.volume = volume / 100;
  }
  onStepChangeVolume(step) {
    let volume = this.state.volume + step;
    volume = volume < 0 ? 0 : (volume > 100 ? 100 : volume);
    this.onVolumeChange(volume);
  }
  onCurrentTimeChange(currentTime) {
    this.setState({ currentTime });
    if (this.audio) this.audio.currentTime = currentTime;
  }
  onClickPlayPause(playing) {
    if (this.audio) {
      if (playing) this.audio.play();
      else this.audio.pause();
    } else if (playing) {
      this.setupAudio();
    }
    this.setState({ playing });
  }
  onClickPreviousNext(next) {
    this.changeSong(next);
  }
  onChangeMode(mode) {
    if (mode === PLAY_MODE.SHUFFLE) {
      this.shuffleSongs = shuffle(this.songs);
      this.current = this.shuffleSongs.indexOf(this.currentSong);
    }
    this.setState({mode});
  }
  changeSong(which) { // 1 for next, -1 for previous
    let current = this.current;
    let songs = this.songs;
    if (this.state.mode === PLAY_MODE.SHUFFLE) {
      songs = this.shuffleSongs;
    } else if (this.state.mode === PLAY_MODE.REPEAT_ONE) {
      songs = [this.currentSong];
    }
    if (which === -1) {
      current = current === 0 ? songs.length - 1 : current - 1;
    } else {
      current = current === songs.length - 1 ? 0 : current + 1;
    }
    this.current = current;
    this.currentSong = songs[current];
    this.setupAudio();
  }
  setupAudio() {
    if (this.audio) this.audio.remove();
    if (this.source) this.source.disconnect();
    if (!this.audioCtx) this.audioCtx = new AudioContext();
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.src = this.currentSong;

    let analyser = this.state.analyser || this.audioCtx.createAnalyser();
    this.source = this.audioCtx.createMediaElementSource(this.audio);
    this.source.connect(analyser);
    analyser.connect(this.audioCtx.destination);

    this.audio.volume = this.state.volume / 100;
    this.setState({
      analyser,
      // duration: this.audio.duration, // available after `canplay`
      playing: true,
    });
    this.audio.addEventListener('canplay', () => {
      this.setState({
        duration: this.audio.duration,
      });
      if (this.state.playing) this.audio.play();
    });
    this.audio.addEventListener('timeupdate', () => {
      this.setState({
        currentTime: this.audio.currentTime
      });
    });
    this.audio.addEventListener('ended', () => {
      this.changeSong(1);
    });
  }
  render() {
    const {width, height, analyser} = this.state;
    return <div>
      <AudioController
        duration={this.state.duration}
        currentTime={this.state.currentTime}
        volume={this.state.volume}
        playing={this.state.playing}
        mode={this.state.mode}
        onVolumeChange={this.onVolumeChange}
        onStepChangeVolume={this.onStepChangeVolume}
        onCurrentTimeChange={this.onCurrentTimeChange}
        onClickPlayPause={this.onClickPlayPause}
        onClickPreviousNext={this.onClickPreviousNext}
        onChangeMode={this.onChangeMode}
      ></AudioController>
      <AudioVisualization analyser={analyser} width={width} height={height}></AudioVisualization>
    </div>;
  }
}

export default AudioPlayer;

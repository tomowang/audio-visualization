import React from 'react';

const SPACER_WIDTH = 10;
const BAR_WIDTH = 5;
const OFFSET = 100;

class AudioVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.animation = null;
    this.ctx = null;
  }
  renderAudio(){
    const {width, height, analyser} = this.props;
    let rafCallback = () => {
      const freqByteData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqByteData);

      const ctx = this.ctx;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#3A5E8C';
      ctx.lineCap = 'round';
      for (let i = 0; i < this.numBars; ++i) {
        let magnitude = freqByteData[i + OFFSET] * 2;
        ctx.fillRect(i * SPACER_WIDTH, height, BAR_WIDTH, -magnitude);
      }
      this.animation = window.requestAnimationFrame(rafCallback);
    }
    rafCallback();
  }
  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d');
  }
  componentDidUpdate() {
    this.numBars = Math.round(this.props.width / SPACER_WIDTH);
    if (this.animation) window.cancelAnimationFrame(this.animation);
    if (this.props.analyser) this.renderAudio();
  }
  componentWillUnmount() {
    if (this.animation) window.cancelAnimationFrame(this.animation);
  }
  render() {
    return <canvas ref={this.canvas} width={this.props.width} height={this.props.height}></canvas>;
  }
}

export default AudioVisualization;

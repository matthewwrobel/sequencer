import React from 'react';
import ReactDom from 'react-dom';
import Sequence from './components/Sequence.jsx'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      initialized: false,
      sequence: [true, true, true, true],
      context: null
    };
    this.startSequencer = this.startSequencer.bind(this);
    this.updateSequence = this.updateSequence.bind(this);
    this.playSound = this.playSound.bind(this);
    this.initializeAudio = this.initializeAudio.bind(this);
    this.loadSound = this.loadSound.bind(this);
  }

  initializeAudio() {
    this.state.context = new AudioContext();
    this.loadSound(`http://localhost:8080/drumset/kick.wav`, 'kick');
    this.loadSound(`http://localhost:8080/drumset/snare.wav`, 'snare');
    this.loadSound(`http://localhost:8080/drumset/hihat.wav`, 'hihat');
    this.setState({
      initialized: true
    });
  }

  loadSound(url, name) {

    const context = this.state.context;
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // this is async
    request.onload = () => {
      context.decodeAudioData(request.response, (buffer) => {
        this.state[name] = buffer;
      }, () => console.log('error!'));
    }
    request.send();
  }

  playSound(buffer) {
    const context = this.state.context;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
  }

  startSequencer(e, step = 0) {
    const sample = new Audio(`http://localhost:8080/drumset/kick.wav`);

    if (step === this.state.sequence.length - 1) {
      if (this.state.sequence[step]) {
        sample.play();
      }
      setTimeout(() => {
        this.startSequencer();
      }, 500)

    } else {

      if (this.state.sequence[step]) {
        sample.play();
      }

      setTimeout(() => {
        this.startSequencer(null, step + 1);
      }, 500);

    }
  }

  updateSequence(beat, value) {
    this.state.sequence[beat] = value;
    console.log(this.state.sequence);
  }

  playSample(e) {
    const instrument = e.target.innerHTML
    const url = `http://localhost:8080/drumset/${instrument}.wav`;
    const sample = new Audio(url);
    sample.play();
  }

  render() {
    if (!this.state.initialized) {
      return (
        <div>
          <button onClick={this.initializeAudio}>
            Initialize!
          </button>
        </div>
      );
    }
    return (
      <div>
        <div onClick={this.startSequencer}>
          Hello Sequencer!
        </div>
        <div>
          <button onClick={() => this.playSound(this.state.kick)}>
            Web Audio API kick
          </button>
          <button onClick={() => this.playSound(this.state.snare)}>
            Web Audio API snare
          </button>
          <button onClick={() => this.playSound(this.state.hihat)}>
            Web Audio API hihat
          </button>
        </div>
        <div>
          <Sequence sequence={this.state.sequence} updateSequence={this.updateSequence}/>
        </div>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('App'));
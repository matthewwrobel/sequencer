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
    // this.startSequencer = this.startSequencer.bind(this);
    // this.updateSequence = this.updateSequence.bind(this);
    this.playSound = this.playSound.bind(this);
    this.initializeAudio = this.initializeAudio.bind(this);
    this.loadSound = this.loadSound.bind(this);
    this.playGroove = this.playGroove.bind(this);
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
    request.onload = () => { // this is async
      context.decodeAudioData(request.response, (buffer) => {
        this.state[name] = buffer;
      }, () => console.log('error!'));
    }
    request.send();
  }

  playSound(buffer, time) {
    const context = this.state.context;
    const source = context.createBufferSource();
    source.buffer = buffer;
    const gainNode = context.createGain();  // gainNode is hard-coded to hi-hat for now...
    source.connect(gainNode);
    gainNode.connect(context.destination);
    if (buffer === this.state.hihat) {
      gainNode.gain.value = 0.25;
    }
    source.start(time);
  }

  playGroove() {
    let startTime = this.state.context.currentTime

    for (let bar = 0; bar < 2; bar++) {
      let quarterNotes = bar * 4;
      this.playSound(this.state.kick, startTime + quarterNotes);
      this.playSound(this.state.snare, startTime + quarterNotes + 1);
      this.playSound(this.state.kick, startTime + quarterNotes + 2);
      this.playSound(this.state.snare, startTime + quarterNotes + 3);
      console.log('bar number: ', bar);

      for (let eightNotes = 0; eightNotes < 4; eightNotes = eightNotes + .5) {
        this.playSound(this.state.hihat, startTime + quarterNotes + eightNotes);
      }
      // this.playSound(this.state.hihat, startTime + quarterNotes + 0);
      // this.playSound(this.state.hihat, startTime + quarterNotes + .5);
      // this.playSound(this.state.hihat, startTime + quarterNotes + 1);
      // this.playSound(this.state.hihat, startTime + quarterNotes + 1.5);
      // this.playSound(this.state.hihat, startTime + quarterNotes + 2);
      // this.playSound(this.state.hihat, startTime + quarterNotes + 2.5);
      // this.playSound(this.state.hihat, startTime + quarterNotes + 3);
      // this.playSound(this.state.hihat, startTime + quarterNotes + 3.5);

    }

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
          <button onClick={this.playGroove}>
            Play Groove
          </button>
        </div>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('App'));

// // REMAINING METHODDS TO BE REFACTORED TO USE WEB AUDIO API
// startSequencer(e, step = 0) {
//   const sample = new Audio(`http://localhost:8080/drumset/kick.wav`);

//   if (step === this.state.sequence.length - 1) {
//     if (this.state.sequence[step]) {
//       sample.play();
//     }
//     setTimeout(() => {
//       this.startSequencer();
//     }, 500)

//   } else {

//     if (this.state.sequence[step]) {
//       sample.play();
//     }

//     setTimeout(() => {
//       this.startSequencer(null, step + 1);
//     }, 500);

//   }
// }

// updateSequence(beat, value) {
//   this.state.sequence[beat] = value;
//   console.log(this.state.sequence);
// }

// playSample(e) {
//   const instrument = e.target.innerHTML
//   const url = `http://localhost:8080/drumset/${instrument}.wav`;
//   const sample = new Audio(url);
//   sample.play();
// }
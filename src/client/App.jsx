import React from 'react';
import ReactDom from 'react-dom';
import Sequence from './components/Sequence.jsx';
import Tempo from './components/Tempo.jsx';
import generateDefaultSequence from './helpers.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      initialized: false,
      sequence: generateDefaultSequence(),
      context: null,
      scheduleAheadTime: 0.1,
      tempo: 60,
      nextNoteTime: 0, // constanty updated to the time position of the next step (1/16th note)
      step: 0
    };
    this.playSound = this.playSound.bind(this);
    this.initializeAudio = this.initializeAudio.bind(this);
    this.loadSound = this.loadSound.bind(this);
    this.playGroove = this.playGroove.bind(this);
    this.nextNote = this.nextNote.bind(this);
    this.toggleSound = this.toggleSound.bind(this);

    this.playMetronome = this.playMetronome.bind(this);
    this.scheduler = this.scheduler.bind(this);
    this.nextNote = this.nextNote.bind(this);
    this.setTempo = this.setTempo.bind(this);
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

  playMetronome() {  // this will be triggered on a click event
    this.state.nextNoteTime = this.state.context.currentTime; // set the next note time to be the current audio context time
    this.scheduler();
  }

  scheduler() {
    while (this.state.nextNoteTime < this.state.context.currentTime + this.state.scheduleAheadTime ) {
      for (let instrument in this.state.sequence[this.state.step]) {
        if (this.state.sequence[this.state.step][instrument]) {
          this.playSound(this.state[instrument], this.state.nextNoteTime);
        }
      }
      this.nextNote();
    }
    setTimeout(() => {
      this.scheduler();
    }, 25);
  }

  nextNote() {
    let secondsPerBeat = 60.0 / this.state.tempo;
    let intervalBetweenSteps = secondsPerBeat * .25; // steps === 1/16th notes
    this.state.nextNoteTime = this.state.nextNoteTime + intervalBetweenSteps;
    this.state.step = this.state.step === 15 ? 0 : this.state.step + 1;
  }

  setTempo(newTempo) {
    this.state.tempo = newTempo;
  }

  playGroove() {
    let startTime = this.state.context.currentTime
    for (let bar = 0; bar < 2; bar++) {
      let quarterNotes = bar * 4;
      this.playSound(this.state.kick, startTime + quarterNotes);
      this.playSound(this.state.snare, startTime + quarterNotes + 1);
      this.playSound(this.state.kick, startTime + quarterNotes + 2);
      this.playSound(this.state.kick, startTime + quarterNotes + 2.5);
      this.playSound(this.state.snare, startTime + quarterNotes + 3);

      for (let eightNotes = 0; eightNotes < 4; eightNotes = eightNotes + .5) {
        this.playSound(this.state.hihat, startTime + quarterNotes + eightNotes);
      }
    }
  }

  toggleSound(step, instrument) {
    this.state.sequence[step][instrument] = !this.state.sequence[step][instrument];
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
            kick
          </button>
          <button onClick={() => this.playSound(this.state.snare)}>
            snare
          </button>
          <button onClick={() => this.playSound(this.state.hihat)}>
            hihat
          </button>
          {/* <button onClick={this.playGroove}>
            Play Groove
          </button> */}
          <button onClick={this.playMetronome}>
            Start Sequence
          </button>
        </div>
        <Tempo setTempo={this.setTempo}/>
        <Sequence sequence={this.state.sequence} toggleSound={this.toggleSound}/>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('App'));
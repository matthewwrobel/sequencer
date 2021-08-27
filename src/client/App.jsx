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

    this.playMetronome = this.playMetronome.bind(this);
    this.scheduler = this.scheduler.bind(this);
    this.nextNote = this.nextNote.bind(this);
    this.setTempo = this.setTempo.bind(this);
    // this.startSequencer = this.startSequencer.bind(this);
    // this.updateSequence = this.updateSequence.bind(this);
    // this.scheduleEvent = this.scheduleEvent.bind(this);
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

  // this will be triggered on a click event
  playMetronome() {
    // set the next note time to be the current audio context time
    this.state.nextNoteTime = this.state.context.currentTime;
    this.scheduler();
  }

  scheduler() {
    while (this.state.nextNoteTime < this.state.context.currentTime + this.state.scheduleAheadTime ) {
      // iterate over the sequence here and invoke playSound when true is found
      for (let instrument in this.state.sequence[this.state.step]) {
        if (this.state.sequence[this.state.step][instrument]) {
          this.playSound(this.state[instrument], this.state.nextNoteTime);
        }
      }
      // this.playSound(this.state.kick, this.state.nextNoteTime); removed hard-coded kick
      this.nextNote();
    }
    setTimeout(() => {
      this.scheduler();
    }, 25);
  }

  nextNote() {
    let secondsPerBeat = 60.0 / this.state.tempo;
    // steps === 1/16th notes
    let intervalBetweenSteps = secondsPerBeat * .25;
    this.state.nextNoteTime = this.state.nextNoteTime + intervalBetweenSteps;
    this.state.step = this.state.step === 15 ? 0 : this.state.step + 1;
    console.log(this.state.step);
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

  render() {
    // console.log(this.state.sequence);
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
          <button onClick={this.playMetronome}>
            Start Metronome
          </button>
        </div>
        <Tempo setTempo={this.setTempo}/>
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

// FIRST ATTEMPT
// scheduleNote(time) {
//   this.playSound(this.state.kick, time);
// }

// scheduleEvent(e, lastScheduledEventTime = 0, nextEventTime, tempo = 60) {
//   // calculate the time between each even at the passed in tempo
//   let secondsBetweenBeats = 60 / tempo;
//   console.log(secondsBetweenBeats);
//   let scheduleAheadTime = .100;
//   let timeOut = .025;
//   if (!nextEventTime) {
//     nextEventTime = lastScheduledEventTime + secondsBetweenBeats;
//     console.log(nextEventTime);
//   }
//   // while the time of the last scheduled event plus the nextEvent to schedule Time is less than the last event plus the timeout
//   while (lastScheduledEventTime + scheduleAheadTime < lastScheduledEventTime + timeOut) {
//     // schedule the next event
//     playSound(this.state.kick, nextEventTime);
//     // lastScheduledEventTime = nextEventTime;
//     lastScheduledEventTime = nextEventTime;
//     // add secondsBetweenBeats to the value of nextEventTime
//     nextEventTime += secondsBetweenBeats;
//   }
//   // set a timeout to schedule the next event
//   setTimeout(() => {
//     console.log('settimeout called');
//     console.log('next event time:', nextEventTime);
//     this.scheduleEvent(null, lastScheduledEventTime, nextEventTime, tempo);
//   }, timeOut);
// }
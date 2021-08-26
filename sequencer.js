// I: steps (length of patter, beats/integer)
//    step
//    tempo

// step[0] === bass drum
// step[1] === snare drum
// step[2] === hi hat

const pattern = [
  [true, false, false], [false, false, false], [false, false, false], [false, false, false],
  [false, true, false], [false, false, false], [false, false, false], [false, false, false],
  [true, false, false], [false, false, false], [false, false, false], [false, false, false],
  [false, true, false], [false, false, false], [false, false, false], [false, false, false]
];

const sequencer = (pattern, tempo, step = 0) => {
  // BASE CASE
  // last step === true
  if (step === pattern.length - 1) {
    // play the sound
    // substitute console.log for sample trigger
    console.log(pattern[step][0], pattern[step][1], pattern[step][2]);
    // wait the correct number of ms
    // recursively call sequencer step === 0
    setTimeout(() => {
      sequencer(pattern, tempo);
    }, tempo);

  // RECURSIVE CASE
  } else {
  // play the sound
  console.log(pattern[step][0], pattern[step][1], pattern[step][2]);
  // wait
  // call sequencer at the next step
  setTimeout(() => {
    sequencer(pattern, tempo, step + 1);
  }, tempo);
  }
};

sequencer(pattern, 100);
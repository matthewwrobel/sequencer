const generateDefaultSequence = () => {
  const sequence = [];
  for (let step = 0; step < 16; step++) {
    sequence.push({
      kick: step === 0 || step === 8 ? true : false,
      snare: step === 4 || step === 12 ? true : false,
      hihat: true,
    });
  }
  return sequence;
};

export default generateDefaultSequence;
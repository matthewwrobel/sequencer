import React from 'react';
import Step from './Step.jsx';
import Beat from './Beat.jsx';

const Sequence = (props) => (

  <div className="sequence">
    {props.sequence.map((beat, i) => (
      <Beat updateSequence={props.updateSequence} key={i} beatNumber={i} beat={beat}/>
    ))}
  </div>

);

export default Sequence;
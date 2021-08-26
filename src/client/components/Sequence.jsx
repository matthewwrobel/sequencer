import React from 'react';
import Beat from './Beat.jsx';

const Sequence = (props) => (

  <div>
    {props.sequence.map((beat, i) => (
      <Beat updateSequence={props.updateSequence} key={i} beatNumber={i} beat={beat}/>
    ))}
  </div>

);

export default Sequence;
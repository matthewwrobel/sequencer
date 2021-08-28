import React from 'react';
import Cell from './Cell.jsx'

const Step = (props) => {

  const instruments = [
    props.instruments.hihat,
    props.instruments.snare,
    props.instruments.kick
  ];

  return (
    <div className={`step ${props.stepNumber}`}>
      {instruments.map((value, i) => (
        <Cell key={i} value={value} instrument={i} stepNumber={props.stepNumber} toggleSound={props.toggleSound}/>
      ))}
      <div>
        {props.stepNumber + 1}
      </div>
    </div>
  );

}

export default Step;
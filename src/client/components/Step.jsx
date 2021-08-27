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
        <Cell key={i} value={value} instrument={i}/>
      ))}
      <div>
        {`Beat ${props.stepNumber + 1}`}
      </div>
    </div>
  // <div className={`step ${props.stepNumber}`}>
  //   <div className="hihat">
  //     {`${props.instruments.hihat}`}
  //   </div>
  //   <div className="snare">
  //     {`${props.instruments.snare}`}
  //   </div>
  //   <div className="kick">
  //     {`${props.instruments.kick}`}
  //   </div>
  // </div>
  );

}

export default Step;
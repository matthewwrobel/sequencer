import React from 'react';

const Step = (props) => (
  <div className={`step ${props.stepNumber}`}>
    <div className="hihat">
      {`${props.instruments.hihat}`}
    </div>
    <div className="snare">
      {`${props.instruments.snare}`}
    </div>
    <div className="kick">
      {`${props.instruments.kick}`}
    </div>
  </div>
);

export default Step;
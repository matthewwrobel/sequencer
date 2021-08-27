import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instrument: null,
      value: null
    };
  }

  render() {
    const instrumentIndexes = {
      '0': 'kick',
      '1': 'snare',
      '2': 'hihat'
    };

    let instrument = instrumentIndexes[this.props.instrument];

    return (
      <div className={`${instrument}`}>
        {`${this.props.value}`}
      </div>

    );
  }
}

export default Cell;
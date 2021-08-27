import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value
    })
  }

  handleClick() {
    this.props.toggleSound(this.props.stepNumber, this.instrument);
    this.setState({
      value: !this.state.value
    });
  }

  render() {
    const instrumentIndexes = {
      '2': 'kick',
      '1': 'snare',
      '0': 'hihat'
    };
    this.instrument = instrumentIndexes[this.props.instrument];
    return (
      <div className={`${this.instrument}`} onClick={this.handleClick}>
        {`${this.state.value}`}
      </div>
    );
  }
}

export default Cell;
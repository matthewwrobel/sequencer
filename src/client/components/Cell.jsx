import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    const instrumentIndexes = {
      '2': 'kick',
      '1': 'snare',
      '0': 'hihat'
    };
    this.instrument = instrumentIndexes[this.props.instrument];
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
    return (
      <div className={this.instrument} onClick={this.handleClick}>
        {this.state.value ? 'ON' : 'OFF'}
      </div>
    );
  }
}

export default Cell;
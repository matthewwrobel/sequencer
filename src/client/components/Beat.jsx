import React from 'react';

class Beat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      play: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(updateSequence) {
    this.setState({
      play: !this.state.play
    }, () => {
      console.log(this.props.beatNumber);
      updateSequence(this.props.beatNumber, this.state.play);
      console.log('the beat you just clicked is: ', this.state.play);
    })
  }

  render() {

    const message = this.state.play ? 'ON' : 'OFF';

    return (
      <span onClick={() => this.handleClick(this.props.updateSequence)}>
        {message}
      </span>
    )
  }
}

export default Beat;
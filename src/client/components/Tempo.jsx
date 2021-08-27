import React from 'react';

class Tempo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '60'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          this.props.setTempo(Number(this.state.value));
        }}>
          <label>
            Tempo:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Set Tempo"/>
        </form>
      </div>
    );
  }
}

export default Tempo;
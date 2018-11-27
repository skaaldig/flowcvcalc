import React, { Component } from 'react';
import './App.css';



// var liquidCv = function(inlet, outlet, flow, gravity) {
//   let cv = flow * Math.sqrt((gravity / (inlet - outlet)));
//   return cv.toFixed(4);
// };


class CalculatorForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      mediumType:'liquid',
      inlet: '',
      outlet:'',
      gravity:'',
      flowRate:'',
      flow:'',
      cv: ''
      flowUnit:
    };
    this.handleInput = this.handleInput.bind(this)
  }
  handleInput (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]:value
    });
  }



  render() {
    const flowUnits = [
      {
        name: 'liquid',
        units: ['GPM', 'l/hr', 'l/min', 'l/sec', 'm3/hr']
      },

      {
        name: 'gas',
        units: ['SCFM', 'stdl/min', 'stdm3/hr', 'stdm3/min']
      }
    ]

    const getFlowUnits = () => {
      const mediumUnits = flowUnits.filter(({name}) => name === this.state.mediumType)[0]
      return (
        <div>
          <select>
            {mediumUnits.units.map(unit => <option>{unit}</option>)}
          </select>
        </div>
        )
    }

      return (
        <div>
          <select onChange={(e) => this.setState({mediumType: e.target.value})}>
            {flowUnits.map(({name}) => <option value={name}>{name}</option>)}
          </select>
          <input name="inlet" value={this.state.inlet} onChange={this.handleInput}></input>
          <input name="outlet" value={this.state.outlet} onChange={this.handleInput}></input>
          <input name="gravity" value={this.state.gravity} onChange={this.handleInput}></input>
          {getFlowUnits()}
        </div>
        )
    }
}



class App extends Component {

  render() {
    return (
      <div className="App">
        <CalculatorForm />
      </div>
    );
  }
}

export default App;

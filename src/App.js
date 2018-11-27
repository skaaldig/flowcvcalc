import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';



// var liquidCv = function(inlet, outlet, flow, gravity) {
//   let cv = flow * Math.sqrt((gravity / (inlet - outlet)));
//   return cv.toFixed(4);
// };


const pressureUnits = ['psia', 'kpa', 'bar', 'mpa']
const tempUnits = ['fahrenheit', 'celsius', 'kelvin']
const flowUnits = [
  {
    name: 'liquid',
    units: ['gpm', 'l/hr', 'l/min', 'l/sec', 'm3/hr']
  },

  {
    name: 'gas',
    units: ['gpm', 'stdl/min', 'stdm3/hr', 'stdm3/min']
  }
]

class CalculatorForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      mediumType:'liquid',
      inlet: '',
      inletUnit: 'psia',
      outlet:'',
      outletUnit:'psia',
      gravity:'',
      flowRate:'',
      flow:'',
      cv: '',
      flowUnit: 'gpm'
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

    const getFlowUnits = () => {
      const mediumUnits = flowUnits.filter(({name}) => name === this.state.mediumType)[0]
      return (
        <div class="col-1">
          <select class="form-control" name="flowUnit" onChange={this.handleInput}>
            {mediumUnits.units.map(unit => <option>{unit}</option>)}
          </select>
        </div>
        )
    }

      return (
        <form>
          <div class="form-group row">
          <label class="col-2">Medium Type</label>
            <div class="col-5">
              <select class="form-control" name="mediumType" onChange={this.handleInput}>
                {flowUnits.map(({name}) => <option value={name}>{name}</option>)}
              </select>
            </div>
          </div>

          <div class="form-group row">
          <label class="col-2">Inlet Pressure</label>
            <div class="col-5">
              <input class="form-control" name="inlet" value={this.state.inlet} onChange={this.handleInput}></input>
            </div>
              <div class="col-1">
                <select class="form-control" name="inletUnit" onChange={this.handleInput}>
                  {pressureUnits.map(unit => <option value={unit}>{unit}</option>)}
                </select>
              </div>
          </div>

          <div class="form-group row">
          <label class="col-2">Outlet Pressure</label>
            <div class="col-5">
              <input class="form-control" name="outlet" value={this.state.outlet} onChange={this.handleInput}></input>
            </div>
              <div class="col-1">
                <select class="form-control" name="outletUnit" onChange={this.handleInput}>
                  {pressureUnits.map((unit) => <option value={unit}>{unit}</option>)}
                </select>
              </div>
          </div>

          <div class="form-group row">
          <label class="col-2">Specific Gravity</label>
            <div class="col-5">
              <input class="form-control" name="gravity" value={this.state.gravity} onChange={this.handleInput}></input>
            </div>
          </div>

          <div class="form-group row">
          <label class="col-2">Flow Rate</label>
            <div class="col-2">
              <input class="form-control" name="flowRate" value={this.state.flowRate} onChange={this.handleInput}></input>
            </div>
            {getFlowUnits()}
          </div>

        </form>
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

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


const pressureUnits = ['psia', 'kpa', 'bar', 'mpa']
const tempUnits = ['fahrenheit', 'celsius', 'kelvin']
const flowUnits = [
  {
    name: 'liquid',
    units: ['gpm', 'l/hr', 'l/min', 'l/sec', 'm3/hr']
  },

  {
    name: 'gas',
    units: ['scfm', 'stdl/min', 'stdm3/hr', 'stdm3/min']
  }
]

const liquidCv = function(inlet, outlet, flow, gravity) {
  let cv = flow * Math.sqrt((gravity / (inlet - outlet)));
  return cv.toFixed(3);
};


const gasCv = function(inlet, outlet, flow, temp, gravity) {
  if (outlet > inlet / 2) {
    let delta = inlet - outlet;
    let cv = flow / (22.67 * inlet * (1 - ((2 * delta) / (3 * inlet))) * Math.sqrt(delta / (inlet * gravity * (temp + 460))))
    return cv.toFixed(3);
  } else {
    let cv = flow / (0.471 * 22.67 * inlet * Math.sqrt(1 / (gravity * (temp + 460))))
    return cv.toFixed(3);
  }
}

const pressureConvert = function(pressure, unit) {
  const units = {
    "kpa":   6.895,
    "bar":  14.504,
    "mpa": 145.037
  }

  if (unit === "kpa") {
    const result = pressure / units[unit];
    return result.toFixed(3);
  }
  const result = pressure * units[unit];
  return result.toFixed(3);
}


const flowConvert = function(flow, unit) {
  const units = {
    lph:  0.004,
    lpm:  0.264,
    lps: 15.850,
    m3hr: 4.403
  }
  const result = flow * units[unit];
  return result.toFixed(3);
}

const temperatureConvert = function(temperature, unit) {
  const convertC = (temp) => {return temp * 1.8 + 32}
  const convertK = (temp) => {return (temp - 273.15) * 1.8 + 32}

  const units = {
    celsius: convertC(temperature).toFixed(3),
    kelvin: convertK(temperature).toFixed(3)
  }
  return parseFloat(units[unit])
}


class CalculatorForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      mediumType:'liquid',
      inlet: '',
      inletUnit: 'psia',
      outlet:'',
      outletUnit:'psia',
      temperature:'',
      tempUnit:'fahrenheit',
      gravity:'',
      flowRate:'',
      flow:'',
      cv: '',
      flowUnit: 'gpm'
    };

    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInput (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({[name]:value});
  }

  handleSubmit (event) {
    let inlet = parseFloat(this.state.inlet, 10)
    const inletUnit = this.state.inletUnit
    var outlet = parseFloat(this.state.outlet, 10)
    const outletUnit = this.state.outletUnit
    let flow = parseFloat(this.state.flowRate, 10)
    const flowUnit = this.state.flowUnit
    const gravity = parseFloat(this.state.gravity, 10)
    let temperature = parseFloat(this.state.temperature, 10)
    const tempUnit = this.state.tempUnit
    const mediumType = this.state.mediumType


    if (inletUnit !== "psia") {
      inlet = pressureConvert(inlet, inletUnit)
    }

    if (outletUnit !== "psia") {
      outlet = pressureConvert(outlet, outletUnit)
    }

    if (flowUnit !== "gpm") {
      flow = flowConvert(flow, flowUnit)
    }

    if (tempUnit !== "fahrenheit") {
      temperature = temperatureConvert(temperature, tempUnit)
    }

    if (outlet > inlet) {
      alert("inlet pressure must be greater than outlet pressure")
    }

    if (mediumType === "gas") {
      this.setState({cv: gasCv(inlet, outlet, flow, temperature, gravity)})
    } else {
      this.setState({cv: liquidCv(inlet, outlet, flow, gravity)})
    }
  }


  render() {

    const getFlowUnits = () => {
      const mediumUnits = flowUnits.filter(({name}) => name === this.state.mediumType)[0]
      return (
        <div class="col-1">
          <select class="form-control" name="mediumType" onChange={this.handleInput}>
            {mediumUnits.units.map(unit => <option>{unit}</option>)}
          </select>
        </div>
        )
    }

      return (
        <div>
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
          <label class="col-2">Temperature</label>
            <div class="col-5">
              <input class="form-control" name="temperature" value={this.state.temperature} onChange={this.handleInput}></input>
            </div>
              <div class="col-1">
                <select class="form-control" name="tempUnit" onChange={this.handleInput}>
                  {tempUnits.map((unit) => <option value={unit}>{unit}</option>)}
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
        <button onClick={this.handleSubmit}>Calculate</button>
        <h1>{this.state.cv}</h1>
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

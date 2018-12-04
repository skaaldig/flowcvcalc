import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


const pressureUnits = ['psia', 'kpa', 'bar', 'mpa']
const calcTypes = ['cv', 'flow']
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

const liquidFlow = function(inlet, outlet, gravity, cv) {
    let flow = cv * Math.sqrt((inlet - outlet) / gravity)
    return flow.toFixed(3);
  }

  const gasFlow = function(inlet, outlet, temp, gravity, cv) {
    if (outlet > inlet / 2) {
        let delta = inlet - outlet
        const flow = cv * 22.67 * inlet * (1 - ((2 * delta) / (3 * inlet))) * Math.sqrt(delta / (inlet * gravity * (temp + 460)))
        return flow.toFixed(3);
  }
    const flow = cv * (22.67 * inlet * 0.471 * Math.sqrt(1 / (gravity * (temp + 460))))
    return flow.toFixed(3);
}

const pressureConvert = function(pressure, unit) {
  const units = {
    "kpa":   6.895,
    "bar":  14.504,
    "mpa": 145.037
  }

  if (unit === "psia") {
    return pressure
  }
  else if (unit === "kpa") {
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
  if (unit === "gpm") {
    return flow
  }
  let result = flow * units[unit];
  return result.toFixed(3);
}

const temperatureConvert = function(temperature, unit) {
  if (unit ==="f") {
    return temperature
  }
  const convertC = (temp) => {return temp * 1.8 + 32}
  const convertK = (temp) => {return (temp - 273.15) * 1.8 + 32}

  const units = {
    celsius: convertC(temperature).toFixed(3),
    kelvin: convertK(temperature).toFixed(3)
  }
  return parseFloat(units[unit])
}


const performCvCalc = function(context) {
  if (context.mediumType === 'gas') {
    return gasCv(context.inlet, context.outlet, context.flow, context.temp, context.gravity);
  }
  return liquidCv(context.inlet, context.outlet, context.flow, context.gravity)
}

const performFlowCalc = function(context) {
  if (context.mediumType === 'gas') {
    return gasFlow(context.inlet, context.outlet, context.temp, context.gravity, context.cv)
  }
  return liquidFlow(context.inlet, context.outlet, context.gravity, context.cv)
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
      flowUnit: 'gpm',
      calcType: 'cv'
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
    let cv = parseFloat(this.state.cv, 10)

    const formContext = {
      inlet: pressureConvert(inlet, inletUnit),
      outlet: pressureConvert(outlet, outletUnit),
      flow:flowConvert(flow, flowUnit),
      temperature:temperatureConvert(temperature, tempUnit),
      gravity: gravity,
      mediumType: mediumType,
      cv: cv
    }


    if (formContext.outlet > formContext.inlet) {
      alert("inlet pressure must be greater than outlet pressure")
    }

    if (this.state.calcType === 'flow') {
      return this.setState({flow: performFlowCalc(formContext)})
    }
     return this.setState({cv: performCvCalc(formContext)})
  }


  render() {
    const getCalcType = () => {
      if (this.state.calcType === 'flow') {
        return (
          <div className="form-group row">
            <label className="col-2">CV</label>
            <div className="col-5">
              <input className="form-control" name="cv" value={this.state.cv} onChange={this.handleInput}></input>
            </div>
          </div>
          );
       return (
            <div className="form-group row">
            <label className="col-2">Flow Rate</label>
            <div className="col-5">
              <input className="form-control" name="flowRate" value={this.state.flowRate} onChange={this.handleInput}></input>
            </div>
          </div>
       )
      }

      return (
          <div className="form-group row">
          <label className="col-2">Flow Rate</label>
            <div className="col-2">
              <input className="form-control" name="flowRate" value={this.state.flowRate} onChange={this.handleInput}></input>
            </div>
            {getFlowUnits()}
          </div>
        );
    }

    const getFlowUnits = () => {
      const mediumUnits = flowUnits.filter(({name}) => name === this.state.mediumType)[0]
      return (
        <div className="col-1">
          <select className="form-control" name="mediumType" onChange={this.handleInput}>
            {mediumUnits.units.map(unit => <option>{unit}</option>)}
          </select>
        </div>
        )
    }

    const getResult = () => {
      if (this.state.calcType === 'flow') {
        return this.state.flow
      }
      return this.state.cv
    }

      return (
        <div>
        <form>
          <div className="form-group row">
          <label className="col-2">Calculation Type</label>
            <div className="col-5">
              <select className="form-control" name="calcType" onChange={this.handleInput}>
                {calcTypes.map((calc) => <option value={calc}>{calc}</option>)}
                }
              </select>
            </div>
          </div>


          <div className="form-group row">
          <label className="col-2">Medium Type</label>
            <div className="col-5">
              <select className="form-control" name="mediumType" onChange={this.handleInput}>
                {flowUnits.map(({name}) => <option value={name}>{name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group row">
          <label className="col-2">Inlet Pressure</label>
            <div className="col-5">
              <input className="form-control" name="inlet" value={this.state.inlet} onChange={this.handleInput}></input>
            </div>
              <div className="col-1">
                <select className="form-control" name="inletUnit" onChange={this.handleInput}>
                  {pressureUnits.map(unit => <option value={unit}>{unit}</option>)}
                </select>
              </div>
          </div>

          <div className="form-group row">
          <label className="col-2">Outlet Pressure</label>
            <div className="col-5">
              <input className="form-control" name="outlet" value={this.state.outlet} onChange={this.handleInput}></input>
            </div>
              <div className="col-1">
                <select className="form-control" name="outletUnit" onChange={this.handleInput}>
                  {pressureUnits.map((unit) => <option value={unit}>{unit}</option>)}
                </select>
              </div>
          </div>

          <div className="form-group row">
          <label className="col-2">Temperature</label>
            <div className="col-5">
              <input className="form-control" name="temperature" value={this.state.temperature} onChange={this.handleInput}></input>
            </div>
              <div className="col-1">
                <select className="form-control" name="tempUnit" onChange={this.handleInput}>
                  {tempUnits.map((unit) => <option value={unit}>{unit}</option>)}
                </select>
              </div>
          </div>

          <div className="form-group row">
          <label className="col-2">Specific Gravity</label>
            <div className="col-5">
              <input className="form-control" name="gravity" value={this.state.gravity} onChange={this.handleInput}></input>
            </div>
          </div>

          {getCalcType()}

        </form>
        <button onClick={this.handleSubmit}>Calculate</button>
        <h1>{getResult()}</h1>
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

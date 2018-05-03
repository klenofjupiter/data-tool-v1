import React, { Component } from 'react';
import DataMaker from './DataMaker';
import { year_arr, sub_area, initialState }from './helperFunctions/pageSetup'
import * as d3 from 'd3';
import axios from 'axios'

import './App.css';

// to do -- talk with Vin about how to handle cascading selections: should we be protective or declarative 
// functionality of this component: 'design lines' (choose drop downs, add them to queue, normalize the data)
//functionality of datamaker component: draw the actual lines (pass the line data down as props on "Draw", let them be drawn (in component will receive props))
class App extends Component {
  constructor() {
    super();
    this.state = initialState

    this.selectStartYear = this.selectStartYear.bind(this);
    this.selectAreaType = this.selectAreaType.bind(this);
    this.selectEndYear = this.selectEndYear.bind(this);
    this.selectMetric = this.selectMetric.bind(this);
    this.selectArea = this.selectArea.bind(this);
    this.selectGranularity = this.selectGranularity.bind(this);
    this.selectValue = this.selectValue.bind(this);
    this.addLine = this.addLine.bind(this);
    this.drawPermission = this.drawPermission.bind(this);
    this.normToggle = this.normToggle.bind(this);
    this.clearPlot = this.clearPlot.bind(this);
    this.yearMinus = this.yearMinus.bind(this);
    this.yearPlus = this.yearPlus.bind(this);
  }

  addLine(){
    let line_id = this.state.locus_value + ' in ' + this.state.area_value;
    let queried_data = this.state.inData[this.state.area_value][this.state.locus_level][this.state.locus_value];
    // this is a change from Vin's version to avoid mutating state -- lines_to_draw becomes an array instead of an object, and so each line gets a "name" property that would have been its object key previously 
    this.setState({lines_to_draw: [...this.state.lines_to_draw, {...queried_data, name:line_id}]})
    d3.select('.sidebar')
      .append("p")
      .attr("class",'sb_desc')
      .append("text")
      .text(line_id);
  }

clearPlot() {
  // window.location.reload();
  this.setState({...initialState})
  d3.selectAll("svg > *").remove();
  d3.selectAll(".sidebar > *").remove();
  d3.selectAll(".year-button").style('display', 'none')
}
normToggle() {
  this.setState({normed: !this.state.normed})
}
drawPermission() {
  this.setState({drawLines: true})
  window.setTimeout(() => this.setState({ plotted: true}),0) //the timeout prevents future changes while still giving the chart time to draw at all
 }

selectStartYear(evt) { 
  this.setState({ start_year: evt.target.value })
  this.setState({showEndYear: true})
}
selectEndYear(evt) {
  this.setState({ end_year: evt.target.value })
}

  selectAreaType(evt) { 
     this.setState({ area_type: evt.target.value})
     let areas = sub_area(evt.target.value, Object.keys(this.state.inData))
     this.setState({area_array: areas})
  }
  

  selectMetric(evt){
    this.setState({ metric:evt.target.value })
    axios.get(`/data/QCEW/${evt.target.value}.json`)
    .then((result) => {
      this.setState({inData: result.data})
    })
  }
  
  selectArea(evt) {
    this.setState({ area_value: evt.target.value })
  }
  
  selectGranularity(evt){
    this.setState({ locus_level: evt.target.value })
  }

  selectValue(evt){
    this.setState({ locus_value: evt.target.value })
  }

  yearMinus() {
    this.setState({start_year : this.state.start_year - 1, end_year: this.state.end_year - 1})
  }
  yearPlus() {
    this.setState({start_year: this.state.start_year + 1 , end_year: this.state.end_year + 1})
  }
  componentDidMount(){}

  render() {
    console.log('startyear', this.state.start_year)
    return (
      <div className="App">
          <div className = "pageHolder">
          <ul className="paramater-list">
            <li>
            <select id="metricSelect" disabled={ this.state.plotted ? true : false } value={this.state.metric ? this.state.metric : "default"} onChange={this.selectMetric}>
              <option disabled = "disabled" value="default"> 1. Select a Metric to Begin </option>
              { this.state.metrics.map((metric) => <option key={metric} value={metric}>{metric}</option>)}
            </select>
            </li>
            {/*<br/> */}
            <li>
            <select id = "startYearSelect" disabled={ this.state.plotted ? true : false } value={this.state.start_year ? this.state.start_year : "default"} onChange={this.selectStartYear}>
              <option disabled = "disabled" value="default"> 2. Select a Start Year </option>
              { year_arr(1990, 2016).map((year) => <option key={year} value={year}>{year}</option>)}
            </select> 
            </li>
            <li>  
            <select id = "endYearSelect" disabled={ this.state.plotted ? true : false } value={this.state.end_year ? this.state.end_year : "default"} onChange={this.selectEndYear}>
              <option  disabled = "disabled" value="default"> 3. Select an End Year </option>
              { this.state.showEndYear && year_arr((parseInt(this.state.start_year)+1),2016).map((year) => <option key={year} value={year}>{year}</option>)}
            </select> 
            </li>
            {/*<br/> */}
            <li>
            <select id = "areaTypeSelect" disabled={ this.state.plotted ? true : false } value={this.state.area_type ? this.state.area_type : "default"} onChange={this.selectAreaType}>
              <option disabled = "disabled" value="default"> 4. Select an Area Type </option>
              {this.state.area_types.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            </li>
            <li>
            <select id = "areaSelect" disabled={ this.state.plotted ? true : false } value={this.state.area_value ? this.state.area_value : "default"} onChange={this.selectArea}>
              <option disabled = "disabled" value="default"> 5. Select a Geographical Area </option>
              {this.state.area_array.length && this.state.area_array.sort().map((area) => <option key={area} value={area}>{area}</option>)}
            </select>
            </li>
            {/*<br/>*/}
            <li>
            <select id = "locusLevelSelect" disabled={ this.state.plotted ? true : false } value={this.state.locus_level ? this.state.locus_level : "default"} onChange={this.selectGranularity}>
              <option disabled = "disabled" value="default"> 6. Select the Locus Function Granularity</option>
              { this.state.area_value && Object.keys(this.state.inData[this.state.area_value]).map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
            </li>
            <li>
            <select id = "locusValueSelect" disabled={ this.state.plotted ? true : false } value={this.state.locus_value ? this.state.locus_value : "default"} onChange={this.selectValue}>
              <option disabled = "disabled" value="default"> 7. Select the Locus Function </option>
              { this.state.area_value && this.state.locus_level && Object.keys(this.state.inData[this.state.area_value][this.state.locus_level]).sort().map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            </li>
            <li>
            <button type="button" id = "addDrawn" disabled={ this.state.plotted ? true : false } onClick={this.addLine}> Add to Plot </button>
            </li>
            <li>
            <button type="button" id = "drawPlot" disabled={ this.state.plotted ? true : false } onClick={this.drawPermission}> Plot Lines </button>
            </li>
            <li>
            <label>Normalize Data:</label>
            <input type="checkbox" id = "norm" checked={this.state.normed} onChange={this.normToggle} />
            </li>
            <li>
            <button type='button' id = 'clearPlot' onClick={this.clearPlot}> Clear Plot</button>
            </li>
            </ul>
{/*            <br/>
            <br/>*/}
            <div id= "sidebar" className= "sidebar"></div>
            <div id='tooltip' />
            {/*<br/>
                        <br/>*/}
          </div>
         <DataMaker normed={this.state.normed} lines={this.state.lines_to_draw} drawLines={this.state.drawLines} plotted={this.state.plotted} start_year={this.state.start_year} end_year={this.state.end_year} metric={this.state.metric} min_y={this.state.min_y} max_y={this.state.max_y}/>
      <button className="year-button minus" onClick={this.yearMinus} disabled={(this.state.start_year > 1990 ? false : true)}>back one</button> <button className="year-button plus" onClick={this.yearPlus} disabled={(this.state.end_year && this.state.end_year < 2016) ? false : true}>fwd one</button>
      </div>
    );
  }
}

export default App;

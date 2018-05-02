// // scratchwork.js
// //old x y scales:
// 	 let yScale = d3.scale.linear().range([plot_margin.left, plot_width - plot_margin.right]).domain([parseInt(props.min_y) * 0.8, parseInt(props.max_y)*1.1])
	 

// 	 let xScale = d3.scale.linear().range([plot_height - plot_margin.top, plot_margin.bottom]).domain([parseInt(years[0]), parseInt(years[years.length -1])])
// //old DataMaker.js
// // import React, { Component } from 'react';
// // import * as d3 from 'd3';
// // import { setup_chart, year_arr } from './helperFunctions/pageSetup'
// // import { clear_plot, trim_dd, get_line_fn_data } from './helperFunctions/drawLines'

// // export default class DataMaker extends Component {
// //   componentDidMount() {
// //   	//d3 functions go here
// //   	let plot_margin = {top: 70, right: 20, bottom: 70, left: 200};
// // 	let plot_width = 1700 - plot_margin.left - plot_margin.right;
// // 	let plot_height = 600 - plot_margin.top - plot_margin.bottom;
// // 	let years = year_arr(this.props.start_year, this.props.end_year)
// //   	setup_chart();

// //   	if(this.props.drawLines){
// //   		//draw the lines
// //   		if(this.props.plotted){
// //   			//if there are already lines, remove the lines 
// //   			clear_plot();
// //   		}
// //   	   d3.select('.plot').append("text")
// //         .attr("x", (plot_width / 2))             
// //         .attr("y", 0 - (plot_margin.top / 2))
// //         .attr("text-anchor", "middle")  
// //         .style("font-size", "16px") 
// //         .style("text-decoration", "underline")  
// //         .text(this.props.metric + " from " + this.props.start_year+ " to " + this.props.end_year);
     
// //        let draw_data = trim_dd(this.props.lines_to_draw, years)
// //        //skipping norm-data handling will go here 
// //        let line_fn_data = get_line_fn_data(draw_data, years)

// //        for (let line in draw_data){
// // 		if (this.props.max_y < d3.max(d3.values(draw_data[line]))){
// // 			 // where are we going to control max_y? pass a function down in props?
// // 			 // like so : this.props.changeMax_Y(newMax) {
// // 			 // 	this.setState({max_y: newMax})
// // 			 // } then call changeMax_Y(d3.max(d3.values(draw_data[line])))
// // 			 // let max_y = d3.max(d3.values(draw_data[line]));
// // 			 this.props.changeMax_Y(d3.max(d3.values(draw_data[line])))
// // 		}
// // 		if (this.props.min_y > d3.min(d3.values(draw_data[line]))){
// //              //have to do same here as with changeMaxY
// // 			// this.props.min_y = d3.min(d3.values(draw_data[line]));
// // 			this.props.changeMin_Y(d3.min(d3.values(draw_data[line])))
// // 		  }
// // 	    }

// //         d3.select('.plot_y').domain([this.props.min_y*0.8, this.props.max_y*1.1])
// //         d3.select('.plot_x').domain([years[0], years[years.length-1]])

        

// //         let plot = d3.select('.plot').append('g')
// //         			 .attr('class', 'x-axis')
// //         			 .attr('transform', 'translate(0,' + plot_height + ')')
// //         			 // .call(plot_x_axis)
// //   	}
// //   }
// //   shouldComponentUpdate() {
// //   	return false;
// //   }
// //   componentWillReceiveProps() {
// //   	//update functions go here
// //   	if(this.props.drawLines){
// //   		//draw the lines
// //   		if(this.props.plotted){
// //   			//remove lines if they are there
// //   			clear_plot();
// //   		}
// //   	}
// //   }

// //   render() {

// //   	//data-maker is the equivalent of className="chart" in Vin's version 
// //   	return <div className="data-maker" />
// //   }
// // }
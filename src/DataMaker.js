import React, { Component } from 'react';
import * as d3 from 'd3';
import { year_arr } from './helperFunctions/pageSetup'
import { trim_dd, get_line_fn_data, colors, normalize_to_100  } from './helperFunctions/drawLines'

export default class DataMaker extends Component {
  constructor(){
  	super();
  	this.drawPlot = this.drawPlot.bind(this);
  }
  componentDidMount() {
  	//d3 functions go here
  	if(this.props.drawLines){
  		this.drawPlot(this.props);
  	}
  }
  shouldComponentUpdate() {
  	return false;
  }
  componentWillReceiveProps(nextProps) {
  	if(nextProps.drawLines  && !nextProps.plotted){
        this.drawPlot(nextProps);
    }
    if(nextProps.normed !== this.props.normed){
      d3.selectAll("svg > *").remove();
      this.drawPlot(nextProps)
    }
  }

  render() {
  	return <svg className="data-maker" />
  }

 drawPlot(props){
   	let plot_margin = {top: 70, right: 20, bottom: 70, left: 200};
	  let plot_width = 1700 - plot_margin.left - plot_margin.right;
	  let plot_height = 1800 - plot_margin.top - plot_margin.bottom;
	  let years = year_arr(this.props.start_year, this.props.end_year)
	  let plot = d3.select('.data-maker')

   if(props.drawLines){ //check to see if we *should* draw a plot
  	
  	plot.append('text') //graph title
  		.attr('x', (plot_width/3))
  		.attr('y', 0 - (plot_margin.top /2))
  		.attr('text-anchor', 'middle')
  		.attr('class', 'graph-title')
  		.style('font-size', '16px')
  		.text(props.metric + " from " + props.start_year + " to " + props.end_year)	

    let draw_data = trim_dd(this.props.lines, years) //make sure our lines only include the right years
    // console.log('unnormed', draw_data)
    if(props.normed){ //norm our data if it's asked for
    	draw_data = normalize_to_100(draw_data, years)
     }
     // console.log('normed', draw_data)

    let line_fn_data = get_line_fn_data(draw_data, years) 
    
    //establish the y bounds of our graph
    let newMaxY, newMinY
	 if(!props.normed){
      newMaxY = props.max_y
      newMinY = props.min_y
   }else{
      newMaxY = 100;
      newMinY = 100;
   }
    for (let line in draw_data){
     if (newMaxY < d3.max(d3.values(draw_data[line]))){
       newMaxY = d3.max(d3.values(draw_data[line]))
     }
     if(newMinY > d3.min(d3.values(draw_data[line]))){
        newMinY = d3.min(d3.values(draw_data[line]))
     }
    }  
	 let yScale = d3.scaleLinear().range([400,0]).domain([parseInt(newMinY) * 0.8, parseInt(newMaxY)*1.1])
	 let xScale = d3.scaleLinear().range([0,plot_width*0.8]).domain([parseInt(years[0]), parseInt(years[years.length -1])])

  
	 let xAxis = d3.axisBottom(xScale).ticks(years.length).tickFormat(d3.format('.4'));
	 let yAxis = d3.axisLeft(yScale).ticks(10);

     plot.append('g')
     	.attr('transform', 'translate(0,'+400+')')
     	.call(xAxis)
     	.attr('class', 'x-class')
     plot.append('g')
     	.call(yAxis)
     	.attr('class', 'y-class')

    //this is a helper function (it makes each individual line based on the data)
    let valueline = d3.line()
    	.x(function(d) {
    		return xScale(d.x); })
    	.y(function(d) { 
    		return yScale(d.y); })


    //this makes the group for each line, and binds it to our draw_data
    const eachline = plot.selectAll('.eachline')
				    .data(d3.keys(draw_data))
				    .enter()
				    .append("g")
				    .attr("class", (d) => {
              let output = ""
              for (let i = 0; i < d.length; i++){
                if(d[i] !== '.' &&  d[i] !== ',') output += d[i];
               }
              output = output.split(" ");
              output = output.join('-')
              return `eachline-${output}`
            });

    //this actually draws the line
	eachline.append("path")
	    .attr("class",(d) => {
        let output = ""
        for (let i = 0; i < d.length; i++){
          if(d[i] !== '.' &&  d[i] !== ',') output += d[i];
         }
         output = output.split(" ");
         output = output.join('-')
         return `eachline-${output}-line`
      })
	    .attr("d",function(d){
	    	return valueline(line_fn_data[d])})
	    .style("stroke",function(d,i){return colors(i);})
	    .style("fill", "none")


// this instantiates a single tooltip line whose x coordinates we will manipulate in the mouse event funcs for tipBox 
    let tooltipLine = d3.select('.data-maker').append('line').attr('class', 'tooltipLine')
//this does the same for the actual tip box field
    let tooltip = d3.select('#tooltip').style('display', 'none')
// this will give us our area in which our tool tip can appear, and serves as an overlay so that other elements don't interfere with events 
    let tipBox = plot.append('rect')
    .attr('width', plot_width*0.85)
    .attr('height', 400)
    .attr('opacity', '0')
    .attr('class', 'tipBox')
    .on('mousemove', function(){
    	let year = Math.floor(xScale.invert(d3.mouse(this)[0]))
    	tooltipLine.attr('stroke', 'black')
    		.style('display', 'block')
    		.attr('x1', xScale(year))
    		.attr('x2', xScale(year))
    		.attr('y1', 0)
    		.attr('y2', 400)

        tooltip.html(year)
        .style('display', 'block')
        .style('left', () => Math.max(0, d3.event.pageX - 150)+"px")
        .style('top',  () => (d3.event.pageY +20) + "px")
        .selectAll()
        .data(d3.keys(draw_data))
        .enter()
        .append('div')
        .style('color', (d,i) => {
           let output = "" //this makes our tool tip font colors match their corresponding lines
            for (let i = 0; i < d.length; i++){
              if(d[i] !== '.' &&  d[i] !== ',') output += d[i];
             }
           output = output.split(" ");
           output = output.join('-')
          let color = d3.selectAll('path').filter(`.eachline-${output}-line`).style('stroke')
          return color;
        } )
        .html((d) => {
    		if (year === props.start_year){
    			return d + " : " + draw_data[d][year] 
    		}
    		else{
    			let data_y0 = draw_data[d][props.start_year];
    			let growth_from_y0 = (draw_data[d][year] - data_y0) / (data_y0)
    			let growth_1y = ((draw_data[d][year] - draw_data[d][year-1]) / (draw_data[d][year-1]))
          if (isNaN(data_y0)) data_y0 = 0;
          if(isNaN(growth_from_y0)) growth_from_y0 = 0;
          if (isNaN(growth_1y)) growth_1y = 0;
    			return d + " : " + draw_data[d][year] + " <br> " + " One-year-growth : "+  d3.format(",.2%")(growth_1y) + "<br>" + "Growth from start year : "+ d3.format(",.2%")(growth_from_y0) + "<br>" + "<br>";	
    		}
        })
    })
    .on('mouseout', function(){
       	tooltipLine.style('display', 'none')
       	tooltip.style('display', 'none')
      });
  	}


  }
}



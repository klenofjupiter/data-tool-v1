
export function trim_dd(dd,years){
	//the purpose of this function is to remove every value outside of the years array
	var output = {} 
	for (let i = 0; i < dd.length; i++){
		let cleanYear = {};
		for (let year in dd[i]){
			if(years.includes(parseInt(year)) || years.includes(year.toString())){
                cleanYear[year] = dd[i][year]
			}
		}
		output[dd[i].name] = cleanYear;
	}
	return output
}

export function get_line_fn_data(draw_data, years){
	//the purpose of this function is to create the actual x and y coordinates for each point on each line
	let line_fn_data = {}

	for (let id in draw_data){
		let to_push = []
		for (let y_i =0; y_i<years.length; y_i++){
			to_push.push( {x:parseInt(years[y_i]), y:draw_data[id][years[y_i]]} )
			
		}
		line_fn_data[id] = to_push;
	}
 
	return line_fn_data;
}

export function colors(n) {
  var colores = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores[n % colores.length];
}

export function normalize_to_100(draw_data, years){
  const output = {}
  for (let id in draw_data){
  	output[id] = {};
  	output[id][years[0]] = 100;
  	let data_y0 = draw_data[id][years[0]];

  	for (let i = 1; i < years.length; i++){
  	  let growth = draw_data[id][years[i]] / (data_y0);
  	  output[id][years[i]] = 100 * growth;
  	}
  }
  return output
}





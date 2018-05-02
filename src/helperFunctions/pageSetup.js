
 export function year_arr(start,end){
	let y_a = []
	for (var y = start; y <= end; y ++ ){
		y_a.push(y);
	}
	return y_a
}

export function sub_area(area_type,all_areas){
	let output_areas = [];
	
	for (let i = 0; i < all_areas.length; i++){
		if (area_type ==='Counties'){
			if (all_areas[i].includes('County')){
				output_areas.push(all_areas[i]);
			}
		}else if (area_type ==='States'){
			if (all_areas[i].includes('Statewide')){
				output_areas.push(all_areas[i]);
			}
		} else if (area_type ==='MSAs'){
			if (all_areas[i].includes('MSA')){
				output_areas.push(all_areas[i]);
			}
		} else {
			output_areas = ['U.S. TOTAL'];
		}
	}
	return output_areas;
}


export const initialState = {
      metrics: ['annual_avg_estabs','annual_avg_emplvl','total_annual_wages','annual_avg_wkly_wage'],
      area_types: ['U.S. TOTAL', 'States', 'Counties','MSAs'],
      'metric': '',
      start_year: "",
      'end_year': "",
      'area_type' : '',
      'area_array': [],
      'area_value' : "",
      'locus_level': '',
      'locus_value': '',
       'max_y' : 0,
       'min_y' : 100,
       'lines_to_draw' : [],
       'plotted': false,
       'normed': false,
       'prob_n': false,
       inData: "",
       showEndYear: false, 
       drawLines: false,
    }
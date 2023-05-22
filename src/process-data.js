import { scaleLinear } from "d3-scale";

import data from "./core/data";
import state from "./core/state";

import { layout, filter_control } from "./core/init";
import { parser } from "./core/update";

// This file takes the input from the datasheet and processes it, performing any
// calculations, formatting, filtering, etc. required to create the visualization.

var processed_data = [];
var max_value = 0;
var x;
var current_highlight = {
	"name": "",
	"values": []
};

function processData() {
	processed_data = [];
	const filter_value = filter_control.value(); // Get current filter value
	if (data.values_now.length > 0) { // If there is data...
		if (filter_value) { // And a filter...
			var found_row = data.values_now.filter(function(row) {
				return row.name == filter_value; // Filter data to current value
			});
			// If there is data for the filter value, set it to current_highlight
			if (found_row.length > 0) current_highlight = found_row[0];
			// Or otherwise use the first row of the datasheet
			else current_highlight = data.values_now[0];
		}
		else current_highlight = data.values_now[0];
	}

	// In case columns for parties are ordered differently across the two
	// datasheets, create a lookup to ensure they are matched up correctly
	var value_names = data.values_now.column_names.values.map(function(d) { return { name: d }; });
	var value_names_historical = data.values_historical.column_names.values || [];
	var value_names_historical_lookup = value_names.map(function(d) {
		return value_names_historical.indexOf(d.name);
	});
	// Filter historical datasheet by the current_highlight
	var values_historical = data.values_historical.filter(function(result) {
		return current_highlight.name == result.name;
	});

	// If there's no data for the current_highlight return an empty processed_data
	if (!current_highlight.values) processed_data = [];
	else {
		// If the user chooses a custom max value, use this as the end of the scale
		const custom_max_value = state.use_custom_scale && state.custom_scale_max;
		max_value = custom_max_value ? state.custom_scale_max : 0;
		processed_data = current_highlight.values.map(function(d, i) {
			const value = parser(d);
			// If no custom max is specified, sum up the data values instead
			if (!custom_max_value) max_value += value;
			var historical_value;
			if (values_historical.length > 0) {
				historical_value = values_historical[0].values[value_names_historical_lookup[i]];
				if (historical_value == "") historical_value = null;
			}

			// Calculate a percentage point change between the data values
			const value_change = historical_value ? Math.round((parser(d) - parser(historical_value)) * 10) / 10 : null;
			const arrow_up = "↑ ", arrow_down = "↓ ";
			let arrow = "";
			if (value_change > 0) arrow = arrow_up;
			else if (value_change < 0) arrow = arrow_down;
			const suffix = state.value_change_abbreviation;

			// For right-to-left languages (RTL) we'll need to reverse the
			// position of the prefixes/suffixes on the labels
			const is_rtl = state.layout.read_direction === "rtl";

			let value_change_formatted;

			// Construct the change label depending on if it's
			// positive/negative and the read direction. Instead of showing
			// negative values with a '-' sign, we are returing absolute values
			// and showing an up or down arrow to indicate the direction of change
			if (is_rtl) {
				value_change_formatted = arrow + suffix + Math.abs(value_change);
			}
			else {
				value_change_formatted = arrow + Math.abs(value_change) + suffix;
			}

			// Pass the data needed for the visualization onto processed_data
			return {
				"name": value_names[i].name,
				"value": state.columns_to_exclude.indexOf(value_names[i].name) > -1 ? 0 : value,
				"value_historical": parser(historical_value),
				"actual_value": d ? parser(d) : 0, // This is used to not transform the scale
				"value_change": value_change,
				"value_change_formatted": value_change_formatted
			};
		});
	}

	// For RTL languages, we want to reverse the direction of the bar
	const is_rtl = state.layout.read_direction == "rtl";
	let x = is_rtl ? -max_value : 0;
	processed_data.forEach(function(d, i) {
		if (i === 0) {
			x += d.value;
			d.x = is_rtl ? Math.abs(x) : 0;
		}
		else {
			if (is_rtl) x += d.value;
			d.x = Math.abs(x);
			if (!is_rtl) x += d.value;
		}
	});
}

// Update the d3 scales used to create the bar using our max value
function updateScales() {
	x = scaleLinear().range([0, layout.getPrimaryWidth()]).domain([0, max_value]);
}


export { processed_data, current_highlight, processData, updateScales, x, max_value };

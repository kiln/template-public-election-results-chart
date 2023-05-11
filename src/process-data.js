import { scaleLinear } from "d3-scale";

import data from "./core/data";
import state from "./core/state";

import { layout, filter_control } from "./core/init";
import { parser } from "./core/update";

var processed_data = [];
var max_value = 0;
var x;
var current_highlight = {
	"name": "",
	"values": []
};

function processData() {
	processed_data = [];
	const filter_value = filter_control.value();
	if (data.values_now.length > 0) {
		if (filter_value) {
			var found_row = data.values_now.filter(function(row) {
				return row.name == filter_value;
			});
			if (found_row.length > 0) current_highlight = found_row[0];
			else current_highlight = data.values_now[0];
		}
		else current_highlight = data.values_now[0];
	}

	var value_names = data.values_now.column_names.values.map(function(d) { return { name: d }; });
	var value_names_historical = data.values_historical.column_names.values || [];
	var value_names_historical_lookup = value_names.map(function(d) {
		return value_names_historical.indexOf(d.name);
	});
	var values_historical = data.values_historical.filter(function(result) {
		return current_highlight.name == result.name;
	});

	if (!current_highlight.values) processed_data = [];
	else {
		const custom_max_value = state.use_custom_scale && state.custom_scale_max;
		max_value = custom_max_value ? state.custom_scale_max : 0;
		processed_data = current_highlight.values.map(function(d, i) {
			const value = parser(d);
			if (!custom_max_value) max_value += value;
			var historical_value;
			if (values_historical.length > 0) {
				historical_value = values_historical[0].values[value_names_historical_lookup[i]];
				if (historical_value == "") historical_value = null;
			}

			const value_change = historical_value ? Math.round((parser(d) - parser(historical_value)) * 10) / 10 : null;
			const arrow_up = "↑ ", arrow_down = "↓ ";
			const suffix = state.value_change_abbreviation;

			const is_rtl = state.layout.read_direction === "rtl";

			let value_change_formatted;

			if (is_rtl) {
				value_change_formatted = d.value_change > 0 ? arrow_up + suffix + value_change : arrow_down + suffix + Math.abs(value_change);
			}
			else {
				value_change_formatted = d.value_change > 0 ? arrow_up + value_change + suffix : arrow_down + Math.abs(value_change) + suffix;
			}

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

function updateScales() {
	x = scaleLinear().range([0, layout.getPrimaryWidth()]).domain([0, max_value]);
}


export { processed_data, current_highlight, processData, updateScales, x, max_value };

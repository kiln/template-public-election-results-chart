import { legend_container, legend_categorical, colors } from "./core/init";
import state from "./core/state";
import update from "./core/update";
import { processed_data } from "./process-data";


function emptyString (str) {
	if (str == "") return true;
	else if (str == 0) return false;
	else return false;
}

function updateLegend() {
	var legend_items = processed_data
		.filter(function(d) {
			return !(emptyString(d.actual_value) && state.hide_empty_legend_items);
		})
		.map(function(d) { return d.name; });

	legend_categorical
		.data(legend_items, colors.getColor)
		.filtered(state.columns_to_exclude)
		.on("click", function(d) {
			var index = state.columns_to_exclude.indexOf(d.label);
			if (index < 0) state.columns_to_exclude.push(d.label);
			else state.columns_to_exclude.splice(index, 1);

			update();
		});

	legend_container.update();
}

export { updateLegend };


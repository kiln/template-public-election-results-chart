import { legend_container, legend_categorical, colors } from "./core/init";
import state from "./core/state";
import update from "./core/update";
import { processed_data } from "./process-data";

// This function allows us to understand if there are any empty series' for the
// next step.
function emptyString (str) {
	if (str == "") return true;
	else if (str == 0) return false;
	else return false;
}

// This function pulls through our data for our legend and hides any series
// with empty values in the data using the function above.
function updateLegend() {
	var legend_items = processed_data
		.filter(function(d) {
			return !(emptyString(d.actual_value) && state.hide_empty_legend_items);
		})
		.map(function(d) { return d.name; });
	// Creates our categorical legend (since there is no numerical colour
	// option),appending our previously processed data with our color palette.
	// Adding user interaction function options for when users interact with
	// the legend including lowering opacity when clicked. Find out more
	// information here: 
	// https://developers.flourish.studio/sdk/getting-started/using-modules
	legend_categorical
		.data(legend_items, colors.getColor)
		.filtered(state.columns_to_exclude)
		.on("click", function(d) {
			var index = state.columns_to_exclude.indexOf(d.label);
			if (index < 0) state.columns_to_exclude.push(d.label);
			else state.columns_to_exclude.splice(index, 1);

			update();
		});

		// Updated the legend container whenever a change is made. This also
		// only needs to be used once if you have used multiple legend types.
	legend_container.update();
}

export { updateLegend };


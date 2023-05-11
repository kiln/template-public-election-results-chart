import { colors } from "./core/init";
import data from "./core/data";

function updateColors() {
	// Updates the color scale based on the domain array.
	// In general the domain array is an array of data values that the scale should be based on.
	// For a categorical scale, this'll be an array of strings.
	// For numeric(sequential or diverging) scales, this'll be an array of numbers
	colors.updateColorScale(data.values_now.column_names.values);
}

export { updateColors };

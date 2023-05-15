// Importing necessary modules and functions
import { select, selectAll } from "d3-selection";
import { popup, label_format } from "./core/init";

// This function allows us to lock a popup, for example, in a story slide. We
// add ids to the key chart elements that have popups to ensure the state
// knows which popup should be locked. For more info, see here:
// https://www.npmjs.com/package/@flourish/info-popup#8---set-up-locking-functionality-optional
function getLockedPositionCallback(id) {
	var el_node = select("#" + id).node();
	if (!el_node) return null;
	var datum = el_node.__data__;
	return [el_node, datum];
}

// Function to update the popup configuration
function updatePopup() {
	// Set default content of popup
	popup
		.getLockedPosition(getLockedPositionCallback)
		.setColumnNames({
			name: "Name",
			value: "Current election",
			value_historical: "Previous election",
			value_change_formatted: "Change"
		})
		.setFormatters({  // Set the formatters for 'value' and 'value_historical'
			value: d => label_format(d),
			value_historical: d => label_format(d)
		})
		.update();

	// Select all '.bar' class elements
	selectAll(".bar")
		// On mouse over a bar element
		.on("mouseover", function() {
			const el = this.querySelector(".bar-background");
			// Trigger popup mouseover event, passing the element and its data
			popup.mouseover(el, el.__data__);
		})
		.on("mouseout", function() {
			popup.mouseout();
		})
		// On click of a bar element
		.on("click", function() {
			const el = this;
			// Get the data of the bar element
			const data = el.__data__;
			// Get the id of the data (used for popup locking functionality)
			const locked_id = data.name.toLowerCase().replace(/\s+/g, "");
			popup.click(el, data, locked_id);
		});
}

// Export the updatePopup function
export { updatePopup };

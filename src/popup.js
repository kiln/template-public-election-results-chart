// Importing necessary modules and functions
import { selectAll } from "d3-selection";
import { popup, label_format } from "./core/init";

// Function to update the popup configuration
function updatePopup() {
	// Set default content of popup
	popup
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
		.on("mouseover", function() {  // On mouse over a bar element
			const el = this.querySelector(".bar-background");  // Select the background of the bar
			popup.mouseover(el, el.__data__);  // Trigger popup mouseover event, passing the element and its data
		})
		.on("mouseout", function() {  // On mouse out of a bar element
			popup.mouseout();  // Trigger popup mouseout event
		})
		.on("click", function() {  // On click of a bar element
			const el = this.querySelector(".bar-background");  // Select the background of the bar
			const data = el.__data__;  // Get the data of the bar element
			const locked_id = data.id;  // Get the id of the data (used for locking functionality)
			popup.click(el, data, locked_id);  // Trigger popup click event, passing the element, its data, and its id
		});
}

// Export the updatePopup function
export { updatePopup };

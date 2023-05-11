import { selectAll } from "d3-selection";
import { popup, label_format } from "./core/init";

function updatePopup() {
	popup
		.setColumnNames({
			name: "Name",
			value: "Current election",
			value_historical: "Previous election",
			value_change_formatted: "Change"
		})
		.setFormatters({
			value: d => label_format(d),
			value_historical: d => label_format(d)
		})
		.update();

	selectAll(".bar") // datapoints
		.on("mouseover", function() {
			const el = this.querySelector(".bar-background");
			popup.mouseover(el, el.__data__);
		})
		.on("mouseout", function() {
			popup.mouseout();
		})
		.on("click", function() {
			const el = this.querySelector(".bar-background");
			const data = el.__data__;
			const locked_id = data.id;
			popup.click(el, data, locked_id); // See step 8 for more information on locked_id
		});
}

export { updatePopup };

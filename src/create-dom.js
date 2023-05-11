import { select } from "d3-selection";
import { layout, legend_container, legend_categorical } from "./core/init";

var svg, plot, g_bar, line, wrapper, extra_bar, plot_background;

// Appending elements to the page later used to draw the visualization.
function createDom() {
	// Here we are using the Flourish layout module. Find a list of modules free
	// to use here:
	// https://developers.flourish.studio/sdk/getting-started/using-modules/
	wrapper = select(layout.getSection("primary"));

	svg = wrapper.append("svg").attr("id", "graphic").style("fill", "currentColor");

	legend_container
		.appendTo(layout.getSection("legend"))
		.add([
			legend_categorical
		]);

	plot = svg.append("g").attr("id", "plot");

	plot_background = plot.append("g").attr("id", "plot_background");
	plot_background.append("text");

	g_bar = plot.append("g").attr("class", "bar_group");

	extra_bar = plot.append("rect").attr("class", "extra_bar");

	line = plot.append("g").attr("id", "middle-line");
	line.append("line");
	line.append("text");
}

export { createDom, svg, g_bar, plot, line, wrapper, extra_bar, plot_background };

import "d3-transition";

import state from "./state";
import data from "./data";

import { layout, colors, localization, label_format, filter_control, controls_container, controls_style, button_style, dropdown_style, slider_style} from "./init";
import { updateColors } from "../colors";
import { updatePopup } from "../popup";
import { updateLegend } from "../legend";
import { getUniqueValuesFromBinding } from "@flourish/pocket-knife";
import { svg, g_bar, line, plot_background, extra_bar } from "../create-dom";
import { processData, updateScales, processed_data, x, max_value } from "../process-data";

export var parser;

var chart_margin_bottom = 20;
var bar_height, total_height, chart_width;
var gradient_width = 8;

let prev_width = "";
let prev_height = "";

function getTransitionDuration() {
	const curr_width = layout.getPrimaryWidth();
	const width_change = prev_width !== curr_width;
	const curr_height = layout.getPrimaryHeight();
	const height_change = prev_height !== curr_height;
	prev_width = curr_width;
	prev_height = curr_height;
	return width_change || height_change ? 0 : state.duration;
}

function update() {
	parser = localization.getParser();
	updateColors();
	updatePopup();
	updateLegend();
	layout.update();
	layout.setLegendPosition(state.legend_position);
	updateControls();
	processData();
	updateScales();
	const transition_duration = getTransitionDuration();
	updateGraphic(transition_duration);
	layout.setHeight(total_height);
}

function updateGraphic(transition_duration) {
	bar_height = layout.remToPx(state.bar_height);
	total_height = bar_height + chart_margin_bottom;
	chart_width = layout.getPrimaryWidth();
	if (Flourish.fixed_height) {
		total_height = layout.getPrimaryHeight();
		bar_height = total_height - chart_margin_bottom;
	}

	svg.attr("width", chart_width).attr("height", total_height);

	plot_background.select("text")
		.style("display", max_value === 0 ? "block" : "none")
		.text(state.placeholder_text)
		.attr("y", (bar_height - 10) / 2)
		.style("fill", "#aaa")
		.attr("text-anchor", "middle")
		.transition()
		.duration(transition_duration)
		.attr("x", chart_width/2);

	var is_rtl = state.layout.read_direction === "rtl";

	// create bars for chart
	var bar = g_bar.selectAll(".bar").data(processed_data);
	var bar_enter = bar.enter().append("g").attr("class", "bar");

	bar_enter.append("rect")
		.attr("class", "bar-background");
	bar_enter.append("text").attr("class", "party-name");
	bar_enter.append("text").attr("class", "number-title");
	bar_enter.append("text").attr("class", "number-subtitle");
	bar_enter.append("line");
	bar_enter.append("rect")
		.attr("class", "bar-gradient");

	var bar_update = bar.merge(bar_enter);
	bar.exit().remove();

	bar_update.transition()
		.duration(transition_duration)
		.attr("transform", function(d) {
			return "translate(" + x(d.x) + ", 0)";
		});

	const last_bar = processed_data[processed_data.length - 1];
	const extra_bar_value = is_rtl ? last_bar.x : max_value - (last_bar.x + last_bar.value);
	const extra_bar_scale = extra_bar_value / max_value;
	const extra_bar_x = is_rtl ? 0 : last_bar.x + last_bar.value;

	extra_bar.attr("fill", state.bar_background)
		.attr("height", bar_height)
		.transition()
		.duration(transition_duration)
		.attr("transform", `translate(${x(extra_bar_x)}, 0) scale(${extra_bar_scale}, 1)`)
		.attr("opacity", 1)
		.attr("width", "100%");


	bar_update.select(".bar-background")
		.attr("height", bar_height)
		.transition()
		.duration(transition_duration)
		.attr("width", function(d) { return !isNaN(d.value) ? x(d.value) : 0; })
		.attr("fill", function(d) { return colors.getColor(d.name); });

	bar_update.select(".party-name")
		.text(function(d) { if (d.value > 0) return d.name; })
		.attr("y", layout.remToPx(1))
		.attr("dy", ".35em")
		.attr("font-size", state.label_font_size + "rem")
		.each(function(d) {
			var text_width = this.getBBox().width;
			var el_width = x(d.value);
			d.hidden = text_width > el_width - 5;
		})
		.transition()
		.duration(transition_duration)
		.attr("x", function(d) { return is_rtl ? x(d.value) - 5 : 5; })
		.attr("fill", state.label_font_color)
		.attr("opacity", (state.show_party_name || processed_data.length === 0) ? 1 : 0);

	bar_update.select(".number-title")
		.text(function(d) { if (d.value > 0) return (label_format(d.value)); })
		.attr("y", function() {
			return state.show_party_name ? layout.remToPx(3) : layout.remToPx(1);
		})
		.attr("dy", ".35em")
		.attr("font-size", state.label_font_size + "rem")
		.each(function(d) {
			if (d.hidden) return;
			var text_width = this.getBBox().width;
			var el_width = x(d.value);
			d.hidden = text_width > el_width - 5;
		})
		.transition()
		.duration(transition_duration)
		.attr("x", function(d) { return is_rtl ? x(d.value) - 5 : 5; })
		.attr("fill", state.label_font_color);

	var max = Math.max.apply(Math, processed_data.map(function(d) { return d.value; }));
	var has_subtitle = false;

	bar_update.select(".number-subtitle")
		.attr("y", function() {
			return state.show_party_name ? layout.remToPx(4.5) : layout.remToPx(2.5);
		})
		.attr("dy", ".35em")
		.attr("font-size", state.label_font_size + "rem")
		.each(function(d) {
			if (d.hidden) return;
			var text_width = this.getBBox().width;
			var el_width = x(d.value);
			d.hidden = text_width > el_width - 5;
		})
		.text(function(d) {
			if (d.value > 0) {
				if (d.value_change === null || isNaN(d.value_change)) return "";
				if (d.value == max && !has_subtitle) {
					has_subtitle = true;
					return (d.value_change_formatted + state.subtitle_text);
				}
				else return d.value_change_formatted;
			}
		})
		.transition()
		.duration(transition_duration)
		.attr("x", function(d) { return is_rtl ? x(d.value) - 5 : 5; })
		.attr("fill", state.label_font_color)
		.attr("opacity", "0.8");

	bar_update.select(".bar-gradient")
		.attr("height", bar_height)
		.transition()
		.duration(transition_duration)
		.attr("width", function(d) { return Math.min(x(d.value), gradient_width) + "px"; })
		.attr("x", function(d) { return is_rtl ? null : x(d.value) - gradient_width; })
		.attr("fill", function(d) { return colors.getColor(d.name); })
		.style("opacity", function(d) {
			if (d.hidden) return 0.5;
			else return 0;
		});

	bar_update.select("line")
		.transition()
		.duration(transition_duration)
		.attr("x1", 0)
		.attr("x2", 0)
		.attr("y1", 0)
		.attr("y2", bar_height)
		.attr("stroke", "#fff")
		.attr("stroke-width", function(d, i) {
			if (i > 0 && +d.value > 0) return 1;
			else return 0;
		});

	updateThreshold(transition_duration);
}

function getThresholdPosition() {
	var is_rtl = state.layout.read_direction === "rtl";
	return is_rtl ? x(x.domain()[1] - state.middle_line_position): x(state.middle_line_position);
}

function updateThreshold(transition_duration) {
	line
		.transition()
		.duration(transition_duration)
		.attr("transform", `translate(${getThresholdPosition()}, 0)`);

	line.select("line")
		.style("display", max_value === 0 ? "none" : "block")
		.attr("y2", bar_height + 5)
		.attr("stroke", state.middle_line_color || state.layout.background_color)
		.style("stroke-width", state.middle_line_width)
		.attr("stroke-dasharray", state.middle_line_dashoffset.split(","));

	line.select("text")
		.style("display", max_value === 0 ? "none" : "block")
		.text(state.middle_line_content)
		.attr("y", bar_height + 15)
		.attr("fill", state.middle_line_text_color)
		.attr("font-size", 12)
		.attr("text-anchor", "middle");
}

function updateControls() {
	controls_style.update();
	button_style.update();
	dropdown_style.update();
	slider_style.update();

	let column_values = getUniqueValuesFromBinding(data.values_now, "name").filter(function(d) { return d; });

	filter_control
		.options(column_values)
		.update();

	controls_container.update();
}

export default update;

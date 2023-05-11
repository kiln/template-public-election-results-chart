import initLayout from "@flourish/layout";
import { createLegendContainer, createDiscreteColorLegend } from "@flourish/legend";
import initPopup from "@flourish/info-popup";
import createColors from "@flourish/colors";
import { createControlsContainer, createControls } from "@flourish/controls";
import { createGeneralControlsStyle, createButtonStyle, createDropdownStyle, createSliderStyle } from "@flourish/ui-styles";
import initLocalization from "@flourish/number-localization";
import initFormatter from "@flourish/number-formatter";
import state from "./state";
import update from "./update";

var layout = initLayout(state.layout);
var colors = createColors(state.color);
var legend_container = createLegendContainer(state.legend_container);
var legend_categorical = createDiscreteColorLegend(state.legend_categorical);

var filter_control = createControls(state.filter_control).on("change", update);
var controls_container = createControlsContainer(state.controls_container)
	.appendTo(layout.getSection("controls"))
	.add([filter_control]);
var controls_style = createGeneralControlsStyle(state.controls_style, ".fl-control");
var button_style = createButtonStyle(state.button_style, ".fl-control-buttons");
var dropdown_style = createDropdownStyle(state.dropdown_style, ".fl-control-dropdown");
var slider_style = createSliderStyle(state.slider_style, ".fl-control-slider");

var popup = initPopup(state.popup);
var localization = initLocalization(state.localization);
var label_formatter = initFormatter(state.label_format);
var label_format = 	label_formatter(localization.getFormatterFunction());

export { layout, colors, legend_container, legend_categorical, filter_control, controls_container, controls_style, button_style, dropdown_style, slider_style, popup, localization, label_format };


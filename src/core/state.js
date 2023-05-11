// The default state of the template. In other words, the default values of all
// the template's settings. The state must be a JSON-serializable object. The
// template should also update the state in response to user interaction. See
// more here: https://developers.flourish.studio/sdk/api-reference/template-js/

var state = {
	// Find setting specification in template.yml
	bg_color: "#FFFFFF",
	color: {},

	label_font_color: "#FFFFFF",
	label_font_size: 1.2,
	label_suffix: "%",

	middle_line_content: "50%",
	middle_line_position: 50,
	middle_line_text_color: null,
	middle_line_color: null,
	middle_line_width: 1,
	middle_line_dashoffset: "2,2",

	bar_height: 10,
	bar_background: "#F2F2F2",

	use_custom_scale: false,
	custom_scale_max: 200,

	controls_container: {},
	filter_control: {},

	controls_style: {},
	dropdown_style: {},
	button_style: {},
	slider_style: {},

	legend_container: {},
	legend_categorical: {
		max_width: 100
	},
	legend_position: "above",
	hide_empty_legend_items: true,

	placeholder_text: "No data available yet",
	subtitle_text: " from previous election",
	value_change_abbreviation: "pp",
	show_party_name: true,
	columns_to_exclude: [],

	popup: {},
	layout: {},

	duration: 200,

	// label format
	localization: {},
	label_format: {
		suffix: "%"
	},

};

export default state;

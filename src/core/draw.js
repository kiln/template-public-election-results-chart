import update from "./update";
import { createDom } from "../create-dom";

// This function runs once when the template has finished loading. Include
// things here that only need to run once. Typically we run update() inside
// draw() to avoid duplication.

function draw() {
	createDom();
	update();
	window.onresize = function() { update(); };
}

export default draw;

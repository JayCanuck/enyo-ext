/**
	Basic slide-fade popup
*/

var	Popup = require("enyo/Popup");

module.exports = Popup.kind({
	name: "FPopup",
	classes: "popup-trans",
	showingChanged: function() {
		this.inherited(arguments);
		if(this.showing) {
			this.applyStyle("opacity", 1);
			this.applyStyle("margin-top", "0px");
		} else {
			this.applyStyle("opacity", 0);
			this.applyStyle("margin-top", "-15px");			
		}
	}
});

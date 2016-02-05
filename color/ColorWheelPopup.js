var
	Popup = require('enyo/Popup'),
	ColorWheel = require('./ColorWheel');

module.exports = Popup.kind({
	name: "ColorWheelPopup",
	published: {
		resetOnDismiss:false
	},
	events: {
		onColorSelected: ""
	},
	handlers:{
		onShow: "setupWheel",
		onHide: "wheelDismiss"
	},
	components:[
		{name:"wheel", kind:ColorWheel, onColor:"colorChanged"}
	],
	colorChanged: function(inSender, inEvent) {
		this.red = inEvent.red;
		this.green = inEvent.green;
		this.blue = inEvent.blue;
		this.hex = inEvent.hex;
	},
	setupWheel: function(inSender,inEvent) {
		this.$.wheel.render();
	},
	wheelDismiss: function(inSender, inEvent) {
		this.doColorSelected({red:this.red, green:this.green, blue:this.blue, hex:this.hex});
		if(this.resetOnDismiss) {
			this.$.wheel.applyStyle("background-color", "#000000");
		}
	}
});

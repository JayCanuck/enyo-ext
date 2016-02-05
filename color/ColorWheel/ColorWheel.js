var
	Control = require('enyo/Control'),

module.exports = Control.kind({
	name: "ColorWheel",
	events: {
		onColor: ""
	},
	classes: "enyo-colorwheel",
	components: [
		{name:"picker", tag:"canvas", classes:"enyo-colorscale", ondown:"readColor", ondrag:"readColor"}
	],
	rendered:function() {
		this.inherited(arguments);

		// create canvas and context objects
		var canvas = this.$.picker.hasNode();
		if(canvas) {
			var b = this.$.picker.getBounds();
			canvas.height = b.height;
			canvas.width = b.width;
			var ctx = this.canvas = canvas.getContext('2d');

			// drawing active image
			var image = new Image();
			image.onload = function () {
				ctx.drawImage(image, 0, 0, b.width, b.height); // draw the image on the canvas
			}
			image.src = "@./assets/colorwheel.png";
			this.wheelBounds = this.$.picker.getAbsoluteBounds();
		}
	},
	readColor: function(inSender, inEvent) {
		if(this.canvas) {
			var canvasX = Math.floor(inEvent.pageX - this.wheelBounds.left);
        	var canvasY = Math.floor(inEvent.pageY - this.wheelBounds.top);
			var imageData = this.canvas.getImageData(canvasX, canvasY, 1, 1);
			var pixel = imageData.data;
			var dColor = pixel[2] + (256 * pixel[1]) + (65536 * pixel[0]);
			this.hex = ("0000" + dColor.toString(16)).substr(-6);
			this.applyStyle("background-color", "#" + this.hex);
			this.doColor({red:pixel[0], green:pixel[1], blue:pixel[2], hex:this.hex});
		}
		return true;
	}
});

/**
	A vertical style variant of the <a href="#onyx.Slider">onyx.Slider</a>.
*/

enyo.kind({
	name: "onyx.VerticalSlider",
	kind: "onyx.Slider",
	//* @protected
	classes: "vertical-slider",
	dragstart: function(inSender, inEvent) {
		if (inEvent.vertical) {
			inEvent.preventDefault();
			this.dragging = true;
			return true;
		}
	},
	updateBarPosition: function(inPercent) {
		this.$.bar.applyStyle("top", (100-inPercent) + "%");
		this.$.bar.applyStyle("height", inPercent + "%");
	},
	updateKnobPosition: function(inPercent) {
		this.$.knob.applyStyle("top", (100-inPercent) + "%");
	},
	calcKnobPosition: function(inEvent) {
		var y = inEvent.clientY - this.hasNode().getBoundingClientRect().top;
		return this.max - (y / this.getBounds().height) * (this.max - this.min);
	}
});

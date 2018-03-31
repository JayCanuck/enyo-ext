enyo.kind({
	name: "enyo.media.HTML5Video",
	kind: "enyo.media.HTML5Media",
	tag: "video",
	videoHeight: function() {
		return this.domMediaProperty("videoHeight");
	},
	videoWidth: function() {
		return this.domMediaProperty("videoWidth");
	}
});

enyo.HTML5Video = enyo.media.HTML5Video;
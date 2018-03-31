
enyo.kind({
	name: "enyo.media.PlayPause",
	kind: "onyx.IconButton",
	src: "$lib/media/assets/icons/play.png",
	handlers: {
		ontap:"togglePlayback",
		onplay:"playing",
		onpause:"paused"
	},
	create: function() {
		this.inherited(arguments);
		this.media = enyo.media.getParentMedia(this);
		this.playSrc = "$lib/media/assets/icons/play.png";
		this.pauseSrc = "$lib/media/assets/icons/pause.png";
	},
	togglePlayback: function(inSender, inEvent) {
		if(this.media.isPaused()) {
			this.setSrc(this.pauseSrc);
			this.media.play();
		} else {
			this.setSrc(this.playSrc);
			this.media.pause();
		}
	},
	// Set images during play/pause events to account for js control
	// and video ending, and autoplay.
	playing: function(inSender, inEvent) {
		this.setSrc(this.pauseSrc);
	},
	paused: function(inSender, inEvent) {
		this.setSrc(this.playSrc);
	}
});

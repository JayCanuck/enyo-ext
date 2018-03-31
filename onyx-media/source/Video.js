enyo.kind({
	name: "enyo.media.Video",
	isMedia: true,
	classes: "enyo-video",
	components: [
		{classes: "enyo-video-outer", components:[
			{classes: "enyo-video-inner", components:[
				{kind:"enyo.media.HTML5Video", classes:"enyo-video-html5"},
				{name:"client", classes:"enyo-video-overlay"}
			]}
		]}
	]
});

//reference to enyo.Video for convenience
enyo.Video = enyo.media.Video;
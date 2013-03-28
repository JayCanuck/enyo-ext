/**
	A simple HTML5 audio wrapper with event bubbling, streamlined ogg/wav/mp3
	source setting, relayed javascript play/pause/stop API, and fade-in and fade-out
	functions.
*/

enyo.kind({
	name: "enyo.Audio",
	tag: "audio",
	published: {
		//* URL for an mp3 audio source
		mp3:"",
		//* URL for an ogg audio source
		ogg:"",
		//* URL for a wav audio source
		wav:""
	},
	attributes: {
		/**
			A number of events are here commented out as there's a _lot_ of HTML5
			audio events. Uncomment any ones you want to use.
		*/
		//onabort: enyo.bubbler,
		//oncanplay: enyo.bubbler,
		//oncanplaythrough: enyo.bubbler,
		//ondurationchange: enyo.bubbler,
		//onemptied: enyo.bubbler,
		//onended: enyo.bubbler,
		//onerror: enyo.bubbler,
		//onloadeddata: enyo.bubbler,
		//onloadedmetadata: enyo.bubbler,
		//onloadstart: enyo.bubbler,
		//onpause: enyo.bubbler,
		//onplay: enyo.bubbler,
		//onplaying: enyo.bubbler,
		//onprogress: enyo.bubbler,
		//onratechange: enyo.bubbler,
		//onseeked: enyo.bubbler,
		//onseeking: enyo.bubbler,
		//onstalled: enyo.bubbler,
		//onsuspend: enyo.bubbler,
		//ontimeupdate: enyo.bubbler,
		//onvolumechange: enyo.bubbler,
		//onwaiting: enyo.bubbler
	},
	//* Default audio fade time (in milliseconds) for the fadeIn/fadeOut functions
	defaultFadeTime:200,
	//* @protected
	mimes: {
		mp3:"audio/mpeg",
		ogg:"audio/ogg",
		wav:"audio/wav"
	},
	create: function() {
		this.inherited(arguments);
		this.mp3Changed();
		this.oggChanged();
		this.wavChanged();
	},
	mp3Changed: function() {
		this.updateSource("mp3");
	},
	oggChanged: function() {
		this.updateSource("ogg");
	},
	wavChanged: function() {
		this.updateSource("wav");
	},
	updateSource: function(ext) {
		if(this[ext] && this[ext]!="") {
			this.setSource(ext, this[ext]);
		} else {
			this.removeSource(ext);
		}
		var node = this.hasNode();
		if(node) {
			node.load();
		}
	},
	setSource: function(ext, url) {
		if(this.$[ext]) {
			if(this.$[ext].src != url) {
				this.$[ext].setSrc(url);
			}
		} else {
			this.createComponent({name:ext, tag:"source", src:url, attributes:{type:this.mimes[ext]}});
		}
	},
	removeSource: function(ext) {
		if(this.$[ext]) {
			this.$[ext].destroy();
		}
	},
	//* @public
	//* Plays the audio (so long as a source audio is specified that works on the given browser)
	play: function() {
		var node = this.hasNode();
		if(node) {
			if (!node.paused) {
				// we want restart the audio file to the beginning but 0 doesn't work on
				// iOS so workarund by seting it to close to 0
				node.currentTime = 0.01;
			}
			node.play();
		}
	},
	//* Pauses the audio
	pause: function()  {
		var node = this.hasNode();
		if(node) {
			node.pause();
		}
	},
	//* Stops the audio
	stop: function() {
		var node = this.hasNode();
		if(node) {
			node.stop();
		}
	},
	/**
		Fades the audio in, for a given length of time (in milliseconds).
		
		If no time is specified, defaultFadeTime is used.
	*/
	fadeIn: function(length) {
		length = length || this.defaultFadeTime || 200;
		var node = this.hasNode();
		var volume = 0;
		if(node) {
			node.volume = volume;
			node.play();
			var fadeInJob = this.fadeInJob = setInterval(function() {
				if(volume < 1) {
					volume += 0.05;
					node.volume = volume.toFixed(2);
				} else {
					clearInterval(fadeInJob);
				}
			}, (length/20));
		}
	},
	//* Cancels any in-progress fadeIn() effects, resetting the volume to 100%
	cancelFadeIn: function() {
		clearInterval(this.fadeInJob);
		node.volume = 1;
	},
	/**
		Fades the audio out, for a given length of time (in milliseconds).
		Can specify the fadeOut() effect mode to fade out to a stop() with "stop"
		or to fade out to a pause() with "pause";
		
		If no time is specified, defaultFadeTime is used.
		If no mode is specified, "stop" is used.
	*/
	fadeOut: function(length, mode) {
		length = length || 200;
		mode = mode || "stop";
		var node = this.hasNode();
		var volume = 1;
		if(node) {
			node.volume = volume;
			var fadeOutJob = this.fadeOutJob = setInterval(function() {
				if(volume > 0) {
					volume -= 0.05;
					node.volume = volume.toFixed(2);
				} else {
					clearInterval(fadeOutJob);
					node[mode]();
					node.volume = 1;
				}
			}, (length/20));
		}
	},
	//* Cancels any in-progress fadeOut() effects, resetting the volume to 100%
	cancelFadeOut: function() {
		clearInterval(this.fadeOutJob);
		node.volume = 1;
	}
});

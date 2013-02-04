enyo.kind({
	name: "enyo.Audio",
	tag: "audio",
	published: {
		mp3:"",
		ogg:"",
		wav:""
	},
	attributes: {
		//Uncomment any of the events you want to use
		
		//onabort: enyo.bubbler,
		//oncanplay: enyo.bubbler,
		//oncanplaythrough: enyo.bubbler,
		//ondurationchange: enyo.bubbler,
		//onemptied: enyo.bubbler,
		onended: enyo.bubbler,
		onerror: enyo.bubbler,
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
	pause: function()  {
		var node = this.hasNode();
		if(node) {
			node.pause();
		}
	},
	stop: function() {
		var node = this.hasNode();
		if(node) {
			node.stop();
		}
	},
	//length in ms
	fadeIn: function(length) {
		length = length || 200;
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
	cancelFadeIn: function() {
		clearInterval(this.fadeInJob);
		node.volume = 1;
	},
	//length in ms, mode is either "pause" or "stop" 
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
	cancelFadeOut: function() {
		clearInterval(this.fadeOutJob);
		node.volume = 1;
	}
});

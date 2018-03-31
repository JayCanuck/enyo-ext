//Generic media container in Enyo
//Superkind of HTML5Audio and HTML5Video

enyo.kind({
	name: "enyo.media.HTML5Media",
	published: {
		nativeControls: true,
		poster: undefined,
		autoplay: false,
		loop: false,
		currentTime: 0,
		muted: false,
		preload: "auto",
		volume: 1,
		crossOrigin: undefined,
		playbackRate: 1
		
	},
	onDemandEvents: true,
	//* @protected
	create: function() {
		this.eventBubbleQuery = [this];
		if(this.onDemandEvents) {
			for(var i=0; i<enyo.media.HTML5Events.length; i++) {
				var evt = enyo.media.HTML5Events[i];
				if(this["on" + evt] || this.handlers["on" + evt]) {
					this.eventBubbleQuery.push(evt);
				}
			}
		} else {
			this.eventBubbleQuery = this.eventBubbleQuery.concat(enyo.media.HTML5Events);
		}
		this.inherited(arguments);
		this.replaceSetterAndGetter("nativeControls", "controls");
		var props = ["autoplay","loop", "currentTime", "muted", "preload",
				"volume", "crossOrigin", "playbackRate"];
		for(var i=0; i<props.length; i++) {
			this.replaceSetterAndGetter(props[i], props[i]);
		}
		this.updateAttr();
	},
	replaceSetterAndGetter: function(name, domName) {
		var cap = enyo.cap(name);
		this["set" + cap] = enyo.bind(this, function(newValue) {
			var old = this.domMediaProperty(domName);
			this.domMediaProperty(domName, newValue);
			this[name] = newValue;
			this[name + "Changed"] && this[name + "Changed"](old);
			
		});
		this["get" + cap] = enyo.bind(this, function() {
			return this.domMediaProperty(domName);
		});
	},
	rendered: function() {
		this.inherited(arguments);
		enyo.makeBubble.apply(enyo, this.eventBubbleQuery);
		var node = this.hasNode();
		if(node) {
			if(this.metaDataLoadedFunct) { //a re-rendering
				enyo.dispatcher.stopListening(node, "loadedmetadata", this.metaDataLoadedFunct);
			}
			this.metaDataLoadedFunct = enyo.bind(this, this.initDomProps);
			enyo.dispatcher.listen(node, "loadedmetadata", this.metaDataLoadedFunct);
		}enyo.dispatcher.stopListening
	},
	initDomProps: function() {
		this.domMediaProperty("controls", this.nativeControls);
		var props = ["autoplay","loop", "currentTime", "muted", "preload",
				"volume", "crossOrigin", "playbackRate"];
		for(var i=0; i<jsProps.length; i++) {
			this.domMediaProperty(jsProps[i], this[jsProps[i]]);
		}
	},
	updateAttr: function() {
		var attr = this.getAttributes();
		if(this.nativeControls) {
			attr.controls = "controls";
		} else if(attr.controls) {
			delete attr.controls;
		}
		if(this.poster && this.poster.length>0) {
			attr.poster = this.poster;
		} else if(attr.poster) {
			delete attr.poster;
		}
		if(this.autoplay) {
			attr.autoplay = "autoplay";
		} else if(attr.autoplay) {
			delete attr.autoplay;
		}
		if(this.loop) {
			attr.loop = "loop";
		} else if(attr.loop) {
			delete attr.loop;
		}
		this.setAttributes(attr);
	},
	posterChanged: function() {
		var attr = this.getAttributes();
		if(this.poster && this.poster.length>0) {
			attr.poster = this.poster;
		} else if(attr.poster) {
			delete attr.poster;
		}
		this.setAttributes(attr);
	},
	nativeControlsChanged: function() {
		if(!this.hasNode()) {
			this.updateAttr();
		}
	},
	autoplayChanged: function() {
		if(!this.hasNode()) {
			this.updateAttr();
		}
	},
	loopChanged: function() {
		if(!this.hasNode()) {
			this.updateAttr();
		}
	},

	/*
		DOM media functions
	*/
	//* @public
	canPlayType: function(type) {
		return this.domMediaFunction("canPlayType", type);
	},
	load: function() {
		this.domMediaFunction("load");
	},
	play: function() {
		this.domMediaFunction("play");
	},
	pause: function() {
		this.domMediaFunction("pause");
	},
	
	/*
		DOM media readonly property getters
	*/
	getDuration: function() {
		return this.domMediaProperty("duration");
	},
	isSeeking: function() {
		return this.domMediaProperty("seeking");
	},
	isPaused: function() {
		return this.domMediaProperty("paused");
	},
	hasEnded: function() {
		return this.domMediaProperty("ended");
	},
	getTextTracks: function() {
		return this.domMediaProperty("textTracks");
	},
	
	/*
		DOM media TimeRange functions
	*/
	buffered: function() {
		return this.domMediaProperty("buffered");
	},
	seekable: function() {
		return this.domMediaProperty("seekable");
	},
	played: function() {
		return this.domMediaProperty("played");
	},
	
	/*
		DOM media state functions
	*/
	readyState: function() {
		return this.domMediaProperty("readyState");
	},
	networkState: function() {
		return this.domMediaProperty("networkState");
	},
	errorState: function() {
		return this.domMediaProperty("error");
	},
	
	//* @protected
	domMediaProperty: function(name, value) {
		var node = this.hasNode();
		if(node) {
			if(arguments.length==2) {
				node[name] = value;
			}
			return node[name];
		}
	},
	domMediaFunction: function() {
		var params = Array.prototype.slice.call(arguments, 0);
		var name = params.shift();
		var node = this.hasNode();
		if(node && node[name]) {
			return node[name].apply(node, params);
		}
	},
	destroy: function() {
		var node = this.hasNode();
		if(node) {
			enyo.dispatcher.stopListening(node, "loadedmetadata", this.metaDataLoadedFunct);
		}
		enyo.unmakeBubble.apply(enyo, this.eventBubbleQuery);
		this.inherited(arguments);
	}
});

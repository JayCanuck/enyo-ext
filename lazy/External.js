/**
	
*/

enyo.kind({
	name: "enyo.External",
	kind: "enyo.Lazy",
	published: {
		src: ""
	},
	//* 
	scriptLoaded: false,
	//*
	load: enyo.inherit(function(sup) {
		return function() {
			if(!this.scriptLoaded && !this.loadInProgress) {
				this.loadInProgress = true;
				var src = this.getSrc();
				if(src && src.length>0) {
					var self = this;
					var args = arguments;
					enyo.ready(function() {
						enyo.loader.finishCallbacks.external = function(inBlock) {
							self.scriptLoaded = true;
							sup.apply(self, args);
						};
						enyo.load(src);
					})
				} else {
					this.warn("No script src declared to for external component declaration.");
					sup.apply(this, arguments);
				}
			} else {
				sup.apply(this, arguments);
			}
		};
	})
});

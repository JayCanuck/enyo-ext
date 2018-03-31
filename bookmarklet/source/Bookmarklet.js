enyo.kind({
	name: "enyo.Bookmarklet",
	kind: (window.onyx) ? "onyx.Popup" : "enyo.Popup", //fallback to enyo.Popup if onyx library isn't used
	centered: false,	// if false, a json needs to be set for position
	position: undefined,	// object containing a left/right and top/bottom combination for positioning
	draggable: true,	// whether or not this popup can be moved around by dragging from its edges
	edgePadding: "20px",	// size of the padding that is a draggable handle, if draggable is true
	unstyled: false,	// remove the onyx.Popup styling to appear like a plain enyo.Popup
	width: undefined,	// optional css width to specify, otherwise auto-sized by contents
	height: undefined,	// optional css height to specify, otherwise auto-sized by contents
	modal: false,
	showing: true,
	defaultZ:1000000,
	classes: "enyo-bookmarklet", //can style the bookmarklet by styling the enyo-bookmarklet css class
	style:"position:fixed;",
	handlers: {
		ondrag: "dragBookmarklet",
		ondragfinish: "dragfinishBookmarklet"
	},
	components:[
		{kind:"enyo.Signals", onBookmarkletRelaunch:"relaunch"},
		{name:"appContainer", style:"width:100%; height:100%;", ondown:"preventBubble", ondragstart:"preventBubble", ondrag:"preventBubble", ondragfinish:"preventBubble", components:[
			{kind:"App", }
		]}
	],
	constructor: function(inParams) {
		enyo.mixin(this, inParams || {});
		this.position = this.position || {top:10, right:10};
		this.vAnchor = (this.position.top!=undefined) ? "top": "bottom";
		this.hAnchor = (this.position.left!=undefined) ? "left": "right";
		this.inherited(arguments);
	},
	create: function() {
		this.inherited(arguments);
		if(this.unstyled) {
			this.removeClass("onyx-popup");
		}
		if(this.width!=undefined) {
			this.applyStyle("width", this.width);
		}
		if(this.height!=undefined) {
			this.applyStyle("height", this.height);
		}
		if(!this.centered) {
			this.applyStyle(this.vAnchor, this.position[this.vAnchor] + "px");
			this.applyStyle(this.hAnchor, this.position[this.hAnchor] + "px");
		}
		if(this.draggable) {
			this.applyStyle("cursor", "move");
			this.$.appContainer.applyStyle("cursor", "default");
			this.applyStyle("padding", this.edgePadding);
		}
	},
	relaunch: function(inSender, inEvent) {
		if(this.showing) {
			this.hide();
		} else {
			this.show();
		}
	},
	preventBubble: function(inSender, inEvent) {
		return !this.wholeDrag;
	},
	updatePosition: function() {
		if(!this.centered) {
			this.applyStyle(this.vAnchor, this.position[this.vAnchor] + "px");
			this.applyStyle(this.hAnchor, this.position[this.hAnchor] + "px");
		} else {
			this.inherited(arguments);
			var b = this.getBounds();
			this.position.top = b.top;
			this.position.left = b.left;
			this.vAnchor = "top";
			this.hAnchor = "left";
		}
	},
	down: function(inSender, inEvent) {
		this.inherited(arguments);
		if(inEvent.dispatchTarget.isDescendantOf(this)) {
			inEvent.preventDefault();
		}
	},
	dragstart: function(inSender, inEvent) {
		if(this.draggable) {
			this.$.appContainer.applyStyle("cursor", "move");
		}
		return this.inherited(arguments);
	},
	dragBookmarklet: function(inSender, inEvent) {
		if(this.draggable) {
			if(inEvent.dy!=0) {
				if(this.vAnchor=="top") {
					this.applyStyle("top", (this.position.top + inEvent.dy) + "px");
				} else {
					this.applyStyle("bottom", (this.position.bottom - inEvent.dy) + "px");
				}
			}
			if(inEvent.dx!=0) {
				if(this.hAnchor=="left") {
					this.applyStyle("left", (this.position.left + inEvent.dx) + "px");
				} else {
					this.applyStyle("right", (this.position.right - inEvent.dx) + "px");
				}
			}
			return true;
		}
	},
	dragfinishBookmarklet: function(inSender, inEvent) {
		if(this.draggable) {
			if(inEvent.dy!=0 || inEvent.dx!=0) {
				//position changed
				this.position[this.vAnchor] += ((this.vAnchor=="top") ? inEvent.dy : (-1*inEvent.dy));
				this.position[this.hAnchor] += ((this.hAnchor=="left") ? inEvent.dx : (-1*inEvent.dx));
				this.centered = false;
			}
			this.applyStyle(this.vAnchor, this.position[this.vAnchor] + "px");
			this.applyStyle(this.hAnchor, this.position[this.hAnchor] + "px");
			this.$.appContainer.applyStyle("cursor", "default");
			return true;
		}
	}
});

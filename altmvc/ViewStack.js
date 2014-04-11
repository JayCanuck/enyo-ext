/**
	Variation of <a href="#enyo.Panels">enyo.Panels</a> designed to dynamically display 
	<a href="#enyo.View">enyo.View</a> components.

	Views are pushed/popped/swapped with the stack, creating/destroying components as needed.

	Whenever a view become active, an _"onViewActivate"_ event is waterfalled down to the view.
	Similarly, when a view then becomes inactive, an _"onViewDeactivate"_ event is waterfalled 
	down.
*/

enyo.kind({
	name:"enyo.ViewStack",
	kind:"Panels",
	//* @protected
	/**
		Whether or not to bind the panels to the Web History API. 
		Due to the dynamic nature of the stack, the back browser navigation will
		basically just pop the current view, and the forward browser navigation will
		be non-functional. Experimental.
	*/
	webHistoryAPI: false,
	draggable:false,
	handlers: {
		onTransitionFinish:"transEnd"
	},
	create: function() {
		this.inherited(arguments);
		this.stateSignal = this.createComponent({kind:"Signals", onpopstate:"historyPopState"});
		var p = this.getPanels();
		if(p.length>0) {
			p[this.index].waterfall("onViewActivate");
			if(this.webHistoryAPI) {
				window.history.pushState({index:this.index}, "");
			}
		}
	},
	//* @public
	/**
		Pushes a new view onto the stack and made active.

		* `viewKind` - The kind of the view to push and show
		* `props` - Properties to mixin into the new view. A name property is recommended
		* `args` - Object to forward to the new view's onViewActivate event
	*/
	push: function(viewKind, props, args) {
		this.createComponent(enyo.mixin({kind:viewKind}, props)).render();
		var p = this.getPanels();
		this.setIndex(p.length-1, {args:args});
	},
	/**
		Pops the current view off the stack, moving back to the previous.

		* `args` - Object to forward to the unlying view's onViewActivate event
	*/
	pop: function(args) {
		var p = this.getPanels();
		if(p.length>1) {
			this.setIndex(p.length-2, {args:args});
		}
	},
	/**
		Pops view off the stack until it gets to a desired view

		* `desiredView` - View to pop back to. Can be the view name or the view object itself
		* `args` - Object to forward to the unlying view's onViewActivate event
	*/
	popTo: function(desiredView, args) {
		var p = this.getPanels();
		var i;
		if(typeof desiredView == "string") {
			for(i=0; i<p.length; i++) {
				if(p[i] && p[i].name && p[i].name==desiredView) {
					this.setIndex(i, {args:args});
					break;
				}
			}
		} else {
			i = p.indexOf(desiredView.view || desiredView);
			if(i>=0) {
				this.setIndex(i, {args:args});
			}
		}		
	},
	/**
		Pops current view then pushes a new one without triggering any onViewActivate or 
		onViewDeactivate events in underlying views

		* `viewKind` - The kind of the view to swap to
		* `props` - Properties to mixin into the new swapped view. A name property is recommended
		* `args` - Object to forward to the new swapped view's onViewActivate event
	*/
	swap: function(viewKind, props, args) {
		this.createComponent(enyo.mixin({kind:viewKind}, props)).render();
		var p = this.getPanels();
		if(p.length>1) {
			p[p.length-2].waterfall("onViewDeactivate", args);
			p[p.length-2].destroy();
		}
		p = this.getPanels();
		p[p.length-1].waterfall("onViewActivate", args);
	},
	/**
		Moves to a particular index in the stack, popping all views that were after it.

		* `newIndex` - Index to switch to
		* `details` - Object that can contain an _"args"_ property, which will be the object forwarded to the view events
	*/
	setIndex: function(newIndex, details) {
		details = details || {};
		if(this.index!=newIndex) {
			var p = this.getPanels();
			if(p[newIndex]) {
				if(p[this.index]) {
					p[this.index].waterfall("onViewDeactivate", details.args);
				}
				p[newIndex].waterfall("onViewActivate", details.args);
				if(!details.skipHistoryState && this.webHistoryAPI) {
					window.history.pushState({index:newIndex}, "");
				}
			}
		}
		this.inherited(arguments);
	},
	//* @protected
	transEnd: function(inSender, inEvent) {
		if(inEvent.fromIndex>inEvent.toIndex) {
			var p = this.getPanels();
			for(var i=inEvent.fromIndex; i>inEvent.toIndex; i--) {
				p[i].destroy();
			}
		}
	},
	previous: function() {
		if(this.webHistoryAPI) {
			window.history.back();
		} else {
			return this.inherited(arguments);
		}
	},
	historyPopState: function(inSender, inEvent) {
		if(this.webHistoryAPI && inEvent && inEvent.state && inEvent.state.index!==undefined) {
			this.setIndex(inEvent.state.index, {skipHistoryState:true});
		}
	}
});

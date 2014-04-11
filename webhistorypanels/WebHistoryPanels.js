/**
	Variation of <a href="#enyo.Panels">enyo.Panels</a> with built-in support for the Web History API.

	Each panel within acts as a separate navigation entry, allowing for back/forward nativeley without 
	changing the current html page nor hash.
*/

enyo.kind({
	name:"enyo.WebHistoryPanels",
	kind:"Panels",
	//* @protected
	draggable:false,
	create: function() {
		this.inherited(arguments);
		this.stateSignal = this.createComponent({kind:"Signals", onpopstate:"historyPopState"});
		window.history.pushState({index:this.index}, "");
	},
	historyPopState: function(inSender, inEvent) {
		if(inEvent && inEvent.state && inEvent.state.index!==undefined) {
			this.setIndex(inEvent.state.index, true);
		}
	},
	//* @public
	/**
		Sets the index to a new value, with an optional `skipHistoryState` parameter which, 
		when true, will skip adding the panel to the web history.
	*/
	setIndex: function(newIndex, skipHistoryState) {
		if(!skipHistoryState) {
			if(this.index!=newIndex) {
				window.history.pushState({index:newIndex}, "");
			}
		}
		this.inherited(arguments);
	},
	//* Moves back in web history states
	previous: function() {
		window.history.back();
	},
	//* Moves forward in web history states
	next: function() {
		window.history.forward();
	}
});

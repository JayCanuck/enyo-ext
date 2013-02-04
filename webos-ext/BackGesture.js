//* @protected
enyo.requiresWindow(function() {
	enyo.dispatcher.listen(document, "keydown", function(inEvent) {
		if(inEvent.keyIdentifier == "U+1200001" || inEvent.keyIdentifier == "U+001B") {
			enyo.Signals.send("onbackbutton", inEvent);
		}
	});
});

/**
	A special kind of <a href="#enyo.ViewStack">enyo.ViewStack</a> designed to only be used once 
	per application. Access to this object instance will bound to enyo.stack for global manipulation
	of the stack.

	A handy idea is to have your root application kind be a subkind of enyo.AppStack.
*/

enyo.kind({
	name:"enyo.AppStack",
	kind:"enyo.ViewStack",
	//* @protected
	create: function() {
		enyo.stack = this;
		this.inherited(arguments);
	}
});

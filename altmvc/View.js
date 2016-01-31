/**
	Lightweight component for freeflow MVC in Enyo focusing on view structures, 
	with separate-but-linked views/controllers.
	
	Genally, the View controls should contain UI controls and basic UI logic, with a separate
	corresponding controller object (which should be a subkind of Component) for data processing
	and manipulation. Views can be within eachother and placed anywhere, like any other component, 
	however keep in mind each view requires a specified controller kind.
	
	All top-level view events will bubble to the controller before continuing upwards in the 
	component tree. Additionally, event handlers can reference the controller directly. For example:
	
		var MainView = View.kind({
			name:"MainView",
			controllerKind: MainController,
			components:[
				{kind:"Button", content:"Tap me", ontap:"controller.buttonTapped"}
			]
		});
	
	In that example, MainController's `buttonTapped` function would be called as the event handler. 
	Furthermore, the controller will execute `reflow()` and `rendered()` functions on view reflow/render,
	if those functions have been implemented.
	
	The controller has a `view` property set which references the corresponding view, and similarly, 
	the view has a `controller` property set which references the corresponding controller. Furthermore,
	as views/controllers are created, they are accessable from View.stage.* (or window.app.stage.* if 
	using `Application.create()` from this altmvc release) for cross-access.
	
	For example, if we created an View subkind called MainView, with a declared controllerKind
	of MainController, and included it in an app's component block like:
	
		{name:"main", kind:MainView}
	
	Then the controller is accessable from `View.stage.main`, and the view instance is accessable
	from `View.stage.main.view`.
*/


//* @public
var
	Control = require("enyo/Control"),
	Component = require("enyo/Component"),
	master = require("enyo/master");


//* @public
var View = module.exports = Control.kind({
	name: "View",
	//* Used to specific the kind of controller to be used for the view
	controllerKind: undefined,
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.controller = this.createComponent({kind:this.controllerKind}, {view:this});
		View.stage = View.stage || {};
		View.stage[this.name || this.id] = this.controller;	
	},
	dispatchEvent: function() {
		// Override dispatchEvent, so when any events bubble up to the point of the View,
		// rather than dispatching to the View, it'll attempt dispatching to the Controller first,
		// afterwards carrying on to the view and upwards in the chain.
		return this.controller.dispatchEvent.apply(this.controller, arguments) || this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		this.controller && this.controller.rendered && this.controller.rendered();
	},
	reflow: function() {
		this.inherited(arguments);
		this.controller && this.controller.reflow && this.controller.reflow();
	},
	statics: {
		stage: {}
	}
});

(function() {
	// Helper function to modify the dispatch request parameters to be forwarded to the event to a controller.
	var modifiedDispatch = function(view, name, event, sender) {
		name = name.replace('controller.', '');
		event.delegate && (event.delegate = {owner:view.controller});
		return view.dispatchEvent(name, event, sender);
	};
	// Overrides the built-in enyo.Component dispatch and dispatchEvent functions so they reroute event 
	// handlers with "controller." prefix to the appropriate controller component.
	var updateDispatchForControllerKeyword = function(fnName) {
		var origFn = Component.prototype[fnName];
		Component.prototype[fnName] = function(name, event, sender) {
			if(name.indexOf('controller.')===0) {
				if(this instanceof View) {
					return modifiedDispatch(this, name, event, sender);
				} else if(this.id === 'master') {
					for(c=sender; c!=master; c=c.owner) {
						if(c.controller) {
							return modifiedDispatch(c, name, event, sender);
						}
					}
				}
				return origFn.apply(this, arguments);
			} else {
				return origFn.apply(this, arguments);
			}
		};
	}
	updateDispatchForControllerKeyword("dispatch");
	updateDispatchForControllerKeyword("dispatchEvent");
})();

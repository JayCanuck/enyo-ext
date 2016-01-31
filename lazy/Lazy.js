/**
	Simple lightweight wrapper to lazy-load contained components,
	synchonously or asynchronously.
*/

var
	Control = require("enyo/Control"),
	utils = require("enyo/utils");

module.exports = Control.kind({
	name:"Lazy",
	tag: null,
    events: {
    	/**
    		Fired after the child components have been created and rendered
    		lazily via the `load()` or `asyncLoad()` functions.
    	*/
        onLazyLoad: ""
    },
    //* A flag variable that will turn to true while a lazy load is in-progress
    loadInProgress: false,
    //* A flag variable that will turn to true once loading is completed
    loaded: false,
    //* @protected
    create: function() {
        this.lazy = this.components;
        this.components = [];
        this.inherited(arguments);
    },
    //* @public
    //* Creates and renders the lazy children components. Will re-render if already loaded.
    load: function() {
    	this.loadInProgress = true;
        if(this.lazy) {
            this.components = this.lazy;
            this.lazy = undefined;
            this.createClientComponents(this.components);
        }
        var ctrl = this.getControls();
		for(var i=0; i<ctrl.length; i++) {
			ctrl[i].render();
		}
        this.loadInProgress = false;
        this.loaded = true;
        this.doLazyLoad();
    },
    //* Calls the `load()` function asynchronously.
    asyncLoad: function() {
    	this.loadInProgress = true;
        utils.asyncMethod(this, this.load);
    },
	//* Destroys the lazily loaded components
	destroyLoaded: function() {
		this.lazy = utils.clone(this.components);
		var ctrl;
		while((ctrl=this.getControls()) && ctrl.length>0) {
			ctrl[0].destroy();
		}
		this.loaded = false;
	}
});

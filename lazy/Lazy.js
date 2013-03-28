/**
	Simple lightweight wrapper to lazy-load contained components,
	synchonously or asynchronously.
*/

enyo.kind({
    name:"enyo.Lazy",
    events: {
    	/**
    		Fired after the child components have been created and rendered
    		lazily via the load() or asyncLoad() functions.
    	*/
        onLazyLoad: ""
    },
    //* A flag variable that will turn to true while a lazy load is in-progress
    loadInProgress: false
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
        this.render();
        this.loadInProgress = false;
        this.loaded = true;
        this.doLazyLoad();
    },
    //* Calls the load() function asynchronously.
    asyncLoad: function() {
    	this.loadInProgress = true;
        enyo.asyncMethod(this, this.load);
    }
});
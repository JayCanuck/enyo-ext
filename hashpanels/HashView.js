/**
	The default panel kind for <a href="#enyo.HashPanels">enyo.HashPanels</a>. Each HashView 
	corresponds to a website URL hash, to give each one a hard URL for the panel contents.  
	It also allows for a custom page title as well as lazy loading of content, so the content 
	gets loaded when the user navigates to the page, rather than all pages loading at once.
*/

enyo.kind({
	name: "enyo.HashView",
	//* Page name. Will end up as the hash of the URL (without the "#")
	page: undefined,
	//* Page title that gets set to `document.title` when the page is navigated to
	title: undefined,
	//* Whether or not to lazy load the child components of the HashPage
	lazy: false,
	events: {
		/**
		    	Fired after the child components have been created and rendered
		    	lazily via the `load()` or `asyncLoad()` functions.
    		*/
		onLazyLoad: ""
	},
	//* A flag variable that will turn to true while a lazy load is in-progress
	loadInProgress: false,
	/**
		A flag variable that will turn to true once lazy loading is completed
		(set to _true_ by default if _"lazy"_ is set to _false_)
	*/
	loaded: false,
	//* @protected
	style: "width:100%; height:100%;",
	create: function() {
		this.loaded = !this.lazy;
		if(this.lazy) {
			this.lazyComponents = this.components;
			this.components = [];
        	}
		this.inherited(arguments);
		if(!this.page || this.page.length==0) {
			this.page = this.id;
		}
	},
	//* @public
	//* Creates and renders the lazy children components. Will re-render if already loaded.
	load: function() {
		this.loadInProgress = true;
		if(this.lazyComponents) {
			this.components = this.lazyComponents;
			this.lazyComponents = undefined;
			this.createClientComponents(this.components);
		}
		this.render();
		this.loadInProgress = false;
		this.loaded = true;
		this.doLazyLoad();
	},
	//* Calls the `load()` function asynchronously.
	asyncLoad: function() {
		this.loadInProgress = true;
		enyo.asyncMethod(this, this.load);
	}
});

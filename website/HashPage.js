enyo.kind({
	name: "enyo.HashPage",
	page: undefined,
	title: undefined,
	lazy: false,
	style: "width:100%; height:100%;",
	events: {
		onLazyLoad: ""
	},
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
	load: function() {
		if(this.lazyComponents) {
			this.components = this.lazyComponents;
			this.lazyComponents = undefined;
			this.createClientComponents(this.components);
		}
		this.render();
		this.loaded = true;
		this.doLazyLoad();
	},
	asyncLoad: function() {
		enyo.asyncMethod(this, this.load);
	}
});

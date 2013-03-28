/**
	An Enyo panels-based solution for creating webpages, where each panel is a
	separate <a href="#enyo.HashPage">enyo.HashPage</a>, giving it a unique hash URL that links directs to the
	HashPage. Furthermore, each <a href="#enyo.HashPage">enyo.HashPage</a> supports lazy-loading to load content
	when you go to the page.
	
	Compatible with the standard <a href="#enyo.Panels">enyo.Panels</a> functions, and you can even set your own
	arranger for different page transitions.
*/

enyo.kind({
	name: "enyo.Website",
	kind: "enyo.Panels",
	published: {
		/**
			Used to get/set the current page once rendered. Will automatically be
			set during creation to the URL's hash (without the initial "#") or the
			first panel if no hash is included on the URL.
		*/
		page: ""
	},
	//* @protected
	handlers: {
		onTransitionStart:"transitionStart"
	},
	draggable: false,
	style: "width:100%; height:100%;",
	defaultKind: "enyo.HashPage",
	create: function() {
		var hash = (window.location.hash.length>1) ? window.location.hash.slice(1) : "";
		this.defaultTitle = document.title;
		this.inherited(arguments);
		this.page = hash;
		this.pageChanged();
		this.hashChange();
		enyo.dispatcher.listen(window, "hashchange", enyo.bind(this, this.hashChange));
	},
	pageChanged: function() {
		if(!this.page || this.page.length==0) {
			this.page = this.getActive().page;
		}
		window.location.hash = "#" + this.page;
	},
	hashChange: function(inSender, inEvent) {
		if(window.location.hash.length<=1) {
			this.page = this.getActive().page;

		}
		var hash = window.location.hash.slice(1);
		var index = this.getPageIndex(hash);
		if(index==-1) {
			this.page = this.getActive().page;
			window.location.hash = "#" + this.page;
		} else {
			this.page = hash;
			var p = this.getPanels();
			var currIndex = this.index % p.length;
			currIndex = (currIndex < 0) ? currIndex + p.length : currIndex;
			if(currIndex!=index) {
				this.setIndex(index);
			}
		}
		
	},
	indexChanged: function() {
		this.inherited(arguments);
		var active = this.getActive();
		if(window.location.hash !== "#" + active.page) {
			this.setPage(active.page);
		}
		document.title = active.title || this.defaultTitle;
	},
	transitionStart: function(inSender, inEvent) {
		var p = this.getPanels();
		var index = inEvent.toIndex % p.length;
		index = (index < 0) ? index + p.length : index;

		if(!p[index].loaded && !p[index].loadInProgress) {
			//if the hashpage isn't loaded and isn't in the process of being loaded
			p[index].asyncLoad();
		}
	}
	//* @public
	//* Gets the natural index of a HashPage by its page name
	getPageIndex: function(page) {
		var p = this.getPanels();
		var index = -1;
		for(var i=0; i<p.length; i++) {
			if(p[i].page === page) {
				index = i;
				break;
			}
		}
		return index;
	},
	/**
		Similar to `setIndexDirect()`, this will change to a given page by name,
		without the usual page transition.
	*/	
	setPageDirect: function(page) {
		var index = this.getPageIndex(page);
		this.setIndexDirect(index);
	},
	
});

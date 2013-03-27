enyo.kind({
	name: "enyo.Website",
	kind: "enyo.Panels",
	draggable: false,
	style: "width:100%; height:100%;",
	published: {
		page: ""
	},
	handlers: {
		onTransitionStart:"transitionStart"
	},
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
	indexChanged: function(old) {
		this.inherited(arguments);
		var active = this.getActive();
		if(window.location.hash !== "#" + active.page) {
			this.setPage(active.page);
		}
		document.title = active.title || this.defaultTitle;
	},
	setPageDirect: function(page) {
		var index = this.getPageIndex(page);
		this.setIndexDirect(index);
	},
	transitionStart: function(inSender, inEvent) {
		var p = this.getPanels();
		var index = inEvent.toIndex % p.length;
		index = (index < 0) ? index + p.length : index;
		if(!p[index].loaded) {
			p[index].asyncLoad();
		}
	}
});

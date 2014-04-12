/**
	Basic hyperlink Enyo binding with all decorations removed. Use as a wrapper, so any containing components
	will be a hyperlink.  Can be used with the <a href="#enyo.HashPanels">enyo.HashPanels</a> and
	<a href="#enyo.HashView">enyo.HashView</a> components, using the hash page name as the _href_.
	
	For example:
	
		{kind:"enyo.Link", href:"#About", components:[
			{"onyx.Button", content:"Go To About HashPage"}
		]}
	
	Allows for custom styling and link customization.
	
		{kind:"enyo.Link", href:"http://google.com", content:"Open Link", style:"color:orange;font-style:italic;"}
*/

enyo.kind({
	name: "enyo.Link",
	published: {
		//* Specifies the URL of the page the link goes to.
		href:"",
		/**
			Optionally specifies where to open the linked document.
			
			May be one of:
			* "_blank" - Opens the linked document in a new window or tab.
			* "_self" - Opens the linked document in the same frame as it was clicked.
			* "_parent" - Opens the linked document in the parent frame.
			* "_top" - Opens the linked document in the full body of the window.
			* _framename_ - Opens the linked document in a named frame.
		*/
		target:"",
		//* Optional title for the link, displayed to the user on a mouseover of the link.
		title:"",
		/**
			Optionally specifies the MIME type of the linked document.
			
			Note: This attribute is purely advisory and may not be enforced by the server.
		*/
		type:""
	},
	//* @protected
	tag: "a",
	classes:"enyo-link",
	create: function() {
		this.inherited(arguments);
		this.updateLinkAttr();
	},
	hrefChanged: function() {
		this.updateLinkAttr();
	},
	targetChanged: function() {
		this.updateLinkAttr();
	},
	typeChanged: function() {
		this.updateLinkAttr();
	},
	titleChanged: function() {
		this.updateLinkAttr();
	},
	updateLinkAttr: function() {
		var attr = this.getAttributes();
		if(this.href && this.href.length>0) {
			attr.href = this.href;
		} else if(attr.href) {
			delete attr.href;
		}
		if(this.target && this.target.length>0) {
			attr.target =  this.target
		} else if(attr.target) {
			delete attr.target;
		}
		if(this.type && this.type.length>0) {
			attr.type =  this.type;
		} else if(attr.type) {
			delete attr.type;
		}
		if(this.title && this.title.length>0) {
			attr.title =  this.title;
		} else if(attr.title) {
			delete attr.title;
		}
		this.setAttributes(attr);
	}
});

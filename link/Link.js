/**
	Simple lightweight wrapper to lazy-load contained components,
	synchonously or asynchronously.
*/

var Anchor = require("enyo/Anchor");

module.exports = Anchor.kind({
    name: "Link",
	published: {
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
		/**
			Optionally specifies the MIME type of the linked document.
			
			Note: This attribute is purely advisory and may not be enforced by the server.
		*/
		type:""
	},
	//* @protected
	classes:"enyo-link",
	create: kind.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.targetChanged();
			this.titleChanged();
		};
	}),
	targetChanged: function() {
		this.setAttribute('target', this.target);
	},
	typeChanged: function() {
		this.setAttribute('type', this.type);
	}
});

/**
	Application creation singeton.

	Creates and renders a `View` kind. Simplifies app creation.
*/

var
	utils = require("enyo/utils"),
	ready = require("enyo/ready"),
	options = require("enyo/options"),
	logger = require("enyo/logger");
	View = require("./View.js");

module.exports = {
	create: function(AppView, params) {
		if(!AppView) {
			console.error('Application.create(): Invalid view');
			return;
		}
		params = utils.mixin({classes:'enyo-fit enyo-unselectable', stage:View.stage}, params);
		ready(function() {
			window.app = new AppView(params);
			if(options.testing) {
				logger.setLogLevel(-1);
			} else {
				app.renderInto(document.body);
			}		
		});
	}
};
enyo.kind({
	name: "onyx.WebAppButton",
	kind: "onyx.Button",
	//* @public
	installLabel: "Install",
	updateLabel: "Update",
	webAppUrl: undefined,  // can optionally specify the url of the webapp to install
	alwaysShow: false, //if true, once installed, the button will turn into an update button, staying visible
	events: {
		onInstallSuccess: "",
		onInstallError: ""
	},
	//* @protected
    	handlers: {
		ontap:"install"
	},
	showing: false,
	checked: false,
	rendered: function() {
		this.inherited(arguments);
		if(!this.checked) {
			this.checked = true;
			enyo.WebAppInstaller.check(enyo.bind(this, function(response) {
				if(response.type!="unsupported") {
					this.setShowing(!response.installed || this.alwaysShow);
					this.setContent(((!response.installed) ? this.installLabel : this.updateLabel));
				}
			}));
		}
	},
    install: function() {
         enyo.WebAppInstaller.install(enyo.bind(this, function(response) {
			if(!this.alwaysShow) {
				this.hide();
			}
			this.setContent(this.updateLabel);
			this.doInstallSuccess(response);
		}), enyo.bind(this, function(err) {
			this.doInstallError(err);
		}));
	}
});

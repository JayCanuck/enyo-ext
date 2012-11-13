enyo.kind({
	name: "enyo.FileInputDecorator",
	tag:"span",
	published: {
		type: "file", //File browser mode: either "file", "audio", "image", or "video"
		mime: undefined, //Confirmed not to work well with IE and Firefox; probably others too
		capture: false, //Only works on Android Browser, Chrome Mobile, Firefox Mobile, and iOS 6
		multiple: false, //Does not work in IE
		inputName:undefined,
		disabled: false
	},
	events: {
		onSelect: ""
	},
	handlers: {
		ontap: "browse"
	},
	components: [
		{name:"fileInput", kind:"enyo.Input", type:"file", showing:false, onchange:"filesSelected"},
		{name: "client", tag:"span"},
	],
	defaultClient: [
		{kind: (window["onyx"] ? "onyx.Button" : "enyo.Button"), content:"Browse..."}
	],
	create: function() {
		this.inherited(arguments);
		if(!this.$.client.children || this.$.client.children.length==0) {
			this.$.client.createComponents(this.defaultClient);
		}
		this.updateFileInputAttr();
		this.disabledChanged();
	},
	updateFileInputAttr: function() {
		if(!this.mime) {
			if(this.type=="audio") {
				this.$.fileInput.setAttribute("accept", "audio/*");
				if(this.capture) {
					this.$.fileInput.setAttribute("capture", "microphone");
				} else {
					this.$.fileInput.setAttribute("capture", "filesystem");
				}
			} else if(this.type=="image") {
				this.$.fileInput.setAttribute("accept", "image/*");
				if(this.capture) {
					this.$.fileInput.setAttribute("capture", "camera");
				} else {
					this.$.fileInput.setAttribute("capture", "filesystem");
				}
			} else if(this.type=="video") {
				this.$.fileInput.setAttribute("accept", "video/*");
				if(this.capture) {
					this.$.fileInput.setAttribute("capture", "camcorder");
				} else {
					this.$.fileInput.setAttribute("capture", "filesystem");
				}
			} else {
				this.$.fileInput.setAttribute("accept", "*/*");
				this.$.fileInput.setAttribute("capture", "filesystem");
			}
		} else {
			this.$.fileInput.setAttribute("accept", this.mime);
			this.$.fileInput.setAttribute("capture", "filesystem");
		}
		if(this.multiple) {
			this.$.fileInput.setAttribute("multiple", "multiple");
		} else {
			this.$.fileInput.setAttribute("multiple", null);
		}
		if(this.inputName) {
			this.$.fileInput.setAttribute("name", this.inputName);
		} else {
			this.$.fileInput.setAttribute("name", null);
		}
	},
	typeChanged: function() {
		this.updateFileInputAttr();
	},
	captureChanged: function() {
		this.updateFileInputAttr();
	},
	multipleChanged: function() {
		this.updateFileInputAttr();
	},
	inputNameChanged: function() {
		this.updateFileInputAttr();
	},
	disabledChanged: function() {
		this.$.fileInput.setDisabled(this.disabled);
	},
	browse: function() {
		var node = this.$.fileInput.hasNode();
		if(node && node.click) {
			node.click();
		}
	},
	filesSelected: function(inSender, inEvent) {
		this.doSelect({value:this.$.fileInput.getValue(), files:inEvent.target.files});
	}
});
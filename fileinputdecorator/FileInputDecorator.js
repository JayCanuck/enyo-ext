/**
	Allows for improved customizable file input, with support for filetype
	filters, multiple file selection, html5 media capture across a wide breadth
	of browsers.
	
	You can wrap this component around other controls to let taps on them trigger the file input.
	If no inner components are specified, a generic button is used.
	
	Note: filetype filters, multiple file support, and media capture not supported in IE.
*/

var
	Control = require("enyo/Control"),
	Input = require("enyo/Input"),
	Button = require("enyo/Button");

try {
	Button = require("onyx/Button");
} catch(e) {}


module.exports = Control.kind({
	name: "FileInputDecorator",
	published: {
		//* File browser mode: either _"file"_, _"audio"_, _"image"_, or _"video"_.
		type: "file",
		//* Mimetype to filter files for. Confirmed not to work well with IE and Firefox.
		mime: undefined,
		//* Whether to create new files via camera/microphone/camcorder. Only works on mobile devices.
		capture: false, 
		//* Whether to input multiple files. Does not work in IE and many mobile browsers
		multiple: false,
		//* Any name attribute you may want to specify
		inputName:undefined,
		//* Disabled or not
		disabled: false
	},
	events: {
		/**
			Triggered when one or more files are selected.
			Event data includes the _"value"_ property which is the standard input value property,
			as well as _"files"_, which is the FileList object (for browsers that support it)
		*/
		onSelect: ""
	},
	//* @protected
	tag:"span",
	handlers: {
		ontap: "browse"
	},
	components: [
		{style:"width: 0px; height: 0px; overflow: hidden;", components:[
			{name:"fileInput", kind:Input, type:"file", onchange:"filesSelected"}
		]},
		{name: "client", tag:"span"},
	],
	defaultClient: [
		{kind: Button, content:"Browse..."}
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
	//* @public
	//* Trigger the file input browser. This function is called automatically when tapped on.
	browse: function() {
		var node = this.$.fileInput.hasNode();
		if(node && node.click) {
			node.click();
		}
	},
	//* @protected
	filesSelected: function(inSender, inEvent) {
		this.doSelect({value:this.$.fileInput.getValue(), files:inEvent.target.files});
	}
});

enyo.kind({
	name: "enyo.JavaApplet",
	kind: enyo.Control,
	tag: "object",
	events: {
		onDataReceived: ""
	},
	published: {
		archive:"",
		code:"",
		height: 200,
		width: 200,
	},
	components: [
		{tag:"param", name:"archiveParam", attributes:{name:"archive", value:""}},
		{tag:"param", name:"codeParam", attributes:{name:"code", value:""}},
		{tag:"param", attributes:{name:"mayscript", value:"yes"}},
		{tag:"param", attributes:{name:"scriptable", value:"true"}}
	],
	create: function() {
		this.inherited(arguments);
		var a = this.getAttributes();
		if(enyo.platform.ie) {
			a.classid = "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93";
		} else {
			a.type = "application/x-java-applet;version=1.5";
		}
		a.width = this.width;
		a.height = this.height;
		this.setAttributes(a);
		this.archiveChanged();
		this.codeChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.callbackName = "javaAppletCallback_" + this.makeId();
		window[this.callbackName] = enyo.bind(this, this.appletCallback);
		var node = this.hasNode();
		if(node) {
			node.enyoAppletInit(this.callbackName);
		}
	},
	archiveChanged: function() {
		this.$.archiveParam.setAttributes({name:"archive", value:this.archive});
	},
	codeChanged: function() {
		this.$.codeParam.setAttributes({name:"code", value:this.code});
	},
	widthChanged: function() {
		var a = this.getAttributes();
		a.width = this.width;
		this.setAttributes(a);
	},
	heightChanged: function() {
		var a = this.getAttributes();
		a.height = this.height;
		this.setAttributes(a);
	},
	call: function(method, params) {
		var node = this.hasNode();
		if(node) {
			node.enyoAppletInit(this.callbackName);
			var obj = {method:method, params:params || {}};
			node.enyoAppletCall(enyo.json.stringify(obj));
		}
	},
	appletCallback: function(payload) {
		var jsonPayload = enyo.json.parse(payload || "{}") || {};
		this.doDataReceived(jsonPayload);
	}
});
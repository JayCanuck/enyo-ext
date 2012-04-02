enyo.kind({
	name: "enyo.XmlpRequest",
	kind: enyo.JsonpRequest,
	callbackName: "callback",
	go: function(inParams) {
		var parts = this.url.split("?");
		var uri = parts.shift() || "";
		var args = parts.join("?").split("&");
		args.push(enyo.Ajax.objectToQuery(inParams || {}));
		var xmlUrl = [uri, args.join("&")].join("?");
		this.url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'"
				+ encodeURIComponent(xmlUrl) + "'&format=json";
		inParams = {};
		this.inherited(arguments);
	},
	respond: function(inValue) {
		if(inValue && inValue.query && inValue.query.results) {
			inValue = inValue.query.results;
		}
		this.inherited(arguments);
	}
});
enyo.kind({
	name: "enyo.XmlpRequest",
	kind: enyo.JsonpRequest,
	published: {
		detailedErrors:true 	//if true, on a query failure, it will re-query the xml url/params
					//to get the plain-text content and return that in the format
					// of {"error":"unescaped-plain-text-content"}
	},
	callbackName: "callback",
	go: function(inParams) {
		var parts = this.url.split("?");
		var uri = parts.shift() || "";
		var args = parts.join("?").split("&");
		args.push(enyo.Ajax.objectToQuery(inParams || {}));
		this.xmlUrl = [uri, args.join("&")].join("?");
		this.url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'"
				+ encodeURIComponent(this.xmlUrl) + "'&format=json";
		inParams = {};
		this.inherited(arguments);
	},
	respond: function(inValue) {
		if(inValue && inValue.query) {
			inValue = inValue.query.results || undefined;
			if(!inValue && this.detailedErrors) {
				var fallbackUrl = "http://query.yahooapis.com/v1/public/yql?q=use%20%22http"
						+ "%3A%2F%2Fwww.datatables.org%2Fdata%2Fhtmlstring.xml%22%20"
						+ "as%20htmlstring%3B%20select%20*%20from%20htmlstring%20where"
						+ "%20url%3D'"+ encodeURIComponent(this.xmlUrl) + "'&format=json";
				this.fallbackTextRequest = new enyo.JsonpRequest({url:fallbackUrl,
						callbackName:"callback"});
				this.fallbackTextRequest.response(this, "fallbackTextCallback");
				this.fallbackTextRequest.go();
				return;
			}
		}
		this.inherited(arguments);
	},
	fallbackTextCallback: function(inSender, inResponse) {
		if(inResponse && inResponse.query) {
			inResponse = inResponse.query.results || undefined;
			if(inResponse && inResponse.result) {
				inResponse = inResponse.result;
				if(inResponse.indexOf("HTML Tidy for Java")>-1) {
					// plain text is within auto-generated html, so extract it
					var text = inResponse.substring(inResponse.indexOf("<p>")+3,
							inResponse.lastIndexOf("</p>"));
					inResponse = {"error":text};

				} else {
					inResponse = {"error":"Query is not in XML format"};
				}
			} else if(inResponse && !inResponse.result) {
				inResponse = {"error":"Unknown XML query failure"};
			} else if(!inResponse) {
				inResponse = {"error":"Unable to connect to server"};
			}
		}
		this.respond(inResponse);
	}
});
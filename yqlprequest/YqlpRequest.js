enyo.kind({
	name: "enyo.YqlpRequest",
	kind: enyo.JsonpRequest,
	published: {
		query: ""
	},
	callbackName: "callback",
	go: function(query) {
		if(query) {
			this.query = query;
		}
		this.url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(this.query)
				+ "&format=json";
		this.inherited(arguments);
	}
});
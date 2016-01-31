/**
	Cross-domain fetching of YQL queries, returned in JSON format.
	
	More information on YQL format can be found at [http://developer.yahoo.com/yql/](http://developer.yahoo.com/yql/)
	and an expansive collection of YQL data tables can be found at
	[http://www.datatables.org](http://www.datatables.org)
*/

var JsonpRequest = require("enyo/Jsonp");

module.exports = JsonpRequest.kind({
	name: "YqlpRequest",
	published: {
		//* YQL query to send
		query: ""
	},
	//* @protected
	callbackName: "callback",
	//* @public
	//* Executes the YQL request, with an optional parameters object
	go: function(query) {
		if(query) {
			this.query = query;
		}
		this.url = "//query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(this.query)
				+ "&format=json";
		this.inherited(arguments);
	}
});

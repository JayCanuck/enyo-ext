enyo.kind({
	name: "App",
	kind: "Scroller",
	classes: "onyx enyo-unselectable",
	components: [
		{kind: "onyx.Toolbar", content:"YqlpRequest Enyo Component Demo"},
		{style:"margin:0 25px 0 25px;", components:[
			{style:"height:50px;"},
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "YQL Query"},
				{kind: "onyx.InputDecorator", components: [
					{name:"query", kind: "onyx.Input", style:"width:100%;", value: "SELECT * from geo.places WHERE text='SFO'"},
					{kind: "onyx.Button", content: "Go", style:"float:right; position:relative; top:-30px;", ontap:"tapButton"}
				]}
			]},
			{style:"height:50px;"},
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Response"},
				{name:"results", content: " ", style: "padding: 8px; min-height:1em; word-break:break-all; word-wrap:break-word; white-space:pre-wrap;"}
			]},
		]},
	],
	tapButton: function(inSender, inEvent) {
		var yql = new enyo.YqlpRequest({query:this.$.query.getValue()});
		yql.response(this, "requestCallback");
		yql.go(); //if I had a json object of parameters, they could go here
	},
	requestCallback: function(inSender, inResponse) {
		this.$.results.setContent(enyo.json.stringify(inResponse, undefined, '\t'));
	}
});
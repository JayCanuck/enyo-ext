if(enyo.platform.ie>=10) {
	var msViewportStyle = document.createElement("style");
	msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}"));
	document.getElementsByTagName("head")[0].
	appendChild(msViewportStyle);
	
	
}

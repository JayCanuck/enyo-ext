//Enyo2 bookmarklet loader
//Copyright 2013, Jason Robitaille www.canuckcoding.ca
//MIT license

var serverPath = "server-url-here"; 	// EDIT THIS TO YOUR BASE URL FOR BUILT/MINIFIED ENYO2 APP
					// (include a trailing slash ("/")
					// https server url recommended for compatibility on https websites

//function to inject scripts
function scriptIt(url, callback) {
	var s = document.createElement("script");
	s.src = url;
	s.async = true;
	if(callback) {
		if(s.addEventListener) {
			s.addEventListener("load", callback, false);
		} else if (s.readyState) {
			s.onreadystatechange = callback;
		}
	}
	document.getElementsByTagName("head")[0].appendChild(s);
};

//function to inject stylesheets
function styleIt(url) {
	var s = document.createElement("link");
	s.href = url;
	s.rel = "stylesheet";
	s.type = "text/css";
	document.getElementsByTagName("head")[0].appendChild(s);
};

//inject stylesheets
styleIt(serverPath + "enyo.css");
styleIt(serverPath + "app.css");

//inject the built scripts in chain sequence, then execute app code
var injectApp = function() {
	scriptIt(serverPath + "app.js", function() {
		var s = document.createElement("div");
		document.body.appendChild(s);
		enyo.bookmarkletApp = new enyo.Bookmarklet();
		enyo.bookmarkletApp.renderInto(s);
	});
};
if(window.enyo) {
	injectApp();
} else {
	scriptIt(serverPath + "enyo.js", injectApp);
}

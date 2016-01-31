/**
	Enyo component bindings for Socket.IO, with dynamic support for the Enyo event system.
	
	For more information about Socket.IO, see [http://socket.io](http://socket.io)
*/

var
	Component = require("enyo/Component"),
	utils = require("enyo/utils");

module.exports = Component.kind({
	name: "Socket",
	//* Websocket url to connect to.
	url: "",
	//* Connection timeout (in milliseconds).
	timeout: 10000,
	//* Whether or not to multiplex connections.
	multiplex: true,
	//* Whether or not to create new sockets for each new websocket.
	forceNew: false,
	//* Number of reconnection attempts to make.
	reconnectionAttempts: Infinity,
	//* Delay time on reconnection (in milliseconds).
	reconnectionDelay: 1000,
	//* Maximum delay time on reconnection (in milliseconds).
	reconnectionDelayMax: 5000,
	/**
		As the events received from the websocket can be anything the server wants to send,
		the event system in _Socket_ is dynamic and will listen and bubble for any events
		specified.  For example,
		
			{kind:Socket, onconnect:"con", ontest:"test"}
		
		will automatically listen for (and bubble) "connect" and "test" events.  However, as
		you may have noticed, this dynamic event handling requires you to specify a handler function
		inline in the component declaration.  If you don't want that, and simply want events to bubble
		up, to be handled elsewhere, you can specify those events in the _"bubblers"_ array property.
	*/
	events: {
	},
	/**
		Set events to bubble websocket events for. For example,
		
			{kind:Socket, bubblers:["connect", "test"]}
		
		will bubble the "connect" and "test" events, for handling anywhere in its component hierarchy.
	*/
	bubblers: [],
	//* attempts to connect the websocket to the server
	connect: function() {
		this.eventQueue = utils.clone(this.bubblers);
		var evScan = [this, this.handlers];
		for(var i=0; i<evScan.length; i++) {
			for(var x in evScan[i]) {
				if(x.indexOf("on")==0) {
					var ev = x.substring(2);
					if(this.eventQueue.indexOf(ev)<0) {
						this.eventQueue.push(ev);
					}
				}
			}
		}
		var opts = {
			multiplex: this.multiplex,
			forceNew: this.forceNew,
			reconnectionAttempts: this.reconnectionAttempts,
			reconnectionDelay: this.reconnectionDelay,
			reconnectionDelayMax: this.reconnectionDelayMax
		};
		this.socket = io.connect(this.url, opts);
		for(var i=0; i<this.eventQueue.length; i++) {
			var currEv = this.eventQueue[i];
			this.socket.on(currEv, this.bindSafely(function(data) {
				this.bubble("on" + currEv, data);
			}));
		}
	},
	//* Sends string data in the form of a `message` event to the server.
	send: function(inMessage) {
		if(this.socket) {
			this.socket.send(inMessage);
		}
	},
	//* Emits an event and event data to the server.
	emit: function(inEvent, inParams) {
		if(this.socket) {
			this.socket.emit(inEvent, inParams);
		}
	},
	//* Disconnects the websocket
	disconnect: function() {
		if(this.socket) {
			this.socket.disconnect();
			this.socket = undefined;
		}
	},
	statics: {
		//* Default events that are part of the Socket.IO system
		Events: [
			"connect",
			"connecting",
			"connect_failed",
			"message",
			"reconnect",
			"reconnecting",
			"reconnect_failed",
			"disconnect",
			"error"
		]
	}
});

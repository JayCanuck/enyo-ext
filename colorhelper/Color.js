/**
	Plugin for Enyo2 for working with colors.
	Originally a jQuery color manipulation plugin by Ole Laursen (MIT license, October 2009),
	which itself was inspired from the jQuery color animation plugin by John Resig.
	
	Released under the MIT license by Jason Robitaille, January 2013.
 */ 

enyo.kind({
	name: "enyo.Color",
	kind: enyo.Object,
	/**
		Constructor are numeric values for red, green, blue, and alpha.
		
		Red, green, and blue should be 0-255. Default for each is _0_.
		Alpha is optional, but should be 0-1. Default is _1_.
	*/
	constructor: function(r, g, b, a) {
		this.r = r || 0;
		this.g = g || 0;
		this.b = b || 0;
		this.a = (a != undefined) ? a : 1;
		this.normalize();
	},
	//* @protected
	normalize:  function() {
		var clamp = function(min, value, max) {
			return value < min ? min: (value > max ? max: value);
		};
		this.r = clamp(0, parseInt(this.r), 255);
		this.g = clamp(0, parseInt(this.g), 255);
		this.b = clamp(0, parseInt(this.b), 255);
		this.a = clamp(0, this.a, 1);
		return this;
	},
	//* @public
	/**
		Adds a value to specific color properties
		For example: `var c = new Color(164, 53, 35).add('gb', 50).add('a', -0.5);`
		Returns the altered color, for chain function calling
	*/
	add: function(properties, value) {
		for(var i=0; i<properties.length; i++) {
			this[properties.charAt(i)] += value;
		}
		return this.normalize();
	},
	/**
		Scales scpecific color properties by a value.
		For example: `var c = new Color(164, 53, 35, 53, 35).scale('rgb', 0.25).scale('a', 0.8);`
		Returns the altered color, for chain function calling
	*/
	scale: function(properties, value) {
		for(var i=0; i<properties.length; i++) {
			this[properties.charAt(i)] *= value;
		}
		return this.normalize();
	},
	/**
		Returns the altered color string, in rgb/rgba format
	*/
	toString: function () {
		if(this.a >= 1.0) {
			return "rgb("+[this.r, this.g, this.b].join(",")+")";
		} else {
			return "rgba("+[this.r, this.g, this.b, this.a].join(",")+")";
		}
	},
	statics:{
		/**
			Extract CSS color property from a given enyo.Control, going up in the DOM
			if it's _"transparent"_
		*/
		extract: function (control, cssProperty) {
			var c;
			do {
				if(enyo.platform.ie<9 && control.hasNode() && control.hasNode().currentStyle) {
					c = control.hasNode().currentStyle.backgroundColor;
				} else {
					c = control.getComputedStyleValue(cssProperty, null);
				}
				if(c!=undefined && c.length>0 && c!="transparent" && c!="rgba(0, 0, 0, 0)") {
					c = c.toLowerCase();
					break;
				}
				control = control.parent;
			} while(control.parent);
	
			// catch webkit's way of signalling transparent
			if(c==null || c=="rgba(0, 0, 0, 0)") {
				c = "transparent";
			}
			return enyo.Color.parse(c);
		},
		/**
			Parses a CSS color string (like "rgb(10, 32, 43)" or "#fff").
			Returns an enyo.Color object, if parsing failed, you get black (0, 0, 0)
		*/
		parse: function(str) {
			var res;
	
			// Look for rgb(num,num,num)
			if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))
				return new enyo.Color(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10));
			
			// Look for rgba(num,num,num,num)
			if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
				return new enyo.Color(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10), parseFloat(res[4]));
				
			// Look for rgb(num%,num%,num%)
			if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))
				return new enyo.Color(parseFloat(res[1])*2.55, parseFloat(res[2])*2.55, parseFloat(res[3])*2.55);
	
			// Look for rgba(num%,num%,num%,num)
			if (res = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
				return new enyo.Color(parseFloat(res[1])*2.55, parseFloat(res[2])*2.55, parseFloat(res[3])*2.55, parseFloat(res[4]));
			
			// Look for #a0b1c2
			if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))
				return new enyo.Color(parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16));
	
			// Look for #fff
			if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))
				return new enyo.Color(parseInt(res[1]+res[1], 16), parseInt(res[2]+res[2], 16), parseInt(res[3]+res[3], 16));
	
			// Otherwise, we're most likely dealing with a named color
			var name = str.replace(/^\s+|\s+$/g,"").toLowerCase();
			if (name == "transparent")
				return new enyo.Color(255, 255, 255, 0);
			else {
				// default to black
				res = enyo.Color[name] || [0, 0, 0];
				return new enyo.Color(res[0], res[1], res[2]);
			}
		},
		//Named color array statics
		aqua:[0,255,255],
		azure:[240,255,255],
		beige:[245,245,220],
		black:[0,0,0],
		blue:[0,0,255],
		brown:[165,42,42],
		cyan:[0,255,255],
		darkblue:[0,0,139],
		darkcyan:[0,139,139],
		darkgrey:[169,169,169],
		darkgray:[169,169,169],
		darkgreen:[0,100,0],
		darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],
		darkolivegreen:[85,107,47],
		darkorange:[255,140,0],
		darkorchid:[153,50,204],
		darkred:[139,0,0],
		darksalmon:[233,150,122],
		darkviolet:[148,0,211],
		fuchsia:[255,0,255],
		gold:[255,215,0],
		grey:[128,128,128],
		gray:[128,128,128],
		green:[0,128,0],
		indigo:[75,0,130],
		khaki:[240,230,140],
		lightblue:[173,216,230],
		lightcyan:[224,255,255],
		lightgreen:[144,238,144],
		lightgrey:[211,211,211],
		lightgray:[211,211,211],
		lightpink:[255,182,193],
		lightyellow:[255,255,224],
		lime:[0,255,0],
		magenta:[255,0,255],
		maroon:[128,0,0],
		navy:[0,0,128],
		olive:[128,128,0],
		orange:[255,165,0],
		pink:[255,192,203],
		purple:[128,0,128],
		violet:[128,0,128],
		red:[255,0,0],
		silver:[192,192,192],
		white:[255,255,255],
		yellow:[255,255,0]
	}
});

//* And because I'm Canadian :p
enyo.Colour = enyo.Color;

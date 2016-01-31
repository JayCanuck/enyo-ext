/**
	Glowe - A focus/blur compatibility layer for EnyoJS
	Minimalist fashion, Glowe allows usage of the default focus system built into browsers.
	Leveraging CSS focus selectors and tabindex DOM attributes for optimal browser support,
	Glowe adds custom styling for the Onyx library for EnyoJS, allowing accessibility with
	controls. Includes user customizable options as well as enchanced keyboard control within
	Enyo apps.
	
	Furthermore, if you want to add a basic focus highlight glow to anyu custom control, just
	include the `focusable` CSS class and include a tabindex attribute with a valid numeric value.
*/

//* @public
// public static interface for Glowe control/options
var
	platform = require("enyo/platform"),
	Control = require("enyo/Control"),
	Component = require("enyo/Component"),
	OnyxButton = undefined;


try {
	OnyxButton = require("onyx/Button");
} catch(e) {}


//* @public
// public static interface for Glowe control/options
var glowe = module.exports = {
	/**
		When true, the focus will be applied when you tap/click on an element
		and hitting the Enter key will not dismiss the focus
	*/
	stickyFocus: false,
	/**
		Whenever focus is dismissed/blurred away, the next time the user attempts
		to tab into the focus system, it resets back at the beginning of the focus
		cycle
	*/
	resetOnBlur: true,
	//* Whether or not the ESC key will blur focus away from the current element
	blurOnEsc: true,
	//* Focus to a specific control (if rendered)
	focus: function(inControl) {
		if(inControl.hasNode()) {
			inControl.node.focus();
		}
	},
	//* Blur the currently focused element
	blur: function() {
		glowe.focusCache && glowe.focusCache.blur();
		if(glowe.focusCache && glowe.resetOnBlur) {
			glowe.resetFocus();
		}
	},
	//* Resets the focus system back to the beginning of the focus cycle
	resetFocus: function() {
		document.documentElement.focus();
		document.documentElement.blur();
		glowe.focusCache = undefined;
	}
};

//* @protected
(function() {
	// local cache of focus to be revived next tab if desired
	glowe.focusCache = undefined;
	var prevFocus = undefined;

	//* @protected
	// focus/blur handlers for mouse-clicks and Tab focusing/blurring
	var focusEvts = {blur:"blur", focus:"focus"};
	if(platform.ie || platform.wp) {
		focusEvts = {blur:"focusout", focus:"focusin"};
	}
	document.documentElement.addEventListener(focusEvts.focus, function(inEvent) {
		prevFocus = document.activeElement;
	}, true);
	document.documentElement.addEventListener(focusEvts.blur, function(inEvent) {
		glowe.focusCache = prevFocus;
		glowe.blur();
	}, true);

	// generic cross-browser function to prevent a key action/bubbling
	var preventKeyAction = function(inEvent) {
		inEvent.preventDefault && inEvent.preventDefault();
		inEvent.cancelBubble && inEvent.cancelBubble();
		inEvent.stopPropagation && inEvent.stopPropagation();
		return false;
	};
	document.addEventListener("keydown", function(inEvent) {
		if(inEvent.keyCode==13 && document.activeElement && document.activeElement.tagName!="HTML"
				&& document.activeElement.tagName!="BODY") {
			// handle Enter key
			if(!glowe.stickyFocus) {
				glowe.focusCache = document.activeElement;
			}
			document.activeElement.click();
			return preventKeyAction(inEvent);
		} else if(inEvent.keyCode==27 && glowe.blurOnEsc && document.activeElement
				&& document.activeElement.tagName!="HTML" && document.activeElement.tagName!="BODY") {
			// handle ESC key
			glowe.focusCache = document.activeElement;
			glowe.blur();
			return preventKeyAction(inEvent);
		} else if(inEvent.keyCode==9 && glowe.focusCache && (!document.activeElement
				||document.activeElement.tagName=="HTML" || document.activeElement.tagName=="BODY")) {
			// handle Tab key, refocusing to cached entry if needed
			glowe.focusCache.focus();
			glowe.focusCache = undefined;
			return preventKeyAction(inEvent);
		}
	}, true);

	// Override default click/tap handler within enyo.Control for post-Enter and click/tap handling
	var orig = Control.prototype.tap;
	Control.prototype.tap = function(inSender, inEvent) {
		if(!glowe.stickyFocus) {
			glowe.blur();
		}
		if(!glowe.stickyFocus && !inEvent.focusHandled) {
			inEvent.focusHandled = true;
			if(document.activeElement && document.activeElement.tagName!="HTML"
					&& document.activeElement.tagName!="BODY") {
				glowe.focusCache = document.activeElement;
			}
			glowe.blur();
		}
		if(orig) {
			return orig.apply(this, arguments)
		}
	};
	// Override built-in Control focus/blur functions to use Glowe's functionality
	Control.prototype.focus = function() {
		glowe.focus(this);
	};
	Control.prototype.blur = function() {
		if(this.hasFocus()) {
			glowe.blur();
		}
	};

	if(OnyxButton) {
		// Add tabindex attribute to all onyx.Button controls
		var attr = OnyxButton.prototype.attributes || {};
		if(attr.tabindex==undefined) {
			attr.tabindex = 0;
		}
		OnyxButton.prototype.attributes = attr;
	}
})();

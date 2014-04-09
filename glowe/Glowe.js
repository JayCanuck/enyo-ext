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
enyo.glowe = {
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
		enyo.glowe.focusCache && enyo.glowe.focusCache.blur();
		if(enyo.glowe.focusCache && enyo.glowe.resetOnBlur) {
			enyo.glowe.resetFocus();
		}
	},
	//* Resets the focus system back to the beginning of the focus cycle
	resetFocus: function() {
		document.documentElement.focus();
		document.documentElement.blur();
		enyo.glowe.focusCache = undefined;
	}
};

//* @protected
(function() {
	// local cache of focus to be revived next tab if desired
	enyo.glowe.focusCache = undefined;
	var prevFocus = undefined;

	//* @protected
	// focus/blur handlers for mouse-clicks and Tab focusing/blurring
	var focusEvts = {blur:"blur", focus:"focus"};
	if(enyo.platform.ie || enyo.platform.wp) {
		focusEvts = {blur:"focusout", focus:"focusin"};
	}
	document.documentElement.addEventListener(focusEvts.focus, function(inEvent) {
		prevFocus = document.activeElement;
	}, true);
	document.documentElement.addEventListener(focusEvts.blur, function(inEvent) {
		enyo.glowe.focusCache = prevFocus;
		enyo.glowe.blur();
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
			if(!enyo.glowe.stickyFocus) {
				enyo.glowe.focusCache = document.activeElement;
			}
			document.activeElement.click();
			return preventKeyAction(inEvent);
		} else if(inEvent.keyCode==27 && enyo.glowe.blurOnEsc && document.activeElement
				&& document.activeElement.tagName!="HTML" && document.activeElement.tagName!="BODY") {
			// handle ESC key
			enyo.glowe.focusCache = document.activeElement;
			enyo.glowe.blur();
			return preventKeyAction(inEvent);
		} else if(inEvent.keyCode==9 && enyo.glowe.focusCache && (!document.activeElement
				||document.activeElement.tagName=="HTML" || document.activeElement.tagName=="BODY")) {
			// handle Tab key, refocusing to cached entry if needed
			enyo.glowe.focusCache.focus();
			enyo.glowe.focusCache = undefined;
			return preventKeyAction(inEvent);
		}
	}, true);

	// Override default click/tap handler within enyo.Control for post-Enter and click/tap handling
	var orig = enyo.Control.prototype.tap;
	enyo.Control.prototype.tap = function(inSender, inEvent) {
		if(!enyo.glowe.stickyFocus) {
			enyo.glowe.blur();
		}
		if(!enyo.glowe.stickyFocus && !inEvent.focusHandled) {
			inEvent.focusHandled = true;
			if(document.activeElement && document.activeElement.tagName!="HTML"
					&& document.activeElement.tagName!="BODY") {
				enyo.glowe.focusCache = document.activeElement;
			}
			enyo.glowe.blur();
		}
		if(orig) {
			return orig.apply(this, arguments)
		}
	};
	// Override built-in Control focus/blur functions to use Glowe's functionality
	enyo.Control.prototype.focus = function() {
		enyo.glowe.focus(this);
	};
	enyo.Control.prototype.blur = function() {
		if(this.hasFocus()) {
			enyo.glowe.blur();
		}
	};

	// Add tabindex attribute to all onyx.Button controls
	var attr = onyx.Button.prototype.attributes || {};
	if(attr.tabindex==undefined) {
		attr.tabindex = 0;
	}
	onyx.Button.prototype.attributes = attr;
})();

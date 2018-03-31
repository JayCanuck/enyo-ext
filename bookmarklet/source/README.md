Enyo Bookmarklet
================

Bookmarklet.js
--------
Built off of onyx.Popup (or enyo.Popup if onyx is not included), the enyo.Bookmarklet allow for custom top/bottom and left/right positioning (or alternatively centered positioning, as inherited by enyo.Popup).

Includes extra features that can be declared in its constructor, including width/height, and the ability to drag the popup around the screen by dragging its edges.

loader.js
--------
Injects the built Enyo framework and app data into the current webpage you're on, and once loaded, displays the Bookmarklet control for your app.

You will need to edit the server path variable at the beginning for it to work properly. To run connectly on https websites, it's recommended you host your bookmarklet code on an https server as well. Dropbox is a great free solution.

Then simply copy the full URL path of your loader.js script into the [Enyo Bookmarklet Builder](http://jaycanuck.github.com/enyo-bookmarklet/) and a hyperlink will be generated that you can drag to your browser's bookmark toolbar.


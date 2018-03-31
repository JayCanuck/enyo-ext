Calculator Bookmarklet Example
=========

A demo Enyo bookmarklet loosely-based off the [webOS-ports calculator app](https://github.com/webOS-ports/org.webosports.app.calculator), using the loader.js and Bookmarklet control

Bookmarklet URL:

javascript:(function()%7Bif%20(window.enyo%20%26%26%20window.enyo.Signals%20%26%26%20enyo.Signals.send%20%26%26%20enyo.bookmarkletApp)%20%7Benyo.Signals.send(%22onBookmarkletRelaunch%22)%3B%7D%20else%20%7Bvar%20s%20%3D%20document.createElement(%22script%22)%3Bs.src%20%3D%20%22https%3A%2F%2Fdl.dropbox.com%2Fu%2F2774158%2Fenyo-bookmarklet-calc%2Floader.js%22%3Bdocument.getElementsByTagName(%22head%22)%5B0%5D.appendChild(s)%3B%7D%7D)()

Note: when hosting a bookmarklet, if you want it to properly run on secure https websites, be sure your bookmarklet is also hosting on a secure http server. In the above example, I use dropbox's public hosting as they support https.

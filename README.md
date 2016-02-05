Enyo 2 Components
=========
A misc collection of components and addons for the EnyoJS framework.
Also-see: [onyx-media](https://github.com/JayCanuck/onyx-media), [enyo-luneos](https://github.com/JayCanuck/enyo-luneos)

----
Avalaible Components/Addons
========================
AdaptiveImage & DynamicImage
--------
> Extensions of enyo/Image that will automatically display the proper image depending on screen pixel ratio. AdaptiveImage determines the nearest ratio match (using media queries if needed) from given src urls for specific pixel ratios. DynamicImage on the otherhand dynamically building a url based off the window.devicePixelRatio value and attempts to display that.

AltMVC
--------
> A lightweight MVC freeflow view/controller library focusing on view structures that allows for interbound view/controller components on any version of EnyoJS.

Color, ColorWheel, & ColorWheelPopup
--------
> Enyo-based color manipulation, detection, and parsing. Includes ColorWheel controls with dynamic color selection.

FadeAudio
--------
> A simple layer on enyo/Audio providing fade-in and fade-out functions.

FileInputDecorator
--------
> Allows for improved customizable file input, with support for filetype filters, multiple file selection, html5 media capture across a wide breadth of browsers, including iOS6 and Android 3.x+. Note: filetype filters, multiple file support, and media capture not supported in IE.

FPopup
--------
> A variant of the regular popup Control that animates a brief fade-slide in.

Glowe
--------
> Compatability layer that takes advantage of builtin focus system in browsers. Makes use of CSS selectors and tabindex DOM attributes for optimum support. Includes a focus highlight glow for onyx.Button and can be added to any custom component by adding a standard tabindex and css "focusable" class.

Gravatar
--------
> A modified/updated version of https://github.com/pcimino/Gravatar which now defaults to the mystery man avatar, default of no rating filter,  and supports dynamic changing of email, size, and rating.

JavaApplet
--------
> Component for Java applets, with improved Enyo2 support, including adapted 2-way Java-Javascript data transfer.

Lazy
--------
> Simple lightweight wrapper to lazy-load contained components, synchonously or asynchronously, with an onLazyLoad event.

Lightbox
--------
> Popup kind that is mostly unstyled, with a shadow and external close button.  Features optional scrim, fadein/fadeout, and the ability to hook into the Enyo Control api to easily display content from anywhere.

Link
--------
> Layer on enyo/Achor to support "target" and "type" attributes along with additional styling to better handle wrapping around enyo buttons/controls.

Socket
--------
> Enyo bindings for Socket.IO.

Validate
--------
> Function parameter type-testing routine.

VerticalSlider
--------
> Vertical variant of the onyx.Slider.

WebAppInstaller
--------
> Unified web app installation library for Firefox, Firefox for Android, FirefoxOS, Chrome, and iOS. Includes a WebAppButton control that hides (or turns into an "Update button) onces the web app is installed or on unsupported browsers. Inspired by the installation library in Mozilla's mortar app stub.

XmlpRequest
--------
> Allows for jsonp-style requests for xml documents, via YQL, returned in json format.

YqlpRequest
--------
> Allows for jsonp-style requests for YQL queries, returned in json format.

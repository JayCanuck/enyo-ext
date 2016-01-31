/**
	A simple HTML5 audio wrapper with fade-in and fade-out functions.
*/

var Audio = require("enyo/Audio");

module.exports = Audio.kind({
	name:"FadeAudio",
	//* Default audio fade time (in milliseconds) for the fadeIn/fadeOut functions
	defaultFadeTime:200,
	/**
		Fades the audio in, for a given length of time (in milliseconds).
		
		If no time is specified, `defaultFadeTime` is used.
	*/
	fadeIn: function(length) {
		length = length || this.defaultFadeTime || 200;
		var volume = 0;
		this.setVolume(volume);
		this.play();
		
		var fadeInJob = this.fadeInJob = setInterval(this.bindSafely(function() {
			if(volume < 1) {
				volume += 0.05;
				this.setVolume(volume.toFixed(2));
			} else {
				clearInterval(fadeInJob);
			}
		}), (length/20));
	},
	//* Cancels any in-progress `fadeIn()` effects, resetting the volume to 100%
	cancelFadeIn: function() {
		clearInterval(this.fadeInJob);
		this.setVolume(1);
	},
	/**
		Fades the audio out, for a given length of time (in milliseconds).
		Can specify the `fadeOut()` effect mode to fade out to a `stop()` with _"stop"_
		or to fade out to a `pause()` with _"pause"_;
		
		If no time is specified, `defaultFadeTime` is used.
		If no mode is specified, _"stop"_ is used.
	*/
	fadeOut: function(length, mode) {
		length = length || 200;
		mode = mode || "stop";
		var node = this.hasNode();
		var volume = 1;
		this.setVolume(volume);
		var fadeOutJob = this.fadeOutJob = setInterval(this.bindSafely(function() {
			if(volume > 0) {
				volume -= 0.05;
				this.setVolume(volume.toFixed(2));
			} else {
				clearInterval(fadeOutJob);
				this.pause();
				if(mode === "stop") {
					this.seekTo(0)
				}
				this.setVolume(1);
			}
		}), (length/20));
	},
	//* Cancels any in-progress `fadeOut()` effects, resetting the volume to 100%
	cancelFadeOut: function() {
		clearInterval(this.fadeOutJob);
		node.volume = 1;
	}
});

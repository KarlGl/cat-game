// Just includes everything for us!

define(['sender', 'dom/get', 'dom/style', 'dom/set', 'statics', 'state', 'receiver'], function(
    sender, domGet, domStyle, domSet, statics, otherState, receiver
) {
    // Only for debugging, evily attach all our shit to window object.
    var args = arguments;
    ['sender', 'domGet', 'domStyle', 'domSet', 'statics', 'otherState', 'receiver'].forEach(function(key, i) {
    	window.a = {};
      window.a[key] = args[i];
    });
});

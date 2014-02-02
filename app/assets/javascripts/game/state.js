/*
All state tracked outside of the DOM
*/
define(function() {
    var otherState = {};
    otherState.playerId = null;

    otherState.setPlayerId = function(playerId) {
        otherState.playerId = playerId;
    };
    return otherState;
})

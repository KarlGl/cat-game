define(['state'], function(state) {
    var domGet = {};

    domGet.playerPos = function(el) {
        return el;
    };

    domGet.playerAttacking = function(el) {
        return el.hasClass("attack");
    };

    domGet.getPlayersElement = function(playerId) {
        return $('#' + playerId);
    };

    domGet.curPlayer = function() {
        return domGet.getPlayersElement(state.playerId);
    };

    domGet.getName = function() {
        return domGet.getNameForPlayer(state.playerId);
    };

    domGet.getNameForPlayer = function(id) {
        return domGet.getPlayersElement(id).find(".name").html() || id;
    };

    // pixels world is from edge of window
    domGet.worldOffset = function() {
        return $("#world").offset();
    };

    domGet.translateCoords = function(e) {
        return {
            x: e.x - domGet.curPlayer().width() / 2,
            y: e.y - domGet.curPlayer().height() / 2
        };
    }

    return domGet;
});

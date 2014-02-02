/* 
	Set stuff that is in the DOM. This is where all state tracking is done.
*/
define(['dom/style', 'dom/get'], function(domStyle, domGet) {
		var domSet = {};
  
    domSet.makePlayer = function(pla) {
        // bug: first positon not set
        return '<div id="' + pla.id + '" class="player ' + (pla.is_cat ? 'cat ' : 'mouse ') + (pla.is_attacking ? 'attack ' : 'not-attack ') + '">' +
            '<div class="name">' + (pla.name || pla.id) + '</div>' + '<div class="hp"></div>' + '<div class="energy"></div>' + "</div>"
    };

    domSet.appendPlayerToWorld = function(pla) {
        $('#world').append(domSet.makePlayer(pla));
        domStyle.setPlayerCss();
    };

    domSet.log = function(msg) {
        console.log('<Logger>');
        console.log(msg.message);
        $('#messages').prepend('<div class="message ' + msg.type + '">' + msg.message + '</div>');
    };

    domSet.deletePlayer = function(plaId) {
        domGet.getPlayersElement(plaId).remove();
    };

    domSet.setAttacking = function(player) {
        var p = domGet.getPlayersElement(player.id)
        if (player.is_attacking) {
            p.addClass('attack');
            p.removeClass('not-attack');
        } else {
            p.removeClass('attack');
            p.addClass('not-attack');
        }
    };

    // DOM movement.
    domSet.movePlayer = function(player) {
        domGet.getPlayersElement(player.id).css('top', player.y)
        domGet.getPlayersElement(player.id).css('left', player.x)
    };


    // of any player
    domSet.setName = function(p) {
        domGet.getPlayersElement(p.id).find(".name").html(p.name)
    };

    domSet.createWorld = function(world) {
        var players = world.players.reduce(function(rt, pla) {
            return rt + domSet.makePlayer(pla);
        }, "");

        $('body').append('<div id="world">' + players + '</div><footer>A game using websockets by Karl Glaser</footer>');


        var chat = '<div id="chat"><div id="messages"></div>    <textarea id="msg-input"/><button id="msg-send">Send</button></div>';
        var nameChange = '<div id="name-change"><span class="head">Name:</span> <input id="name-input"/></div>';
        $('body').append('<div id="hud">' + chat + nameChange + '</div>');
    };
    return domSet;
});
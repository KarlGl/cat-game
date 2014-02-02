/* 
    Set stuff that is in the DOM. This is where all state tracking is done.
*/
define(['dom/style', 'dom/get'], function(domStyle, domGet) {
    var domSet = {};

    domSet.setAttacking = function(player) {
        var p = domGet.getPlayersElement(player.id)
        if (player.is_attacking) {
            p.addClass('attack');
        } else {
            p.removeClass('attack');
        }
    };

    domSet.setKilled = function(player) {
        var p = domGet.getPlayersElement(player.id)
        if (player.killed) {
            p.addClass('killed');
        } else {
            p.removeClass('killed');
        }
    };

    domSet.makePlayer = function(pla) {
        var style = 'style="left: ' + (Math.round(pla.x) || 0) + 'px; top:' + (Math.round(pla.y) || 0) + 'px;"';
        var id = 'id="' + pla.id + '"';

        var addClasses = function(el) {
            el.addClass('player');
            if (pla.is_cat)
                el.addClass('cat');
            else
                el.addClass('mouse');

            if (pla.is_attacking)
                el.addClass('attack');
            
            if (pla.killed)
                el.addClass('killed');

            return el;
        };
        var addId = function(el) {
            el.attr('id', pla.id);
            return el;
        };
        var addCss = function(el) {
            el.css('top', pla.y);
            el.css('left', pla.x);
            return el;
        };
        var player = addCss(addId(addClasses($('<div></div>')))).append('<div class="name">' + (pla.name || pla.id) + '</div>' + '<div class="hp"></div>' + '<div class="energy"></div>');
        $('#world').append(player);
    };

    domSet.appendPlayerToWorld = function(pla) {
        domSet.makePlayer(pla);
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

        $('body').append('<div id="world">' + '</div><footer>A game using websockets by Karl Glaser</footer>');

        world.players.forEach(function(pla) {
            domSet.makePlayer(pla);
        });


        var chat = '<div id="chat"><div id="messages"></div>    <textarea id="msg-input"/><button id="msg-send">Send</button></div>';
        var nameChange = '<div id="name-change"><span class="head">Name:</span> <input id="name-input"/></div>';
        $('body').append('<div id="hud">' + chat + nameChange + '</div>');
    };
    return domSet;
});

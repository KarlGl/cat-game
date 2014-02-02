define(function() {
    var cD = {};

    cD.sender = {};

    cD.sender.dispatcher = new WebSocketRails(window.server);

    cD.sender.dispatch = function(name, params, extraCb) {
        var success = function(response) {
            // console.log("<Logger> SUCCESS Triggered: ");
            // console.log(response);
            if (extraCb)
                extraCb(response);
        };

        var failure = function(response) {
            console.log("<Logger> FAIL: " + response);
        };
        this.dispatcher.trigger(name, params, success, failure);
    };

    cD.dom = {};
    cD.dom.get = {};
    cD.dom.style = {};

    cD.dom.log = function(msg) {
        console.log('<Logger>');
        console.log(msg.message);
        $('#messages').prepend('<div class="message ' + msg.type + '">' + msg.message + '</div>');
    };


    cD.dom.makePlayer = function(pla) {
        // bug: first positon not set
        return '<div id="' + pla.id + '" class="player ' + (pla.is_cat ? 'cat ' : 'mouse ') + (pla.is_attacking ? 'attack ' : 'not-attack ') + '">' +
            '<div class="name">' + (pla.name || pla.id) + '</div>' + '<div class="hp"></div>' + '<div class="energy"></div>' + "</div>"
    };


    cD.dom.appendPlayerToWorld = function(pla) {
        $('#world').append(cD.dom.makePlayer(pla));
        cD.dom.style.setPlayerCss();
    };

    cD.dom.deletePlayer = function(plaId) {
        cD.dom.get.getPlayersElement(plaId).remove();
    };

    cD.dom.get.getPlayersElement = function(playerId) {
        return $('#' + playerId);
    };

    cD.curPlayer = function() {
        return cD.dom.get.getPlayersElement(cD.state.playerId);
    };

    // STATE
    cD.state = {};
    cD.state.playerId = null;

    cD.dom.get.getName = function() {
        return cD.dom.get.getNameForPlayer(cD.state.playerId);
    };

    cD.dom.get.getNameForPlayer = function(id) {
        return cD.dom.get.getPlayersElement(id).find(".name").html() || id;
    };

    cD.state.setPlayerId = function(playerId) {
        cD.state.playerId = playerId;
    }

    // DOM movement.
    cD.dom.movePlayer = function(player) {
        cD.dom.get.getPlayersElement(player.id).css('top', player.y)
        cD.dom.get.getPlayersElement(player.id).css('left', player.x)
    }

    // pixels world is from edge of window
    cD.dom.get.worldOffset = function() {
        return $("#world").offset();
    };


    // of any player
    cD.setName = function(p) {
        cD.dom.get.getPlayersElement(p.id).find(".name").html(p.name)
    };
    // of current player
    cD.sender.setName = function(name) {
        cD.curPlayer().find(".name").html(name)
        cD.sender.dispatch('chat.set_name', {
            name: name
        });
    };

    cD.sender.attack = function() {
        cD.sender.dispatch('player.set_attacking', {
            is_attacking: true
        });
        setTimeout(function() {
            cD.sender.dispatch('player.set_attacking', {
                is_attacking: false
            });
        }, 700);
    };

    // Send to server
    cD.sender.updatePos = function(e) {
        var raw = {
            x: e.pageX - cD.dom.get.worldOffset().left,
            y: e.pageY - cD.dom.get.worldOffset().top
        };
        var pos = cD.translateCoords(raw);
        if (pos.x + cD.curPlayer().width() >= cD.world.width)
            pos.x = cD.world.width - cD.curPlayer().width() - 1;
        if (pos.x < 0)
            pos.x = 0;
        if (pos.y + cD.curPlayer().height() >= cD.world.height)
            pos.y = cD.world.height - cD.curPlayer().height() - 1;
        if (pos.y < 0)
            pos.y = 0;
        cD.sendPosition(pos);
    };

    // in ms
    cD.sender.throttleWait = 40;
    cD.sendPosition = _.throttle(function(pos) {
            cD.sender.dispatch('player.new_pos', pos);
        }, cD.sender.throttleWait, true);
    cD.sender.sendMsg = function() {
        cD.sender.dispatch('chat.msg', {
            msg: $("#msg-input").val()
        });
        $("#msg-input").val("");
    };
    cD.changeName = function() {
        console.log($("#name-input").val())
        cD.sender.setName($("#name-input").val());
    };
    
    cD.sender.triggerPing = function() {
        var start = new Date();
        cD.sender.dispatch('session.ping', {}, function() {
            var end = new Date();
            console.log("Ping: " + (end - start) + " ms");
        });
    };

    cD.translateCoords = function(e) {
        return {
            x: e.x - cD.curPlayer().width() / 2,
            y: e.y - cD.curPlayer().height() / 2
        };
    }


    cD.createWorld = function(world) {
        var players = world.players.reduce(function(rt, pla) {
            return rt + cD.dom.makePlayer(pla);
        }, "");

        $('body').append('<div id="world">' + players + '</div><footer>A game using websockets by Karl Glaser</footer>');


        var chat = '<div id="chat"><div id="messages"></div>	<textarea id="msg-input"/><button id="msg-send">Send</button></div>';
        var nameChange = '<div id="name-change"><span class="head">Name:</span>	<input id="name-input"/></div>';
        $('body').append('<div id="hud">' + chat + nameChange + '</div>');
        cD.afterWorldCb();
    };

    // Called after the world is created the first time.
    cD.afterWorldCb = function() {
        $('html').mousemove(cD.sender.updatePos);
        $('#world').css('width', cD.world.width);
        $('#world').css('height', cD.world.height);
        $('#world').css('margin-left', -cD.world.width / 2);
        $('#world').css('margin-top', -cD.world.height / 2);
        cD.dom.style.setPlayerCss();

        cD.sizeHud();
        $(window).resize(cD.sizeHud);
        $('#msg-send').click(cD.sender.sendMsg);
        $('#name-input').keyup(cD.changeName);
        cD.curPlayer().click(cD.sender.attack)
        $('#msg-input').focus();
        $('#msg-input').keyup(function(e) {
            if (e.keyCode === 13) {
            	cD.sender.sendMsg();
            }
        });
        setInterval(cD.sender.triggerPing, 3500);
    };

    cD.dom.style.setPlayerCss = function() {
        $('.cat').css('width', cD.cat.width);
        $('.cat').css('height', cD.cat.height);
        $('.mouse').css('width', cD.mouse.width);
        $('.mouse').css('height', cD.mouse.height);
    };

    cD.sizeHud = function() {
        $('#hud').css('height', $('#world').height());
        $('#hud').css('left', cD.dom.get.worldOffset().left + $('#world').width());
        $('#hud').css('top', cD.dom.get.worldOffset().top);
        $('#msg-input').css('width', $("#hud").width() - 6);
        $('#msg-send').css('height', $("#msg-input").height());
        $('#msg-send').css('width', '100%');
        $('#messages').css('height', $("#chat").height() - ($('#msg-input').outerHeight() + $('#msg-send').outerHeight()))
    };

    cD.setAttacking = function(player) {
        var p = cD.dom.get.getPlayersElement(player.id)
        if (player.is_attacking) {
            p.addClass('attack');
            p.removeClass('not-attack');
        } else {
            p.removeClass('attack');
            p.addClass('not-attack');
        }
    };

    cD.world = {};
    cD.world.width = 800;
    cD.world.height = 600;
    cD.cat = {};
    cD.cat.height = 150;
    cD.cat.width = 200;
    cD.mouse = {};
    cD.mouse.height = 50;
    cD.mouse.width = 50;

    cD.channel = cD.sender.dispatcher.subscribe('game');
    cD.channel.bind('logging', cD.dom.log);
    cD.sender.dispatch('session.get_id', {}, cD.state.setPlayerId);
    cD.sender.dispatch('player.get_all', {}, cD.createWorld);
    // join after getting the whole world so i wont add my own player again to the world
    cD.channel.bind('player_joined', cD.dom.appendPlayerToWorld);
    cD.channel.bind('player_left', cD.dom.deletePlayer);
    cD.channel.bind('player_moved', cD.dom.movePlayer);
    cD.channel.bind('player_name_changed', cD.setName);
    cD.channel.bind('player_attacking_changed', cD.setAttacking);
    return cD;
});

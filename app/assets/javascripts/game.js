// Chat Dispatcher.	
var a = function() {
    window.cD = {}

    cD.dispatcher = new WebSocketRails(window.server);

    cD.dispatch = function(name, params, extraCb) {

        var success = function(response) {
            // console.log("<Logger> SUCCESS: ");
            // console.log(response);
            if (extraCb)
                extraCb(response);
        }

        var failure = function(response) {
            console.log("<Logger> FAIL: " + response);
        }
        this.dispatcher.trigger(name, params, success, failure);
    };

    var log = function(msg) {
        console.log('<Logger RECIEVED>');
        console.log(msg.message);
        $('#messages').prepend('<div class="message ' + msg.type + '">' + msg.message + '</div>')
    }

    var genName = function() {
        return "Player" + Math.floor(Math.random() * 1000).toString();
    };
    cD.makePlayer = function(pla) {
        return '<div id="' + pla.id + '" class="player ' + (pla.is_cat ? 'cat ' : 'mouse ') + (pla.is_attacking ? 'attack ' : 'not-attack ') + '">' +
            '<div class="name">' + (pla.name || pla.id) + '</div>' + '<div class="hp"></div>' + '<div class="energy"></div>' + "</div>"
    };


    cD.appendPlayerToWorld = function(pla) {
        $('#world').append(cD.makePlayer(pla));
        cD.setPlayerCss();
    };

    cD.deletePlayer = function(plaId) {
        cD.getPlayersElement(plaId).remove();
    };

    cD.getPlayersElement = function(playerId) {
        return $('#' + playerId);
    };

    cD.curPlayer = function() {
        return cD.getPlayersElement(cD.state.playerId);
    };

    // STATE
    cD.state = {};
    cD.state.playerId = null;

    cD.getName = function() {
        return cD.getNameForPlayer(cD.state.playerId);
    };

    cD.getNameForPlayer = function(id) {
        return cD.getPlayersElement(id).find(".name").html() || id;
    };

    cD.setPlayerId = function(playerId) {
        cD.state.playerId = playerId;
    }

    // DOM movement.
    cD.movePlayer = function(player) {
        cD.getPlayersElement(player.id).css('top', player.y)
        cD.getPlayersElement(player.id).css('left', player.x)
    }

    // pixels world is from edge of window
    cD.worldOffset = function() {
        return $("#world").offset();
    };

    cD.sender = {};

    // of any player
    cD.setName = function(p) {
        cD.getPlayersElement(p.id).find(".name").html(p.name)
    };
    // of current player
    cD.sender.setName = function(name) {
        cD.curPlayer().find(".name").html(name)
        cD.dispatch('chat.set_name', {
            name: name
        });
    };

    cD.sender.attack = function() {
        cD.dispatch('chat.set_attacking', {
            is_attacking: true
        });
        setTimeout(function() {
            cD.dispatch('chat.set_attacking', {
                is_attacking: false
            });
        }, 700);
    };

    // Send to server
    cD.sender.updatePos = function(e) {
        var raw = {
            x: e.pageX - cD.worldOffset().left,
            y: e.pageY - cD.worldOffset().top
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
        cD.dispatch('chat.new_pos', pos);
    };

    cD.sender.sendMsg = function() {
        cD.dispatch('chat.msg', {
            msg: $("#msg-input").val()
        });
        $("#msg-input").val("");
    };
    cD.changeName = function() {
        console.log($("#name-input").val())
        cD.sender.setName($("#name-input").val());
    };
    cD.setNameOf

    cD.translateCoords = function(e) {
        return {
            x: e.x - cD.curPlayer().width() / 2,
            y: e.y - cD.curPlayer().height() / 2
        };
    }


    cD.createWorld = function(world) {
        var players = world.players.reduce(function(rt, pla) {
            return rt + cD.makePlayer(pla);
        }, "");

        $('body').append('<div id="world">' + players + '</div>');


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
        cD.setPlayerCss();

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
    };

    cD.setPlayerCss = function() {
        $('.cat').css('width', cD.cat.width);
        $('.cat').css('height', cD.cat.height);
        $('.mouse').css('width', cD.mouse.width);
        $('.mouse').css('height', cD.mouse.height);
    };

    cD.sizeHud = function() {
        $('#hud').css('height', $('#world').height());
        $('#hud').css('left', cD.worldOffset().left + $('#world').width());
        $('#hud').css('top', cD.worldOffset().top);
        $('#msg-input').css('width', $("#hud").width() - 6);
        $('#msg-send').css('height', $("#msg-input").height());
        $('#msg-send').css('width', '100%');
        $('#messages').css('height', $("#chat").height() - ($('#msg-input').outerHeight() + $('#msg-send').outerHeight()))
    };

    cD.setAttacking = function(player) {
        var p = cD.getPlayersElement(player.id)
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

    cD.channel = cD.dispatcher.subscribe('game');
    cD.channel.bind('logging', log);
    cD.dispatch('chat.get_id', {}, cD.setPlayerId);
    cD.dispatch('chat.get_all', {}, cD.createWorld);
    // join after getting the whole world so i wont add my own player again to the world
    cD.channel.bind('player_joined', cD.appendPlayerToWorld);
    cD.channel.bind('player_left', cD.deletePlayer);
    cD.channel.bind('player_moved', cD.movePlayer);
    cD.channel.bind('player_name_changed', cD.setName);
    cD.channel.bind('player_attacking_changed', cD.setAttacking);
};

a();

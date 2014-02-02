define(['sender', 'dom/get', 'statics'], function(sender, domGet, statics) {
    var cD = {};
    cD.sender = sender;

    cD.dom = {};
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
        domGet.getPlayersElement(plaId).remove();
    };


    // STATE
    cD.state = {};
    cD.state.playerId = null;

    cD.state.setPlayerId = function(playerId) {
        cD.state.playerId = playerId;
    };

    // DOM movement.
    cD.dom.movePlayer = function(player) {
        domGet.getPlayersElement(player.id).css('top', player.y)
        domGet.getPlayersElement(player.id).css('left', player.x)
    };


    // of any player
    cD.dom.setName = function(p) {
        domGet.getPlayersElement(p.id).find(".name").html(p.name)
    };

    cD.dom.createWorld = function(world) {
        var players = world.players.reduce(function(rt, pla) {
            return rt + cD.dom.makePlayer(pla);
        }, "");

        $('body').append('<div id="world">' + players + '</div><footer>A game using websockets by Karl Glaser</footer>');


        var chat = '<div id="chat"><div id="messages"></div>    <textarea id="msg-input"/><button id="msg-send">Send</button></div>';
        var nameChange = '<div id="name-change"><span class="head">Name:</span> <input id="name-input"/></div>';
        $('body').append('<div id="hud">' + chat + nameChange + '</div>');
        cD.afterWorldCb();
    };

    // Called after the world is created the first time.
    cD.afterWorldCb = function() {
        $('html').mousemove(cD.sender.updatePos);
        $('#world').css('width', statics.world.width);
        $('#world').css('height', statics.world.height);
        $('#world').css('margin-left', -statics.world.width / 2);
        $('#world').css('margin-top', -statics.world.height / 2);
        cD.dom.style.setPlayerCss();

        cD.dom.style.sizeHud();
        $(window).resize(cD.dom.style.sizeHud);
        $('#msg-send').click(cD.sender.sendMsg);
        $('#name-input').keyup(cD.sender.changeName);
        domGet.curPlayer().click(cD.sender.attack)
        $('#msg-input').focus();
        $('#msg-input').keyup(function(e) {
            if (e.keyCode === 13) {
                cD.sender.sendMsg();
            }
        });
        setInterval(cD.sender.triggerPing, 3500);
    };

    cD.dom.style.setPlayerCss = function() {
        $('.cat').css('width', statics.cat.width);
        $('.cat').css('height', statics.cat.height);
        $('.mouse').css('width', statics.mouse.width);
        $('.mouse').css('height', statics.mouse.height);
    };

    cD.dom.style.sizeHud = function() {
        $('#hud').css('height', $('#world').height());
        $('#hud').css('left', domGet.worldOffset().left + $('#world').width());
        $('#hud').css('top', domGet.worldOffset().top);
        $('#msg-input').css('width', $("#hud").width() - 6);
        $('#msg-send').css('height', $("#msg-input").height());
        $('#msg-send').css('width', '100%');
        $('#messages').css('height', $("#chat").height() - ($('#msg-input').outerHeight() + $('#msg-send').outerHeight()))
    };

    cD.dom.setAttacking = function(player) {
        var p = domGet.getPlayersElement(player.id)
        if (player.is_attacking) {
            p.addClass('attack');
            p.removeClass('not-attack');
        } else {
            p.removeClass('attack');
            p.addClass('not-attack');
        }
    };

    cD.receiver = {};
    cD.receiver.channel = cD.sender.dispatcher.subscribe('game');
    cD.receiver.channel.bind('logging', cD.dom.log);
    cD.sender.dispatch('session.get_id', {}, cD.state.setPlayerId);
    cD.sender.dispatch('player.get_all', {}, cD.dom.createWorld);
    // join after getting the whole world so i wont add my own player again to the world
    cD.receiver.channel.bind('player_joined', cD.dom.appendPlayerToWorld);
    cD.receiver.channel.bind('player_left', cD.dom.deletePlayer);
    cD.receiver.channel.bind('player_moved', cD.dom.movePlayer);
    cD.receiver.channel.bind('player_name_changed', cD.dom.setName);
    cD.receiver.channel.bind('player_attacking_changed', cD.dom.setAttacking);
    return cD;
});

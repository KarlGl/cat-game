/* 
    Link received worker messages to callbacks.
*/
define(['sender', 'dom/get', 'dom/style', 'dom/set', 'state'], function(sender, domGet, domStyle, domSet, otherState) {
    var receiver = {}
    // Called after the world is created the first time.
    receiver.afterWorldCb = function() {
        $('html').mousemove(sender.updatePos);
        domStyle.worldStyle();
        domStyle.setPlayerCss();

        domStyle.sizeHud();
        $(window).resize(domStyle.sizeHud);
        $('#msg-send').click(sender.sendMsg);
        $('#name-input').keyup(sender.changeName);
        $("#world").click(sender.attack)
        $('#msg-input').focus();
        $('#msg-input').keyup(function(e) {
            if (e.keyCode === 13) {
                sender.sendMsg();
            }
        });
        setInterval(sender.triggerPing, 3500);
    };

    receiver.channel = sender.dispatcher.subscribe('game');
    receiver.channel.bind('logging', domSet.log);
    sender.dispatch('session.get_id', {}, otherState.setPlayerId);
    sender.dispatch('player.get_all', {}, 
        function(world) {
            domSet.createWorld(world);
            receiver.afterWorldCb();
        });
    // join after getting the whole world so i wont add my own player again to the world
    receiver.channel.bind('player_joined', domSet.appendPlayerToWorld);
    receiver.channel.bind('player_left', domSet.deletePlayer);
    receiver.channel.bind('player_moved', domSet.movePlayer);
    receiver.channel.bind('player_name_changed', domSet.setName);
    receiver.channel.bind('player_attacking_changed', domSet.setAttacking);
    receiver.channel.bind('player_killed_changed', domSet.setKilled);
    return receiver;
});
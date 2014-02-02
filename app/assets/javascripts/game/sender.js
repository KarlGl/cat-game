define(['dom/get', 'statics'], function(domGet, statics) {
    sender = {};
    sender.dispatcher = new WebSocketRails(window.server);

    sender.dispatch = function(name, params, extraCb) {
        var success = function(response) {
            // console.log("<Logger> SUCCESS Triggered: ");
            // console.log(response);
            if (extraCb) {
                extraCb(response);
            }
        };

        var failure = function(response) {
            console.log("<Logger> FAIL: " + response);
        };
        this.dispatcher.trigger(name, params, success, failure);
    };
        // of current player
    sender.setName = function(name) {
        domGet.curPlayer().find(".name").html(name)
        sender.dispatch('chat.set_name', {
            name: name
        });
    };

    sender.attack = function() {
        sender.dispatch('player.set_attacking', {
            is_attacking: true
        });
        window.setTimeout(function() {
            sender.dispatch('player.set_attacking', {
                is_attacking: false
            });
        }, 700);
    };

    // Send to server
    sender.updatePos = function(e) {
        var raw = {
            x: e.pageX - domGet.worldOffset().left,
            y: e.pageY - domGet.worldOffset().top
        };
        var pos = domGet.translateCoords(raw);
        if (pos.x + domGet.curPlayer().width() >= statics.world.width)
            pos.x = statics.world.width - domGet.curPlayer().width() - 1;
        if (pos.x < 0)
            pos.x = 0;
        if (pos.y + domGet.curPlayer().height() >= statics.world.height)
            pos.y = statics.world.height - domGet.curPlayer().height() - 1;
        if (pos.y < 0)
            pos.y = 0;
        sender.sendPosition(pos);
    };

    // in ms
    sender.throttleWait = 40;
    sender.sendPosition = _.throttle(function(pos) {
        sender.dispatch('player.new_pos', pos);
    }, sender.throttleWait, true);
    sender.sendMsg = function() {
        sender.dispatch('chat.msg', {
            // shouldn't be in this module.
            msg: $("#msg-input").val()
        });
        $("#msg-input").val("");
    };

    sender.triggerPing = function() {
        var start = new Date();
        sender.dispatch('session.ping', {}, function() {
            var end = new Date();
            console.log("Ping: " + (end - start) + " ms");
        });
    };

    sender.changeName = function() {
        sender.setName($("#name-input").val());
    };

    return sender;
})
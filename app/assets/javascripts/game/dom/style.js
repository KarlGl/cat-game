/*
    Seting css on stuff with js? Goes here.
*/
define(['statics', 'dom/get'] ,function(statics, domGet) {
    domStyle = {};

    domStyle.worldStyle = function() {
        $('#world').css('width', statics.world.width);
        $('#world').css('height', statics.world.height);
        $('#world').css('margin-left', -statics.world.width / 2);
        $('#world').css('margin-top', -statics.world.height / 2);
    };
    domStyle.setPlayerCss = function() {
        $('.cat').css('width', statics.cat.width);
        $('.cat').css('height', statics.cat.height);
        $('.mouse').css('width', statics.mouse.width);
        $('.mouse').css('height', statics.mouse.height);
    };

    domStyle.sizeHud = function() {
        $('#hud').css('height', $('#world').height());
        $('#hud').css('left', domGet.worldOffset().left + $('#world').width());
        $('#hud').css('top', domGet.worldOffset().top);
        $('#msg-input').css('width', $("#hud").width() - 6);
        $('#msg-send').css('height', $("#msg-input").height());
        $('#msg-send').css('width', '100%');
        $('#messages').css('height', $("#chat").height() - ($('#msg-input').outerHeight() + $('#msg-send').outerHeight()))
    };

    return domStyle;
});

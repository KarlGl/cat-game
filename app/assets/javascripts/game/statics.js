/*
    Static variables for the game.
*/
define(function() {
    var statics = {}, cat = {}, mouse = {}, world = {};

    world.width = 800;
    world.height = 600;

    cat.height = 150;
    cat.width = 200;
    cat.attackTime = 700;
    cat.recoveryTime = cat.attackTime * 1.68;

    mouse.height = 50;
    mouse.width = 50;

    statics.world = world;
    statics.cat = cat;
    statics.mouse = mouse;
    return statics;
})
cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        type:0,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.node.on("touchstart", function (event) {
            self.node.dispatchEvent(new cc.Event.EventCustom("ButtonApi", true));
        }, this)
    },
});
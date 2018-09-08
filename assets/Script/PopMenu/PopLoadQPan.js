cc.Class({
    extends: cc.Component,

    properties: {
		button:cc.Node,
		label:cc.Node,
		file_label:cc.Node,
		bg_sprite:cc.Node,
    },
    onLoad () {
		var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
                var target = self.bg_sprite;
                var local=target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (rect.contains(local)){
                    cc.log("ok touch in the region......");
                }else{
                    cc.log("touch remove from parent");
                    self.node.active = false;
                }
            }
        }, self.bg_sprite);
	}
});
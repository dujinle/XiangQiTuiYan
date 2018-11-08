cc.Class({
    extends: cc.Component,

    properties: {
	   wait_label:cc.Node,
    },
    onLoad () {
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
			}
         }, this.node);
	},
	onExit(){
		this.node.destroy();
	},
	setStatus(msg){
		this.wait_label.getComponent(cc.Label).string = msg;
	}
});

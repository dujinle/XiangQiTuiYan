cc.Class({
    extends: cc.Component,

    properties: {
        bg_sprite:cc.Node,
		qpButton:cc.Node,
		tpButton:cc.Node,
		qpContent:cc.Node,
		tpContent:cc.Node,
    },
    onLoad () {
		this.qpContent.active = true;
		this.tpContent.active = false;
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
	tpButtonCB(){
		this.qpContent.active = false;
		this.tpContent.active = true;
	},
	qpButtonCB(){
		this.qpContent.active = true;
		this.tpContent.active = false;
	},
	onExit(){
		cc.log("onExit......");
		this.node.active = false;
		this.node.destroy();
	}
});

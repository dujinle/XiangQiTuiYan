cc.Class({
    extends: cc.Component,

    properties: {
       atlas:cc.SpriteAtlas,
	   wait_sprite:cc.Node,
	   wait_label:cc.Node,
	   anim:null,
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
	play(msg){
		this.wait_label.getComponent(cc.Label).string = msg;
		var spriteFrames = this.atlas.getSpriteFrames();
		this.anim = this.wait_sprite.addComponent(cc.Animation);
		var aclip = cc.AnimationClip.createWithSpriteFrames(spriteFrames,6);
		aclip.wrapMode = cc.WrapMode.Loop;
		aclip.name='anim'
		this.anim.addClip(aclip);
        this.anim.play('anim');
	},
	onExit(){
		this.node.destroy();
	},
	setStatus(msg){
		this.wait_label.getComponent(cc.Label).string = msg;
	}
});

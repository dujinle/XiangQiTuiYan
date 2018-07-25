cc.Class({
	extends: cc.Component,

	properties: {
		my_name:null,
		my_type:null,
		cnode:null,
	},

	// LIFE-CYCLE CALLBACKS:
	onLoad () {
		var self = this;
		this.sprite = this.node.getComponent(cc.Sprite);

		this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
			cc.log("start move the node");
			var delta = event.touch.getDelta();
			var parent_pos = self.cnode.getPosition();
			cc.log("parent_pos x:" + parent_pos.x + " y:" + parent_pos.y);
			var x = delta.x + parent_pos.x;
			var y = delta.y + parent_pos.y;
			cc.log("x:" + x + " y:" + y);
			self.cnode.setPosition(cc.p(x,y));
			self.cnode.opacity = 255;
			self.node.opacity = 255;
		},this.node);

		this.node.on(cc.Node.EventType.TOUCH_START, function () {
			cc.log("touch start");
			self.creat_node();
        }, this.node);
		
	},
	creat_node(){
		this.node.opacity = 0;
		this.cnode = new cc.Node('citem');
		var sp = this.cnode.addComponent(cc.Sprite);
		sp.spriteFrame = this.sprite.spriteFrame;
		var rparent = this.get_root_node();
		rparent.addChild(this.cnode);
		var position = this.get_positon_root();
		cc.log("touch start" + position.x + " " + position.y);
		this.cnode.setPosition(position);
		this.cnode.opacity = 100;
	},
	get_root_node(){
		var parent_node = this.node;
		while(parent_node.parent != null){
			parent_node = parent_node.parent;
		}
		return parent_node;
	},
	get_positon_root(){
		var x = this.node.getPosition().x;
		var y = this.node.getPosition().y;
		var parent_node = this.node.parent;
		while(parent_node != null){
			var parent_pos = parent_node.getPosition();
			cc.log(parent_pos.x + " " + parent_pos.y);
			x = x + parent_pos.x;
			y = y + parent_pos.y;
			cc.log(x + " add " + y);
			parent_node = parent_node.parent;
		}
		return cc.p(x,y);
	},
	start () {

	},

	// update (dt) {},
});

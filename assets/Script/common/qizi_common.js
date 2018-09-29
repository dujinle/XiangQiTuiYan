cc.Class({
	extends: cc.Component,

	properties: {
		back_sprite:cc.Sprite,
		key:null,
		from_pos:null,
		to_pos:null,
		start_pos:null,
	},
	onLoad () {
		var self = this;
		this.on_action();
	},
	off_action(){
		this.node.off(cc.Node.EventType.TOUCH_START);
	},
	on_action(){
		var self = this;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			cc.log("<qizi_base>touch start the node");
			var mask_sprite = g_root_node_com.from_sprite;
			mask_sprite.setPosition(self.node.getPosition());
			g_root_node_com.set_data(self.node);
			/*如果已经开始游戏则点击棋子之后暂时关闭其他棋子的事件*/
			if(g_root_node_com.game_status == true){
				g_root_node_com.deal_nodes_beside(self.node,false);
			}
		},this.node);
	}
});

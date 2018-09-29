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
			g_com.touch_mark.setPosition(self.node.getPosition());
			g_com.select_node = self.node;
			/*如果已经开始游戏则点击棋子之后暂时关闭其他棋子的事件*/
			if(g_com.game_is_start == true){
				for(var i = 0;i < g_com.initMap.length;i++){
					for(var j = 0;j < g_com.initMap[i].length;j++){
						if(g_com.initMap[i][j] != 0){
							var item = g_com.mans[g_com.initMap[i][j]];
							var qizi_node = item.node.getComponent("qizi_common");
							qizi_node.off_action();
						}
					}
				}
			}
			
		},this.node);
	}
});

cc.Class({
	extends: cc.Component,

	properties: {
		back_sprite:cc.Sprite,
	},
	off_action(){
		this.node.off("touchstart", this.event_function,this);
	},
	on_action(){
		var self = this;
		this.node.on("touchstart", this.event_function,this);
		
		/*
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			cc.log("<qizi_base>touch start the node");
			g_com.touch_mark.setPosition(self.node.getPosition());
			g_com.touch_mark.runAction(cc.show());
			g_com.select_node = g_com.mans[self.key];
			//如果已经开始游戏则点击棋子之后暂时关闭其他棋子的事件
			if(g_com.game_is_start == true){
				for(var i = 0;i < g_com.initMap.length;i++){
					for(var j = 0;j < g_com.initMap[i].length;j++){
						if(g_com.initMap[i][j] != 0){
							if(self.key == g_com.initMap[i][j]){
								continue;
							}
							var item = g_com.mans[g_com.initMap[i][j]];
							var qizi_node = item.node.getComponent("qizi_common");
							qizi_node.off_action();
						}
					}
				}
			}
		},this.node);
		*/
	},
	event_function(event){
		this.node.dispatchEvent(new cc.Event.EventCustom("pressed", true));
	}
});

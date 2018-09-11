cc.Class({
    extends: cc.Component,

    properties: {
		start_node:cc.Node,
		end_node:cc.Node,
		vector_2d:null,
		touch_ok:false,
		audio_source:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
		//初始化棋盘位置信息[10,9]
		this.vector_2d = this.init_vec2d(10,9);
		var areas = this.calc_qipan_jianju();
		var pos = this.start_node.getPosition();
		cc.log("<qipan_node>start node:",pos.x,pos.y);
		//初始化2维数组的位置信息
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				var x = pos.x + areas * j;
				var y = pos.y + areas * i;
				this.vector_2d[i][j] = cc.v2(x,y);
			}
		}
		var self = this;
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
				var target = event.getCurrentTarget();
				var org_local = target.convertToNodeSpaceAR(touch.getLocation());
				var start_node_pos = self.start_node.getPosition();
				var end_node_pos = self.end_node.getPosition();
				var width = Math.abs(end_node_pos.x - start_node_pos.x) + 100;
				var height = Math.abs(end_node_pos.y - start_node_pos.y) + 100;
				var rect = cc.rect(start_node_pos.x - 50,start_node_pos.y - 50,width,height);
				//if (cc.rectContainsPoint(rect, org_local)){
				if(rect.contains(org_local)){
					cc.log("<qipan_node> touch begin org_local: x:" + org_local.x + " y:" + org_local.y);
					self.touch_ok = true;
					return true;
				}
				self.touch_ok = false;
                return false;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
				var target = event.getCurrentTarget();
				var xd_local = target.convertToNodeSpaceAR(touch.getLocation());
				if(self.touch_ok == true){
					self.set_node_pos(xd_local);
				}
			}
         }, this.node);
    },
	set_node_pos(xd_local){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		var select_node = g_root_node_com.get_data();
		if(select_node == null){
			return;
		}
		var pos = this.get_real_position(xd_local);
		var real_pos = this.get_position(pos.x,pos.y);
		var xd_pos = this.get_qizi_position(select_node,real_pos);
		
		/*开始摆棋子阶段*/
		if(g_root_node_com.game_status == false){
			var move = cc.moveTo(0.2,xd_pos);
			var audio_play = cc.callFunc(this.play_audio,this);
			var spawn = cc.spawn(move,audio_play);
			select_node.runAction(spawn);
			var mask_move = cc.moveTo(0.2,xd_pos);
			var mask_sprite = g_root_node_com.from_sprite;
			mask_sprite.runAction(mask_move);
			var select_node_com = select_node.getComponent("qizi_base");
			select_node_com.from_pos = cc.v2(pos.x,pos.y);
			select_node_com.to_pos = cc.v2(pos.x,pos.y);
			this.touch_ok = false;
			g_root_node_com.add_select_qizi(select_node,pos);
		}else if(g_root_node_com.game_status == true){
			/*游戏开始了 点击棋盘位置确定棋子的走位*/
			var select_node_com = select_node.getComponent("qizi_base");
			g_root_node_com.deal_nodes_beside(select_node,true);
			/*判断棋子的移动位置是否有效*/
			var is_ok = select_node_com.ready_to_move(pos);
			if(is_ok == -1){
				cc.log("node:" + select_node_com.my_name + " canot move to the pos");
				return 0;
			}else if(is_ok == 0){
				this.touch_ok = false;
				g_root_node_com.update_move_pos(select_node,pos);
			}else if(is_ok == 1){
				this.touch_ok = false;
				g_root_node_com.update_move_pos(select_node,pos);
				var eat_node = select_node_com.eat_node;
				if(eat_node != null){
					var eat_node_com = eat_node.getComponent("qizi_base");
					var move = cc.moveTo(0.2,eat_node_com.yuandian);
					eat_node_com.off_action();
					eat_node.runAction(cc.sequence(cc.delayTime(0.2),move));
				}
			}
			cc.log("move node from x:" + select_node_com.from_pos.x  + " y:" + select_node_com.from_pos.y
				+ " to: x:" + select_node_com.to_pos.x + " y:" + select_node_com.to_pos.y
			);
			/*设置棋子移动位置*/
			var xd_pos = this.get_qizi_position(select_node,real_pos);
			var move = cc.moveTo(0.2,xd_pos);
			var audio_play = cc.callFunc(this.play_audio,this);
			var spawn = cc.spawn(move,audio_play);
			select_node.runAction(spawn);
			var mask_move = cc.moveTo(0.2,xd_pos);
			var mask_sprite = g_root_node_com.from_sprite;
			mask_sprite.runAction(mask_move);
		}
	},
	//获取相对于棋盘的棋子的相对位置
	get_qizi_position(qizi_node,real_pos){
		var qizi_pp_pos = qizi_node.parent.getPosition();
		cc.log("qizi_pp_pos  x:" + qizi_pp_pos.x + " y:" + qizi_pp_pos.y);
		var xd_pos = cc.v2(real_pos.x - qizi_pp_pos.x,real_pos.y - qizi_pp_pos.y);
		cc.log("xd_pos  x:" + xd_pos.x + " y:" + xd_pos.y);
		return xd_pos;
	},
	get_position(i,j){
		return this.vector_2d[i][j];
	},
	//修正点击的位置到棋盘的2d位置
	get_real_position(pos){
		var x = pos.x
		var y = pos.y;
		var near_pos = cc.v2(-1,-1);
		var near_dist = Math.exp(10);
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				var qipan_x = this.vector_2d[i][j].x;
				var qipan_y = this.vector_2d[i][j].y;
				var dist = Math.sqrt((x - qipan_x)*(x - qipan_x) + (y - qipan_y)*(y - qipan_y));
				//cc.log(qipan_x,qipan_y,i,j,dist);
				if(dist <= near_dist){
					near_dist = dist;
					near_pos = cc.v2(i,j);
				}
			}
		}
		return near_pos;
	},
	init_vec2d(row,col){
		var arr = new Array();
		for(var i = 0;i < row;i++){
			arr[i] = new Array();
			for(var j = 0;j < col;j++){
				arr[i][j] = 0;
			}
		}
		return arr;
	},
	play_audio(){
		var com = this.audio_source.getComponent(cc.AudioSource);
		com.play();
	},
	//计算棋盘每一个格子的间距是多大
	calc_qipan_jianju(){
		var spos = this.start_node.getPosition();
		var epos = this.end_node.getPosition();
		var x = epos.x - spos.x;
		var y = epos.y - spos.y;
		var areas = Math.floor(Math.sqrt(Math.abs(x * y)/72));
		return areas;
	}
});

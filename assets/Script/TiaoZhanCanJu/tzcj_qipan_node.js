cc.Class({
    extends: cc.Component,

    properties: {
		start_node:cc.Node,
		end_node:cc.Node,
		touch_mark:cc.Node,
		vector_2d:null,
		touch_ok:false,
		audio_source:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
		//初始化棋盘位置信息[10,9]
		g_com.touch_mark = this.touch_mark;
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
		var self = this;
		var pos = this.get_real_position(xd_local);
		var real_pos = this.get_position(pos.x,pos.y);
		
		/*开始摆棋子阶段*/
		if(g_com.game_is_start == true){
			/*游戏开始了 点击棋盘位置确定棋子的走位*/
			if(g_com.select_node.my != g_com.current_step){
				return;
			}
			this.touch_ok = false;
			var select_node = g_com.select_node.node;
			var select_node_com = select_node.getComponent("qizi_common");
			//其他棋子状态归位
			for(var i = 0;i < g_com.initMap.length;i++){
				for(var j = 0;j < g_com.initMap[i].length;j++){
					if(g_com.initMap[i][j] != 0){
						if(g_com.initMap[i][j] != select_node_com.key){
							var item = g_com.mans[g_com.initMap[i][j]];
							var qizi_node = item.node.getComponent("qizi_common");
							qizi_node.on_action();
						}
					}
				}
			}
			cc.log(g_com.select_node.cur_pos[0],g_com.select_node.cur_pos[1],pos.x,pos.y)
			var is_ok = g_com.bylaw[g_com.keys[select_node_com.key]](
					g_com.select_node.cur_pos[0],
					g_com.select_node.cur_pos[1],
					pos.x,pos.y,g_com.initMap,
					g_com.select_node.my);
			cc.log("move is ok:" + is_ok);
			/*判断棋子的移动位置是否有效*/
			if(is_ok == -1){
				cc.log("node:" + select_node.name + " canot move to the pos");
				return 0;
			}else if(is_ok == 1){
				var eat_node = g_com.mans[g_com.initMap[pos.x][pos.y]];
				var eat_node_com = eat_node.node.getComponent("qizi_common");
				eat_node.node.runAction(cc.hide());
				eat_node_com.off_action();
				g_com.select_node.eat_node = eat_node;
			}
			cc.log("move node from x:" + g_com.select_node.past_pos[0]  + " y:" + g_com.select_node.past_pos[1]
				+ " to: x:" + g_com.select_node.cur_pos[0] + " y:" + g_com.select_node.cur_pos[1]);
			
			g_com.initMap[g_com.select_node.cur_pos[0]][g_com.select_node.cur_pos[1]] = 0;
			g_com.initMap[pos.x][pos.y] = select_node_com.key;
			g_com.select_node.past_pos = g_com.select_node.cur_pos;
			g_com.select_node.cur_pos = [pos.x,pos.y];
			g_com.history[g_com.game_num++] = g_com.select_node;
			/*设置棋子移动位置*/
			var move = cc.moveTo(0.2,real_pos);
			var audio_play = cc.callFunc(this.play_audio,this);
			var spawn = cc.spawn(move,audio_play);
			select_node.runAction(spawn);
			var mask_move = cc.moveTo(0.2,real_pos);
			g_com.touch_mark.runAction(mask_move);
			setTimeout(function(){
				/*AI to move*/
				var ret = AI.getAlphaBeta(-Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,4,g_com.initMap,g_com.select_node.my * -1);
				cc.log(JSON.stringify(ret));
				var ai_node = g_com.mans[ret.key];
				var ai_node_pos = self.get_position(ret.x,ret.y);
				var ai_move = cc.moveTo(0.2,ai_node_pos);
				var ai_audio_play = cc.callFunc(self.play_audio,self);
				var spawn = cc.spawn(ai_move,ai_audio_play);
				ai_node.node.runAction(spawn);
				var mask_move = cc.moveTo(0.2,ai_node_pos);
				g_com.touch_mark.runAction(mask_move);
				if(g_com.initMap[ret.x][ret.y] != 0){
					var eat_node = g_com.mans[g_com.initMap[ret.x][ret.y]];
					var eat_node_com = eat_node.node.getComponent("qizi_common");
					eat_node.node.runAction(cc.hide());
					eat_node_com.off_action();
					ai_node.eat_node = eat_node;
				}
				g_com.initMap[ai_node.cur_pos[0]][ai_node.cur_pos[1]] = 0;
				g_com.initMap[ret.x][ret.y] = ret.key;
				ai_node.past_pos = ai_node.cur_pos;
				ai_node.cur_pos = [ret.x,ret.y];
				g_com.history[g_com.game_num++] = ai_node;
				g_com.current_step = g_com.start_juese;
			},500);
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

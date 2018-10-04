cc.Class({
    extends: cc.Component,

    properties: {
		start_node:cc.Node,
		end_node:cc.Node,
		touch_mark:cc.Node,
		vector_2d:null,
		press_node:null,
		touch_ok:false,
		
		audio_source:cc.Node,
		audio_click:cc.Node,
		audio_illegal:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
		this.node.on("pressed", this.switchRadio, this);
		//初始化棋盘位置信息[10,9]
		g_com.touch_mark = this.touch_mark;

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
					self.click_square(xd_local);
				}
			}
         }, this.node);
    },
	click_square(xd_local){
		var pos = this.get_real_position(xd_local);
		var select_node = this.press_node;

		/*开始摆棋子阶段*/
		if(g_com.game_is_start == true && select_node != null){
			/*游戏开始了 点击棋盘位置确定棋子的走位*/
			//其他棋子状态归位
			g_com.setOtherNodePressActive(select_node.name,true);
			var select_item = g_com.mans[select_node.name];
			
			/*判断棋子的移动位置是否有效*/
			var is_ok = g_com.bylaw[g_com.keys[select_node.name]](
					select_item.cur_pos[0],
					select_item.cur_pos[1],
					pos.x,pos.y,g_com.initMap,
					select_item.my);
			cc.log("node:" + select_item.key + " move is ok:" + is_ok);
			if(is_ok == -1){
				var click_audio = cc.callFunc(this.play_illegal,this);
				select_node.runAction(click_audio);
				return 0;
			}
			
			
			this.make_move(pos);
			this.make_ai_move(500);
			this.press_node = null;
			cc.log("move node from x:" + select_item.cur_pos[0]  + " y:" + select_item.cur_pos[1] + " to: x:" + pos.x + " y:" + pos.y);
			
		}
	},
	
	//修正点击的位置到棋盘的2d位置
	get_real_position(pos){
		var x = pos.x
		var y = pos.y;
		var near_pos = cc.v2(-1,-1);
		var near_dist = Math.exp(10);
		for(var i = 0;i < g_com.initMap.length;i++){
			for(var j = 0;j < g_com.initMap[i].length;j++){
				var qipan_pos = g_com.initPos(i,j);
				var dist = Math.sqrt((x - qipan_pos[0])*(x - qipan_pos[0]) + (y - qipan_pos[1])*(y - qipan_pos[1]));
				//cc.log(qipan_x,qipan_y,i,j,dist);
				if(dist <= near_dist){
					near_dist = dist;
					near_pos = cc.v2(i,j);
				}
			}
		}
		return near_pos;
	},
	make_ai_move(time){
		var self = this;
		setTimeout(function(){
			//AI to move
			var ret = AI.getAlphaBeta(-Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,4,g_com.initMap,g_com.start_juese * -1);
			cc.log(JSON.stringify(ret));
			var ai_item = g_com.mans[ret.key];
			var ai_node = g_com.manNodes[ret.key];
			
			var ai_node_pos = g_com.initPos(ret.x,ret.y);
			var ai_move = cc.moveTo(0.2,cc.v2(ai_node_pos[0],ai_node_pos[1]));
			var ai_audio_play = cc.callFunc(self.play_audio,self);
			var spawn = cc.spawn(ai_move,ai_audio_play);
			ai_node.runAction(spawn);
			var mask_move = cc.moveTo(0.2,cc.v2(ai_node_pos[0],ai_node_pos[1]));
			g_com.touch_mark.runAction(cc.sequence(cc.show(),mask_move));
			
			if(g_com.initMap[ret.x][ret.y] != 0){
				ai_item.eatKey = g_com.initMap[ret.x][ret.y];
				var eat_node = g_com.manNodes[ai_item.eatKey];
				var eat_node_com = eat_node.getComponent("qizi_common");
				eat_node.runAction(cc.hide());
				eat_node_com.off_action();
			}
			g_com.initMap[ai_item.cur_pos[0]][ai_item.cur_pos[1]] = 0;
			g_com.initMap[ret.x][ret.y] = ret.key;
			ai_item.past_pos = ai_item.cur_pos;
			ai_item.cur_pos = [ret.x,ret.y];
			g_com.history[g_com.game_num++] = util.deepClone(ai_item);
			g_com.current_step = g_com.start_juese;
		},time);
	},
	make_move(pos){
		var real_pos = g_com.initPos(pos.x,pos.y);
		var select_item = g_com.mans[this.press_node.name];
		select_item.eatKey = g_com.initMap[pos.x][pos.y];
		if(select_item.eatKey != 0){
			var eat_node = g_com.manNodes[select_item.eatKey];
			var eat_node_com = eat_node.getComponent("qizi_common");
			eat_node.runAction(cc.hide());
			eat_node_com.off_action();
		}
		
		g_com.initMap[select_item.cur_pos[0]][select_item.cur_pos[1]] = 0;
		g_com.initMap[pos.x][pos.y] = this.press_node.name;
		select_item.past_pos = select_item.cur_pos;
		select_item.cur_pos = [pos.x,pos.y];
		g_com.history[g_com.game_num++] = util.deepClone(select_item);
		
		/*设置棋子移动位置*/
		var move = cc.moveTo(0.2,cc.v2(real_pos[0],real_pos[1]));
		var audio_play = cc.callFunc(this.play_audio,this);
		var spawn = cc.spawn(move,audio_play);
		this.press_node.runAction(spawn);
		var mask_move = cc.moveTo(0.2,cc.v2(real_pos[0],real_pos[1]));
		g_com.touch_mark.runAction(cc.sequence(cc.show(),mask_move));
	},
	play_audio(){
		var com = this.audio_source.getComponent(cc.AudioSource);
		com.play();
	},
	play_click(){
		var com = this.audio_click.getComponent(cc.AudioSource);
		com.play();
	},
	play_illegal(){
		var com = this.audio_illegal.getComponent(cc.AudioSource);
		com.play();
	},
	switchRadio(event) {
		/*只可以点击自己的棋子*/
		var key = event.target.name;
		if(this.press_node == null && g_com.mans[key].my != g_com.start_juese){
			this.press_node = null;
			return;
		}
        this.press_node = event.target;
		g_com.setOtherNodePressActive(this.press_node.name,false);
		var click_audio = cc.callFunc(this.play_click,this);
		g_com.touch_mark.setPosition(this.press_node.getPosition());
		g_com.touch_mark.runAction(cc.spawn(cc.show(),click_audio));
		cc.log("press node:" + this.press_node.name);
    },
});

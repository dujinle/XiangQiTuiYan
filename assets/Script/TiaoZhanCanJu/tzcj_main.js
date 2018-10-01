cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		qipan:cc.Node,
		qizi_com_node:cc.Node,
		//按钮参数
		back_one_node:cc.Node,
		start_node:cc.Node,
		restart_button:cc.Node,
		//标签参数
		step_num_label:cc.Node,
    },
	onLoad(){
		for(var i = 0;i < g_com.initMap.length;i++){
			for(var j = 0;j < g_com.initMap[i].length;j++){
				var item = g_com.initMap[i][j];
				if(item != 0){
					var qizi_node = cc.instantiate(this.qizi_com_node);
					var qizi_node_com = qizi_node.getComponent("qizi_common");
					qizi_node_com.key = item;
					qizi_node_com.back_sprite.spriteFrame = g_assets[g_com.sprite_frame_name[item]];
					g_com.mans[item] = {
						'node':qizi_node,
						'my':0
					};
				}
			}
		}

		for(var key in g_com.mans){
			var item = g_com.mans[key];
			item.node.runAction(cc.hide());
			this.qipan.addChild(item.node);
		}
	},
    start () {
		var games = {
			"马跃檀溪":{
				"record":[
					"z0-8-4-1",
					"c0-5-8-1",
					"c1-4-8-1",
					"p0-3-8-1",
					"p1-3-7-1",
					"j0-0-5-1",
					"Z0-1-4-0",
					"Z1-2-5-0",
					"C0-3-3-0",
					"M0-9-5-0",
					"J0-9-3-0"
				],
				"content":"无相版马跃檀溪若是摆在街头，说白了就是坑你钱的。",
				"start":"1"
			}
		};
		this.onLoadCanJu(games["马跃檀溪"]);

	},
	off_one_button(flag){
		this.back_one_node.getComponent(cc.Button).interactable = flag;
		this.restart_button.getComponent(cc.Button).interactable = flag;
	},
	onLoadCanJu(data){
		cc.log("start load can ju game");
		for(var key in g_com.mans){
			var item = g_com.mans[key];
			var qizi_node = item.node.getComponent("qizi_common");
			qizi_node.off_action();
		}
		for(var i = 0;i < g_com.initMap.length;i++){
			for(var j = 0;j < g_com.initMap[i].length;j++){
				g_com.initMap[i][j] = 0;
			}
		}
		
		if(data != null){
			var self = this;
			g_com.current_step = parseInt(data['start']) == 1?1:-1;
			g_com.start_juese = g_com.current_step;
			var canju = data['record'];

			this.count = 0;
			this.back_callback = function(){
				var objs = canju[self.count].split("-");
				var x = parseInt(objs[1]);
				var y = parseInt(objs[2]);
				//mans {"node":node,"my":1,"past_pos":[x,y],"cur_pos":[x,y],"init_pos":[x,y]}
				g_com.mans[objs[0]].my = parseInt(objs[3]) == 1?1:-1;
				g_com.mans[objs[0]].past_pos = [x,y];
				g_com.mans[objs[0]].cur_pos = [x,y];
				g_com.mans[objs[0]].init_pos = [x,y];
				var item = g_com.mans[objs[0]].node;
				var item_com = item.getComponent("qizi_common");
				
				var qipan_node_com = self.qipan.getComponent("tzcj_qipan_node");
				var real_pos = qipan_node_com.get_position(x,y);
				
				g_com.initMap[x][y] = objs[0];
				item.runAction(cc.show());
				item.setPosition(real_pos);
				self.count = self.count + 1;
				if(self.count >= canju.length){
					self.unschedule(self.back_callback);
				}
			}
			this.schedule(this.back_callback,0.2,canju.length,0.000001);
		}
	},
	/*回退2步*/
	back_two(){
		var self = this;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(g_root_node_com.current_idx < 2){
			cc.log("棋子移动的步数不够");
			return;
		}
		this.count = 0;
		this.back_callback = function(){
			self.back_one();
			self.count = self.count + 1;
			if(self.count >= 2){
				self.unschedule(self.back_callback);
			}
			cc.log("history length:" +g_root_node_com.mhistory.length);
		}
		this.schedule(this.back_callback,0.5,2,0.000001);
	},
	/*回退一步*/
	back_one(){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(g_root_node_com.current_idx <= 0){
			cc.log("还没有开始移动棋子");
			return;
		}
		/*获取最后一步的棋子*/
		var back_node = g_root_node_com.mhistory[g_root_node_com.current_idx - 1];
		var node_com = back_node.getComponent("qizi_base");
		if(node_com.my_type == 'red'){
			g_root_node_com.current_step = "black";
		}else{
			g_root_node_com.current_step = "red";
		}
		/*移动的始末位置*/
		var from_pos = node_com.from_pos;
		var last_pos = node_com.to_pos;
		var qipan_node_com = this.qipan.getComponent("qipan_node");
		var real_pos = qipan_node_com.get_position(from_pos.x,from_pos.y);
		var xd_pos = qipan_node_com.get_qizi_position(back_node,real_pos);
		
		var move = cc.moveTo(0.2,xd_pos);
		back_node.runAction(move);
		var mask_move = cc.moveTo(0.2,xd_pos);
		var mask_sprite = g_root_node_com.from_sprite;
		mask_sprite.runAction(mask_move);
		node_com.from_pos = last_pos;
		node_com.to_pos = from_pos;
		g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = 0;
		g_root_node_com.qizi_2d[from_pos.x][from_pos.y] = back_node;
		cc.log("last:" + last_pos.x + " " + last_pos.y + " from:" + from_pos.x + " " + from_pos.y);
		/*如果这一步有棋子被吃 则还原被吃的棋子*/
		if(node_com.eat_node != null){
			g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = node_com.eat_node;
			g_root_node_com.select_node.push(node_com.eat_node);
			var eat_node_com = node_com.eat_node.getComponent("qizi_base");
			var position = qipan_node_com.get_position(last_pos.x,last_pos.y);
			var xdd_pos = qipan_node_com.get_qizi_position(node_com.eat_node,position);
			var move = cc.moveTo(0.2,xdd_pos);
			node_com.eat_node.runAction(move);
			eat_node_com.on_action();
		}
		g_root_node_com.current_idx = g_root_node_com.current_idx - 1;
		cc.log("history length:" +g_root_node_com.mhistory.length);
	},
	game_start(){
		cc.log("game_start");
		if(g_com.game_is_start == false){
			//开始游戏
			this.off_one_button(true);
			this.start_node.getChildByName("start").active = false;
			this.start_node.getChildByName("stop").active = true;
			g_com.game_is_start = true;
			//游戏开始 棋盘棋子添加点击事件
			for(var i = 0;i < g_com.initMap.length;i++){
				for(var j = 0;j < g_com.initMap[i].length;j++){
					if(g_com.initMap[i][j] != 0){
						var item = g_com.mans[g_com.initMap[i][j]];
						var qizi_node = item.node.getComponent("qizi_common");
						qizi_node.on_action();
					}
				}
			}
		}else{
			//停止游戏
			this.off_one_button(false);
			this.start_node.getChildByName("start").active = true;
			this.start_node.getChildByName("stop").active = false;
			g_com.game_is_start = false;
		}
	},
	update(dt){
		//var g_root_node = cc.director.getScene().getChildByName("RootNode");
		//var g_root_node_com = g_root_node.getComponent("root_node");
		this.step_num_label.getComponent(cc.Label).string = g_com.game_num;
	}
});

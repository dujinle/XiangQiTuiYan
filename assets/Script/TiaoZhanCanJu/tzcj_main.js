cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		qipan:cc.Node,
		qizi_room:cc.Node,
		//按钮参数
		back_one_node:cc.Node,
		start_node:cc.Node,
		clear_button:cc.Node,
		restart_button:cc.Node,
		//标签参数
		current_step_label:cc.Node,
		past_step_label:cc.Node,
		step_num_label:cc.Node,
    },
    start () {
		var games = {
			"马跃檀溪":{
				"record":[
					"兵1-8-4",
					"车1-5-8",
					"车1-4-8",
					"炮1-3-8",
					"炮1-3-7",
					"帅1-0-5",
					"兵2-1-4",
					"兵2-2-5",
					"车2-3-3",
					"马2-9-5",
					"帅2-9-3"
				],
				"content":"无相版马跃檀溪若是摆在街头，说白了就是坑你钱的。",
				"past":"black"
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
		var qizi_room_com = this.qizi_room.getComponent("tzcj_qizi_room");
		for(var i = 0 ;i < qizi_room_com.qizis.length;i++){
			var item = qizi_room_com.qizis[i];
			var item_com = item.getComponent("qizi_base");
			item_com.off_action();
		}
		if(data != null){
			var self = this;
			var g_root_node = cc.director.getScene().getChildByName("RootNode");
			var g_root_node_com = g_root_node.getComponent("root_node");
			var qizi_room_com = this.qizi_room.getComponent("tzcj_qizi_room");
			g_root_node_com.current_step = data['past'];
			var canju = data['record'];
			this.count = 0;
			this.back_callback = function(){
				var objs = canju[self.count].split("-");
				var label = g_qizi_obj[objs[0]].target;
				var x = parseInt(objs[1]);
				var y = parseInt(objs[2]);
				var item = qizi_room_com.get_qizi_node(label);
				if(item == null){
					return;
				}
				var item_com = item.getComponent("qizi_base");
				var qipan_node_com = self.qipan.getComponent("qipan_node");
				var real_pos = qipan_node_com.get_position(x,y);
				var xd_pos = qipan_node_com.get_qizi_position(item,real_pos);
				item_com.target = item_com.target + "_" + Date.now();
				item_com.from_pos = cc.v2(x,y);
				item_com.to_pos = cc.v2(x,y);
				item_com.start_pos = cc.v2(x,y);
				g_root_node_com.add_select_qizi(item,cc.v2(x,y));
				var move = cc.moveTo(0.2,xd_pos);
				item.runAction(move);
				self.count = self.count + 1;
				if(self.count >= canju.length){
					self.unschedule(self.back_callback);
				}
				cc.log("history length:" +g_root_node_com.mhistory.length);
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
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		g_root_node_com.set_data(null);
		if(g_root_node_com.game_status == false){
			//开始游戏
			this.clear_button.getComponent(cc.Button).interactable = false;
			this.off_one_button(true);
			this.start_node.getChildByName("start").active = false;
			this.start_node.getChildByName("stop").active = true;

			g_root_node_com.set_game_status(true);

			for(var i = 0;i < g_root_node_com.select_node.length;i++){
				var item = g_root_node_com.select_node[i];
				var item_com = item.getComponent("qizi_base");
				cc.log("select_node:" + item_com.my_name);
				item_com.on_action();
			}
		}else{
			//停止游戏
			this.off_one_button(false);
			this.clear_button.getComponent(cc.Button).interactable = true;
			this.start_node.getChildByName("start").active = true;
			this.start_node.getChildByName("stop").active = false;
			g_root_node_com.set_game_status(false);
		}
	},
	update(dt){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(g_root_node_com.current_step == "red"){
			this.current_step_label.getComponent(cc.Label).string = "黑";
			this.past_step_label.getComponent(cc.Label).string = "红";
		}else if(g_root_node_com.current_step == "black"){
			this.current_step_label.getComponent(cc.Label).string = "红";
			this.past_step_label.getComponent(cc.Label).string = "黑";
		}
		this.step_num_label.getComponent(cc.Label).string = g_root_node_com.current_idx;
	}
});

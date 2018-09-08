cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		qipan:cc.Node,
		qizi_room:cc.Node,
		//按钮参数
		back_two_node:cc.Node,
		back_one_node:cc.Node,
		forward_node:cc.Node,
		forward_two_node:cc.Node,
		start_node:cc.Node,
		clear_button:cc.Node,
		//标签参数
		current_step_label:cc.Node,
		past_step_label:cc.Node,
		step_num_label:cc.Node,
	},
	onLoad () {
		this.off_one_button(false);
		this.clear_button.getComponent(cc.Button).interactable = true;
		this.current_step_label.getComponent(cc.Label).string = "";
		this.past_step_label.getComponent(cc.Label).string = "";
		this.step_num_label.getComponent(cc.Label).string = "";
	},
	off_one_button(flag){
		this.back_two_node.getComponent(cc.Button).interactable = flag;
		this.back_one_node.getComponent(cc.Button).interactable = flag;
		this.forward_node.getComponent(cc.Button).interactable = flag;
		this.forward_two_node.getComponent(cc.Button).interactable = flag;
	},
	get_pos_from_parent(node){
		if(node.parent != null){
			var p_pos = node.parent.getPosition();
			return cc.v2(node.x + p_pos.x,node.y + p_pos.y);
		}else{
			return node.getPosition();
		}
	},
	/*游戏结束棋子归位到原来的位置*/
	clear_qizi(){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		for(var i = 0;i < g_root_node_com.select_node.length;i++){
			var item = g_root_node_com.select_node[i];
			var item_com = item.getComponent("qizi_base");
			var move = cc.moveTo(0.2,item_com.yuandian);
			item.runAction(move);
			cc.log("select_node:" + item_com.my_name);
			item_com.off_action();
			item_com.on_action();
		}
		var qizi_room_com = this.qizi_room.getComponent("qizi_control");
		for(var i = 0 ;i < qizi_room_com.qizis.length;i++){
			var item = qizi_room_com.qizis[i];
			var item_com = item.getComponent("qizi_base");
			item_com.off_action();
			item_com.on_action();
		}
		g_root_node_com.select_node.splice(0,g_root_node_com.select_node.length);
		g_root_node_com.mhistory.splice(0,g_root_node_com.mhistory.length);
		g_root_node_com.current_step = null;
		g_root_node_com.current_idx = 0;
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				g_root_node_com.qizi_2d[i][j] = 0;
			}
		}
		g_root_node_com.from_sprite.setPosition(cc.v2(500,500));
		g_root_node_com.end_sprite.setPosition(cc.v2(500,500));
		this.off_one_button(false);
		this.start_node.getChildByName("start").active = true;
		this.start_node.getChildByName("stop").active = false;
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
	forward_two(){
		var self = this;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(g_root_node_com.current_idx + 1 >= g_root_node_com.mhistory.length){
			cc.log("已经移动到最后的位置");
			return;
		}
		this.count = 0;
		this.forward_callback = function(){
			self.forward_one();
			self.count = self.count + 1;
			if(self.count >= 2){
				self.unschedule(self.forward_callback);
			}
			cc.log("history length:" +g_root_node_com.mhistory.length);
		}
		this.schedule(this.forward_callback,0.5,2,0.000001);
	},
	/*回退之后前进一步*/
	forward_one(){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(g_root_node_com.current_idx >= g_root_node_com.mhistory.length){
			cc.log("已经移动到最后的位置");
			return;
		}
		/*获取最后一步的棋子*/
		var back_node = g_root_node_com.mhistory[g_root_node_com.current_idx];
		var node_com = back_node.getComponent("qizi_base");
		g_root_node_com.current_step = node_com.my_type;
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
		/*这一步有棋子被吃*/
		if(node_com.eat_node != null){
			var eat_node_com = node_com.eat_node.getComponent("qizi_base");
			var move = cc.moveTo(0.2,eat_node_com.yuandian);
			eat_node_com.off_action();
			node_com.eat_node.runAction(cc.sequence(cc.delayTime(0.2),move));
			g_root_node_com.remove_node(node_com.eat_node);
		}
		g_root_node_com.current_idx = g_root_node_com.current_idx + 1;
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
			var qizi_room_com = this.qizi_room.getComponent("qizi_control");
			for(var i = 0 ;i < qizi_room_com.qizis.length;i++){
				var item = qizi_room_com.qizis[i];
				var item_com = item.getComponent("qizi_base");
				item_com.off_action();
			}
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
	exit(){
		cc.director.loadScene("StartGameScene");
	},
	load_qipan(){
		var size = cc.winSize;
		this.pop_qipan = cc.instantiate(g_assets["PopLoadQPan"]);
		this.node.addChild(this.pop_qipan);
		this.pop_qipan.setPosition(this.node.convertToNodeSpaceAR(cc.v2(size.width/2,size.height/2)));
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
		if(g_root_node_com.current_idx == 0){
			this.step_num_label.getComponent(cc.Label).string = "";
		}else{
			this.step_num_label.getComponent(cc.Label).string = g_root_node_com.current_idx;
		}
	}
});

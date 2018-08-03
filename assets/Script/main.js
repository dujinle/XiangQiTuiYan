cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		start_node:cc.Node,
		end_node:cc.Node,
		qipan:cc.Node,
		qizi_room:cc.Node,
		back_two_node:cc.Node,
		back_one_node:cc.Node,
		forward_node:cc.Node,
		forward_two_node:cc.Node,
		start_node:cc.Node,
		current_node:cc.Node,
		past_node:cc.Node,
		current_step_node:cc.Node,
		clear_button:cc.Node,
	},

	onLoad () {
		this.start_flag = false;
		this.back_two_node.getComponent(cc.Button).interactable = false;
		this.back_one_node.getComponent(cc.Button).interactable = false;
		this.forward_node.getComponent(cc.Button).interactable = false;
		this.forward_two_node.getComponent(cc.Button).interactable = false;
		this.clear_button.getComponent(cc.Button).interactable = false;
		this.current_node.getComponent(cc.Label).string = "";
		this.past_node.getComponent(cc.Label).string = "";
		this.current_step_node.getComponent(cc.Label).string = "";
	},

	get_pos_from_parent(node){
		if(node.parent != null){
			var p_pos = node.parent.getPosition();
			return cc.p(node.x + p_pos.x,node.y + p_pos.y);
		}else{
			return node.getPosition();
		}
	},
	back_two(){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		var idx = g_root_node_com.current_idx;
		if(idx < 1){
			cc.log("棋子移动的步数不够");
			return;
		}
		this.count = 0;
		this.callback = function(){
			var tnode = g_root_node_com.mhistory[g_root_node_com.current_idx];
			var node = tnode.node.getComponent("qizi_base");
			if(tnode.step == 'red'){
				g_root_node_com.current_step = "black";
			}else{
				g_root_node_com.current_step = "red";
			}
			var from_pos = tnode['from'];
			var last_pos = tnode['last'];
			var position = g_root_node_com.get_position(from_pos.x,from_pos.y);
			var parent_pos = tnode.node.parent.getPosition();
			var move = cc.moveTo(0.2,cc.p(position.x - parent_pos.x,position.y - parent_pos.y));
			g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = 0;
			g_root_node_com.qizi_2d[from_pos.x][from_pos.y] = tnode.node;
			node.from_pos = last_pos;
			node.last_pos = from_pos;
			cc.log("last:" + node.last_pos.x + " " + node.last_pos.y + " from:" + node.from_pos.x + " " + node.from_pos.y);
			tnode.node.runAction(move);
			if(tnode.eat != null){
				g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = tnode.eat;
				g_root_node_com.select_node.push(tnode.eat);
				var eat_node = tnode.eat.getComponent("qizi_base");
				cc.log("eat :" + eat_node.last_pos.x + " " + eat_node.last_pos.y + " from:" +  eat_node.from_pos.x + " " + eat_node.from_pos.y);
				var position = g_root_node_com.get_position(last_pos.x,last_pos.y);
				var parent_pos = tnode.eat.parent.getPosition();
				var move = cc.moveTo(0.2,cc.p(position.x - parent_pos.x,position.y - parent_pos.y));
				tnode.eat.runAction(move);
				eat_node.init_ontouch();
			}
			g_root_node_com.current_idx = g_root_node_com.current_idx - 1;
			this.count = this.count + 1;
			if(this.count >= 2){
				this.unschedule(this.callback);
			}
		}
		this.schedule(this.callback,0.5,2,0.000001);
	},
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
			item_com.prev_onmove();
		}
		var qizi_room_com = this.qizi_room.getComponent("qizi_control");
		for(var i = 0 ;i < qizi_room_com.qizis.length;i++){
			var item = qizi_room_com.qizis[i];
			var item_com = item.getComponent("qizi_base");
			item_com.off_action();
			item_com.prev_onmove();
		}
		g_root_node_com.select_node.splice(0,g_root_node_com.select_node.length);
		g_root_node_com.mhistory.splice(0,g_root_node_com.mhistory.length);
		g_root_node_com.current_step = null;
		g_root_node_com.current_idx = -1;
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				g_root_node_com.qizi_2d[i][j] = 0;
			}
		}
		this.start_flag = false;
		this.back_two_node.getComponent(cc.Button).interactable = false;
		this.back_one_node.getComponent(cc.Button).interactable = false;
		this.forward_node.getComponent(cc.Button).interactable = false;
		this.forward_two_node.getComponent(cc.Button).interactable = false;
		this.start_node.getChildByName("start").active = true;
		this.start_node.getChildByName("stop").active = false;
	},
	back_one(){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		var idx = g_root_node_com.current_idx;
		if(idx < 0){
			cc.log("还没有开始移动棋子");
			return;
		}
		var tnode = g_root_node_com.mhistory[g_root_node_com.current_idx];
		var node = tnode.node.getComponent("qizi_base");
		if(tnode.step == 'red'){
			g_root_node_com.current_step = "black";
		}else{
			g_root_node_com.current_step = "red";
		}
		var from_pos = tnode['from'];
		var last_pos = tnode['last'];
		var position = g_root_node_com.get_position(from_pos.x,from_pos.y);
		var parent_pos = tnode.node.parent.getPosition();
		var move = cc.moveTo(0.2,cc.p(position.x - parent_pos.x,position.y - parent_pos.y));
		g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = 0;
		g_root_node_com.qizi_2d[from_pos.x][from_pos.y] = tnode.node;
		node.from_pos = last_pos;
		node.last_pos = from_pos;
		cc.log("last:" + node.last_pos.x + " " + node.last_pos.y + " from:" + node.from_pos.x + " " + node.from_pos.y);
		tnode.node.runAction(move);
		if(tnode.eat != null){
			g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = tnode.eat;
			g_root_node_com.select_node.push(tnode.eat);
			var eat_node = tnode.eat.getComponent("qizi_base");
			var position = g_root_node_com.get_position(last_pos.x,last_pos.y);
			cc.log("eat :" + eat_node.last_pos.x + " " + eat_node.last_pos.y + " from:" +  eat_node.from_pos.x + " " + eat_node.from_pos.y);
			var parent_pos = tnode.eat.parent.getPosition();
			var move = cc.moveTo(0.2,cc.p(position.x - parent_pos.x,position.y - parent_pos.y));
			tnode.eat.runAction(move);
			eat_node.init_ontouch();
		}
		g_root_node_com.current_idx = g_root_node_com.current_idx - 1;
	},
	forward_two(){
		return;
	},
	forward(){
		return;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		var idx = g_root_node_com.current_idx + 1;
		if(idx >= g_root_node_com.mhistory.length){
			cc.log("已经移动到最后的位置");
			return;
		}
		var tnode = g_root_node_com.mhistory[idx];
		var node = tnode.node.getComponent("qizi_base");
		if(tnode.step == 'red'){
			g_root_node_com.current_step = "black";
		}else{
			g_root_node_com.current_step = "red";
		}
		var from_pos = tnode['from'];
		var last_pos = tnode['last'];
		var position = g_root_node_com.get_position(last_pos.x,last_pos.y);
		var parent_pos = tnode.node.parent.getPosition();
		var move = cc.moveTo(0.2,cc.p(position.x - parent_pos.x,position.y - parent_pos.y));
		g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = tnode.node;
		g_root_node_com.qizi_2d[from_pos.x][from_pos.y] = 0;
		cc.log("last:" + node.last_pos.x + " " + node.last_pos.y + " from:" + node.from_pos.x + " " + node.from_pos.y);
		tnode.node.runAction(move);
		if(tnode.eat != null){
			//g_root_node_com.qizi_2d[last_pos.x][last_pos.y] = tnode.eat;
			var eat_node = tnode.eat.getComponent("qizi_base");
			var move = cc.moveTo(0.2,eat_node.yuandian);
			tnode.eat.runAction(move);
		}
		g_root_node_com.current_idx = g_root_node_com.current_idx + 1;
	},
	game_start(){
		cc.log("game_start");
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(this.start_flag == false){
			//开始游戏
			this.clear_button.getComponent(cc.Button).interactable = true;
			this.back_two_node.getComponent(cc.Button).interactable = true;
			this.back_one_node.getComponent(cc.Button).interactable = true;
			this.forward_node.getComponent(cc.Button).interactable = true;
			this.forward_two_node.getComponent(cc.Button).interactable = true;
			this.start_flag = true;
			this.start_node.getChildByName("start").active = false;
			this.start_node.getChildByName("stop").active = true;
			var qizi_room_com = this.qizi_room.getComponent("qizi_control");
			for(var i = 0 ;i < qizi_room_com.qizis.length;i++){
				var item = qizi_room_com.qizis[i];
				var item_com = item.getComponent("qizi_base");
				item_com.off_action();
			}
			for(var i = 0;i < g_root_node_com.select_node.length;i++){
				var item = g_root_node_com.select_node[i];
				var item_com = item.getComponent("qizi_base");
				cc.log("select_node:" + item_com.my_name);
				item_com.init_ontouch();
			}
		}else{
			//停止游戏
			this.start_flag = false;
			this.clear_button.getComponent(cc.Button).interactable = false;
			this.back_two_node.getComponent(cc.Button).interactable = false;
			this.back_one_node.getComponent(cc.Button).interactable = false;
			this.forward_node.getComponent(cc.Button).interactable = false;
			this.forward_two_node.getComponent(cc.Button).interactable = false;
			this.start_node.getChildByName("start").active = true;
			this.start_node.getChildByName("stop").active = false;
		}
	},
	exit(){
		cc.director.end();
	},
	update(dt){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(g_root_node_com.current_step == "red"){
			this.current_node.getComponent(cc.Label).string = "黑";
			this.past_node.getComponent(cc.Label).string = "红";
		}else if(g_root_node_com.current_step == "black"){
			this.current_node.getComponent(cc.Label).string = "红";
			this.past_node.getComponent(cc.Label).string = "黑";
		}
		if(g_root_node_com.current_idx == -1){
			this.current_step_node.getComponent(cc.Label).string = "";
		}else{
			this.current_step_node.getComponent(cc.Label).string = g_root_node_com.current_idx + 1;
		}
	}
});

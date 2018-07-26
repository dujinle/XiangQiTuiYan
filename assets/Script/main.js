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
	back_one(){},
	forward_two(){},
	forward(){},
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
			this.current_step_node.getComponent(cc.Label).string = g_root_node_com.current_idx;
		}
	}
});

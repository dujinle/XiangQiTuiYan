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
	onLoadCanJu(data){
		cc.log("start load can ju game");
		var qizi_room_com = this.qizi_room.getComponent("tzcj_qizi_room");
		for(var i = 0 ;i < qizi_room_com.qizis.length;i++){
			var item = qizi_room_com.qizis[i];
			var item_com = item.getComponent("qizi_base");
			item_com.off_action();
		}
		if(data != null){
			var g_root_node = cc.director.getScene().getChildByName("RootNode");
			var g_root_node_com = g_root_node.getComponent("root_node");
			var qizi_room_com = this.qizi_room.getComponent("tzcj_qizi_room");
			g_root_node_com.current_step = data['past'];
			var canju = data['record'];
			for(var i = 0;i < canju.length;i++){
				var objs = canju[i].split("-");
				if(objs.length != 3){
					continue;
				}
				var label = g_qizi_obj[objs[0]].target;
				var x = parseInt(objs[1]);
				var y = parseInt(objs[2]);
				var item = qizi_room_com.get_qizi_node(label);
				if(item == null){
					continue;
				}
				var item_com = item.getComponent("qizi_base");
				var qipan_node_com = this.qipan.getComponent("qipan_node");
				var real_pos = qipan_node_com.get_position(x,y);
				var xd_pos = qipan_node_com.get_qizi_position(item,real_pos);
				item_com.target = item_com.target + "_" + Date.now();
				item_com.from_pos = cc.v2(x,y);
				item_com.to_pos = cc.v2(x,y);
				item_com.start_pos = cc.v2(x,y);
				g_root_node_com.add_select_qizi(item,cc.v2(x,y));
				var move = cc.moveTo(0.2,xd_pos);
				item.runAction(move);
			}
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

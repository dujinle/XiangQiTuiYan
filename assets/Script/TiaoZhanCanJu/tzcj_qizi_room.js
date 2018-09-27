cc.Class({
    extends: cc.Component,

    properties: {
		layout:cc.Node,
		qizis:{
			default:[],
			type:cc.Node,
		},
		from_sprite:cc.Node,
		end_sprite:cc.Node,
    },
    onLoad () {
		cc.log("onLoad " + this.node.name);
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		g_root_node_com.from_sprite = this.from_sprite;
		g_root_node_com.end_sprite = this.end_sprite;
		for(var i = 0;i < g_com.initMap.length;i++){
			for(var j = 0;j < g_com.initMap[i].length;j++){
				var item = g_com.initMap[i][j];
				if(item != 0){
					var type = g_com.keys[item];
					var cnode = new cc.Node(item);
					var sp = cnode.addComponent(cc.Sprite);
					sp.spriteFrame = g_assets[g_com.sprite_frame_name[item]];
					var com = cnode.addComponent("qizi_base");
					com.my_name = item;
					com.my_type = type;
					g_com.mans[item] = {
						'node':cnode,
						'my':0
					};
				}
			}
		}
		for(var key in g_com.mans){
			var item = g_com.mans[key];
			item.node.active = false;
			this.node.addChild(item.node);
		}
		/*
		for(var i = 0;i < this.layout.children.length;i++){
			var item = this.layout.children[i];
			var sprite = item.getComponent(cc.Sprite);
			var sprite_name = sprite.spriteFrame.name;
			var qizi_obj = g_qizi_obj[sprite_name];
			cc.log(JSON.stringify(qizi_obj),item.getPosition().x,item.getPosition().y);

			for(var j = 0;j < qizi_obj.num;j++){
				var cnode = new cc.Node(qizi_obj.name + "-" + qizi_obj.type + "-" + j);
				var sp = cnode.addComponent(cc.Sprite);
				sp.spriteFrame = sprite.spriteFrame;
				
				var com = cnode.addComponent("qizi_base");
				com.my_name = qizi_obj.name;
				com.my_type = qizi_obj.type;
				com.target = qizi_obj.target;
				this.qizis.push(cnode);
				cnode.setPosition(item.getPosition());
			}
		}
		for(var i = 0;i < this.qizis.length;i++){
			var item = this.qizis[i];
			this.node.addChild(item);
		}
		*/
	},
	get_all_path(color){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		var all_paths = {};
		for(var i = 0;i < g_root_node_com.select_node.length;i++){
			var item = g_root_node_com.select_node[i];
			var item_com = item.getComponent("qizi_base");
			if(item_com.my_type == color){
				if(item_com.my_name == "兵"){
					var path = [];
					if(g_root_node_com.my == color){
						//兵已经过河了
						if(item_com.to_pos.x >= 5){
							if(item_com.to_pos.y - 1 >= 0){
								var ret = item_com.ready_to_move(cc.v2(item_com.to_pos.x,item_com.to_pos.y - 1));
								if(ret != -1){
									path.push(cc.v2(item_com.to_pos.x,item_com.to_pos.y - 1));
								}
							}
							if(item_com.to_pos.y + 1 <= 8){
								var ret = item_com.ready_to_move(cc.v2(item_com.to_pos.x,item_com.to_pos.y + 1));
								if(ret != -1){
									path.push(cc.v2(item_com.to_pos.x,item_com.to_pos.y + 1));
								}
							}
						}
						if(item_com.to_pos.x + 1 <= 9){
							var ret = item_com.ready_to_move(cc.v2(item_com.to_pos.x + 1,item_com.to_pos.y));
							if(ret != -1){
								path.push(cc.v2(item_com.to_pos.x + 1,item_com.to_pos.y));
							}
						}
					}
					else{
						//兵已经过河了
						if(item_com.to_pos.x <= 4){
							if(item_com.to_pos.y - 1 >= 0){
								var ret = item_com.ready_to_move(cc.v2(item_com.to_pos.x,item_com.to_pos.y - 1));
								if(ret != -1){
									path.push(cc.v2(item_com.to_pos.x,item_com.to_pos.y - 1));
								}
							}
							if(item_com.to_pos.y + 1 <= 8){
								var ret = item_com.ready_to_move(cc.v2(item_com.to_pos.x,item_com.to_pos.y + 1));
								if(ret != -1){
									path.push(cc.v2(item_com.to_pos.x,item_com.to_pos.y + 1));
								}
							}
						}
						if(item_com.to_pos.x - 1 >= 0){
							var ret = item_com.ready_to_move(cc.v2(item_com.to_pos.x - 1,item_com.to_pos.y));
							if(ret != -1){
								path.push(cc.v2(item_com.to_pos.x - 1,item_com.to_pos.y));
							}
						}
					}
					all_paths[item_com.my_name] = path;
				}
				else if(item_com.my_name == "炮"){
					var path = [];
					/*向上检测*/
					for(var i = item_com.to_pos.x + 1;i <= 9;i++){
						var pos = cc.v2(i,item_com.to_pos.y);
						var ret = item_com.ready_to_move(pos);
						if(ret != -1){
							path.push(pos);
						}
					}
					/*向下检测*/
					for(var i = item_com.to_pos.x - 1;i >= 0;i--){
						var pos = cc.v2(i,item_com.to_pos.y);
						var ret = item_com.ready_to_move(pos);
						if(ret != -1){
							path.push(pos);
						}
					}
					/*向左检测*/
					for(var i = item_com.to_pos.y - 1;i >= 0;i--){
						var pos = cc.v2(item_com.to_pos.x,i);
						var ret = item_com.ready_to_move(pos);
						if(ret != -1){
							path.push(pos);
						}
					}
					/*向右检测*/
					for(var i = item_com.to_pos.y + 1;i <= 8;i++){
						var pos = cc.v2(item_com.to_pos.x,i);
						var ret = item_com.ready_to_move(pos);
						if(ret != -1){
							path.push(pos);
						}
					}
					all_paths[item_com.my_name] = path;
				}
				else if(item_com.my_name == "马"){
					var path = [];
					/*左前检测*/
					for(var i = item_com.to_pos.x - 2;i <= item_com.to_pos.x + 2 && i <= 9;i++){
						for(var j = item_com.to_pos.y - 2;j <= item_com.to_pos.y + 2 && j <= 8;j++){
							var pos = cc.v2(i,j);
							var ret = item_com.ready_to_move(pos);
							if(ret != -1){
								path.push(pos);
							}
						}
					}
					all_paths[item_com.my_name] = path;
				}
				else if(item_com.my_name == "车"){
					var path = [];
					/*向上下检测*/
					for(var i = 0;i <= 9;i++){
						if(i == item_com.to_pos.x){
							continue;
						}
						var pos = cc.v2(i,item_com.to_pos.y);
						var ret = item_com.ready_to_move(pos);
						if(ret != -1){
							path.push(pos);
						}
					}
					/*向左右检测*/
					for(var i = 0;i <= 8;i++){
						if(i == item_com.to_pos.y){
							continue;
						}
						var pos = cc.v2(item_com.to_pos.x,i);
						var ret = item_com.ready_to_move(pos);
						if(ret != -1){
							path.push(pos);
						}
					}
					all_paths[item_com.my_name] = path;
				}
				else if(item_com.my_name == "相"){
					var path = [];
					/*左前检测*/
					for(var i = item_com.to_pos.x - 2;i <= item_com.to_pos.x + 2 && i <= 9;i++){
						for(var j = item_com.to_pos.y - 2;j <= item_com.to_pos.y + 2 && j <= 8;j++){
							var pos = cc.v2(i,j);
							var ret = item_com.ready_to_move(pos);
							if(ret != -1){
								path.push(pos);
							}
						}
					}
					all_paths[item_com.my_name] = path;
				}
				else if(item_com.my_name == "士"){
					var path = [];
					/*左前检测*/
					for(var i = item_com.to_pos.x - 1;i <= item_com.to_pos.x + 1 && i <= 9;i++){
						for(var j = item_com.to_pos.y - 1;j <= item_com.to_pos.y + 1 && j <= 8;j++){
							var pos = cc.v2(i,j);
							var ret = item_com.ready_to_move(pos);
							if(ret != -1){
								path.push(pos);
							}
						}
					}
					all_paths[item_com.my_name] = path;
				}
				else if(item_com.my_name == "将"){
					var path = [];
					/*左前检测*/
					for(var i = item_com.to_pos.x - 1;i <= item_com.to_pos.x + 1 && i <= 9;i++){
						for(var j = item_com.to_pos.y - 1;j <= item_com.to_pos.y + 1 && j <= 8;j++){
							var pos = cc.v2(i,j);
							var ret = item_com.ready_to_move(pos);
							if(ret != -1){
								path.push(pos);
							}
						}
					}
					all_paths[item_com.my_name] = path;
				}
			}
		}
	},
	get_qizi_node(target){
		for(var i = 0;i < this.qizis.length;i++){
			var item = this.qizis[i];
			var item_com = item.getComponent("qizi_base");
			if(item_com.target == target){
				return item;
			}
		}
		return null;
	}
});

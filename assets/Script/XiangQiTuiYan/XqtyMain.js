cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		qipan:cc.Node,
		//按钮参数
		backButton:cc.Node,
		startButton:cc.Node,
		clearButton:cc.Node,
		restartButton:cc.Node,
		//标签参数
		currStepLabel:cc.Node,
		pastStepLabel:cc.Node,
		stepNumLabel:cc.Node,
	},
	onLoad () {
		gBoardGame = new gGameBoard();
		this.setGameButtonsActive(false);
		gBoardGame.ClearBoard();
		this.currStepLabel.getComponent(cc.Label).string = "";
		this.pastStepLabel.getComponent(cc.Label).string = "";
		this.stepNumLabel.getComponent(cc.Label).string = "";
	},
	setGameButtonsActive(flag){
		this.backButton.getComponent(cc.Button).interactable = flag;
		this.restartButton.getComponent(cc.Button).interactable = flag;
	},
	/*重新开始游戏*/
	restart_game(){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		var qipan_node_com = this.qipan.getComponent("qipan_node");

		for(var i = 0;i < g_root_node_com.init_node.length;i++){
			var item = g_root_node_com.init_node[i];
			var item_com = item.getComponent("qizi_base");
			var real_pos = qipan_node_com.get_position(item_com.start_pos.x,item_com.start_pos.y);
			var xd_pos = qipan_node_com.get_qizi_position(item,real_pos);
			var move = cc.moveTo(0.2,xd_pos);
			item.runAction(move);
			cc.log("restart init select_node:" + item_com.my_name);
			item_com.off_action();
			item_com.on_action();
			g_root_node_com.add_select_qizi(item,item_com.start_pos);
		}
		g_root_node_com.mhistory.splice(0,g_root_node_com.mhistory.length);
		g_root_node_com.current_step = null;
		g_root_node_com.current_idx = 0;
		g_root_node_com.from_sprite.setPosition(cc.v2(500,500));
		g_root_node_com.end_sprite.setPosition(cc.v2(500,500));
		this.off_one_button(true);
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
			item_com.target = item_com.target.split("_")[0];
			item_com.off_action();
			item_com.on_action();
		}
		g_root_node_com.select_node.splice(0,g_root_node_com.select_node.length);
		g_root_node_com.init_node.splice(0,g_root_node_com.init_node.length);
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
		var self = this;
		this.pop_qipan = cc.instantiate(g_assets["PopLoadQPan"]);
		var pop_qipan_com = this.pop_qipan.getComponent("PopLoadQPan");
		pop_qipan_com.install_cb(function(data){
			self.callback(data);
		});
		this.node.addChild(this.pop_qipan);
		this.pop_qipan.setPosition(this.node.convertToNodeSpaceAR(cc.v2(size.width/2,size.height/2)));
	},
	update(dt){
		this.currStepLabel.getComponent(cc.Label).string = "黑";
		this.pastStepLabel.getComponent(cc.Label).string = "红";
		this.stepNumLabel.getComponent(cc.Label).string = "";
	},
	/*通过图像识别结果进行残局复盘*/
	callback(data){
		if(data['result'] != null){
			var g_root_node = cc.director.getScene().getChildByName("RootNode");
			var g_root_node_com = g_root_node.getComponent("root_node");
			var size = data['result']['size'];
			var objs = data['result']['objs'];
			var width = size[0];
			var height = size[1];
			var extend_wd = ((710/796 * height) - width) / 2;
			for(var i = 0;i < objs.length;i++){
				var obj = objs[i];
				cc.log(JSON.stringify(obj));
				cc.log("extend_wd:" + extend_wd);
				var label = obj.shift().shift().split(":").shift();
				var left = obj.shift();
				var right = obj.shift();
				var top = obj.shift();
				var bottom = obj.shift();
				var xx = (top + bottom) / 2 * 10 / height;
				var yy = (left + right) / 2 * 10 / (width + extend_wd * 2) - 0.2;
				var y = Math.floor(yy);
				var x = Math.floor(xx);
				cc.log("xx:" + xx + " x:" + x + " yy:" + yy +" y:" + y);
				if(x >= 10 || y >= 9){
					continue;
				}
				x = 9 - x;
				var qizi_room_com = this.qizi_room.getComponent("qizi_control");
				var item = qizi_room_com.get_qizi_node(label);
				if(item == null){
					continue;
				}
				var item_com = item.getComponent("qizi_base");
				var qipan_node_com = this.qipan.getComponent("qipan_node");
				var real_pos = qipan_node_com.get_position(x,y);
				var xd_pos = qipan_node_com.get_qizi_position(item,real_pos);
				var move = cc.moveTo(0.2,xd_pos);
				item.runAction(move);
				item_com.target = item_com.target + "_" + Date.now();
				item_com.from_pos = cc.v2(x,y);
				item_com.to_pos = cc.v2(x,y);
				item_com.start_pos = cc.v2(x,y);
				g_root_node_com.add_select_qizi(item,cc.v2(x,y));
			}
		}
	}
});

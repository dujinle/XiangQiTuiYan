cc.Class({
	extends: cc.Component,

	properties: {
		my_name:null,
		my_type:null,
		my_x:-1,
		my_y:-1,
		last_pos:null,
		from_pos:null,
	},

	onLoad () {
		var self = this;
		this.yuandian = this.node.getPosition();
		this.prev_onmove();
	},
	prev_onmove(){
		var self = this;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
			//cc.log("start move the node");
			var delta = event.touch.getDelta();
			self.calc_pos(delta);
		},this.node);
		this.node.on(cc.Node.EventType.TOUCH_END, function () {
			var start = g_root_node.getComponent("root_node").start_node;
			var end = g_root_node.getComponent("root_node").end_node;
			var width = end.getPosition().x - start.getPosition().x + 50;
			var height = end.getPosition().y - start.getPosition().y + 50;
			var rect = cc.rect(start.getPosition().x -50, start.getPosition().y - 50,width,height);
			cc.log("width:" + width + " height:" + height);
			var my_pos = self.node.getPosition();
			var parent_pos = self.node.parent.getPosition();
			var local = cc.p(my_pos.x + parent_pos.x,my_pos.y + parent_pos.y);
			if (cc.rectContainsPoint(rect, local)){
				var g_root_node_com = g_root_node.getComponent("root_node");
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				self.my_x = qipan_pos.x;
				self.my_y = qipan_pos.y;
				if(self.my_x != -1 && self.my_y != -1){
					var g_root_pos = g_root_node_com.get_position(self.my_x,self.my_y);
					var x = g_root_pos.x - parent_pos.x;
					var y = g_root_pos.y - parent_pos.y;
					self.node.setPosition(cc.p(x,y));
				}
				cc.log("qipan pos:x" + self.my_x + " " + self.my_y);
				var is_have = g_root_node_com.is_have(self.node);
				if(is_have == false){
					cc.log("add node " + self.my_name);
					g_root_node_com.add_node(self.node);
				}
				self.from_pos = cc.p(self.my_x,self.my_y);
				cc.log("ok touch in the region.....g_root_node_com." + g_root_node_com.select_node.length);
			}else{
				var move = cc.moveTo(0.2,yuandian);
				self.node.runAction(move);
				var g_root_node_com = g_root_node.getComponent("root_node")
				var is_have = g_root_node_com.is_have(self.node);
				if(is_have == true){
					g_root_node_com.remove_node(self.node);
				}
				self.from_pos = self.node.getPosition();
				cc.log("touch remove from parent root_node_com." + g_root_node_com.select_node.length);
			}
			cc.log("touch end");
        }, this.node);
	},
	calc_pos(delta){
		var parent_pos = this.node.getPosition();
		//cc.log("parent_pos x:" + parent_pos.x + " y:" + parent_pos.y);
		var x = delta.x + parent_pos.x;
		var y = delta.y + parent_pos.y;
		//cc.log("x:" + x + " y:" + y);
		this.node.setPosition(cc.p(x,y));
		var parent_pos = this.node.parent.getPosition();
		//cc.log("x:" + (x+parent_pos.x) + " y:" + (y+parent_pos.y));
	},
	off_action(){
		this.node.off(cc.Node.EventType.TOUCH_MOVE);
		this.node.off(cc.Node.EventType.TOUCH_END);
	},
	init_ontouch(){
		cc.log("init_ontouch " + this.my_name);
		var self = this;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
			//cc.log("start move the node");
			var delta = event.touch.getDelta();
			self.calc_pos(delta);
		},this.node);
		if(this.my_name == "帅"){
			this.node.on(cc.Node.EventType.TOUCH_END,function(){
				var g_root_node_com = g_root_node.getComponent("root_node");
				if(self.last_pos == null){
					self.last_pos = cc.p(self.my_x,self.my_y);
				}
				if(g_root_node_com.current_step == self.my_type){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				var dist = Math.sqrt((self.last_pos.x - qipan_pos.x) * (self.last_pos.x - qipan_pos.x) +
					(self.last_pos.y - qipan_pos.y) * (self.last_pos.y - qipan_pos.y));
				//移动距离为1 不然就返回原来的位置
				if(dist != 1){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
				//如果移动的位置没有棋子则完成操作
				if(in_pos_node == 0){
					cc.log(self.my_name + " move success");
					self.move_succ(qipan_pos);
				}else{
					var in_pos_node_com = in_pos_node.getComponent("qizi_base");
					//如果移动的位置有自己的棋子返回
					if(self.my_type == in_pos_node_com.my_type){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					}else{
						//有对方的棋子可以吃掉
						self.move_succ_eat(qipan_pos);
					}
				}
			});
		}else if(this.my_name == "士"){
			this.node.on(cc.Node.EventType.TOUCH_END,function(){
				var g_root_node_com = g_root_node.getComponent("root_node")
				if(self.last_pos == null){
					self.last_pos = cc.p(self.my_x,self.my_y);
				}
				if(g_root_node_com.current_step == self.my_type){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				var dist = (self.last_pos.x - qipan_pos.x) * (self.last_pos.x - qipan_pos.x) +
					(self.last_pos.y - qipan_pos.y) * (self.last_pos.y - qipan_pos.y);
				//移动距离为1 不然就返回原来的位置
				if(dist != 2){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				if(qipan_pos.x > 2 && qipan_pos.x < 7){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				if(qipan_pos.y < 3 && qipan_pos.y > 5){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
				//如果移动的位置没有棋子则完成操作
				if(in_pos_node == 0){
					cc.log(self.my_name + " move success");
					self.move_succ(qipan_pos);
				}else{
					var in_pos_node_com = in_pos_node.getComponent("qizi_base");
					//如果移动的位置有自己的棋子返回
					if(self.my_type == in_pos_node_com.my_type){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					}else{
						//有对方的棋子可以吃掉
						self.move_succ_eat(qipan_pos);
					}
				}
			});
		}else if(this.my_name == "相"){
			this.node.on(cc.Node.EventType.TOUCH_END,function(){
				var g_root_node_com = g_root_node.getComponent("root_node")
				if(self.last_pos == null){
					self.last_pos = cc.p(self.my_x,self.my_y);
				}
				if(g_root_node_com.current_step == self.my_type){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				if(Math.abs(self.last_pos.y - qipan_pos.y) != 2){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				if(Math.abs(self.last_pos.x - qipan_pos.x) != 2){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
				//如果移动的位置没有棋子则完成操作
				if(in_pos_node == 0){
					cc.log(self.my_name + " move success");
					self.move_succ(qipan_pos);
				}else{
					var in_pos_node_com = in_pos_node.getComponent("qizi_base");
					//如果移动的位置有自己的棋子返回
					if(self.my_type == in_pos_node_com.my_type){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					}else{
						//有对方的棋子可以吃掉
						self.move_succ_eat(qipan_pos);
					}
				}
			});
		}else if(this.my_name == "马"){
			this.node.on(cc.Node.EventType.TOUCH_END,function(){
				var g_root_node_com = g_root_node.getComponent("root_node")
				if(self.last_pos == null){
					self.last_pos = cc.p(self.my_x,self.my_y);
				}
				if(g_root_node_com.current_step == self.my_type){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					cc.log("当前方已经走过了,不可以再走！");
					return;
				}
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);

				if(Math.abs(self.last_pos.y - qipan_pos.y) == 2 && Math.abs(self.last_pos.x - qipan_pos.x) != 1){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					cc.log("exit 1");
					return;
				}
				if(Math.abs(self.last_pos.y - qipan_pos.y) == 1 && Math.abs(self.last_pos.x - qipan_pos.x) != 2){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					cc.log("exit 2");
					return;
				}
				if(Math.abs(self.last_pos.x - qipan_pos.x) == 1 && Math.abs(self.last_pos.y - qipan_pos.y) != 2){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					cc.log("exit 3");
					return;
				}
				if(Math.abs(self.last_pos.x - qipan_pos.x) == 2 && Math.abs(self.last_pos.y - qipan_pos.y) != 1){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					cc.log("exit 4");
					return;
				}
				if(Math.abs(self.last_pos.x - qipan_pos.x) == 2){
					var xx = (self.last_pos.x + qipan_pos.x) / 2;
					var yy = self.last_pos.y;
					var in_pos_node = g_root_node_com.qizi_2d[xx][yy];
					if(in_pos_node != 0){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
						cc.log("exit 5");
						return;
					}
				}else{
					var xx = self.last_pos.x;
					var yy = (self.last_pos.y + qipan_pos.y) / 2;
					var in_pos_node = g_root_node_com.qizi_2d[xx][yy];
					if(in_pos_node != 0){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
						cc.log("exit 6");
						return;
					}
				}
				var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
				//如果移动的位置没有棋子则完成操作
				if(in_pos_node == 0){
					cc.log(self.my_name + " move success");
					self.move_succ(qipan_pos);
				}else{
					var in_pos_node_com = in_pos_node.getComponent("qizi_base");
					//如果移动的位置有自己的棋子返回
					if(self.my_type == in_pos_node_com.my_type){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
						cc.log("不可以盖住自己的棋子");
					}else{
						//有对方的棋子可以吃掉
						cc.log(self.my_name + "eat move success");
						self.move_succ_eat(qipan_pos);
					}
				}
			});
		}else if(this.my_name == "车"){
			this.node.on(cc.Node.EventType.TOUCH_END,function(){
				var g_root_node_com = g_root_node.getComponent("root_node")
				if(self.last_pos == null){
					self.last_pos = cc.p(self.my_x,self.my_y);
				}
				if(g_root_node_com.current_step == self.my_type){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				if(Math.abs(self.last_pos.y - qipan_pos.y) != 0 && Math.abs(self.last_pos.x - qipan_pos.x) != 0){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				if(Math.abs(self.last_pos.x - qipan_pos.x) == 0){
					for(var i = self.last_pos.y + 1;i < qipan_pos.y;i++){
						var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][i];
						if(in_pos_node != 0){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
					for(var i = qipan_pos.y + 1;i < self.last_pos.y;i++){
						var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][i];
						if(in_pos_node != 0){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
				}
				if(Math.abs(self.last_pos.y - qipan_pos.y) == 0){
					for(var i = self.last_pos.x + 1;i < qipan_pos.x;i++){
						var in_pos_node = g_root_node_com.qizi_2d[i][qipan_pos.y];
						if(in_pos_node != 0){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
					for(var i = qipan_pos.x + 1;i < self.last_pos.x;i++){
						var in_pos_node = g_root_node_com.qizi_2d[i][qipan_pos.y];
						if(in_pos_node != 0){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
				}
				var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
				//如果移动的位置没有棋子则完成操作
				if(in_pos_node == 0){
					cc.log(self.my_name + " move success");
					self.move_succ(qipan_pos);
				}else{
					var in_pos_node_com = in_pos_node.getComponent("qizi_base");
					//如果移动的位置有自己的棋子返回
					if(self.my_type == in_pos_node_com.my_type){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					}else{
						//有对方的棋子可以吃掉
						self.move_succ_eat(qipan_pos);
					}
				}
			});
		}else if(this.my_name == "炮"){
			this.node.on(cc.Node.EventType.TOUCH_END,function(){
				var g_root_node_com = g_root_node.getComponent("root_node")
				if(self.last_pos == null){
					self.last_pos = cc.p(self.my_x,self.my_y);
				}
				if(g_root_node_com.current_step == self.my_type){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				if(Math.abs(self.last_pos.y - qipan_pos.y) != 0 && Math.abs(self.last_pos.x - qipan_pos.x) != 0){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var num = 0;
				if(Math.abs(self.last_pos.x - qipan_pos.x) == 0){
					for(var i = self.last_pos.y + 1;i < qipan_pos.y;i++){
						var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][i];
						if(in_pos_node != 0){
							num = num + 1;
						}
						if(num > 1){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
					for(var i = qipan_pos.y + 1;i < self.last_pos.y;i++){
						var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][i];
						if(in_pos_node != 0){
							num = num + 1;
						}
						if(num > 1){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
				}
				num = 0;
				if(Math.abs(self.last_pos.y - qipan_pos.y) == 0){
					for(var i = self.last_pos.x + 1;i < qipan_pos.x;i++){
						var in_pos_node = g_root_node_com.qizi_2d[i][qipan_pos.y];
						if(in_pos_node != 0){
							num = num + 1;
						}
						if(num > 1){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
					for(var i = qipan_pos.x + 1;i < self.last_pos.x;i++){
						var in_pos_node = g_root_node_com.qizi_2d[i][qipan_pos.y];
						if(in_pos_node != 0){
							num = num + 1;
						}
						if(num > 1){
							var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
							var parent_pos = self.node.parent.getPosition();
							self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
							return;
						}
					}
				}
				var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
				//如果移动的位置没有棋子则完成操作
				if(in_pos_node == 0){
					if(num != 0){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
						return ;
					}else{
						self.move_succ(qipan_pos);
					}
				}else{
					var in_pos_node_com = in_pos_node.getComponent("qizi_base");
					//如果移动的位置有自己的棋子返回
					if(self.my_type == in_pos_node_com.my_type){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					}else if(num == 1){
						//有对方的棋子可以吃掉
						self.move_succ_eat(qipan_pos);
					}else{
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					}
				}
			});
		}else if(this.my_name == "兵"){
			this.node.on(cc.Node.EventType.TOUCH_END,function(){
				var g_root_node_com = g_root_node.getComponent("root_node")
				if(self.last_pos == null){
					self.last_pos = cc.p(self.my_x,self.my_y);
				}
				if(g_root_node_com.current_step == self.my_type){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				var dist = Math.sqrt((self.last_pos.x - qipan_pos.x) * (self.last_pos.x - qipan_pos.x) +
					(self.last_pos.y - qipan_pos.y) * (self.last_pos.y - qipan_pos.y));
				//移动距离为1 不然就返回原来的位置
				if(dist != 1){
					var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
					var parent_pos = self.node.parent.getPosition();
					self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					return;
				}
				var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
				//如果移动的位置没有棋子则完成操作
				if(in_pos_node == 0){
					self.move_succ(qipan_pos);
				}else{
					var in_pos_node_com = in_pos_node.getComponent("qizi_base");
					//如果移动的位置有自己的棋子返回
					if(self.my_type == in_pos_node_com.my_type){
						var position = g_root_node_com.get_position(self.last_pos.x,self.last_pos.y);
						var parent_pos = self.node.parent.getPosition();
						self.node.setPosition(position.x - parent_pos.x,position.y - parent_pos.y);
					}else{
						//有对方的棋子可以吃掉
						self.move_succ_eat(qipan_pos);
					}
				}
			});
		}
	},
	move_succ(qipan_pos){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		g_root_node_com.qizi_2d[this.last_pos.x][this.last_pos.y] = 0;
		g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y] = this.node;
		this.from_pos = this.last_pos;
		this.last_pos = qipan_pos;
		g_root_node_com.update_history(this.node,null);
		var g_root_pos = g_root_node_com.get_position(qipan_pos.x,qipan_pos.y);
		var parent_pos = this.node.parent.getPosition();
		var x = g_root_pos.x - parent_pos.x;
		var y = g_root_pos.y - parent_pos.y;
		this.node.setPosition(cc.p(x,y));
	},
	move_succ_eat(qipan_pos){
		//有对方的棋子可以吃掉
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		var in_pos_node = g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y];
		var in_pos_node_com = in_pos_node.getComponent("qizi_base");
		var move = cc.moveTo(0.2,in_pos_node_com.yuandian);
		in_pos_node_com.off_action();
		in_pos_node.runAction(move);
		g_root_node_com.remove_node(in_pos_node);
		g_root_node_com.qizi_2d[this.last_pos.x][this.last_pos.y] = 0;
		g_root_node_com.qizi_2d[qipan_pos.x][qipan_pos.y] = this.node;
		this.from_pos = this.last_pos;
		this.last_pos = qipan_pos;
		g_root_node_com.update_history(this.node,in_pos_node);
		var g_root_pos = g_root_node_com.get_position(qipan_pos.x,qipan_pos.y);
		var parent_pos = this.node.parent.getPosition();
		var x = g_root_pos.x - parent_pos.x;
		var y = g_root_pos.y - parent_pos.y;
		this.node.setPosition(cc.p(x,y));
	}
});

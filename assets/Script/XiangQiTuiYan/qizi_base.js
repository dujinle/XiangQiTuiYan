cc.Class({
	extends: cc.Component,

	properties: {
		my_name:null,
		my_type:null,
		eat_node:null,
		yuandian:null,
		from_pos:null,
		to_pos:null,
	},
	onLoad () {
		var self = this;
		this.yuandian = this.node.getPosition();
		this.on_action();
	},
	off_action(){
		this.node.off(cc.Node.EventType.TOUCH_START);
	},
	on_action(){
		var self = this;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			cc.log("<qizi_base>touch start the node");
			var mask_sprite = g_root_node_com.from_sprite;
			mask_sprite.setPosition(self.node.getPosition());
			g_root_node_com.set_data(self.node);
			/*如果已经开始游戏则点击棋子之后暂时关闭其他棋子的事件*/
			if(g_root_node_com.game_status == true){
				g_root_node_com.deal_nodes_beside(self.node,false);
			}
		},this.node);
	},
	/*判断是否可以移动棋子 -1:不可以 0:可以 1:可以且吃掉对方棋子*/
	ready_to_move(pos){
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		if(this.my_name == "帅"){
			/*计算欧氏距离 距离必须为1*/
			var dist = Math.sqrt((pos.x - this.to_pos.x) * (pos.x - this.to_pos.x) +
				(pos.y - this.to_pos.y) * (pos.y - this.to_pos.y));
			//移动距离为1 不然就返回原来的位置
			if(dist != 1){
				return -1;
			}
		}
		else if(this.my_name == "士"){
			var dist = (pos.x - this.to_pos.x) * (pos.x - this.to_pos.x) +
				(pos.y - this.to_pos.y) * (pos.y - this.to_pos.y);
			//移动距离为1 不然就返回原来的位置
			if(dist != 2){
				return -1;
			}
			if(pos.x > 2 && pos.x < 7){
				return -1;
			}
			if(pos.y < 3 && pos.y > 5){
				return -1;
			}
		}
		else if(this.my_name == "相"){
			if(Math.abs(this.to_pos.y - pos.y) != 2){
					return -1;
			}
			if(Math.abs(this.to_pos.x - pos.x) != 2){
				return -1;
			}
			if(this.to_pos.x < 5 && pos.x > 5){
				return -1;
			}
			if(this.to_pos.x > 4 && pos.x < 5){
				return -1;
			}
		}
		else if(this.my_name == "马"){
			/*判断是否走得日字*/
			var dist = (pos.x - this.to_pos.x) * (pos.x - this.to_pos.x) +
				(pos.y - this.to_pos.y) * (pos.y - this.to_pos.y);
			if(dist != 5){
				return -1;
			}
			if(Math.abs(pos.x - this.to_pos.x) != 1 && Math.abs(pos.y - this.to_pos.y) != 1){
				return -1;
			}
			/*判断是否有棋子挡住马腿*/
			if(Math.abs(pos.x - this.to_pos.x) == 2){
				var xx = (this.to_pos.x + pos.x) / 2;
				var yy = this.to_pos.y;
				var in_pos_node = g_root_node_com.qizi_2d[xx][yy];
				if(in_pos_node != 0){
					return -1;
				}
			}else{
				var xx = this.to_pos.x;
				var yy = (this.to_pos.y + pos.y) / 2;
				var in_pos_node = g_root_node_com.qizi_2d[xx][yy];
				if(in_pos_node != 0){
					return -1;
				}
			}
		}
		else if(this.my_name == "车"){
			/*车走直线 必有 x,y距离为0 */
			if(Math.abs(this.to_pos.y - pos.y) != 0 && Math.abs(this.to_pos.x - pos.x) != 0){
				return -1;
			}
			/*判断路径中是否有棋子*/
			/*上行棋子*/
			for(var i = this.to_pos.y + 1;i < pos.y;i++){
				var in_pos_node = g_root_node_com.qizi_2d[i][pos.y];
				if(in_pos_node != 0){
					return -1;
				}
			}
			/*下行棋子*/
			for(var i = pos.y + 1;i < this.to_pos.y;i++){
				var in_pos_node = g_root_node_com.qizi_2d[i][pos.y];
				if(in_pos_node != 0){
					return -1;
				}
			}
			/*右行棋子*/
			for(var i = this.to_pos.x + 1;i < pos.x;i++){
				var in_pos_node = g_root_node_com.qizi_2d[pos.x][i];
				if(in_pos_node != 0){
					return -1;
				}
			}
			/*左行棋子*/
			for(var i = pos.x + 1;i < this.to_pos.x;i++){
				var in_pos_node = g_root_node_com.qizi_2d[pos.x][i];
				if(in_pos_node != 0){
					return -1;
				}
			}
		}
		else if(this.my_name == "炮"){
			/*炮走直线 必有 x,y距离为0 */
			if(Math.abs(this.to_pos.y - pos.y) != 0 && Math.abs(this.to_pos.x - pos.x) != 0){
				return -1;
			}
			var num = 0;
			/*判断路径中是否有棋子*/
			/*上行棋子*/
			for(var i = this.to_pos.y + 1;i < pos.y;i++){
				var in_pos_node = g_root_node_com.qizi_2d[i][pos.y];
				if(in_pos_node != 0){
					num = num + 1;
				}
			}
			/*下行棋子*/
			for(var i = pos.y + 1;i < this.to_pos.y;i++){
				var in_pos_node = g_root_node_com.qizi_2d[i][pos.y];
				if(in_pos_node != 0){
					num = num + 1;
				}
			}
			/*右行棋子*/
			for(var i = this.to_pos.x + 1;i < pos.x;i++){
				var in_pos_node = g_root_node_com.qizi_2d[pos.x][i];
				if(in_pos_node != 0){
					num = num + 1;
				}
			}
			/*左行棋子*/
			for(var i = pos.x + 1;i < this.to_pos.x;i++){
				var in_pos_node = g_root_node_com.qizi_2d[pos.x][i];
				if(in_pos_node != 0){
					num = num + 1;
				}
			}
			var in_pos_node = g_root_node_com.qizi_2d[pos.x][pos.y];
			if(num == 0){
				if(in_pos_node != 0){
					return -1;
				}
			}else if(num > 1){
				return -1;
			}
			if(num == 1){
				if(in_pos_node == 0){
					return -1;
				}
			}
		}
		else if(this.my_name == "兵"){
			/*计算欧氏距离 距离必须为1*/
			var dist = Math.sqrt((pos.x - this.to_pos.x) * (pos.x - this.to_pos.x) +
				(pos.y - this.to_pos.y) * (pos.y - this.to_pos.y));
			//移动距离为1 不然就返回原来的位置
			if(dist != 1){
				return -1;
			}
		}
		var current_step = g_root_node_com.current_step;
		if(current_step == this.my_type){
			return -1;
		}
		var in_pos_node = g_root_node_com.qizi_2d[pos.x][pos.y];
		//如果移动的位置没有棋子则完成操作
		if(in_pos_node == 0){
			this.from_pos = this.to_pos;
			this.to_pos = pos;
			return 0;
		}else{
			var in_pos_node_com = in_pos_node.getComponent("qizi_base");
			//如果移动的位置有自己的棋子返回
			if(this.my_type == in_pos_node_com.my_type){
				return -1;
			}else{
				this.from_pos = this.to_pos;
				this.to_pos = pos;
				this.eat_node = in_pos_node;
				return 1;
			}
		}
	}
});

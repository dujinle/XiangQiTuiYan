cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
		game_status:false,
		select_node:[],
		init_node:[],
		qizi_2d:null,
		mhistory:[],
		current_step:null,
		current_idx:0,
		from_sprite:null,
		end_sprite:null
    },

    // use this for initialization
    onLoad: function () {
		var self = this;
		cc.game.addPersistRootNode(this.node);
		this.qizi_2d = this.init_vec2d(10,9);
    },
	init_vec2d(row,col){
		var arr = new Array();
		for(var i = 0;i < row;i++){
			arr[i] = new Array();
			for(var j = 0;j < col;j++){
				arr[i][j] = 0;
			}
		}
		return arr;
	},
	update_move_pos(node,pos){
		var node_com = node.getComponent("qizi_base");
		var from_pos = node_com.from_pos;
		this.qizi_2d[pos.x][pos.y] = node;
		this.qizi_2d[from_pos.x][from_pos.y] = 0;
		
		this.current_step = node_com.my_type;
		this.mhistory[this.current_idx] = node;
		if(node_com.eat_node != null){
			this.remove_node(node_com.eat_node);
		}
		this.current_idx = this.current_idx + 1;
	},
	//自定义的两个函数。将值保存在this变量里
	set_data : function(json){
		this.data = json;
	},
	get_data : function(){
		return this.data;
	},
	add_select_qizi(node,pos){
		//添加之前判断一下是否已经在其他地方存在它
		var flag = false;
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				var my_node = this.qizi_2d[i][j];
				if(my_node == 0){
					continue;
				}
				if(i == pos.x && j == pos.y){
					continue;
				}
				if(my_node.name == node.name){
					cc.log("棋子已经存在在<"+ i + ","+ j + ">,并进行了位置替换");
					this.qizi_2d[i][j] = 0;
					flag = true;
					break;
				}
			}
			if(flag == true){
				break;
			}
		}
		this.qizi_2d[pos.x][pos.y] = node;
		if(flag == false){
			cc.log("添加棋子到<"+ pos.x + ","+ pos.y + ">!");
			this.select_node.push(node);
		}
		if(this.game_status == false){
			this.init_node.push(node);
		}
	},
	set_game_status(flag){
		this.game_status = flag;
	},
	remove_node(node){
		for(var i = 0;i < this.select_node.length;i++){
			var item = this.select_node[i];
			if(item.name == node.name){
				this.select_node.splice(i,1);
				break;
			}
		}
	},
	/*关闭或者打开除此以外的事件*/
	deal_nodes_beside(node,flag){
		for(var i = 0;i < this.select_node.length;i++){
			var item = this.select_node[i];
			if(item.name == node.name){
				continue;
			}else{
				var item_com = item.getComponent("qizi_base");
				if(flag == true){
					item_com.on_action();
				}else{
					item_com.off_action();
				}
			}
		}
	}
});

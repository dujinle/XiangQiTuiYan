cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
		game_status:false,
		select_node:[],
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
		this.mhistory[this.current_idx] = {
			"node":node,
			"step":this.current_step,
			"idx":this.current_idx,
			"eat":node_com.eat_node,
			"from":node_com.from_pos,
			"last":node_com.to_pos
		};
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
				}
			}
		}
		cc.log("添加棋子到<"+ pos.x + ","+ pos.y + ">!");
		this.qizi_2d[pos.x][pos.y] = node;
		this.select_node.push(node);
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
	}
});

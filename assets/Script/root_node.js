cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
		start_node:cc.Node,
		end_node:cc.Node,
		select_node:[],
		qizi_2d:null,
		mhistory:[],
		current_step:null,
		current_idx:-1,
    },

    // use this for initialization
    onLoad: function () {
		var self = this;
		cc.game.addPersistRootNode(this.node);
		this.m2d = this._init_2d(10,9);
		this.qizi_2d = this._init_2d(10,9);
		var areas = this._calc_jianju();
		var pos = this.start_node.getPosition();
		cc.log(pos.x + " " + pos.y);
		//初始化2维数组的位置信息
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				var x = pos.x + areas * j;
				var y = pos.y + areas * i;
				this.m2d[i][j] = cc.p(x,y);
				this.qizi_2d[i][j] = 0;
			}
		}
    },
	update_history(node){
		var node_com = node.getComponent("qizi_base");
		this.current_step = node_com.my_type;
		this.current_idx = this.current_idx + 1;
		this.mhistory[this.current_idx] = node;
	},
    //自定义的两个函数。将值保存在this变量里
    setdata : function(json){
        this.data = json;
    },  
    getdata : function(){
        return this.data;
    },
	add_node(node){
		this.select_node.push(node);
		var node_com = node.getComponent("qizi_base");
		this.qizi_2d[node_com.my_x][node_com.my_y] = node;
	},
	get_position(i,j){
		return this.m2d[i][j];
	},
	calc_test_pos(pos){
		var x = pos.x
		var y = pos.y;
		var near_pos = cc.p(-1,-1);
		var near_dist = Math.exp(10);
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				var qipan_x = this.m2d[i][j].x;
				var qipan_y = this.m2d[i][j].y;
				var dist = Math.sqrt((x - qipan_x)*(x - qipan_x) + (y - qipan_y)*(y - qipan_y));
				cc.log(qipan_x,qipan_y,i,j,dist);
				if(dist <= near_dist){
					near_dist = dist;
					near_pos = cc.p(i,j);
				}
			}
		}
		return near_pos;
	},
	calc_my_pos(node){
		var pos = node.getPosition();
		var parent_pos = node.parent.getPosition();
		var x = pos.x + parent_pos.x;
		var y = pos.y + parent_pos.y;
		var near_pos = cc.p(-1,-1);
		var near_dist = Math.exp(10);
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				var qipan_x = this.m2d[i][j].x;
				var qipan_y = this.m2d[i][j].y;
				var dist = Math.sqrt((x - qipan_x)*(x - qipan_x) + (y - qipan_y)*(y - qipan_y));
				if(dist <= near_dist){
					near_dist = dist;
					near_pos = cc.p(i,j);
				}
			}
		}
		return near_pos;
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
	is_have(node){
		for(var i = 0;i < this.select_node.length;i++){
			var item = this.select_node[i];
			if(item.name == node.name){
				return true;
			}
		}
		return false;
	},
	_init_2d(row,col){
		var arr = new Array();
		for(var i = 0;i < row;i++){
			arr[i] = new Array();
			for(var j = 0;j < col;j++){
				arr[i][j] = 0;
			}
		}
		return arr;
	},
	//计算棋盘每一个格子的间距是多大
	_calc_jianju(){
		var spos = this.start_node.getPosition();
		var epos = this.end_node.getPosition();
		var x = epos.x - spos.x;
		var y = epos.y - spos.y;
		var areas = Math.floor(Math.sqrt(Math.abs(x * y)/72));
		return areas;
	},
});

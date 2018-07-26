cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
		start_node:cc.Node,
		end_node:cc.Node,
		select_node:[],
    },

    // use this for initialization
    onLoad: function () {
		var self = this;
		cc.game.addPersistRootNode(this.node);
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
				var target = event.getCurrentTarget();
				var local = target.convertToNodeSpaceAR(touch.getLocation());
				//var local = touch.getLocation();
				cc.log(local.x + " " + local.y);
				//var pos = self.calc_test_pos(local);
				//cc.log("qipan test " + pos.x + " " + pos.y);
				/*
				
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				if (cc.rectContainsPoint(rect, local)){
					cc.log("ok touch in the region......");
				}else{
					cc.log("touch remove from parent");
					self.node.active = false;
				}
				*/
			}
         }, this.node);
		cc.log(this.node.getPosition().x);
		this.m2d = this._init_2d(10,9);
		var areas = this._calc_jianju();
		var pos = this.start_node.getPosition();
		cc.log(pos.x + " " + pos.y);
		//初始化2维数组的位置信息
		for(var i = 0;i < 10;i++){
			for(var j = 0;j < 9;j++){
				var x = pos.x + areas * j;
				var y = pos.y + areas * i;
				this.m2d[i][j] = cc.p(x,y);
			}
		}
		cc.log(this.m2d[9][8].x + " " + this.m2d[9][8].y);
		cc.log(this.m2d[0][0].x + " " + this.m2d[0][0].y);
		cc.log(this.m2d[0][1].x + " " + this.m2d[0][1].y);
		cc.log(this.m2d[1][0].x + " " + this.m2d[1][0].y);
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
		if(this.is_have(node) == false){
			return cc.p(-1,-1);
		}else{
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
		}
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

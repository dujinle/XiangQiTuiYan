cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		qipan:cc.Node,
		qizi_com_node:cc.Node,
		//按钮参数
		back_one_node:cc.Node,
		start_node:cc.Node,
		restart_button:cc.Node,
		//标签参数
		step_num_label:cc.Node,
		qizi_data:null,
    },
	onLoad(){
		this.off_one_button(false);
		g_com.initMap = g_com.arr2Clone(g_com.init_map);
		/*初始化所有的棋子*/
		for(var i = 0;i < g_com.initMap.length;i++){
			for(var j = 0;j < g_com.initMap[i].length;j++){
				var key = g_com.initMap[i][j];
				if(key != 0){
					g_com.manNodes[key] = this.newNode(key);
					g_com.mans[key] = {'my':0,"key":key};
				}
			}
		}
		/*把棋子节点加入到棋盘节点上*/
		for(var key in g_com.manNodes){
			var node = g_com.manNodes[key];
			node.runAction(cc.hide());
			this.qipan.addChild(node);
		}
	},
    start () {
		var games = {
			"马跃檀溪":{
				"record":[
					"z0-8-4-1",
					"c0-5-8-1",
					"c1-4-8-1",
					"p0-3-8-1",
					"p1-3-7-1",
					"j0-0-5-1",
					"Z0-1-4-0",
					"Z1-2-5-0",
					"C0-3-3-0",
					"M0-9-5-0",
					"J0-9-3-0"
				],
				"content":"无相版马跃檀溪若是摆在街头，说白了就是坑你钱的。",
				"start":"1"
			}
		};
		this.onLoadCanJu(games["马跃檀溪"],0.2);

	},
	off_one_button(flag){
		this.back_one_node.getComponent(cc.Button).interactable = flag;
		this.restart_button.getComponent(cc.Button).interactable = flag;
	},
	onLoadCanJu(data,time){
		cc.log("start load can ju game");
		/*清空棋盘矩阵*/
		for(var i = 0;i < g_com.initMap.length;i++){
			for(var j = 0;j < g_com.initMap[i].length;j++){
				g_com.initMap[i][j] = 0;
			}
		}
		
		if(data != null){
			var self = this;
			this.qizi_data = data;
			g_com.current_step = parseInt(data['start']) == 1?1:-1;
			g_com.start_juese = g_com.current_step;
			var canju = data['record'];

			this.count = 0;
			this.back_callback = function(){
				var objs = canju[self.count].split("-");
				var x = parseInt(objs[1]);
				var y = parseInt(objs[2]);
				//mans {"node":node,"my":1,"past_pos":[x,y],"cur_pos":[x,y],"init_pos":[x,y]}
				g_com.mans[objs[0]].my = parseInt(objs[3]) == 1?1:-1;
				g_com.mans[objs[0]].past_pos = [x,y];
				g_com.mans[objs[0]].cur_pos = [x,y];
				g_com.mans[objs[0]].init_pos = [x,y];
				var real_pos = g_com.initPos(x,y);
				
				g_com.initMap[x][y] = objs[0];
				g_com.manNodes[objs[0]].runAction(cc.show());
				g_com.manNodes[objs[0]].setPosition(cc.v2(real_pos[0],real_pos[1]));
				cc.log("init node:" + g_com.manNodes[objs[0]].name);
				self.count = self.count + 1;
				if(self.count >= canju.length){
					self.unschedule(self.back_callback);
				}
			}
			this.schedule(this.back_callback,time,canju.length,0.000001);
		}
	},
	newNode(key){
		var qizi_node = cc.instantiate(this.qizi_com_node);
		var qizi_node_com = qizi_node.getComponent("qizi_common");
		qizi_node.name = key;
		qizi_node_com.back_sprite.spriteFrame = g_assets[g_com.sprite_frame_name[key]];
		return qizi_node;
	},
	restart_game(){
		/*存储棋子的移动历史*/
		g_com.ab_history = {};
		g_com.history = [];

		g_com.start_juese = -1;
		g_com.current_step = -1;
		g_com.game_num = 0;
		g_com.touch_mark.runAction(cc.hide());
		g_com.select_node = null;
		this.off_one_button(false);
		this.start_node.getChildByName("start").active = true;
		this.start_node.getChildByName("stop").active = false;
		g_com.game_is_start = false;
		this.onLoadCanJu(this.qizi_data,0);
	},
	/*回退2步*/
	back_two(){
		var self = this;
		if(g_com.game_num < 2){
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
		}
		this.schedule(this.back_callback,0.2,2,0.000001);
	},
	/*回退一步*/
	back_one(){
		if(g_com.game_num <= 0){
			cc.log("还没有开始移动棋子");
			return;
		}
		/*获取最后一步的棋子*/
		var back_item = g_com.history[g_com.game_num - 1];
		/*当轮到自己走子时可以悔棋*/
		/*移动的始末位置*/
		var cur_pos = [back_item.cur_pos[0],back_item.cur_pos[1]];
		var past_pos = [back_item.past_pos[0],back_item.past_pos[1]];
		var eat_key = back_item.eatKey;

		var real_pos = g_com.initPos(past_pos[0],past_pos[1]);

		var move = cc.moveTo(0.2,cc.v2(real_pos[0],real_pos[1]));
		g_com.manNodes[back_item.key].runAction(move);
		g_com.touch_mark.runAction(cc.hide());

		g_com.initMap[past_pos[0]][past_pos[1]] = g_com.initMap[cur_pos[0]][cur_pos[1]];
		g_com.initMap[cur_pos[0]][cur_pos[1]] = 0;
		g_com.mans[back_item.key].cur_pos = past_pos;
		g_com.mans[back_item.key].past_pos = cur_pos;
		cc.log("last:" + past_pos[0] + " " + past_pos[1] + " from:" + cur_pos[0] + " " + cur_pos[1]);
		
		/*如果这一步有棋子被吃 则还原被吃的棋子*/
		if(!!eat_key && eat_key != 0){
			var eat_key_com = g_com.manNodes[eat_key].getComponent("qizi_common");
			var eat_real_pos = g_com.initPos(cur_pos[0],cur_pos[1]);
			g_com.initMap[cur_pos[0]][cur_pos[1]] = eat_key;
						
			var eat_move = cc.moveTo(0.2,cc.v2(eat_real_pos[0],eat_real_pos[1]));
			g_com.manNodes[eat_key].runAction(cc.sequence(cc.show(),eat_move));
			eat_key_com.on_action();
		}
		g_com.game_num = g_com.game_num - 1;
	},
	game_start(){
		cc.log("game_start");
		if(g_com.game_is_start == false){
			//开始游戏
			this.off_one_button(true);
			this.start_node.getChildByName("start").active = false;
			this.start_node.getChildByName("stop").active = true;
			g_com.game_is_start = true;
			//游戏开始 棋盘棋子添加点击事件
			g_com.setOtherNodePressActive(null,true);
		}else{
			//停止游戏
			this.off_one_button(false);
			this.start_node.getChildByName("start").active = true;
			this.start_node.getChildByName("stop").active = false;
			g_com.setOtherNodePressActive(null,false);
			g_com.game_is_start = false;
		}
	},
	exit(){
		g_com.mans = {};
		/*存储棋子的移动历史*/
		g_com.ab_history = {};
		g_com.history = [];

		g_com.game_is_start = false;
		g_com.start_juese = -1;
		g_com.current_step = -1;
		g_com.game_num = 0;
		g_com.touch_mark = null;
		g_com.select_node = null;
		cc.director.loadScene("StartGameScene");
	},
	update(dt){
		this.step_num_label.getComponent(cc.Label).string = g_com.game_num;
	}
});

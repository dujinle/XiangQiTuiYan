cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		qipan:cc.Node,
		//按钮参数
		backButton:cc.Node,
		startButton:cc.Node,
		restartButton:cc.Node,
		//标签参数
		step_num_label:cc.Node,
		qizi_data:null,
    },
	onLoad(){
		this.setGameButtonsActive(false);
	},
    start () {
		this.onLoadCanJu(gGames["马跃檀溪"],0.2);
	},
	setGameButtonsActive(flag){
		this.backButton.getComponent(cc.Button).interactable = flag;
		this.restartButton.getComponent(cc.Button).interactable = flag;
	},
	onLoadCanJu(data,time){
		cc.log("start load can ju game");
		/*清空棋盘*/
		gGameBoard.ClearBoard();
		
		if(data != null){
			//棋盘上添加棋子
			for (var x = gGameBoard.FILE_LEFT; x <= gGameBoard.FILE_RIGHT; x ++) {
				for (var y = gGameBoard.RANK_TOP; y <= gGameBoard.RANK_BOTTOM; y ++) {
					var sq = gGameBoard.COORD_XY(x, y);
					var pc = data.board[sq];
					if (pc != 0) {
						var pos = gCommon.BoardPos(x - gGameBoard.FILE_LEFT,y - gGameBoard.RANK_TOP);
						var qiNode = this.newNode(sq,pc);
						this.qipan.addChild(qiNode);
						qiNode.setPosition(cc.v2(pos[0],pos[1]));
						gGameBoard.AddQz(sq,pc);
						gGameBoard.BoardNodes[sq] = qiNode;
					}
				}
			}
		}
	},
	newNode(sq,key){
		var QzNode = new cc.Node(sq);
        var Sprite = QzNode.addComponent(cc.Sprite);
        //给sprite的spriteFrame属性 赋值  
        Sprite.spriteFrame = g_assets[gCommon.PngResource[key]];
		var QzNodeCom = QzNode.addComponent("QzNode");
		QzNodeCom.SetPressEvent(false);
		cc.log("new node:" + key + " sprite:" + gCommon.PngResource[key]);
		return QzNode;
	},
	
	restart_game(){
		/*存储棋子的移动历史*/
		gCommon.ab_history = {};
		gCommon.history = [];

		gCommon.start_juese = -1;
		gCommon.current_step = -1;
		gCommon.game_num = 0;
		gCommon.touch_mark.runAction(cc.hide());
		gCommon.select_node = null;
		this.setGameButtonsActive(false);
		this.startButton.getChildByName("start").active = true;
		this.startButton.getChildByName("stop").active = false;
		gCommon.game_is_start = false;
		this.onLoadCanJu(this.qizi_data,0);
	},
	/*回退2步*/
	back_two(){
		var self = this;
		if(gCommon.game_num < 2){
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
		if(gCommon.game_num <= 0){
			cc.log("还没有开始移动棋子");
			return;
		}
		/*获取最后一步的棋子*/
		var back_item = gCommon.history[gCommon.game_num - 1];
		/*当轮到自己走子时可以悔棋*/
		/*移动的始末位置*/
		var cur_pos = [back_item.cur_pos[0],back_item.cur_pos[1]];
		var past_pos = [back_item.past_pos[0],back_item.past_pos[1]];
		var eat_key = back_item.eatKey;

		var real_pos = gCommon.initPos(past_pos[0],past_pos[1]);

		var move = cc.moveTo(0.2,cc.v2(real_pos[0],real_pos[1]));
		gCommon.manNodes[back_item.key].runAction(move);
		gCommon.touch_mark.runAction(cc.hide());

		gCommon.initMap[past_pos[0]][past_pos[1]] = gCommon.initMap[cur_pos[0]][cur_pos[1]];
		gCommon.initMap[cur_pos[0]][cur_pos[1]] = 0;
		gCommon.mans[back_item.key].cur_pos = past_pos;
		gCommon.mans[back_item.key].past_pos = cur_pos;
		cc.log("last:" + past_pos[0] + " " + past_pos[1] + " from:" + cur_pos[0] + " " + cur_pos[1]);
		
		/*如果这一步有棋子被吃 则还原被吃的棋子*/
		if(!!eat_key && eat_key != 0){
			var eat_key_com = gCommon.manNodes[eat_key].getComponent("qizi_common");
			var eat_real_pos = gCommon.initPos(cur_pos[0],cur_pos[1]);
			gCommon.initMap[cur_pos[0]][cur_pos[1]] = eat_key;
						
			var eat_move = cc.moveTo(0.2,cc.v2(eat_real_pos[0],eat_real_pos[1]));
			gCommon.manNodes[eat_key].runAction(cc.sequence(cc.show(),eat_move));
			eat_key_com.on_action();
		}
		gCommon.game_num = gCommon.game_num - 1;
	},
	startGame(){
		cc.log("startGame");
		if(gGameBoard.isGameOver == 0){
			//开始游戏
			this.setGameButtonsActive(true);
			this.startButton.getChildByName("start").active = false;
			this.startButton.getChildByName("stop").active = true;
			gGameBoard.isGameOver = 1;
			//游戏开始 棋盘棋子添加点击事件
			this.qipan.getComponent("TzcjQpNode").setOtherNodePressActive(0,true);
		}else{
			//停止游戏
			this.setGameButtonsActive(false);
			this.startButton.getChildByName("start").active = true;
			this.startButton.getChildByName("stop").active = false;
			this.qipan.getComponent("TzcjQpNode").setOtherNodePressActive(0,false);
			gGameBoard.isGameOver = 0;
		}
	},
	exit(){
		gCommon.mans = {};
		/*存储棋子的移动历史*/
		gCommon.ab_history = {};
		gCommon.history = [];

		gCommon.game_is_start = false;
		gCommon.start_juese = -1;
		gCommon.current_step = -1;
		gCommon.game_num = 0;
		gCommon.touch_mark = null;
		gCommon.select_node = null;
		cc.director.loadScene("StartGameScene");
	},
	update(dt){
		this.step_num_label.getComponent(cc.Label).string = gGameBoard.nDistance;
	}
});

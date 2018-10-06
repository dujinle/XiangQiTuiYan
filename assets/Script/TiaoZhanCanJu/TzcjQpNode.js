cc.Class({
    extends: cc.Component,

    properties: {
		selectedMark:cc.Node,
		press_node:null,
		touchOk:false,
		audioSources:{
			type:cc.AudioSource,
			default:[]
		},
    },

    // use this for initialization
    onLoad: function () {
		var self = this;
		this.node.on("pressed", this.PressFunc, this);
		gGameBoard.selectedMark = this.selectedMark;
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
				var target = event.getCurrentTarget();
				var touchLocal = target.convertToNodeSpaceAR(touch.getLocation());
				var beginPos = gCommon.BoardPos(0,9);
				var endPos = gCommon.BoardPos(8,0);
				//左右上下增加100像素
				var width = Math.abs(beginPos[0] - endPos[0]) + 100;
				var height = Math.abs(beginPos[1] - endPos[1]) + 100;
				var rect = cc.rect(beginPos[0] - 50,beginPos[1] - 50,width,height);
				if(rect.contains(touchLocal)){
					cc.log("<qipan_node> touch begin org_local: x:" + touchLocal.x + " y:" + touchLocal.y);
					self.touchOk = true;
					return true;
				}
				self.touchOk = false;
                return false;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
				var target = event.getCurrentTarget();
				var touckLocal = target.convertToNodeSpaceAR(touch.getLocation());
				if(self.touchOk == true){
					self.clickSquare(touckLocal);
					self.touchOk = false;
				}
			}
         }, this.node);
    },
	//点击棋盘的位置检测是否可以走子
	clickSquare(touckLocal){
		var sq = this.getPosFromXY(touckLocal);
		cc.log("clickSquare: sq:" + sq);
		/*游戏开始 并且已经点击过棋子*/
		if(gGameBoard.isGameOver > 0 && gGameBoard.sqSelected != 0){
			gGameBoard.mvLast = gGameBoard.MOVE(gGameBoard.sqSelected, sq);
			gGameBoard.MakeMove(gGameBoard.mvLast);
			this.moveNode(gGameBoard.mvLast);
			gGameBoard.sqSelected = 0;
			this.playResWav(gGameBoard.IDR_MOVE); // 播放走子或吃子的声音
		}
	},
	//打开其他棋子的点击事件
	setOtherNodePressActive(key,active){
		for (var x = gGameBoard.FILE_LEFT; x <= gGameBoard.FILE_RIGHT; x ++) {
			for (var y = gGameBoard.RANK_TOP; y <= gGameBoard.RANK_BOTTOM; y ++) {
				var sq = gGameBoard.COORD_XY(x,y);
				if(sq != key && gGameBoard.BoardNodes[sq] != 0){
					gGameBoard.BoardNodes[sq].getComponent("QzNode").SetPressEvent(active);
				}
			}
		}
	},
	//修正点击的位置在棋盘的坐标
	getPosFromXY(pos){
		var near_pos = -1;
		var near_dist = Math.exp(10);
		for (var x = gGameBoard.FILE_LEFT; x <= gGameBoard.FILE_RIGHT; x ++) {
			for (var y = gGameBoard.RANK_TOP; y <= gGameBoard.RANK_BOTTOM; y ++) {
				var itemPos = gCommon.BoardPos(x - gGameBoard.FILE_LEFT,y - gGameBoard.RANK_TOP);
				var dist = Math.sqrt((pos.x - itemPos[0])*(pos.x - itemPos[0]) + (pos.y - itemPos[1])*(pos.y - itemPos[1]));
				if(dist <= near_dist){
					near_dist = dist;
					near_pos = gGameBoard.COORD_XY(x,y);
				}
			}
		}
		return near_pos;
	},
	make_ai_move(time){
		var self = this;
		setTimeout(function(){
			//AI to move
			var ret = AI.getAlphaBeta(-Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,4,g_com.initMap,g_com.start_juese * -1);
			cc.log(JSON.stringify(ret));
			var ai_item = g_com.mans[ret.key];
			var ai_node = g_com.manNodes[ret.key];
			
			var ai_node_pos = g_com.initPos(ret.x,ret.y);
			var ai_move = cc.moveTo(0.2,cc.v2(ai_node_pos[0],ai_node_pos[1]));
			var ai_audio_play = cc.callFunc(self.play_audio,self);
			var spawn = cc.spawn(ai_move,ai_audio_play);
			ai_node.runAction(spawn);
			var mask_move = cc.moveTo(0.2,cc.v2(ai_node_pos[0],ai_node_pos[1]));
			g_com.selectedMark.runAction(cc.sequence(cc.show(),mask_move));
			
			if(g_com.initMap[ret.x][ret.y] != 0){
				ai_item.eatKey = g_com.initMap[ret.x][ret.y];
				var eat_node = g_com.manNodes[ai_item.eatKey];
				var eat_node_com = eat_node.getComponent("qizi_common");
				eat_node.runAction(cc.hide());
				eat_node_com.off_action();
			}
			g_com.initMap[ai_item.cur_pos[0]][ai_item.cur_pos[1]] = 0;
			g_com.initMap[ret.x][ret.y] = ret.key;
			ai_item.past_pos = ai_item.cur_pos;
			ai_item.cur_pos = [ret.x,ret.y];
			g_com.history[g_com.game_num++] = util.deepClone(ai_item);
			g_com.current_step = g_com.start_juese;
		},time);
	},
	make_move(pos){
		var real_pos = g_com.initPos(pos.x,pos.y);
		var select_item = g_com.mans[this.press_node.name];
		select_item.eatKey = g_com.initMap[pos.x][pos.y];
		if(select_item.eatKey != 0){
			var eat_node = g_com.manNodes[select_item.eatKey];
			var eat_node_com = eat_node.getComponent("qizi_common");
			eat_node.runAction(cc.hide());
			eat_node_com.off_action();
		}
		
		g_com.initMap[select_item.cur_pos[0]][select_item.cur_pos[1]] = 0;
		g_com.initMap[pos.x][pos.y] = this.press_node.name;
		select_item.past_pos = select_item.cur_pos;
		select_item.cur_pos = [pos.x,pos.y];
		g_com.history[g_com.game_num++] = util.deepClone(select_item);
		
		/*设置棋子移动位置*/
		var move = cc.moveTo(0.2,cc.v2(real_pos[0],real_pos[1]));
		var audio_play = cc.callFunc(this.play_audio,this);
		var spawn = cc.spawn(move,audio_play);
		this.press_node.runAction(spawn);
		var mask_move = cc.moveTo(0.2,cc.v2(real_pos[0],real_pos[1]));
		g_com.selectedMark.runAction(cc.sequence(cc.show(),mask_move));
	},
	playResWav(whichWav){
		this.audioSources[whichWav].getComponent(cc.AudioSource).play();
	},
	drawSelected(sq){
		var pos = gGameBoard.NodePos(sq);
		this.selectedMark.setPosition(cc.v2(pos[0],pos[1]));
	},
	moveNode(mv){
		var sqSRC = gGameBoard.SRC(mv);
		var sqDST = gGameBoard.DST(mv);
		var mvNode = gGameBoard.BoardNodes[sqSRC];
		if(mvNode != 0){
			var pos = gGameBoard.NodePos(sqDST);
			var move = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
			var moveMark = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
			mvNode.runAction(move);
			gGameBoard.selectedMark.runAction(moveMark);
		}
	},
	PressFunc(event) {
		var sq = this.getPosFromXY(event.target.getPosition());
		var pc = gGameBoard.BoardMap[sq];
		/*只可以点击自己的棋子*/
		if((pc & gGameBoard.SIDE_TAG(gGameBoard.sdPlayer)) != 0) {
			gGameBoard.sqSelected = sq;
			this.drawSelected(sq);
			this.playResWav(gGameBoard.IDR_CLICK); // 播放点击的声音
		}else if (gGameBoard.sqSelected != 0) {
			// 如果点击的不是自己的子，但有子选中了(一定是自己的子)，那么走这个子
			gGameBoard.mvLast = gGameBoard.MOVE(gGameBoard.sqSelected, sq);
			gGameBoard.MakeMove(gGameBoard.mvLast);
			this.moveNode(gGameBoard.mvLast);
			gGameBoard.sqSelected = 0;
			this.playResWav(gGameBoard.IDR_CAPTURE); // 播放走子或吃子的声音
		}
		cc.log("PressFunc: sq:" + sq + " pc:" + pc + " select:" + gGameBoard.sqSelected);
    },
});

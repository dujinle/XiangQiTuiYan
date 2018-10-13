cc.Class({
    extends: cc.Component,

    properties: {
		selectedMark:cc.Node,
		touchOk:false,
		boardData:null,
		audioSources:{
			type:cc.AudioSource,
			default:[]
		},
		QiNodes:{
			type:cc.Node,
			default:[]
		},
		nodeList:null,
    },

    // use this for initialization
    onLoad: function () {
		this.nodeList = new Array();
		this.node.on("pressed", this.PressFunc, this);
		gCommon.selectedMark = this.selectedMark;
		this.boardData = null;
		this.onTouchAction();
		this.onLoadQzs();
    },
	onTouchAction(){
		this.node.on(cc.Node.EventType.TOUCH_START,this.funcTouchStart,this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.funcTouchEnd,this);
	},
	offTouchAction(){
		this.node.off(cc.Node.EventType.TOUCH_START,this.funcTouchStart,this);
		this.node.off(cc.Node.EventType.TOUCH_END, this.funcTouchEnd,this);
	},
	funcTouchStart(event){
		var target = event.getCurrentTarget();
		var touchLocal = target.convertToNodeSpaceAR(event.getLocation());
		var beginPos = gCommon.BoardPos(0,9);
		var endPos = gCommon.BoardPos(8,0);
		//左右上下增加100像素
		var width = Math.abs(beginPos[0] - endPos[0]) + 100;
		var height = Math.abs(beginPos[1] - endPos[1]) + 100;
		var rect = cc.rect(beginPos[0] - 50,beginPos[1] - 50,width,height);
		if(rect.contains(touchLocal)){
			cc.log("<qipan_node> touch begin org_local: x:" + touchLocal.x + " y:" + touchLocal.y);
			this.touchOk = true;
			return true;
		}
		this.touchOk = false;
		return false;
	},
	funcTouchEnd(event){
		var target = event.getCurrentTarget();
		var touckLocal = target.convertToNodeSpaceAR(event.getLocation());
		if(this.touchOk == true){
			this.clickSquare(touckLocal);
			this.touchOk = false;
		}
	},
	//加载棋子
	onLoadQzs(){
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x, y);
				var pc = gCommon.InitMap[sq];
				if (pc != 0) {
					var tmp = this.QiNodes[pc - 8];
					var qiNode = this.newNode(pc);
					this.node.addChild(qiNode);
					qiNode.setPosition(tmp.getPosition());
					this.nodeList.push(qiNode);
				}
			}
		}
	},
	setStart(){
		this.boardData = {
			"name":"",
			"board":util.deepClone(gBoardGame.BoardMap),
			"start":0,
			"content":""
		};
		for(var i = 0;i < this.nodeList.length;i++){
			this.nodeList[i].getComponent("QzNode").SetPressEvent(false);
		}
		for(var i = 0;i < gBoardGame.BoardNodes.length;i++){
			if(gBoardGame.BoardNodes[i] != null && gBoardGame.BoardNodes[i] != 0){
				gBoardGame.BoardNodes[i].getComponent("QzNode").SetPressEvent(true);
			}
		}
	},
	reGame(){
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x, y);
				var board = this.boardData.board;
				if(board[sq] != 0 && board[sq] != null){
					this.baiQz(sq);
				}
			}
		}
	},
	newNode(key){
		var QzNode = new cc.Node(key);
        QzNode.addComponent(cc.Sprite).spriteFrame = g_assets[gCommon.PngResource[key]];
		QzNode.addComponent("QzNode").SetPressEvent(true);
		cc.log("new node:" + key + " sprite:" + gCommon.PngResource[key]);
		return QzNode;
	},
	//点击棋盘的位置检测是否可以走子
	clickSquare(touckLocal){
		var self = this;
		var sq = this.getPosFromXY(touckLocal);
		cc.log("clickSquare: sq:" + sq);
		/*游戏开始 并且已经点击过棋子*/
		if(gBoardGame.isGameOver > 0 && gBoardGame.sqSelected != 0){
			this.gameMove(sq);
		}
		if(gBoardGame.isGameOver == 0 && gBoardGame.sqSelected != 0){
			this.baiQz(sq);
		}
	},
	//打开其他棋子的点击事件
	setOtherNodePressActive(key,active){
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x,y);
				if(sq != key && gBoardGame.BoardNodes[sq] != 0){
					gBoardGame.BoardNodes[sq].getComponent("QzNode").SetPressEvent(active);
				}
			}
		}
	},
	//修正点击的位置在棋盘的坐标
	getPosFromXY(pos){
		var near_pos = -1;
		var near_dist = Math.exp(10);
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var itemPos = gCommon.BoardPos(x - gCommon.FILE_LEFT,y - gCommon.RANK_TOP);
				var dist = Math.sqrt((pos.x - itemPos[0])*(pos.x - itemPos[0]) + (pos.y - itemPos[1])*(pos.y - itemPos[1]));
				if(dist <= near_dist){
					near_dist = dist;
					near_pos = gCommon.COORD_XY(x,y);
				}
			}
		}
		return near_pos;
	},
	playResWav(whichWav){
		cc.log("playResWav:" + whichWav);
		this.audioSources[whichWav].getComponent(cc.AudioSource).play();
	},
	drawSelected(sq){
		var pos = gCommon.NodePos(sq);
		this.selectedMark.setPosition(cc.v2(pos[0],pos[1]));
		this.selectedMark.runAction(cc.show());
	},
	moveNode(mv,sdPlayer){
		var sqSRC = gCommon.SRC(mv);
		var sqDST = gCommon.DST(mv);
		var srcNode = gBoardGame.BoardNodes[sqSRC];
		var dstNode = gBoardGame.BoardNodes[sqDST];
		if(srcNode != 0){
			cc.log("moveNode	srcNode:" + srcNode.name);
			var pos = gCommon.NodePos(sqDST);
			var move = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
			
			srcNode.runAction(move);
			//如果是电脑走子则隐藏选择框
			if(sdPlayer != 0){
				var moveMark = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
				this.selectedMark.runAction(moveMark);
			}else{
				this.selectedMark.runAction(cc.hide());
			}
		}
		if(dstNode != 0){
			cc.log("moveNode	dstNode:" + dstNode.name);
			dstNode.destroy();
		}
		//更新nodes表
		gBoardGame.BoardNodes[sqDST] = srcNode;
		gBoardGame.BoardNodes[sqSRC] = 0;
	},
	PressFunc(event) {
		if(gBoardGame.isGameOver == 0){
			gBoardGame.sqSelected = event.target;
			this.selectedMark.setPosition(event.target.getPosition());
			this.selectedMark.runAction(cc.show());
			this.playResWav(gCommon.IDR_CLICK); // 播放点击的声音
		}else{
			var sq = this.getPosFromXY(event.target.getPosition());
			var pc = gBoardGame.BoardMap[sq];
			/*只可以点击自己的棋子*/
			if((pc & gCommon.SIDE_TAG(gBoardGame.sdPlayer)) != 0) {
				gBoardGame.sqSelected = sq;
				this.drawSelected(sq);
				this.playResWav(gCommon.IDR_CLICK); // 播放点击的声音
			}else if (gBoardGame.sqSelected != 0) {
				// 如果点击的不是自己的子，但有子选中了(一定是自己的子)，那么走这个子
				this.gameMove(sq);
			}
			cc.log("PressFunc: sq:" + sq + " pc:" + pc + " select:" + gBoardGame.sqSelected);
		}
    },
	//游戏开始之前摆棋子到棋盘的位置
	baiQz(sq){
		cc.log("baiQz:" + gBoardGame.BoardMap[sq]);
		if(gBoardGame.BoardMap[sq] == 0){
			gBoardGame.AddQz(sq,parseInt(gBoardGame.sqSelected.name));
			gBoardGame.BoardNodes[sq] = gBoardGame.sqSelected;
			var pos = gCommon.NodePos(sq);
			var move = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
			gBoardGame.sqSelected.runAction(move);
			var moveMark = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
			this.selectedMark.runAction(cc.sequence(cc.show(),moveMark));
			this.playResWav(gCommon.IDR_MOVE);
			gBoardGame.sqSelected = 0;
		}
	},
	gameMove(sq){
		var self = this;
		var mv = gCommon.MOVE(gBoardGame.sqSelected, sq);
		if (gBoardGame.LegalMove(mv)) {
			if (gBoardGame.MakeMove(mv)) {
				gBoardGame.mvLast = mv;
				gBoardGame.sqSelected = 0;
				this.moveNode(gBoardGame.mvLast,1);
				// 检查重复局面
				var vlRep = gBoardGame.RepStatus(3);
				if (gBoardGame.IsMate()) {
					// 如果分出胜负，那么播放胜负的声音，并且弹出不带声音的提示框
					this.playResWav(gCommon.IDR_WIN);
					this.setOtherNodePressActive(0,false);
					gBoardGame.isGameOver = 0;
				}else if (vlRep > 0) {
					vlRep = gBoardGame.RepValue(vlRep);
					// 注意："vlRep"是对电脑来说的分值
					this.playResWav(vlRep > gCommon.WIN_VALUE ? gCommon.IDR_LOSS : vlRep < -gCommon.WIN_VALUE ? gCommon.IDR_WIN : gCommon.IDR_DRAW);
					this.setOtherNodePressActive(0,false);
					gBoardGame.isGameOver = 0;
				} else if (gBoardGame.nMoveNum > 100) {
					this.playResWav(gCommon.IDR_DRAW);
					this.setOtherNodePressActive(0,false);
					gBoardGame.isGameOver = 0;
				} else {
					// 如果没有分出胜负，那么播放将军、吃子或一般走子的声音
					this.playResWav(gBoardGame.Checked() ? gCommon.IDR_CHECK : gBoardGame.Captured() ? gCommon.IDR_CAPTURE : gCommon.IDR_MOVE);
					if (gBoardGame.Captured()) {
						gBoardGame.SetIrrev();
					}
				}
			} else {
				this.playResWav(gCommon.IDR_ILLEGAL); // 播放被将军的声音
			}
		}
		// 如果根本就不符合走法(例如马不走日字)，那么程序不予理会
	}
});

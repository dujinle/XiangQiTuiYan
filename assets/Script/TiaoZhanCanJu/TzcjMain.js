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
		boardData:null,
		gameNum:cc.Node,
    },
	onLoad(){
		this.setGameButtonsActive(false);
		gBoardGame = new gGameBoard();
	},
    start () {
		this.onLoadCanJu(gGames["马跃檀溪"]);
	},
	setGameButtonsActive(flag){
		this.backButton.getComponent(cc.Button).interactable = flag;
		this.restartButton.getComponent(cc.Button).interactable = flag;
	},
	onLoadCanJu(data){
		cc.log("start load can ju game");
		/*清空棋盘*/
		gBoardGame.ClearBoard();
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x, y);
				if(gBoardGame.BoardNodes[sq] != 0){
					gBoardGame.BoardNodes[sq].destroy();
				}
			}
		}
		//清空选择框
		if(gCommon.selectedMark != null){
			gCommon.selectedMark.runAction(cc.hide());
		}
		
		this.boardData = data;
		if(data != null){
			//棋盘上添加棋子
			for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
				for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
					var sq = gCommon.COORD_XY(x, y);
					var pc = data.board[sq];
					if (pc != 0) {
						var pos = gCommon.BoardPos(x - gCommon.FILE_LEFT,y - gCommon.RANK_TOP);
						var qiNode = this.newNode(sq,pc);
						this.qipan.addChild(qiNode);
						qiNode.setPosition(cc.v2(pos[0],pos[1]));
						gBoardGame.AddQz(sq,pc);
						gBoardGame.BoardNodes[sq] = qiNode;
					}
				}
			}
		}
	},
	newNode(sq,key){
		var QzNode = new cc.Node(sq);
        QzNode.addComponent(cc.Sprite).spriteFrame = g_assets[gCommon.PngResource[key]];
		QzNode.addComponent("QzNode").SetPressEvent(false);
		cc.log("new node:" + key + " sprite:" + gCommon.PngResource[key]);
		return QzNode;
	},
	//重新开始游戏
	gameRestart(){
		this.setGameButtonsActive(false);
		this.startButton.getChildByName("start").active = true;
		this.startButton.getChildByName("stop").active = false;
		this.onLoadCanJu(this.boardData);
	},
	//悔棋
	gameBack(){
		if(gBoardGame.nMoveNum >= 3){
			for(var i = 1;i < 3;i++){
				var backMv = gBoardGame.mvsList[gBoardGame.nMoveNum - 1];
				gBoardGame.UndoMakeMove();
				var wmv = backMv.wmv;
				var spSrc = gCommon.SRC(wmv);
				var spDst = gCommon.DST(wmv);
				cc.log("src:" + spSrc + " dst:" + spDst);
				var pcCaptured = backMv.ucpcCaptured;
				if(gBoardGame.BoardNodes[spDst] != 0){
					var pos = gCommon.NodePos(spSrc);
					var move = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
					gBoardGame.BoardNodes[spDst].runAction(move);
					gBoardGame.BoardNodes[spSrc] = gBoardGame.BoardNodes[spDst];
					gBoardGame.BoardNodes[spDst] = 0;
				}
				if(pcCaptured != 0){
					var pos = gCommon.NodePos(spDst);
					var qiNode = this.newNode(spDst,pcCaptured);
					this.qipan.addChild(qiNode);
					qiNode.setPosition(cc.v2(pos[0],pos[1]));
					gBoardGame.BoardNodes[spDst] = qiNode;
					qiNode.getComponent("QzNode").SetPressEvent(true);
				}
			}
		}
	},
	//开始游戏
	startGame(){
		cc.log("startGame");
		if(gBoardGame.isGameOver == 0){
			//开始游戏
			this.setGameButtonsActive(true);
			this.startButton.getChildByName("start").active = false;
			this.startButton.getChildByName("stop").active = true;
			gBoardGame.isGameOver = 1;
			//游戏开始 棋盘棋子添加点击事件
			this.qipan.getComponent("TzcjQpNode").setOtherNodePressActive(0,true);
		}else{
			//停止游戏
			this.setGameButtonsActive(false);
			this.startButton.getChildByName("start").active = true;
			this.startButton.getChildByName("stop").active = false;
			this.qipan.getComponent("TzcjQpNode").setOtherNodePressActive(0,false);
			gBoardGame.isGameOver = 0;
		}
	},
	onExit(){
		gBoardGame.ClearBoard();
		cc.director.loadScene("MainGameScene");
		this.node.destroy();
		gBoardGame = null;
	},
	update(dt){
		this.gameNum.getComponent(cc.Label).string = gBoardGame.nMoveNum - 1;
	}
});

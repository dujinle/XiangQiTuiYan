cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		qipan:cc.Node,
		//按钮参数
		backButton:cc.Node,
		startButton:cc.Node,
		clearButton:cc.Node,
		restartButton:cc.Node,
		//标签参数
		currStepLabel:cc.Node,
		pastStepLabel:cc.Node,
		stepNumLabel:cc.Node,
	},
	onLoad () {
		gBoardGame = new gGameBoard();
		this.setGameButtonsActive(false);
		
		this.currStepLabel.getComponent(cc.Label).string = "";
		this.pastStepLabel.getComponent(cc.Label).string = "";
		this.stepNumLabel.getComponent(cc.Label).string = "";
		this.initGameQz();
		this.node.on("itemPress", this.itemPressFunc, this);
	},
	setGameButtonsActive(flag){
		this.backButton.getComponent(cc.Button).interactable = flag;
		this.restartButton.getComponent(cc.Button).interactable = flag;
		this.clearButton.getComponent(cc.Button).interactable = flag;
	},
	//加载棋子
	initGameQz(){
		gBoardGame.ClearBoard();
		
		for (var sq = 0; sq < gCommon.InitMap.length; sq ++) {
			var pc = gCommon.InitMap[sq];
			if (pc != 0) {
				var tmp = this.qipan.getComponent("XqtyQpNode").QiNodes[pc - 8];
				var qiNode = this.newNode(pc);
				this.qipan.addChild(qiNode);
				qiNode.setPosition(tmp.getPosition());
				gBoardGame.BoardNodes[sq] = qiNode;
				gCommon.nodeDic[pc].push(qiNode);
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
	/*重新开始游戏*/
	gameRestart(){
		this.clearGame();
		this.qipan.getComponent("XqtyQpNode").reGame(this.boardData);
	},
	/*游戏结束棋子归位到原来的位置*/
	clearGame(){
		this.startButton.getChildByName("start").active = true;
		this.startButton.getChildByName("stop").active = false;
		this.setGameButtonsActive(false);
		/*清空棋盘*/
		for(var key in gCommon.nodeDic){
			while(gCommon.nodeDic.length > 0){
				gCommon.nodeDic.shift();
			}
		}
		for (var sq = 0; sq < gCommon.InitMap.length; sq ++) {
			var pc = gCommon.InitMap[sq];
			if (pc != 0) {
				gCommon.nodeDic[pc].push(gBoardGame.BoardNodes[sq]);
			}
		}
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x, y);
				var pc = gBoardGame.BoardMap[sq];
				if(gBoardGame.BoardNodes[sq] != 0 && gBoardGame.BoardNodes[sq] != null){
					var tmp = this.qipan.getComponent("XqtyQpNode").QiNodes[pc - 8];
					gBoardGame.BoardNodes[sq].setPosition(tmp.getPosition());
				}
			}
		}
		//清空选择框
		if(gCommon.selectedMark != null){
			gCommon.selectedMark.runAction(cc.hide());
		}
		gBoardGame.ClearBoard();
	},
	//悔棋
	gameBack(){
		if(gBoardGame.nMoveNum >= 2){
			for(var i = 1;i < 2;i++){
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
		//清空选择框
		if(gCommon.selectedMark != null){
			gCommon.selectedMark.runAction(cc.hide());
		}
		if(gBoardGame.isGameOver == 0){
			//开始游戏
			this.startButton.getChildByName("start").active = false;
			this.startButton.getChildByName("stop").active = true;
			gBoardGame.isGameOver = 1;
			this.setGameButtonsActive(true);
			this.boardData = {
				"name":"",
				"board":util.deepClone(gBoardGame.BoardMap),
				"start":0,
				"content":""
			};
			this.setQqzAction();
		}else{
			//停止游戏
			this.setGameButtonsActive(false);
			this.startButton.getChildByName("start").active = true;
			this.startButton.getChildByName("stop").active = false;
			gBoardGame.isGameOver = 0;
		}
	},
	//关闭棋盘外的棋子action 打开棋盘内的棋子action
	setQqzAction(){
		for(var i = 0;i < gBoardGame.BoardNodes.length;i++){
			if(gBoardGame.BoardNodes[i] != null && gBoardGame.BoardNodes[i] != 0){
				gBoardGame.BoardNodes[i].getComponent("QzNode").SetPressEvent(false);
			}
		}
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x, y);
				var pc = gBoardGame.BoardMap[sq];
				if(gBoardGame.BoardNodes[sq] != 0 && gBoardGame.BoardNodes[sq] != null){
					gBoardGame.BoardNodes[sq].getComponent("QzNode").SetPressEvent(true);
				}
			}
		}
	},
	onExit(){
		gBoardGame.ClearBoard();
		cc.director.loadScene("MainGameScene");
	},
	PopToolMenu(){
		this.PMenu = cc.instantiate(g_assets["PopToolMenu"]);
		this.node.addChild(this.PMenu);
		this.PMenu.setPosition(this.node.convertToNodeSpaceAR(cc.v2(cc.winSize.width/2,cc.winSize.height/2)));
	},
	itemPressFunc(event){
		cc.log("itemPressFunc");
		if(event.target.name == "tupian_content"){
			var popItem = event.target.getComponent("WebView");
			//加载棋子位置修正界面
			this.PSelect = cc.instantiate(g_assets["PopSelectPos"]);
			this.node.addChild(this.PSelect);
			this.PSelect.setPosition(this.node.convertToNodeSpaceAR(cc.v2(cc.winSize.width/2,cc.winSize.height/2)));
			this.PSelect.getComponent("PopSelectPos").data = popItem.data;
			this.PMenu.destroy();
		}else if(event.target.name == "PopSelectPos"){
			var popItem = event.target.getComponent("PopSelectPos");
			this.clearGame();
			this.qipan.getComponent("XqtyQpNode").reGame(popItem.data);
			this.PSelect.destroy();
		}else{
			var popItem = event.target.getComponent("PopSvItem");
			this.clearGame();
			this.qipan.getComponent("XqtyQpNode").reGame(popItem.data);
			this.PMenu.destroy();
		}
	},
	update(dt){
		this.currStepLabel.getComponent(cc.Label).string = "黑";
		this.pastStepLabel.getComponent(cc.Label).string = "红";
		this.stepNumLabel.getComponent(cc.Label).string = "";
	}
});

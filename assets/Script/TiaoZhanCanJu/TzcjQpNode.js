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
		var self = this;
		var sq = this.getPosFromXY(touckLocal);
		cc.log("clickSquare: sq:" + sq);
		/*游戏开始 并且已经点击过棋子*/
		if(gGameBoard.isGameOver > 0 && gGameBoard.sqSelected != 0){
			var mv = gGameBoard.MOVE(gGameBoard.sqSelected, sq);
			if (gGameBoard.LegalMove(mv)) {
				var mvObj = {"mv":mv,"pcCaptured":0};
				if (gGameBoard.MakeMove(mvObj)) {
					gGameBoard.mvLast = gGameBoard.MOVE(gGameBoard.sqSelected, sq);
					this.moveNode(gGameBoard.mvLast,1);
					gGameBoard.sqSelected = 0;
					if (gGameBoard.IsMate()) {
						// 如果分出胜负，那么播放胜负的声音，并且弹出不带声音的提示框
						this.playResWav(gGameBoard.IDR_WIN);
						this.setOtherNodePressActive(0,false);
					} else {
						// 如果没有分出胜负，那么播放将军、吃子或一般走子的声音
						this.playResWav(gGameBoard.Checked() ? gGameBoard.IDR_CHECK : gGameBoard.IDR_MOVE);
						setTimeout(function(){
							self.responseMove();
						},500);
					}
				} else {
					this.playResWav(gGameBoard.IDR_ILLEGAL); // 播放被将军的声音
				}
			}
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
	
	// 电脑回应一步棋
	responseMove(){
		// 电脑走一步棋
		gGameBoard.SearchMain();
		cc.log("responseMove:" + gGameBoard.mvResult);
		var mvObj = {"mv":gGameBoard.mvResult,"pcCaptured":0};
		gGameBoard.MakeMove(mvObj);
		gGameBoard.mvLast = gGameBoard.mvResult;
		this.moveNode(gGameBoard.mvLast,0);

		if (gGameBoard.IsMate()) {
			// 如果分出胜负，那么播放胜负的声音，并且弹出不带声音的提示框
			this.playResWav(gGameBoard.IDR_LOSS);
			this.setOtherNodePressActive(0,false);
		} else {
			// 如果没有分出胜负，那么播放将军、吃子或一般走子的声音
			this.playResWav(gGameBoard.Checked() ? gGameBoard.IDR_CHECK : mvObj.pcCaptured != 0 ? gGameBoard.IDR_CAPTURE : gGameBoard.IDR_MOVE);
		}
	},
	playResWav(whichWav){
		this.audioSources[whichWav].getComponent(cc.AudioSource).play();
	},
	drawSelected(sq){
		var pos = gGameBoard.NodePos(sq);
		this.selectedMark.setPosition(cc.v2(pos[0],pos[1]));
		gGameBoard.selectedMark.runAction(cc.show());
	},
	moveNode(mv,sdPlayer){
		var sqSRC = gGameBoard.SRC(mv);
		var sqDST = gGameBoard.DST(mv);
		var srcNode = gGameBoard.BoardNodes[sqSRC];
		var dstNode = gGameBoard.BoardNodes[sqDST];
		if(srcNode != 0){
			cc.log("moveNode	srcNode:" + srcNode.name);
			var pos = gGameBoard.NodePos(sqDST);
			var move = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
			
			srcNode.runAction(move);
			//如果是电脑走子则隐藏选择框
			if(sdPlayer != 0){
				var moveMark = cc.moveTo(0.2,cc.v2(pos[0],pos[1]));
				gGameBoard.selectedMark.runAction(moveMark);
			}else{
				gGameBoard.selectedMark.runAction(cc.hide());
			}
		}
		if(dstNode != 0){
			cc.log("moveNode	dstNode:" + dstNode.name);
			dstNode.runAction(cc.hide());
		}
		//更新nodes表
		gGameBoard.BoardNodes[sqDST] = srcNode;
		gGameBoard.BoardNodes[sqSRC] = 0;
	},
	PressFunc(event) {
		var self = this;
		var sq = this.getPosFromXY(event.target.getPosition());
		var pc = gGameBoard.BoardMap[sq];
		/*只可以点击自己的棋子*/
		if((pc & gGameBoard.SIDE_TAG(gGameBoard.sdPlayer)) != 0) {
			gGameBoard.sqSelected = sq;
			this.drawSelected(sq);
			this.playResWav(gGameBoard.IDR_CLICK); // 播放点击的声音
		}else if (gGameBoard.sqSelected != 0) {
			// 如果点击的不是自己的子，但有子选中了(一定是自己的子)，那么走这个子
			var mv = gGameBoard.MOVE(gGameBoard.sqSelected, sq);
			if (gGameBoard.LegalMove(mv)) {
				if (gGameBoard.MakeMove(mv)) {
					gGameBoard.mvLast = gGameBoard.MOVE(gGameBoard.sqSelected, sq);
					this.moveNode(gGameBoard.mvLast,1);
					gGameBoard.sqSelected = 0;
					if (gGameBoard.IsMate()) {
						// 如果分出胜负，那么播放胜负的声音，并且弹出不带声音的提示框
						this.playResWav(gGameBoard.IDR_WIN);
						this.setOtherNodePressActive(0,false);
					} else {
						// 如果没有分出胜负，那么播放将军、吃子或一般走子的声音
						this.playResWav(gGameBoard.Checked() ? gGameBoard.IDR_CHECK : gGameBoard.IDR_CAPTURE);
						setTimeout(function(){
							self.responseMove();
						},500);
					}
				} else {
					this.playResWav(gGameBoard.IDR_ILLEGAL); // 播放被将军的声音
				}
			}
			// 如果根本就不符合走法(例如马不走日字)，那么程序不予理会
		}
		cc.log("PressFunc: sq:" + sq + " pc:" + pc + " select:" + gGameBoard.sqSelected);
    },
});

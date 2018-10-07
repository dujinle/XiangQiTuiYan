gGameBoard = {};

// 棋子编号
gGameBoard.PIECE_KING = 0;
gGameBoard.PIECE_ADVISOR = 1;
gGameBoard.PIECE_BISHOP = 2;
gGameBoard.PIECE_KNIGHT = 3;
gGameBoard.PIECE_ROOK = 4;
gGameBoard.PIECE_CANNON = 5;
gGameBoard.PIECE_PAWN = 6;

// 棋盘范围
gGameBoard.RANK_TOP		= 3;
gGameBoard.RANK_BOTTOM 	= 12;
gGameBoard.FILE_LEFT 	= 3;
gGameBoard.FILE_RIGHT 	= 11;

gGameBoard.IDR_CLICK 	= 0;
gGameBoard.IDR_CAPTURE 	= 1;
gGameBoard.IDR_MOVE 	= 2;
gGameBoard.IDR_WIN 		= 3;
gGameBoard.IDR_CHECK 	= 4;
gGameBoard.IDR_ILLEGAL	= 5;
gGameBoard.IDR_LOSS 	= 6;

// 其他常数
gGameBoard.MAX_GEN_MOVES 	= 128; // 最大的生成走法数
gGameBoard.LIMIT_DEPTH 		= 32;    // 最大的搜索深度
gGameBoard.MATE_VALUE 		= 10000;  // 最高分值，即将死的分值
gGameBoard.WIN_VALUE 		= gGameBoard.MATE_VALUE - 100; // 搜索出胜负的分值界限，超出此值就说明已经搜索出杀棋了
gGameBoard.ADVANCED_VALUE 	= 3;  // 先行权分值
gGameBoard.CLOCKS_PER_SEC 	= 1000;// 1秒 的毫秒数

gGameBoard.selectedMark = null;
//棋局状态信息
gGameBoard.BoardMap = new Array(256);
gGameBoard.BoardNodes = new Array(256); //棋子的node信息
gGameBoard.sdPlayer = 0;			// 轮到谁走，0=红方，1=黑方
gGameBoard.isGameOver = 0;			// 0=没有开始，1=开始，2=结束
gGameBoard.sqSelected = 0;			//选中的棋子
gGameBoard.mvLast = 0;				//最近的一次移动位置
gGameBoard.nDistance = 0;			// 距离根节点的步数

// 红、黑双方的子力价值
gGameBoard.vlWhite = 0;
gGameBoard.vlBlack = 0;           

gGameBoard.ClearBoard = function(){
	gGameBoard.sdPlayer = 0;
	gGameBoard.isGameOver = 0;
	gGameBoard.sqSelected = 0;
	gGameBoard.mvLast = 0;
	gGameBoard.nDistance = 0;
	for(var i = 0;i < gGameBoard.BoardMap.length;i++){
		gGameBoard.BoardMap[i] = 0;
		gGameBoard.BoardNodes[i] = 0;
	}
}

// 获得格子的横坐标
gGameBoard.RANK_Y = function(sq) {
	return sq >> 4;
}

// 获得格子的纵坐标
gGameBoard.FILE_X = function(sq) {
	return sq & 15;
}
// 判断棋子是否在棋盘中
gGameBoard.IN_BOARD = function(sq) {
  return gCommon.ccInBoard[sq] != 0;
}

// 判断棋子是否在九宫中
gGameBoard.IN_FORT = function(sq) {
  return gCommon.ccInFort[sq] != 0;
}

gGameBoard.NodePos = function(sq){
	var y = (sq >> 4) - gGameBoard.RANK_TOP;
	var x = (sq & 15) - gGameBoard.FILE_LEFT;
	return gCommon.BoardPos(x,y);
}
// 根据纵坐标和横坐标获得格子
gGameBoard.COORD_XY = function(x,y) {
	return x + (y << 4);
}

// 走法是否符合帅(将)的步长
gGameBoard.KING_SPAN = function(sqSrc,sqDst){
  return gCommon.ccLegalSpan[sqDst - sqSrc + 256] == 1;
}

// 走法是否符合仕(士)的步长
gGameBoard.ADVISOR_SPAN = function(sqSrc,sqDst) {
  return gCommon.ccLegalSpan[sqDst - sqSrc + 256] == 2;
}

// 走法是否符合相(象)的步长
gGameBoard.BISHOP_SPAN = function(sqSrc,sqDst) {
  return gCommon.ccLegalSpan[sqDst - sqSrc + 256] == 3;
}

// 相(象)眼的位置
gGameBoard.BISHOP_PIN = function(sqSrc,sqDst) {
  return (sqSrc + sqDst) >> 1;
}

// 马腿的位置
gGameBoard.KNIGHT_PIN = function(sqSrc,sqDst) {
  return sqSrc + gCommon.ccKnightPin[sqDst - sqSrc + 256];
}

// 格子水平镜像
gGameBoard.SQUARE_FORWARD = function(sq,sd) {
  return sq - 16 + (sd << 5);
}

// 翻转格子
gGameBoard.SQUARE_FLIP = function(sq) {
  return 254 - sq;
}

// 是否未过河
gGameBoard.HOME_HALF = function(sq,sd) {
  return (sq & 0x80) != (sd << 7);
}

// 是否已过河
gGameBoard.AWAY_HALF = function(sq,sd) {
  return (sq & 0x80) == (sd << 7);
}

// 是否在河的同一边
gGameBoard.SAME_HALF = function(sqSrc,sqDst) {
  return ((sqSrc ^ sqDst) & 0x80) == 0;
}

// 是否在同一行
gGameBoard.SAME_RANK = function(sqSrc,sqDst) {
  return ((sqSrc ^ sqDst) & 0xf0) == 0;
}

// 是否在同一列
gGameBoard.SAME_FILE = function(sqSrc,sqDst) {
  return ((sqSrc ^ sqDst) & 0x0f) == 0;
}

gGameBoard.ChangeSide = function() {         // 交换走子方
    gGameBoard.sdPlayer = 1 - gGameBoard.sdPlayer;
}

gGameBoard.AddQz = function(sq,pc) { // 在棋盘上放一枚棋子
    gGameBoard.BoardMap[sq] = pc;
	// 红方加分，黑方(注意"cucvlPiecePos"取值要颠倒)减分
    if (pc < 16) {
		gGameBoard.vlWhite += gCommon.cucvlPiecePos[pc - 8][sq];
    } else {
		gGameBoard.vlBlack += gCommon.cucvlPiecePos[pc - 16][gGameBoard.SQUARE_FLIP(sq)];
    }
}

gGameBoard.DelQz = function(sq,pc) {         // 从棋盘上拿走一枚棋子
	gGameBoard.BoardMap[sq] = 0;
	// 红方加分，黑方(注意"cucvlPiecePos"取值要颠倒)减分
    if (pc < 16) {
		gGameBoard.vlWhite -= gCommon.cucvlPiecePos[pc - 8][sq];
    } else {
		gGameBoard.vlBlack -= gCommon.cucvlPiecePos[pc - 16][gGameBoard.SQUARE_FLIP(sq)];
    }
}

// 获得红黑标记(红子是8，黑子是16)
gGameBoard.SIDE_TAG = function(sd) {
	return 8 + (sd << 3);
}

// 获得对方红黑标记
gGameBoard.OPP_SIDE_TAG = function(sd) {
  return 16 - (sd << 3);
}

// 根据起点和终点获得走法
gGameBoard.MOVE = function(sqSrc,sqDst) {
	return sqSrc + sqDst * 256;
}
// 获得走法的起点
gGameBoard.SRC = function(mv) {
	return mv & 255;
}

// 获得走法的终点
gGameBoard.DST = function(mv) {
	return mv >> 8;
}

// 搬一步棋的棋子
gGameBoard.MovePiece = function(mv) {
	var sqSrc = gGameBoard.SRC(mv);
	var sqDst = gGameBoard.DST(mv);
	var pc = gGameBoard.BoardMap[sqSrc];
	var pcCaptured = gGameBoard.BoardMap[sqDst];
	
	if(pcCaptured != 0){
		gGameBoard.DelQz(sqDst,pcCaptured);
	}
	gGameBoard.DelQz(sqSrc,pc);
	gGameBoard.AddQz(sqDst, pc);
	return pcCaptured;
}

// 撤消搬一步棋的棋子
gGameBoard.UndoMovePiece = function(mv,pcCaptured) {
	var sqSrc = gGameBoard.SRC(mv);
	var sqDst = gGameBoard.DST(mv);
	var pc = gGameBoard.BoardMap[sqDst];
	gGameBoard.DelQz(sqDst,pc);
	gGameBoard.AddQz(sqSrc, pc);
	if(pcCaptured != 0){
		gGameBoard.AddQz(sqDst, pcCaptured);
	}
}


gGameBoard.MakeMove = function(mvObj) {         // 走一步棋
	mvObj.pcCaptured = gGameBoard.MovePiece(mvObj.mv);
	if (gGameBoard.Checked()) {
		gGameBoard.UndoMovePiece(mvObj.mv, mvObj.pcCaptured);
		return false;
	}
	gGameBoard.ChangeSide();
	gGameBoard.nDistance++;
	return true;
}

gGameBoard.UndoMakeMove = function(mvObj) { // 撤消走一步棋
    gGameBoard.nDistance--;
    gGameBoard.ChangeSide();
    gGameBoard.UndoMovePiece(mvObj.mv, mvObj.pcCaptured);
}

gGameBoard.Evaluate = function(){      // 局面评价函数
    return (gGameBoard.sdPlayer == 0 ? gGameBoard.vlWhite - gGameBoard.vlBlack : gGameBoard.vlBlack - gGameBoard.vlWhite) + gGameBoard.ADVANCED_VALUE;
}

// 生成所有走法
gGameBoard.GenerateMoves = function(){

	// 生成所有走法，需要经过以下几个步骤：
	var mvs = new Array();
	var pcSelfSide = gGameBoard.SIDE_TAG(gGameBoard.sdPlayer);
	var pcOppSide = gGameBoard.OPP_SIDE_TAG(gGameBoard.sdPlayer);
	for (var sqSrc = 0; sqSrc < 256; sqSrc ++) {

		// 1. 找到一个本方棋子，再做以下判断：
		var pcSrc = gGameBoard.BoardMap[sqSrc];
		if ((pcSrc & pcSelfSide) == 0) {
			continue;
		}

		// 2. 根据棋子确定走法
		switch (pcSrc - pcSelfSide) {
		case gGameBoard.PIECE_KING:
			for (var i = 0; i < 4; i ++) {
				sqDst = sqSrc + gCommon.ccKingDelta[i];
				if (!gGameBoard.IN_FORT(sqDst)) {
					continue;
				}
				var pcDst = gGameBoard.BoardMap[sqDst];
				if ((pcDst & pcSelfSide) == 0) {
					mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
				}
			}
			break;
		case gGameBoard.PIECE_ADVISOR:
			for (var i = 0; i < 4; i ++) {
				sqDst = sqSrc + gCommon.ccAdvisorDelta[i];
				if (!gGameBoard.IN_FORT(sqDst)) {
					continue;
				}
				var pcDst = gGameBoard.BoardMap[sqDst];
				if ((pcDst & pcSelfSide) == 0) {
					mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
				}
			}
			break;
		case gGameBoard.PIECE_BISHOP:
			for (var i = 0; i < 4; i ++) {
				var sqDst = sqSrc + gCommon.ccAdvisorDelta[i];
				if (!(gGameBoard.IN_BOARD(sqDst) && gGameBoard.HOME_HALF(sqDst, gGameBoard.sdPlayer) && gGameBoard.BoardMap[sqDst] == 0)) {
					continue;
				}
				sqDst += gCommon.ccAdvisorDelta[i];
				var pcDst = gGameBoard.BoardMap[sqDst];
				if ((pcDst & pcSelfSide) == 0) {
					mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
				}
			}
			break;
		case gGameBoard.PIECE_KNIGHT:
			for (var i = 0; i < 4; i ++) {
				var sqDst = sqSrc + gCommon.ccKingDelta[i];
				if (gGameBoard.BoardMap[sqDst] != 0) {
					continue;
				}
				for (var j = 0; j < 2; j ++) {
					sqDst = sqSrc + gCommon.ccKnightDelta[i][j];
					if (!gGameBoard.IN_BOARD(sqDst)) {
						continue;
					}
					var pcDst = gGameBoard.BoardMap[sqDst];
					if ((pcDst & pcSelfSide) == 0) {
						mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
					}
				}
			}
			break;
		case gGameBoard.PIECE_ROOK:
			for (var i = 0; i < 4; i ++) {
				var nDelta = gCommon.ccKingDelta[i];
				var sqDst = sqSrc + nDelta;
				while (gGameBoard.IN_BOARD(sqDst)) {
					var pcDst = gGameBoard.BoardMap[sqDst];
					if (pcDst == 0) {
						mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
					} else {
						if ((pcDst & pcOppSide) != 0) {
							mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
						}
						break;
					}
					sqDst += nDelta;
				}
			}
			break;
		case gGameBoard.PIECE_CANNON:
			for (var i = 0; i < 4; i ++) {
				var nDelta = gCommon.ccKingDelta[i];
				var sqDst = sqSrc + nDelta;
				while (gGameBoard.IN_BOARD(sqDst)) {
					var pcDst = gGameBoard.BoardMap[sqDst];
					if (pcDst == 0) {
						mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
					} else {
						break;
					}
					sqDst += nDelta;
				}
				sqDst += nDelta;
				while (gGameBoard.IN_BOARD(sqDst)) {
					var pcDst = gGameBoard.BoardMap[sqDst];
					if (pcDst != 0) {
						if ((pcDst & pcOppSide) != 0) {
							mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
						}
						break;
					}
					sqDst += nDelta;
				}
			}
			break;
		case gGameBoard.PIECE_PAWN:
			var sqDst = gGameBoard.SQUARE_FORWARD(sqSrc, gGameBoard.sdPlayer);
			if (gGameBoard.IN_BOARD(sqDst)) {
				var pcDst = gGameBoard.BoardMap[sqDst];
				if ((pcDst & pcSelfSide) == 0) {
					mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
				}
			}
			if (gGameBoard.AWAY_HALF(sqSrc, gGameBoard.sdPlayer)) {
				for (var nDelta = -1; nDelta <= 1; nDelta += 2) {
					var sqDst = sqSrc + nDelta;
					if(gGameBoard.IN_BOARD(sqDst)) {
						var pcDst = gGameBoard.BoardMap[sqDst];
						if ((pcDst & pcSelfSide) == 0) {
							mvs.push(gGameBoard.MOVE(sqSrc, sqDst));
						}
					}
				}
			}
			break;
		}
	}
	return mvs;
}

// 判断走法是否合理
gGameBoard.LegalMove = function(mv){
  // 判断走法是否合法，需要经过以下的判断过程：

  // 1. 判断起始格是否有自己的棋子
	var sqSrc = gGameBoard.SRC(mv);
	var pcSrc = gGameBoard.BoardMap[sqSrc];
	var pcSelfSide = gGameBoard.SIDE_TAG(gGameBoard.sdPlayer);
	if ((pcSrc & pcSelfSide) == 0) {
		return false;
	}

	// 2. 判断目标格是否有自己的棋子
	var sqDst = gGameBoard.DST(mv);
	var pcDst = gGameBoard.BoardMap[sqDst];
	if ((pcDst & pcSelfSide) != 0) {
		return false;
	}

	// 3. 根据棋子的类型检查走法是否合理
	switch (pcSrc - pcSelfSide) {
	case gGameBoard.PIECE_KING: 		//老将
		return gGameBoard.IN_FORT(sqDst) && gGameBoard.KING_SPAN(sqSrc, sqDst);
	case gGameBoard.PIECE_ADVISOR:		//士
		return gGameBoard.IN_FORT(sqDst) && gGameBoard.ADVISOR_SPAN(sqSrc, sqDst);
	case gGameBoard.PIECE_BISHOP:		//相
		return gGameBoard.SAME_HALF(sqSrc, sqDst) && gGameBoard.BISHOP_SPAN(sqSrc, sqDst) &&
			gGameBoard.BoardMap[gGameBoard.BISHOP_PIN(sqSrc, sqDst)] == 0;
	case gGameBoard.PIECE_KNIGHT:		//马
		var sqPin = gGameBoard.KNIGHT_PIN(sqSrc, sqDst);
		return sqPin != sqSrc && gGameBoard.BoardMap[sqPin] == 0;
	case gGameBoard.PIECE_ROOK:			//车
	case gGameBoard.PIECE_CANNON:			//炮
		var nDelta = -1;
		if (gGameBoard.SAME_RANK(sqSrc, sqDst)){	//同行
			nDelta = (sqDst < sqSrc ? -1 : 1);
		} else if (gGameBoard.SAME_FILE(sqSrc, sqDst)) {		//同列
			nDelta = (sqDst < sqSrc ? -16 : 16);
		} else {
			return false;
		}
		var sqPin = sqSrc + nDelta;
		while (sqPin != sqDst && gGameBoard.BoardMap[sqPin] == 0) {
			sqPin += nDelta;
		}
		if (sqPin == sqDst) {
			return pcDst == 0 || pcSrc - pcSelfSide == gGameBoard.PIECE_ROOK;
		} else if (pcDst != 0 && pcSrc - pcSelfSide == gGameBoard.PIECE_CANNON) {
			sqPin += nDelta;
			while (sqPin != sqDst && gGameBoard.BoardMap[sqPin] == 0) {
				sqPin += nDelta;
			}
			return sqPin == sqDst;
		} else {
			return false;
		}
	case gGameBoard.PIECE_PAWN:			//兵
		if (gGameBoard.AWAY_HALF(sqDst, gGameBoard.sdPlayer) && (sqDst == sqSrc - 1 || sqDst == sqSrc + 1)) {
			return true;
		}
		return sqDst == gGameBoard.SQUARE_FORWARD(sqSrc, gGameBoard.sdPlayer);
	default:
		return false;
	}
}

// 判断是否被将军
gGameBoard.Checked = function(){
	var pcSelfSide = gGameBoard.SIDE_TAG(gGameBoard.sdPlayer);
	var pcOppSide = gGameBoard.OPP_SIDE_TAG(gGameBoard.sdPlayer);
	// 找到棋盘上的帅(将)，再做以下判断：

	for (var sqSrc = 0; sqSrc < 256; sqSrc ++) {
		if (gGameBoard.BoardMap[sqSrc] != pcSelfSide + gGameBoard.PIECE_KING) {
			continue;
		}

		// 1. 判断是否被对方的兵(卒)将军
		if (gGameBoard.BoardMap[gGameBoard.SQUARE_FORWARD(sqSrc, gGameBoard.sdPlayer)] == pcOppSide + gGameBoard.PIECE_PAWN) {
			return true;
		}
		for (var nDelta = -1; nDelta <= 1; nDelta += 2) {
			if (gGameBoard.BoardMap[sqSrc + nDelta] == pcOppSide + gGameBoard.PIECE_PAWN) {
				return true;
			}
		}

		// 2. 判断是否被对方的马将军(以仕(士)的步长当作马腿)
		for (var i = 0; i < 4; i ++) {
			if (gGameBoard.BoardMap[sqSrc + gCommon.ccAdvisorDelta[i]] != 0) {
				continue;
			}
			for (j = 0; j < 2; j ++) {
				var pcDst = gGameBoard.BoardMap[sqSrc + gCommon.ccKnightCheckDelta[i][j]];
				if (pcDst == pcOppSide + gGameBoard.PIECE_KNIGHT) {
					return true;
				}
			}
		}

		// 3. 判断是否被对方的车或炮将军(包括将帅对脸)
		for (var i = 0; i < 4; i ++) {
			var nDelta = gCommon.ccKingDelta[i];
			var sqDst = sqSrc + nDelta;
			while (gGameBoard.IN_BOARD(sqDst)) {
				var pcDst = gGameBoard.BoardMap[sqDst];
				if (pcDst != 0) {
					if (pcDst == pcOppSide + gGameBoard.PIECE_ROOK || pcDst == pcOppSide + gGameBoard.PIECE_KING) {
						return true;
					}
					break;
				}
				sqDst += nDelta;
			}
			sqDst += nDelta;
			while (gGameBoard.IN_BOARD(sqDst)) {
				var pcDst = gGameBoard.BoardMap[sqDst];
				if (pcDst != 0) {
					if (pcDst == pcOppSide + gGameBoard.PIECE_CANNON) {
						return true;
					}
					break;
				}
				sqDst += nDelta;
			}
		}
		return false;
	}
	return false;
}
// 判断是否被杀
gGameBoard.IsMate = function(){
	var mvs = gGameBoard.GenerateMoves();
	for (var i = 0; i < mvs.length; i ++) {
		var pcCaptured = gGameBoard.MovePiece(mvs[i]);
		if (!gGameBoard.Checked()) {
			gGameBoard.UndoMovePiece(mvs[i], pcCaptured);
			return false;
		} else {
			gGameBoard.UndoMovePiece(mvs[i], pcCaptured);
		}
	}
	return true;
}

// 电脑走的棋
gGameBoard.mvResult = 0;
// 历史表
gGameBoard.nHistoryTable = new Array(65536);
// "qsort"按历史表排序的比较函数
gGameBoard.CompareHistory = function(mv1,mv2) {
  return gGameBoard.nHistoryTable[mv2] - gGameBoard.nHistoryTable[mv1];
}
// 超出边界(Fail-Soft)的Alpha-Beta搜索过程
gGameBoard.SearchFull = function(vlAlpha,vlBeta,nDepth) {
	// 一个Alpha-Beta完全搜索分为以下几个阶段

	// 1. 到达水平线，则返回局面评价值
	if (nDepth == 0) {
		return gGameBoard.Evaluate();
	}

	// 2. 初始化最佳值和最佳走法
	var vlBest = -gGameBoard.MATE_VALUE; // 这样可以知道，是否一个走法都没走过(杀棋)
	var mvBest = 0;           // 这样可以知道，是否搜索到了Beta走法或PV走法，以便保存到历史表

	// 3. 生成全部走法，并根据历史表排序
	var mvs = gGameBoard.GenerateMoves();
	mvs.sort(gGameBoard.CompareHistory);


	// 4. 逐一走这些走法，并进行递归
	for (var i = 0; i < mvs.length; i ++) {
		var mvObj = {"mv":mvs[i], "pcCaptured":0};
		if (gGameBoard.MakeMove(mvObj)) {
			var vl = -gGameBoard.SearchFull(-vlBeta, -vlAlpha, nDepth - 1);
			gGameBoard.UndoMakeMove(mvObj);

			// 5. 进行Alpha-Beta大小判断和截断
			if (vl > vlBest) {    // 找到最佳值(但不能确定是Alpha、PV还是Beta走法)
				vlBest = vl;        // "vlBest"就是目前要返回的最佳值，可能超出Alpha-Beta边界
				if (vl >= vlBeta) { // 找到一个Beta走法
					mvBest = mvs[i];  // Beta走法要保存到历史表
					break;            // Beta截断
				}
				if (vl > vlAlpha) { // 找到一个PV走法
					mvBest = mvs[i];  // PV走法要保存到历史表
					vlAlpha = vl;     // 缩小Alpha-Beta边界
				}
			}
		}
	}

	// 5. 所有走法都搜索完了，把最佳走法(不能是Alpha走法)保存到历史表，返回最佳值
	if (vlBest == -gGameBoard.MATE_VALUE) {
		// 如果是杀棋，就根据杀棋步数给出评价
		return gGameBoard.nDistance - gGameBoard.MATE_VALUE;
	}
	if (mvBest != 0) {
		// 如果不是Alpha走法，就将最佳走法保存到历史表
		gGameBoard.nHistoryTable[mvBest] += nDepth * nDepth;
		if (gGameBoard.nDistance == 0) {
			// 搜索根节点时，总是有一个最佳走法(因为全窗口搜索不会超出边界)，将这个走法保存下来
			gGameBoard.mvResult = mvBest;
		}
	}
	return vlBest;
}

// 迭代加深搜索过程
gGameBoard.SearchMain = function(){

	// 初始化
	for(var i = 0;i < 65536;i++){
		gGameBoard.nHistoryTable[i] = 0;// 清空历史表
	}
	var t = Date.now();       // 初始化定时器
	gGameBoard.nDistance = 0; // 初始步数

	// 迭代加深过程
	for (var i = 1; i <= gGameBoard.LIMIT_DEPTH; i ++) {
		var vl = gGameBoard.SearchFull(-gGameBoard.MATE_VALUE, gGameBoard.MATE_VALUE, i);
		// 搜索到杀棋，就终止搜索
		if (vl > gGameBoard.WIN_VALUE || vl < -gGameBoard.WIN_VALUE) {
			break;
		}
		// 超过一秒，就终止搜索
		if (Date.now() - t > gGameBoard.CLOCKS_PER_SEC) {
			cc.log("search time finish");
			break;
		}
	}
}











/*


// 纵坐标水平镜像
inline int FILE_FLIP(int x) {
  return 14 - x;
}

// 横坐标垂直镜像
inline int RANK_FLIP(int y) {
  return 15 - y;
}



// 获得对方红黑标记
inline int OPP_SIDE_TAG(int sd) {
  return 16 - (sd << 3);
}




*/
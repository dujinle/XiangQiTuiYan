cc.log("load GameBoard......");
// RC4密码流生成器
function RC4Struct(){
	this.x = 0;
	this.y = 0;
	this.s = new Array(256);
}

RC4Struct.prototype = {
	constructor:RC4Struct,
	NextByte:function() {  // 生成密码流的下一个字节
		this.x = (this.x + 1) & 255;
		this.y = (this.y + this.s[this.x]) & 255;
		var uc = this.s[this.x];
		this.s[this.x] = this.s[this.y];
		this.s[this.y] = uc;
		return this.s[(this.s[this.x] + this.s[this.y]) & 255];
	},
	NextLong:function() { // 生成密码流的下四个字节
		var uc0 = this.NextByte();
		var uc1 = this.NextByte();
		var uc2 = this.NextByte();
		var uc3 = this.NextByte();
		return uc0 + (uc1 << 8) + (uc2 << 16) + (uc3 << 24);
	},
	InitZero:function() {	// 用空密钥初始化密码流生成器
		this.x = 0;
		this.y = 0;
		for (var i = 0; i < 256; i ++) {
			this.s[i] = i;
		}
		for (var i = 0; i < 256; i ++) {
			var j = (j + this.s[i]) & 255;
			var uc = this.s[i];
			this.s[i] = this.s[j];
			this.s[j] = uc;
		}
	}
}

// Zobrist结构
function ZobristStruct(){
	this.dwKey 		= 0;
	this.dwLock0 	= 0;
	this.dwLock1 	= 0;
}

ZobristStruct.prototype = {
	constructor:ZobristStruct,
	InitZero:function() {                 // 用零填充Zobrist
		this.dwKey 		= 0;
		this.dwLock0 	= 0;
		this.dwLock1 	= 0
	},
	InitRC4:function(rc4) {        // 用密码流填充Zobrist
		this.dwKey = rc4.NextLong();
		this.dwLock0 = rc4.NextLong();
		this.dwLock1 = rc4.NextLong();
	},
	Xor:function(zobr) { // 执行XOR操作
		this.dwKey ^= zobr.dwKey;
		this.dwLock0 ^= zobr.dwLock0;
		this.dwLock1 ^= zobr.dwLock1;
	},
	Xor2:function(zobr1,zobr2) {
		this.dwKey ^= zobr1.dwKey ^ zobr2.dwKey;
		this.dwLock0 ^= zobr1.dwLock0 ^ zobr2.dwLock0;
		this.dwLock1 ^= zobr1.dwLock1 ^ zobr2.dwLock1;
	}
}

// 历史走法信息
function MoveStruct(){
	this.wmv 			= 0;
	this.ucpcCaptured 	= 0;
	this.ucbCheck 		= false;
	this.dwKey 			= 0;
}

MoveStruct.prototype = {
	constructor:MoveStruct,
	Set:function(mv,pcCaptured,bCheck,dwKey_) {
		this.wmv = mv;
		this.ucpcCaptured = pcCaptured;
		this.ucbCheck = bCheck;
		this.dwKey = dwKey_;
	}
}

// Zobrist表
Zobrist = {}
Zobrist.Player = new ZobristStruct();
Zobrist.Table = new Array(14);

Zobrist.InitZobrist = function() {	// 初始化Zobrist表
	var rc4 = new RC4Struct();
	rc4.InitZero();
	Zobrist.Player.InitRC4(rc4);
	for (var i = 0; i < 14; i ++) {
		var items = new Array(256);
		for (var j = 0; j < 256; j ++) {
			items[j] = new ZobristStruct();
			items[j].InitRC4(rc4);
		}
		Zobrist.Table[i] = items;
	}
}

// "qsort"按历史表排序的比较函数
CompareHistory = function(mv1,mv2) {
	return Search.nHistoryTable[mv2] - Search.nHistoryTable[mv1];
}
	// 求MVV/LVA值
MvvLva = function(mv) {
	return (gCommon.cucMvvLva[gCommon.BoardMap[gCommon.DST(mv)]] << 3) - gCommon.cucMvvLva[gCommon.BoardMap[gCommon.SRC(mv)]];
}
// "qsort"按MVV/LVA值排序的比较函数
CompareMvvLva = function(mv1,mv2) {
	return MvvLva(mv2) - MvvLva(mv1);
}

function gGameBoard(){
	cc.log("new gGameBoard start");
	this.BoardMap = gCommon.BoardMap;		//棋局状态信息
	this.BoardNodes = new Array(256); 	//棋子的node信息
	this.sdPlayer = 0;					// 轮到谁走，0=红方，1=黑方
	this.isGameOver = 0;				// 0=没有开始，1=开始，2=结束
	this.sqSelected = 0;				//选中的棋子
	this.mvsList = new Array();			//历史走法信息列表
	this.nDistance = 0;					// 距离根节点的步数
	this.nMoveNum = 0;					//棋子走的步数
	this.mvLast = 0;					//上一步棋


	// 红、黑双方的子力价值
	this.vlWhite = 0;
	this.vlBlack = 0;
	this.zobr = new ZobristStruct();	// Zobrist
	for(var i = 0;i < gCommon.MAX_MOVES;i++){
		this.mvsList.push(new MoveStruct());
	}
}

gGameBoard.prototype = {
	constructor:gGameBoard,
	SetIrrev:function() {           // 清空(初始化)历史走法信息
		this.mvsList[0].Set(0, 0, this.Checked(), this.zobr.dwKey);
		//this.nMoveNum = 1;
	},
	InCheck:function(){      // 是否被将军
		return this.mvsList[this.nMoveNum - 1].ucbCheck;
	},
	Captured:function(){     // 上一步是否吃子
		return this.mvsList[this.nMoveNum - 1].ucpcCaptured != 0;
	},
	ClearBoard:function(){
		this.sdPlayer = 0;
		this.isGameOver = 0;
		this.sqSelected = 0;
		this.nDistance = 0;
		this.vlWhite = 0;
		this.vlBlack = 0;
		this.nMoveNum = 1;
		this.mvLast = 0;
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x, y);
				this.BoardMap[sq] = 0;
				this.BoardNodes[sq] = 0;
			}
		}
		this.zobr.InitZero();
		this.SetIrrev();
		Zobrist.InitZobrist();
	},
	ChangeSide:function() {         // 交换走子方
		this.sdPlayer = 1 - this.sdPlayer;
		this.zobr.Xor(Zobrist.Player);
	},
	AddQz:function(sq,pc) { // 在棋盘上放一枚棋子
		this.BoardMap[sq] = pc;
		// 红方加分，黑方(注意"cucvlPiecePos"取值要颠倒)减分
		if (pc < 16 && pc != 0) {
			this.vlWhite += gCommon.cucvlPiecePos[pc - 8][sq];
			this.zobr.Xor(Zobrist.Table[pc - 8][sq]);
		} else if(pc != 0){
			this.vlBlack += gCommon.cucvlPiecePos[pc - 16][gCommon.SQUARE_FLIP(sq)];
			this.zobr.Xor(Zobrist.Table[pc - 9][sq]);
		}
	},
	DelQz:function(sq,pc) {         // 从棋盘上拿走一枚棋子
		this.BoardMap[sq] = 0;
		//cc.log("DelQz:" + sq + " " + pc);
		// 红方加分，黑方(注意"cucvlPiecePos"取值要颠倒)减分
		if (pc < 16 && pc != 0) {
			this.vlWhite -= gCommon.cucvlPiecePos[pc - 8][sq];
			this.zobr.Xor(Zobrist.Table[pc - 8][sq]);
		} else if(pc != 0){
			this.vlBlack -= gCommon.cucvlPiecePos[pc - 16][gCommon.SQUARE_FLIP(sq)];
			this.zobr.Xor(Zobrist.Table[pc - 9][sq]);
		}
	},
	// 搬一步棋的棋子
	MovePiece:function(mv) {
		var sqSrc = gCommon.SRC(mv);
		var sqDst = gCommon.DST(mv);
		var pcCaptured = this.BoardMap[sqDst];
		//cc.log("MakeMove pc:" + this.BoardMap[sqSrc] + " sqSrc:" + sqSrc + " sqDst:" + sqDst);
		
		if(pcCaptured != 0){
			this.DelQz(sqDst,pcCaptured);
		}
		var pc = this.BoardMap[sqSrc];
		this.DelQz(sqSrc,pc);
		this.AddQz(sqDst,pc);
		return pcCaptured;
	},
	// 撤消搬一步棋的棋子
	UndoMovePiece:function(mv,pcCaptured) {
		var sqSrc = gCommon.SRC(mv);
		var sqDst = gCommon.DST(mv);
		var pc = this.BoardMap[sqDst];
		this.DelQz(sqDst,pc);
		this.AddQz(sqSrc,pc);
		if(pcCaptured != 0){
			this.AddQz(sqDst, pcCaptured);
		}
	},
	NullMove:function() {                       // 走一步空步
		var dwKey = this.zobr.dwKey;
		this.ChangeSide();
		this.mvsList[this.nMoveNum].Set(0, 0, false, dwKey);
		this.nMoveNum ++;
		this.nDistance ++;
	},
	UndoNullMove:function() {                   // 撤消走一步空步
		this.nDistance --;
		this.nMoveNum --;
		this.ChangeSide();
	},
	NullOkay:function(){                 // 判断是否允许空步裁剪
		return (this.sdPlayer == 0 ? this.vlWhite : this.vlBlack) > gCommon.NULL_MARGIN;
	},
	MakeMove:function(mv) {         // 走一步棋
		var pcCaptured = this.MovePiece(mv);
		var dwKey = this.zobr.dwKey;
		if (this.Checked()) {
			this.UndoMovePiece(mv,pcCaptured);
			return false;
		}
		this.ChangeSide();
		this.mvsList[this.nMoveNum].Set(mv, pcCaptured, this.Checked(), dwKey);
		this.nDistance++;
		this.nMoveNum ++;
		return true;
	},
	UndoMakeMove:function() { // 撤消走一步棋
		this.nDistance--;
		this.nMoveNum--;
		this.ChangeSide();
		var mv = this.mvsList[this.nMoveNum];
		this.UndoMovePiece(mv.wmv, mv.ucpcCaptured);
	},
	Evaluate:function(){      // 局面评价函数
		return (this.sdPlayer == 0 ? this.vlWhite - this.vlBlack : this.vlBlack - this.vlWhite) + gCommon.ADVANCED_VALUE;
	},
	// 生成所有走法
	GenerateMoves:function(bCapture){
		// 生成所有走法，需要经过以下几个步骤：
		var mvs = new Array();
		var pcSelfSide = gCommon.SIDE_TAG(this.sdPlayer);
		var pcOppSide = gCommon.OPP_SIDE_TAG(this.sdPlayer);
		for (var sqSrc = 0; sqSrc < 256; sqSrc ++) {

			// 1. 找到一个本方棋子，再做以下判断：
			var pcSrc = this.BoardMap[sqSrc];
			if ((pcSrc & pcSelfSide) == 0) {
				continue;
			}

			// 2. 根据棋子确定走法
			switch (pcSrc - pcSelfSide) {
			case gCommon.PIECE_KING:		//老将
				for (var i = 0; i < 4; i ++) {
					var sqDst = sqSrc + gCommon.ccKingDelta[i];
					if (!gCommon.IN_FORT(sqDst)) {
						continue;
					}
					var pcDst = this.BoardMap[sqDst];
					if (bCapture ? (pcDst & pcOppSide) != 0 : (pcDst & pcSelfSide) == 0) {
						mvs.push(gCommon.MOVE(sqSrc, sqDst));
					}
				}
				break;
			case gCommon.PIECE_ADVISOR:		//士
				for (var i = 0; i < 4; i ++) {
					var sqDst = sqSrc + gCommon.ccAdvisorDelta[i];
					if (!gCommon.IN_FORT(sqDst)) {
						continue;
					}
					var pcDst = this.BoardMap[sqDst];
					if (bCapture ? (pcDst & pcOppSide) != 0 : (pcDst & pcSelfSide) == 0) {
						mvs.push(gCommon.MOVE(sqSrc, sqDst));
					}
				}
				break;
			case gCommon.PIECE_BISHOP:		//相
				for (var i = 0; i < 4; i ++) {
					var sqDst = sqSrc + gCommon.ccAdvisorDelta[i];
					if (!(gCommon.IN_BOARD(sqDst) && gCommon.HOME_HALF(sqDst, this.sdPlayer) && this.BoardMap[sqDst] == 0)) {
						continue;
					}
					sqDst += gCommon.ccAdvisorDelta[i];
					var pcDst = this.BoardMap[sqDst];
					if (bCapture ? (pcDst & pcOppSide) != 0 : (pcDst & pcSelfSide) == 0) {
						mvs.push(gCommon.MOVE(sqSrc, sqDst));
					}
				}
				break;
			case gCommon.PIECE_KNIGHT:		//马
				for (var i = 0; i < 4; i ++) {
					var sqDst = sqSrc + gCommon.ccKingDelta[i];
					if (this.BoardMap[sqDst] != 0) {
						continue;
					}
					for (var j = 0; j < 2; j ++) {
						sqDst = sqSrc + gCommon.ccKnightDelta[i][j];
						if (!gCommon.IN_BOARD(sqDst)) {
							continue;
						}
						var pcDst = this.BoardMap[sqDst];
						if (bCapture ? (pcDst & pcOppSide) != 0 : (pcDst & pcSelfSide) == 0) {
							mvs.push(gCommon.MOVE(sqSrc, sqDst));
						}
					}
				}
				break;
			case gCommon.PIECE_ROOK:		//车
				for (var i = 0; i < 4; i ++) {
					var nDelta = gCommon.ccKingDelta[i];
					var sqDst = sqSrc + nDelta;
					while (gCommon.IN_BOARD(sqDst)) {
						var pcDst = this.BoardMap[sqDst];
						if (pcDst == 0) {
							if(!bCapture){
								mvs.push(gCommon.MOVE(sqSrc, sqDst));
							}
						} else {
							if ((pcDst & pcOppSide) != 0) {
								mvs.push(gCommon.MOVE(sqSrc, sqDst));
							}
							break;
						}
						sqDst += nDelta;
					}
				}
				break;
			case gCommon.PIECE_CANNON:		//炮
				for (var i = 0; i < 4; i ++) {
					var nDelta = gCommon.ccKingDelta[i];
					var sqDst = sqSrc + nDelta;
					while (gCommon.IN_BOARD(sqDst)) {
						var pcDst = this.BoardMap[sqDst];
						if (pcDst == 0) {
							if(!bCapture){
								mvs.push(gCommon.MOVE(sqSrc, sqDst));
							}
						} else {
							break;
						}
						sqDst += nDelta;
					}
					sqDst += nDelta;
					while (gCommon.IN_BOARD(sqDst)) {
						var pcDst = this.BoardMap[sqDst];
						if (pcDst != 0) {
							if ((pcDst & pcOppSide) != 0) {
								mvs.push(gCommon.MOVE(sqSrc, sqDst));
							}
							break;
						}
						sqDst += nDelta;
					}
				}
				break;
			case gCommon.PIECE_PAWN:		//兵
				var sqDst = gCommon.SQUARE_FORWARD(sqSrc, this.sdPlayer);
				if (gCommon.IN_BOARD(sqDst)) {
					var pcDst = this.BoardMap[sqDst];
					if (bCapture ? (pcDst & pcOppSide) != 0 : (pcDst & pcSelfSide) == 0) {
						mvs.push(gCommon.MOVE(sqSrc, sqDst));
					}
				}
				if (gCommon.AWAY_HALF(sqSrc, this.sdPlayer)) {
					for (var nDelta = -1; nDelta <= 1; nDelta += 2) {
						var sqDst = sqSrc + nDelta;
						if(gCommon.IN_BOARD(sqDst)) {
							var pcDst = this.BoardMap[sqDst];
							if (bCapture ? (pcDst & pcOppSide) != 0 : (pcDst & pcSelfSide) == 0) {
								mvs.push(gCommon.MOVE(sqSrc, sqDst));
							}
						}
					}
				}
				break;
			}
		}
		return mvs;
	},
	// 判断走法是否合理
	LegalMove:function(mv){
	  // 判断走法是否合法，需要经过以下的判断过程：

	  // 1. 判断起始格是否有自己的棋子
		var sqSrc = gCommon.SRC(mv);
		var pcSrc = this.BoardMap[sqSrc];
		var pcSelfSide = gCommon.SIDE_TAG(this.sdPlayer);
		if ((pcSrc & pcSelfSide) == 0) {
			return false;
		}

		// 2. 判断目标格是否有自己的棋子
		var sqDst = gCommon.DST(mv);
		var pcDst = this.BoardMap[sqDst];
		if ((pcDst & pcSelfSide) != 0) {
			return false;
		}

		// 3. 根据棋子的类型检查走法是否合理
		switch (pcSrc - pcSelfSide) {
		case gCommon.PIECE_KING: 		//老将
			return gCommon.IN_FORT(sqDst) && gCommon.KING_SPAN(sqSrc, sqDst);
		case gCommon.PIECE_ADVISOR:		//士
			return gCommon.IN_FORT(sqDst) && gCommon.ADVISOR_SPAN(sqSrc, sqDst);
		case gCommon.PIECE_BISHOP:		//相
			return gCommon.SAME_HALF(sqSrc, sqDst) && gCommon.BISHOP_SPAN(sqSrc, sqDst) &&
				this.BoardMap[gCommon.BISHOP_PIN(sqSrc, sqDst)] == 0;
		case gCommon.PIECE_KNIGHT:		//马
			var sqPin = gCommon.KNIGHT_PIN(sqSrc, sqDst);
			return sqPin != sqSrc && this.BoardMap[sqPin] == 0;
		case gCommon.PIECE_ROOK:			//车
		case gCommon.PIECE_CANNON:			//炮
			var nDelta = -1;
			if (gCommon.SAME_RANK(sqSrc, sqDst)){	//同行
				nDelta = (sqDst < sqSrc ? -1 : 1);
			} else if (gCommon.SAME_FILE(sqSrc, sqDst)) {		//同列
				nDelta = (sqDst < sqSrc ? -16 : 16);
			} else {
				return false;
			}
			var sqPin = sqSrc + nDelta;
			while (sqPin != sqDst && this.BoardMap[sqPin] == 0) {
				sqPin += nDelta;
			}
			if (sqPin == sqDst) {
				return pcDst == 0 || pcSrc - pcSelfSide == gCommon.PIECE_ROOK;
			} else if (pcDst != 0 && pcSrc - pcSelfSide == gCommon.PIECE_CANNON) {
				sqPin += nDelta;
				while (sqPin != sqDst && this.BoardMap[sqPin] == 0) {
					sqPin += nDelta;
				}
				return sqPin == sqDst;
			} else {
				return false;
			}
		case gCommon.PIECE_PAWN:			//兵
			if (gCommon.AWAY_HALF(sqDst, this.sdPlayer) && (sqDst == sqSrc - 1 || sqDst == sqSrc + 1)) {
				return true;
			}
			return sqDst == gCommon.SQUARE_FORWARD(sqSrc, this.sdPlayer);
		default:
			return false;
		}
	},
	// 判断是否被将军
	Checked:function(){
		var pcSelfSide = gCommon.SIDE_TAG(this.sdPlayer);
		var pcOppSide = gCommon.OPP_SIDE_TAG(this.sdPlayer);
		// 找到棋盘上的帅(将)，再做以下判断：

		for (var sqSrc = 0; sqSrc < 256; sqSrc ++) {
			if (this.BoardMap[sqSrc] != pcSelfSide + gCommon.PIECE_KING) {
				continue;
			}

			// 1. 判断是否被对方的兵(卒)将军
			if (this.BoardMap[gCommon.SQUARE_FORWARD(sqSrc, this.sdPlayer)] == pcOppSide + gCommon.PIECE_PAWN) {
				return true;
			}
			for (var nDelta = -1; nDelta <= 1; nDelta += 2) {
				if (this.BoardMap[sqSrc + nDelta] == pcOppSide + gCommon.PIECE_PAWN) {
					return true;
				}
			}

			// 2. 判断是否被对方的马将军(以仕(士)的步长当作马腿)
			for (var i = 0; i < 4; i ++) {
				if (this.BoardMap[sqSrc + gCommon.ccAdvisorDelta[i]] != 0) {
					continue;
				}
				for (j = 0; j < 2; j ++) {
					var pcDst = this.BoardMap[sqSrc + gCommon.ccKnightCheckDelta[i][j]];
					if (pcDst == pcOppSide + gCommon.PIECE_KNIGHT) {
						return true;
					}
				}
			}

			// 3. 判断是否被对方的车或炮将军(包括将帅对脸)
			for (var i = 0; i < 4; i ++) {
				var nDelta = gCommon.ccKingDelta[i];
				var sqDst = sqSrc + nDelta;
				while (gCommon.IN_BOARD(sqDst)) {
					var pcDst = this.BoardMap[sqDst];
					if (pcDst != 0) {
						if (pcDst == pcOppSide + gCommon.PIECE_ROOK || pcDst == pcOppSide + gCommon.PIECE_KING) {
							return true;
						}
						break;
					}
					sqDst += nDelta;
				}
				sqDst += nDelta;
				while (gCommon.IN_BOARD(sqDst)) {
					var pcDst = this.BoardMap[sqDst];
					if (pcDst != 0) {
						if (pcDst == pcOppSide + gCommon.PIECE_CANNON) {
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
	},
	// 判断是否被杀
	IsMate:function(){
		var mvs = this.GenerateMoves(false);
		for (var i = 0; i < mvs.length; i ++) {
			var pcCaptured = this.MovePiece(mvs[i]);
			if (!this.Checked()) {
				this.UndoMovePiece(mvs[i], pcCaptured);
				return false;
			} else {
				this.UndoMovePiece(mvs[i], pcCaptured);
			}
		}
		return true;
	},
	// 检测重复局面
	DrawValue:function(){                 // 和棋分值
		return (this.nDistance & 1) == 0 ? -gCommon.DRAW_VALUE : gCommon.DRAW_VALUE;
	},
	RepStatus:function(nRecur){
		var idx = 1;
		var bSelfSide = false;
		var bPerpCheck = true;
		var bOppPerpCheck = true;
		var lpmvs = this.mvsList[this.nMoveNum - idx];
		while (lpmvs.wmv != 0 && lpmvs.ucpcCaptured == 0) {
			if (bSelfSide) {
				bPerpCheck = bPerpCheck && lpmvs.ucbCheck;
				if (lpmvs.dwKey == this.zobr.dwKey) {
					nRecur --;
					if (nRecur == 0) {
						return 1 + (bPerpCheck ? 2 : 0) + (bOppPerpCheck ? 4 : 0);
					}
				}
			} else {
				bOppPerpCheck = bOppPerpCheck && lpmvs.ucbCheck;
			}
			bSelfSide = !bSelfSide;
			idx = idx + 1;
			lpmvs = this.mvsList[this.nMoveNum - idx];
		}
		return 0;
	},
	RepValue:function(nRepStatus){        // 重复局面分值
		var vlReturn = ((nRepStatus & 2) == 0 ? 0 : this.nDistance - gCommon.MATE_VALUE) +
			((nRepStatus & 4) == 0 ? 0 : gCommon.MATE_VALUE - this.nDistance);
		return vlReturn == 0 ? this.DrawValue() : vlReturn;
	},
	// 静态(Quiescence)搜索过程
	SearchQuiesc:function(vlAlpha,vlBeta) {
		// 一个静态搜索分为以下几个阶段

		// 1. 检查重复局面
		var mvs = [];
		var vl = this.RepStatus();
		if (vl != 0) {
			return this.RepValue(vl);
		}

		// 2. 到达极限深度就返回局面评价
		if (this.nDistance == gCommon.LIMIT_DEPTH) {
			return this.Evaluate();
		}

		// 3. 初始化最佳值
		var vlBest = -gCommon.MATE_VALUE; // 这样可以知道，是否一个走法都没走过(杀棋)

		if (this.InCheck()) {
			// 4. 如果被将军，则生成全部走法
			mvs = this.GenerateMoves(false);
			mvs.sort(CompareHistory);
		} else {
			// 5. 如果不被将军，先做局面评价
			vl = this.Evaluate();
			if (vl > vlBest) {
				vlBest = vl;
				if (vl >= vlBeta) {
					return vl;
				}
				if (vl > vlAlpha) {
					vlAlpha = vl;
				}
			}

			// 6. 如果局面评价没有截断，再生成吃子走法
			mvs = this.GenerateMoves(true);
			mvs.sort(CompareMvvLva);
		}

		// 7. 逐一走这些走法，并进行递归
		for (var i = 0; i < mvs.length; i ++) {
			if (this.MakeMove(mvs[i])) {
				vl = -this.SearchQuiesc(-vlBeta, -vlAlpha);
				this.UndoMakeMove();

				// 8. 进行Alpha-Beta大小判断和截断
				if (vl > vlBest) {    // 找到最佳值(但不能确定是Alpha、PV还是Beta走法)
					vlBest = vl;        // "vlBest"就是目前要返回的最佳值，可能超出Alpha-Beta边界
					if (vl >= vlBeta) { // 找到一个Beta走法
						return vl;        // Beta截断
					}
					if (vl > vlAlpha) { // 找到一个PV走法
						vlAlpha = vl;     // 缩小Alpha-Beta边界
					}
				}
			}
		}
		// 9. 所有走法都搜索完了，返回最佳值
		return vlBest == -gCommon.MATE_VALUE ? this.nDistance - gCommon.MATE_VALUE : vlBest;
	},
	// 超出边界(Fail-Soft)的Alpha-Beta搜索过程
	SearchFull:function(vlAlpha,vlBeta,nDepth,bNoNull) {
		// 一个Alpha-Beta完全搜索分为以下几个阶段
		var HashSort = new SortStruct();
		var mvHash = 0;
		if (this.nDistance > 0) {
			// 1. 到达水平线，则调用静态搜索(注意：由于空步裁剪，深度可能小于零)
			if (nDepth <= 0) {
				return this.SearchQuiesc(vlAlpha, vlBeta);
			}

			// 1-1. 检查重复局面(注意：不要在根节点检查，否则就没有走法了)
			var vl = this.RepStatus();
			if (vl != 0) {
				return this.RepValue(vl);
			}

			// 1-2. 到达极限深度就返回局面评价
			if (this.nDistance == gCommon.LIMIT_DEPTH) {
				return this.Evaluate();
			}
			var param = {"vlAlpha":vlAlpha,"vlBeta":vlBeta,"nDepth":nDepth,"mv":mvHash};
			 // 1-3. 尝试置换表裁剪，并得到置换表走法
			var vl = HashTable.ProbeHash(param,this);
			if (vl > -gCommon.MATE_VALUE) {
				return vl;
			}
			// 1-4. 尝试空步裁剪(根节点的Beta值是"MATE_VALUE"，所以不可能发生空步裁剪)
			if (!bNoNull && !this.InCheck() && this.NullOkay()) {
				this.NullMove();
				var vl = -this.SearchFull(-vlBeta, 1 - vlBeta, nDepth - gCommon.NULL_DEPTH - 1, true);
				this.UndoNullMove();
				if (vl >= vlBeta) {
					return vl;
				}
			}
			mvHash = param.mv;
		}
		// 2. 初始化最佳值和最佳走法
		var nHashFlag = gCommon.HASH_ALPHA;
		var vlBest = -gCommon.MATE_VALUE; // 这样可以知道，是否一个走法都没走过(杀棋)
		var mvBest = 0;           // 这样可以知道，是否搜索到了Beta走法或PV走法，以便保存到历史表

		// 3. 初始化走法排序结构
		HashSort.Init(mvHash,this);
		// 4. 逐一走这些走法，并进行递归
		var mv = 0;
		while ((mv = HashSort.Next(this)) != 0) {
			//cc.log("HashSort.Next:" + mv);
			if (this.MakeMove(mv)) {
				// 将军延伸
				var vl = -this.SearchFull(-vlBeta, -vlAlpha, this.InCheck() ? nDepth : nDepth - 1,false);
				this.UndoMakeMove();

				// 5. 进行Alpha-Beta大小判断和截断
				if (vl > vlBest) {    // 找到最佳值(但不能确定是Alpha、PV还是Beta走法)
					vlBest = vl;        // "vlBest"就是目前要返回的最佳值，可能超出Alpha-Beta边界
					if (vl >= vlBeta) { // 找到一个Beta走法
						nHashFlag = gCommon.HASH_BETA;
						mvBest = mv;      // Beta走法要保存到历史表
						break;            // Beta截断
					}
					if (vl > vlAlpha) { // 找到一个PV走法
						nHashFlag = gCommon.HASH_PV;
						mvBest = mv;      // PV走法要保存到历史表
						vlAlpha = vl;     // 缩小Alpha-Beta边界
					}
				}
			}
		}
		// 5. 所有走法都搜索完了，把最佳走法(不能是Alpha走法)保存到历史表，返回最佳值
		if (vlBest == -gCommon.MATE_VALUE) {
			// 如果是杀棋，就根据杀棋步数给出评价
			return this.nDistance - gCommon.MATE_VALUE;
		}

		// 记录到置换表
		HashTable.RecordHash({"nHashFlag":nHashFlag,"vlBest":vlBest,"nDepth":nDepth,"mv":mvBest},this);
		if (mvBest != 0) {
			// 如果不是Alpha走法，就将最佳走法保存到历史表
			HashTable.SetBestMove(mvBest, nDepth,this);
			if (this.nDistance == 0) {
				// 搜索根节点时，总是有一个最佳走法(因为全窗口搜索不会超出边界)，将这个走法保存下来
				Search.mvResult = mvBest;
			}
		}
		return vlBest;
	},
	// 迭代加深搜索过程
	SearchMain:function(){
		// 初始化
		Search.Init();
		var t = Date.now();       // 初始化定时器
		this.nDistance = 0; // 初始步数

		// 迭代加深过程
		for (var i = 1; i <= gCommon.LIMIT_DEPTH; i ++) {
			var vl = this.SearchFull(-gCommon.MATE_VALUE, gCommon.MATE_VALUE, i,false);
			// 搜索到杀棋，就终止搜索
			if (vl > gCommon.WIN_VALUE || vl < -gCommon.WIN_VALUE) {
				break;
			}
			// 超过一秒，就终止搜索
			if (Date.now() - t > gCommon.CLOCKS_PER_SEC) {
				cc.log("search time finish");
				break;
			}
		}
	}
}

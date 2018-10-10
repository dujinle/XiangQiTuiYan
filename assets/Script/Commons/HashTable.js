cc.log("load HashTable......");
// 置换表项结构
function HashItem(){
	this.ucDepth 	= 0;
	this.ucFlag		= 0;
	this.sv1		= 0;
	this.wmv		= 0;
	this.wReserved	= 0;
	this.dwLock0	= 0;
	this.dwLock1	= 0;
};

// 与搜索有关的全局变量
Search = {};
Search.nHistoryTable = new Array(65536);	// 历史表
Search.mvResult = 0;						// 电脑走的棋
Search.mvKillers = new Array(gCommon.LIMIT_DEPTH);	// 杀手走法表
Search.HashTable = new Array(gCommon.HASH_SIZE);	// 置换表

Search.Init = function(){
	Search.mvResult = 0;
	for(var i = 0;i < 65536;i++){
		Search.nHistoryTable[i] = 0;// 清空历史表
	}
	for(var i = 0;i < gCommon.LIMIT_DEPTH;i++){
		Search.mvKillers[i] = [0,0];
	}
	for(var i = 0;i < gCommon.HASH_SIZE;i++){
		Search.HashTable[i] = new HashItem();// 清空历史表
	}
}

HashTable = {};
// 提取置换表项
//param = {vlAlpha,vlBeta,nDepth,mv}
HashTable.ProbeHash = function(param,pos) {
	var hsh = Search.HashTable[pos.zobr.dwKey & (gCommon.HASH_SIZE - 1)];
	if (hsh.dwLock0 != pos.zobr.dwLock0 || hsh.dwLock1 != pos.zobr.dwLock1) {
		param.mv = 0;
		return -gCommon.MATE_VALUE;
	}
	param.mv = hsh.wmv;
	var bMate = false;// 杀棋标志：如果是杀棋，那么不需要满足深度条件
	if (hsh.svl > gCommon.WIN_VALUE) {
		hsh.svl -= pos.nDistance;
		bMate = true;
	} else if (hsh.svl < -gCommon.WIN_VALUE) {
		hsh.svl += pos.nDistance;
		bMate = true;
	}
	if (hsh.ucDepth >= param.nDepth || bMate) {
		if (hsh.ucFlag == gCommon.HASH_BETA) {
			return (hsh.svl >= param.vlBeta ? hsh.svl : -gCommon.MATE_VALUE);
		} else if (hsh.ucFlag == gCommon.HASH_ALPHA) {
			return (hsh.svl <= param.vlAlpha ? hsh.svl : -gCommon.MATE_VALUE);
		}
		return hsh.svl;
	}
	return -gCommon.MATE_VALUE;
}

// 保存置换表项
//param = {nFlag,vl,nDepth,mv}
HashTable.RecordHash = function(param,pos) {
	cc.log(JSON.stringify(param));
	var hsh = Search.HashTable[pos.zobr.dwKey & (gCommon.HASH_SIZE - 1)];
	if (hsh.ucDepth > param.nDepth) {
		return;
	}
	hsh.ucFlag = param.nFlag;
	hsh.ucDepth = param.nDepth;
	if (param.vl > gCommon.WIN_VALUE) {
		hsh.svl = param.vl + pos.nDistance;
	} else if (param.vl < -gCommon.WIN_VALUE) {
		hsh.svl = param.vl - pos.nDistance;
	} else {
		hsh.svl = param.vl;
	}
	hsh.wmv = param.mv;
	hsh.dwLock0 = pos.zobr.dwLock0;
	hsh.dwLock1 = pos.zobr.dwLock1;
	Search.HashTable[pos.zobr.dwKey & (gCommon.HASH_SIZE - 1)] = hsh;
}

// 对最佳走法的处理
HashTable.SetBestMove = function(mv,nDepth,pos){
	Search.nHistoryTable[mv] += nDepth * nDepth;
	var lpmvKillers = Search.mvKillers[pos.nDistance];
	if (lpmvKillers[0] != mv) {
		lpmvKillers[1] = lpmvKillers[0];
		lpmvKillers[0] = mv;
	}
}

// 走法排序结构
SortStruct = function(){
	// 置换表走法和两个杀手走法
	this.mvHash 	= 0;
	this.mvKiller1 	= 0;
	this.mvKiller2 	= 0;
	// 当前阶段，当前采用第几个走法，总共有几个走法
	this.nPhase		= 0;
	this.nIndex		= 0;
	// 所有的走法
	this.mvs		= null;
};

SortStruct.prototype = {
	constructor:SortStruct,
	Init:function(mvHash_,pos){		// 初始化，设定置换表走法和两个杀手走法
		this.mvHash = mvHash_;
		this.mvKiller1 = Search.mvKillers[pos.nDistance][0];
		this.mvKiller2 = Search.mvKillers[pos.nDistance][1];
		this.nPhase = gCommon.PHASE_HASH;
	},
	Next:function(pos){
		switch (this.nPhase) {
			// "nPhase"表示着法启发的若干阶段，依次为：
			// 0. 置换表着法启发，完成后立即进入下一阶段；
			case gCommon.PHASE_HASH:
				this.nPhase = gCommon.PHASE_KILLER_1;
				if (this.mvHash != 0) {
					return this.mvHash;
				}
			// 技巧：这里没有"break"，表示"switch"的上一个"case"执行完后紧接着做下一个"case"，下同
			// 1. 杀手着法启发(第一个杀手着法)，完成后立即进入下一阶段；
			case gCommon.PHASE_KILLER_1:
				this.nPhase = gCommon.PHASE_KILLER_2;
				if (this.mvKiller1 != this.mvHash && this.mvKiller1 != 0 && pos.LegalMove(this.mvKiller1)) {
					return this.mvKiller1;
				}
			// 2. 杀手着法启发(第二个杀手着法)，完成后立即进入下一阶段；
			case gCommon.PHASE_KILLER_2:
				this.nPhase = gCommon.PHASE_GEN_MOVES;
				if (this.mvKiller2 != this.mvHash && this.mvKiller2 != 0 && pos.LegalMove(this.mvKiller2)) {
					return this.mvKiller2;
				}
			// 3. 生成所有着法，完成后立即进入下一阶段；
			case gCommon.PHASE_GEN_MOVES:
				this.nPhase = gCommon.PHASE_REST;
				this.mvs = pos.GenerateMoves(false);
				this.mvs.sort(CompareHistory);
				this.nIndex = 0;
			// 4. 对剩余着法做历史表启发；
			case gCommon.PHASE_REST:
				while (this.nIndex < this.mvs.length) {
					var mv = this.mvs[this.nIndex];
					this.nIndex ++;
					if (mv != this.mvHash && mv != this.mvKiller1 && mv != this.mvKiller2) {
						return mv;
					}
				}
			// 5. 没有着法了，返回零。
			default:
				return 0;
		}
	}
}

gGameBoard = {};

// 棋盘范围
gGameBoard.RANK_TOP = 3;
gGameBoard.RANK_BOTTOM = 12;
gGameBoard.FILE_LEFT = 3;
gGameBoard.FILE_RIGHT = 11;

gGameBoard.IDR_CLICK = 0;
gGameBoard.IDR_CAPTURE = 1;
gGameBoard.IDR_MOVE = 2;

gGameBoard.selectedMark = null;
//棋局状态信息
gGameBoard.BoardMap = new Array(256);
gGameBoard.BoardNodes = new Array(256); //棋子的node信息
gGameBoard.sdPlayer = 0;			// 轮到谁走，0=红方，1=黑方
gGameBoard.isGameOver = 0;			// 0=没有开始，1=开始，2=结束
gGameBoard.sqSelected = 0;			//选中的棋子
gGameBoard.mvLast = 0;				//最近的一次移动位置

gGameBoard.ClearBoard = function(){
	gGameBoard.sdPlayer = 0;
	gGameBoard.isGameOver = 0;
	gGameBoard.sqSelected = 0;
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

gGameBoard.NodePos = function(sq){
	var y = (sq >> 4) - gGameBoard.RANK_TOP;
	var x = (sq & 15) - gGameBoard.FILE_LEFT;
	return gCommon.BoardPos(x,y);
}
// 根据纵坐标和横坐标获得格子
gGameBoard.COORD_XY = function(x,y) {
	return x + (y << 4);
}

// 根据纵坐标和横坐标获得格子
gGameBoard.COORD_XY = function(x,y) {
	return x + (y << 4);
}

gGameBoard.ChangeSide = function() {         // 交换走子方
    gGameBoard.sdPlayer = 1 - gGameBoard.sdPlayer;
}
gGameBoard.AddQz = function(sq,pc) { // 在棋盘上放一枚棋子
    gGameBoard.BoardMap[sq] = pc;
}

gGameBoard.DelQz = function(sq) {         // 从棋盘上拿走一枚棋子
	gGameBoard.BoardMap[sq] = 0;
}

// 获得红黑标记(红子是8，黑子是16)
gGameBoard.SIDE_TAG = function(sd) {
	return 8 + (sd << 3);
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
	gGameBoard.BoardNodes[sqDst] = gGameBoard.BoardNodes[sqSrc];
	gGameBoard.DelQz(sqSrc);
	gGameBoard.AddQz(sqDst, pc);
}

gGameBoard.MakeMove = function(mv) {         // 走一步棋
    gGameBoard.MovePiece(mv);
    gGameBoard.ChangeSide();
}
/*
// 翻转格子
inline int SQUARE_FLIP(int sq) {
  return 254 - sq;
}

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
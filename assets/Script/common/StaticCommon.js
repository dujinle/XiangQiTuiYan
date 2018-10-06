
/*公共数据接口*/
gCommon = {};
//象棋棋子资源名称R:红色 B:黑色
gCommon.PngResource = {
	8:"RJ",
	9:"RS",
	10:"RX",
	11:"RM",
	12:"RC",
	13:"RP",
	14:"RZ",
	16:"BJ",
	17:"BS",
	18:"BX",
	19:"BM",
	20:"BC",
	21:"BP",
	22:"BZ"
};
// 棋盘初始设置
gCommon.InitMap = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0, 20, 19, 18, 17, 16, 17, 18, 19, 20,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0, 21,  0,  0,  0,  0,  0, 21,  0,  0,  0,  0,  0,
  0,  0,  0, 22,  0, 22,  0, 22,  0, 22,  0, 22,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0, 14,  0, 14,  0, 14,  0, 14,  0, 14,  0,  0,  0,  0,
  0,  0,  0,  0, 13,  0,  0,  0,  0,  0, 13,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0, 12, 11, 10,  9,  8,  9, 10, 11, 12,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
];

// 判断棋子是否在棋盘中的数组
gCommon.ccInBoard = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

// 判断棋子是否在九宫的数组
gCommon.ccInFort = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

// 判断步长是否符合特定走法的数组，1=帅(将)，2=仕(士)，3=相(象)
gCommon.ccLegalSpan = [
                       0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0
];

// 根据步长判断马是否蹩腿的数组
gCommon.ccKnightPin = [
                              0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,-16,  0,-16,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0, 16,  0, 16,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0
];

// 帅(将)的步长
gCommon.ccKingDelta = [-16, -1, 1, 16];
// 仕(士)的步长
gCommon.ccAdvisorDelta = [-17, -15, 15, 17];
// 马的步长，以帅(将)的步长作为马腿
gCommon.ccKnightDelta = [[-33, -31], [-18, 14], [-14, 18], [31, 33]];
// 马被将军的步长，以仕(士)的步长作为马腿
gCommon.ccKnightCheckDelta = [[-33, -18], [-31, -14], [14, 31], [18, 33]];

gCommon.QzNodes = {};

/*棋子在棋盘的确定位置保存*/
gCommon.BoardPos = function(x,y){
	var xx = [-271,-203,-135,-67,1,69,137,205,273];
	var yy = [298,230,162,94,26,-42,-110,-178,-246,-314];
	return [xx[x],yy[y]];
}


gCommon.arr2Clone = function(arr){
	var arrc = new Array();
	for(var i = 0;i < arr.length;i++){
		var items = new Array();
		for(var j = 0;j < arr[i].length;j++){
			items.push(arr[i][j]);
		}
		arrc.push(items);
	}
	return arrc;
};

gCommon.bylaw = {}
/*
* x , y 原始位置坐标
* nx,ny 新的位置坐标
* map   棋盘棋子数据
* my    当前移动的棋子角色
*/
gCommon.bylaw.Z = gCommon.bylaw.z = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	var dist = Math.abs(x - nx) + Math.abs(y - ny);
	//移动距离为1 不然就返回原来的位置
	if(dist != 1){
		return -1;
	}
	/*不可以后退*/
	if(my == gCommon.start_juese && nx < x){
		return -1;
	}
	if(my != gCommon.start_juese && nx > x){
		return -1;
	}
	/*没有过河不可以左右移动*/
	if (my == gCommon.start_juese && x <= 4 && x == nx){
		return -1;
	}
	if (my != gCommon.start_juese && x >= 5 && x == nx){
		return -1;
	}
	/*判断新位置是否有自己的棋子*/
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my == my){
		return -1;
	}else if(map[nx][ny] && gCommon.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

gCommon.bylaw.P = gCommon.bylaw.p = function(x,y,nx,ny,map,my){
	//出界返回
	if(ny < 0 || ny > 8 || nx < 0 || nx > 9){
		return -1;
	}
	/*必须是直来直往*/
	if((nx - x) != 0 && (ny - y) != 0){
		return -1;
	}
	if(x == nx && y == ny){
		return -1;
	}
	var num = 0;
	/*上下行棋子*/
	var x_move_step = nx - x;
	while(true){
		if(x_move_step == 0){break;}
		var xx = x + x_move_step;
		if(map[xx][ny] != 0){
			num = num + 1;
		}
		x_move_step = x_move_step - x_move_step / Math.abs(x_move_step);
	}
	/*左右检测*/
	var y_move_step = ny - y;
	while(true){
		if(y_move_step == 0){break;}
		var yy = y + y_move_step;
		if(map[nx][yy] != 0){
			num = num + 1;
		}
		y_move_step = y_move_step - y_move_step / Math.abs(y_move_step);
	}
	if(num == 0){
		return 0;
	}
	if(num == 2 && map[nx][ny] && gCommon.mans[map[nx][ny]].my != my){
		return 1;
	}
	return -1;
}

gCommon.bylaw.C = gCommon.bylaw.c = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	/*必须是直来直往*/
	if((nx - x) != 0 && (ny - y) != 0){
		return -1;
	}
	if(x == nx && y == ny){
		return -1;
	}
	var num = 0;
	/*上下行棋子*/
	var x_move_step = nx - x;
	while(true){
		if(x_move_step == 0){break;}
		var xx = x + x_move_step;
		if(map[xx][ny] != 0){
			num = num + 1;
		}
		x_move_step = x_move_step - x_move_step / Math.abs(x_move_step);
	}
	/*左右检测*/
	var y_move_step = ny - y;
	while(true){
		if(y_move_step == 0){break;}
		var yy = y + y_move_step;
		if(map[nx][yy] != 0){
			num = num + 1;
		}
		y_move_step = y_move_step - y_move_step / Math.abs(y_move_step);
	}
	if(num == 0){
		return 0;
	}
	if(num == 1 && map[nx][ny] && gCommon.mans[map[nx][ny]].my != my){
		return 1;
	}
	return -1;
}

gCommon.bylaw.M = gCommon.bylaw.m = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	/*判断是否走得日字*/
	var dist = (x - nx) * (x - nx) + (y - ny) * (y - ny);
	if(dist != 5){
		return -1;
	}
	if(Math.abs(x - nx) != 1 && Math.abs(y - ny) != 1){
		return -1;
	}
	/*判断是否有棋子挡住马腿*/
	if(Math.abs(x - nx) == 2){
		var xx = (x + nx) / 2;
		if(map[xx][y] != 0){
			return -1;
		}
	}else{
		var yy = (y + ny) / 2;
		if(map[x][yy] != 0){
			return -1;
		}
	}
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my == my){
		return -1;
	}
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

gCommon.bylaw.X = gCommon.bylaw.x = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	/*判断是否走得田字*/
	if(Math.abs(y - ny) != 2){
		return -1;
	}
	if(Math.abs(x - nx) != 2){
		return -1;
	}
	if(my == gCommon.start_juese && nx >= 5){
		return -1;
	}
	if(my != gCommon.start_juese && nx <= 4){
		return -1;
	}
	if(map[(x + nx) / 2][(y + ny) / 2] != 0){
		return -1;
	}
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my == my){
		return -1;
	}
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

gCommon.bylaw.S = gCommon.bylaw.s = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	var dist = (x - nx) * (x - nx) + (y - ny) * (y - ny);
	//移动距离为1 不然就返回原来的位置
	if(dist != 2){
		return -1;
	}
	if(my == gCommon.start_juese && (nx > 2 || Math.abs(ny - 4) > 1)){
		return -1;
	}
	if(my != gCommon.start_juese && (nx < 7 || Math.abs(ny - 4) > 1)){
		return -1;
	}
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my == my){
		return -1;
	}
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

gCommon.bylaw.J = gCommon.bylaw.j = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	var dist = Math.abs(x - nx) + Math.abs(y - ny);
	//移动距离为1 不然就返回原来的位置
	if(dist != 1){
		return -1;
	}
	if(my == gCommon.start_juese && (nx > 2 || Math.abs(ny - 4) > 1)){
		return -1;
	}
	if(my != gCommon.start_juese && (nx < 7 || Math.abs(ny - 4) > 1)){
		return -1;
	}
	/*判断新位置是否有自己的棋子*/
	if(map[nx][ny] && gCommon.mans[map[nx][ny]].my == my){
		return -1;
	}else if(map[nx][ny] && gCommon.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

gCommon.value = {
	//车价值
	c:[
		[206, 208, 207, 213, 214, 213, 207, 208, 206],
		[206, 212, 209, 216, 233, 216, 209, 212, 206],
		[206, 208, 207, 214, 216, 214, 207, 208, 206],
		[206, 213, 213, 216, 216, 216, 213, 213, 206],
		[208, 211, 211, 214, 215, 214, 211, 211, 208],
		
		[208, 212, 212, 214, 215, 214, 212, 212, 208],
		[204, 209, 204, 212, 214, 212, 204, 209, 204],
		[198, 208, 204, 212, 212, 212, 204, 208, 198],
		[200, 208, 206, 212, 200, 212, 206, 208, 200],
		[194, 206, 204, 212, 200, 212, 204, 206, 194]
	],
	
	//马价值
	m:[
		[90, 90, 90, 96, 90, 96, 90, 90, 90],
		[90, 96,103, 97, 94, 97,103, 96, 90],
		[92, 98, 99,103, 99,103, 99, 98, 92],
		[93,108,100,107,100,107,100,108, 93],
		[90,100, 99,103,104,103, 99,100, 90],
		
		[90, 98,101,102,103,102,101, 98, 90],
		[92, 94, 98, 95, 98, 95, 98, 94, 92],
		[93, 92, 94, 95, 92, 95, 94, 92, 93],
		[85, 90, 92, 93, 78, 93, 92, 90, 85],
		[88, 85, 90, 88, 90, 88, 90, 85, 88]
	],
	
	//相价值
	x:[
		[0, 0,20, 0, 0, 0,20, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0,23, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0,20, 0, 0, 0,20, 0, 0],
		
		[0, 0,20, 0, 0, 0,20, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[18,0, 0, 0,23, 0, 0, 0,18],
		[0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0,20, 0, 0, 0,20, 0, 0]
	],
	
	//士价值
	s:[
		[0, 0, 0,20, 0,20, 0, 0, 0],
		[0, 0, 0, 0,23, 0, 0, 0, 0],
		[0, 0, 0,20, 0,20, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0,20, 0,20, 0, 0, 0],
		[0, 0, 0, 0,23, 0, 0, 0, 0], 
		[0, 0, 0,20, 0,20, 0, 0, 0]
	],
	
	//奖价值
	j:[
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0], 
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0], 
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0]
	],
	
	//炮价值
	p:[	
		[100, 100,  96, 91,  90, 91,  96, 100, 100],
		[ 98,  98,  96, 92,  89, 92,  96,  98,  98],
		[ 97,  97,  96, 91,  92, 91,  96,  97,  97],
		[ 96,  99,  99, 98, 100, 98,  99,  99,  96],
		[ 96,  96,  96, 96, 100, 96,  96,  96,  96], 
		
		[ 95,  96,  99, 96, 100, 96,  99,  96,  95],
		[ 96,  96,  96, 96,  96, 96,  96,  96,  96],
		[ 97,  96, 100, 99, 101, 99, 100,  96,  97],
		[ 96,  97,  98, 98,  98, 98,  98,  97,  96],
		[ 96,  96,  97, 99,  99, 99,  97,  96,  96]
	],
	
	//卒价值
	z:[
		[ 9,  9,  9, 11, 13, 11,  9,  9,  9],
		[19, 24, 34, 42, 44, 42, 34, 24, 19],
		[19, 24, 32, 37, 37, 37, 32, 24, 19],
		[19, 23, 27, 29, 30, 29, 27, 23, 19],
		[14, 18, 20, 27, 29, 27, 20, 18, 14],
		
		[ 7,  0, 13,  0, 16,  0, 13,  0,  7],
		[ 7,  0,  7,  0, 15,  0,  7,  0,  7], 
		[ 0,  0,  0,  0,  0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0,  0,  0,  0,  0]
	]
}

gCommon.keys = {
	"c0":"c","c1":"c",
	"m0":"m","m1":"m",
	"x0":"x","x1":"x",
	"s0":"s","s1":"s",
	"j0":"j",
	"p0":"p","p1":"p",
	"z0":"z","z1":"z","z2":"z","z3":"z","z4":"z","z5":"z",
	
	"C0":"C","C1":"C",
	"M0":"M","M1":"M",
	"X0":"X","X1":"X",
	"S0":"S","S1":"S",
	"J0":"J",
	"P0":"P","P1":"P",
	"Z0":"Z","Z1":"Z","Z2":"Z","Z3":"Z","Z4":"Z","Z5":"Z",
}

gCommon.setOtherNodePressActive = function(key,flag){
	for(var i = 0;i < gCommon.initMap.length;i++){
		for(var j = 0;j < gCommon.initMap[i].length;j++){
			if(gCommon.initMap[i][j] != 0 && gCommon.initMap[i][j] != key){
				var node = gCommon.manNodes[gCommon.initMap[i][j]];
				var node_com = node.getComponent("qizi_common");
				if(flag == true){
					node_com.on_action();
				}else{
					node_com.off_action();
				}
			}
		}
	}
}

//黑子为红字价值位置的倒置
gCommon.value.C = gCommon.arr2Clone(gCommon.value.c).reverse();
gCommon.value.M = gCommon.arr2Clone(gCommon.value.m).reverse();
gCommon.value.X = gCommon.value.x;
gCommon.value.S = gCommon.value.s;
gCommon.value.J = gCommon.value.j;
gCommon.value.P = gCommon.arr2Clone(gCommon.value.p).reverse();
gCommon.value.Z = gCommon.arr2Clone(gCommon.value.z).reverse();

/*存储棋牌上棋子的信息*/
gCommon.mans = {}
gCommon.manNodes = {}
/*存储棋子的移动历史*/
gCommon.ab_history = {}
gCommon.history = []

gCommon.game_is_start = false;
gCommon.start_juese = -1;
gCommon.current_step = -1;
gCommon.game_num = 0;
gCommon.touch_mark = null;
gCommon.select_node = null;


/*公共数据接口*/
g_com = {};
g_com.init_map = [
	['C0','M0','X0','S0','J0','S1','X1','M1','C1'],
	[  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	[  0 ,'P0',  0 ,  0 ,  0 ,  0 ,  0 ,'P1',  0 ],
	['Z0',  0 ,'Z1',  0 ,'Z2',  0 ,'Z3',  0 ,'Z4'],
	[  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	
	[  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	['z0',  0 ,'z1',  0 ,'z2',  0 ,'z3',  0 ,'z4'],
	[  0 ,'p0',  0 ,  0 ,  0 ,  0 ,  0 ,'p1',  0 ],
	[  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	['c0','m0','x0','s0','j0','s1','x1','m1','c1']
]


g_com.sprite_frame_name = {
	"c0":"CHER","c1":"CHER",
	"m0":"MAR","m1":"MAR",
	"x0":"XIANGR","x1":"XIANGR",
	"s0":"SHIR","s1":"SHIR",
	"j0":"JIANGR",
	"p0":"PAOR","p1":"PAOR",
	"z0":"ZUR","z1":"ZUR","z2":"ZUR","z3":"ZUR","z4":"ZUR","z5":"ZUR",
	
	"C0":"CHEB","C1":"CHEB",
	"M0":"MAB","M1":"MAB",
	"X0":"XIANGB","X1":"XIANGB",
	"S0":"SHIB","S1":"SHIB",
	"J0":"JIANGB",
	"P0":"PAOB","P1":"PAOB",
	"Z0":"ZUB","Z1":"ZUB","Z2":"ZUB","Z3":"ZUB","Z4":"ZUB","Z5":"ZUB",
}

g_com.arr2Clone = function(arr){
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

g_com.bylaw = {}
/*
* x , y 原始位置坐标
* nx,ny 新的位置坐标
* map   棋盘棋子数据
* my    当前移动的棋子角色
*/
g_com.bylaw.Z = g_com.bylaw.z = function(x,y,nx,ny,map,my){
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
	if(my == g_com.start_juese && nx < x){
		return -1;
	}
	if(my != g_com.start_juese && nx > x){
		return -1;
	}
	/*没有过河不可以左右移动*/
	if (my == g_com.start_juese && x <= 4 && x == nx){
		return -1;
	}
	if (my != g_com.start_juese && x >= 5 && x == nx){
		return -1;
	}
	/*判断新位置是否有自己的棋子*/
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my == my){
		return -1;
	}else if(map[nx][ny] && g_com.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

g_com.bylaw.P = g_com.bylaw.p = function(x,y,nx,ny,map,my){
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
	if(num == 2 && map[nx][ny] && g_com.mans[map[nx][ny]].my != my){
		return 1;
	}
	return -1;
}

g_com.bylaw.C = g_com.bylaw.c = function(x,y,nx,ny,map,my){
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
	if(num == 1 && map[nx][ny] && g_com.mans[map[nx][ny]].my != my){
		return 1;
	}
	return -1;
}

g_com.bylaw.M = g_com.bylaw.m = function(x,y,nx,ny,map,my){
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
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my == my){
		return -1;
	}
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

g_com.bylaw.X = g_com.bylaw.x = function(x,y,nx,ny,map,my){
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
	if(my == g_com.start_juese && nx >= 5){
		return -1;
	}
	if(my != g_com.start_juese && nx <= 4){
		return -1;
	}
	if(map[(x + nx) / 2][(y + ny) / 2] != 0){
		return -1;
	}
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my == my){
		return -1;
	}
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

g_com.bylaw.S = g_com.bylaw.s = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	var dist = (x - nx) * (x - nx) + (y - ny) * (y - ny);
	//移动距离为1 不然就返回原来的位置
	if(dist != 2){
		return -1;
	}
	if(my == g_com.start_juese && (nx > 2 || Math.abs(ny - 4) > 1 || nx < 0)){
		return -1;
	}
	if(my != g_com.start_juese && (nx < 7 || Math.abs(ny - 4) > 1 || nx > 9)){
		return -1;
	}
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my == my){
		return -1;
	}
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

g_com.bylaw.J = g_com.bylaw.j = function(x,y,nx,ny,map,my){
	//出界返回
	if(nx < 0 || nx > 9 || ny < 0 || ny > 8){
		return -1;
	}
	var dist = Math.abs(x - nx) + Math.abs(y - ny);
	//移动距离为1 不然就返回原来的位置
	if(dist != 1){
		return -1;
	}
	if(my == g_com.start_juese && (nx > 2 || Math.abs(ny - 4) > 1 || nx < 0)){
		return -1;
	}
	if(my != g_com.start_juese && (nx < 7 || Math.abs(ny - 4) > 1 || nx > 9)){
		return -1;
	}
	/*判断新位置是否有自己的棋子*/
	if(map[nx][ny] && g_com.mans[map[nx][ny]].my == my){
		return -1;
	}else if(map[nx][ny] && g_com.mans[map[nx][ny]].my != my){
		return 1;
	}
	return 0;
}

g_com.value = {
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

g_com.keys = {
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

//黑子为红字价值位置的倒置
g_com.value.C = g_com.arr2Clone(g_com.value.c).reverse();
g_com.value.M = g_com.arr2Clone(g_com.value.m).reverse();
g_com.value.X = g_com.value.x;
g_com.value.S = g_com.value.s;
g_com.value.J = g_com.value.j;
g_com.value.P = g_com.arr2Clone(g_com.value.p).reverse();
g_com.value.Z = g_com.arr2Clone(g_com.value.z).reverse();

/*存储棋牌上棋子的信息*/
g_com.mans = {}

/*存储棋子的移动历史*/
g_com.ab_history = {}
g_com.history = []

g_com.game_is_start = false;
g_com.start_juese = -1;
g_com.current_step = -1;
g_com.game_num = 0;
g_com.touch_mark = null;
g_com.select_node = null;

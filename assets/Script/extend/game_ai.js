AI = {};

AI.treeDepth = 4;

AI.getMoves = function(map,my){
	var all_paths = [];
	for(var i = 0;i < map.length;i++){
		for(var j = 0;j < map[i].length;j++){
			if(map[i][j] && g_com.mans[map[i][j]].my == my){
				//兵
				var cur_pos = g_com.mans[map[i][j]].cur_pos;
				if(g_com.keys[map[i][j]] == "z" || g_com.keys[map[i][j]] == "Z"){
					for(var m = cur_pos[0] - 1;m <= cur_pos[0] + 1 && m <= 9;m++){
						for(var n = cur_pos[1] - 1;n <= cur_pos[1]+ 1 && n <= 8;n++){
							
							var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								m,n,map,
								my);
							if(is_ok != -1){
								all_paths.push([map[i][j],cur_pos[0],cur_pos[1],m,n]);
							}
						}
					}
				}
				else if(g_com.keys[map[i][j]] == "p" || g_com.keys[map[i][j]] == "P"){	
					/*向左右检测*/
					for(var m = 0;m <= 9;m++){
						var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								m,cur_pos[1],map,
								my);
						if(is_ok != -1){
							all_paths.push([map[i][j],cur_pos[0],cur_pos[1],m,cur_pos[1]]);
						}
					}
					/*向上下检测*/
					for(var m = 0;m <= 8;m++){
						var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								cur_pos[0],m,map,
								my);
						if(is_ok != -1){
							all_paths.push([map[i][j],cur_pos[0],cur_pos[1],cur_pos[0],m]);
						}
					}
				}
				else if(g_com.keys[map[i][j]] == "M" || g_com.keys[map[i][j]] == "m"){
					for(var m = cur_pos[0] - 2;m <= cur_pos[0] + 2 && m <= 9;m++){
						for(var n = cur_pos[1] - 2;n <= cur_pos[1]+ 2 && n <= 8;n++){
							var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								m,n,map,
								my);
							if(is_ok != -1){
								all_paths.push([map[i][j],cur_pos[0],cur_pos[1],m,n]);
							}
						}
					}
				}
				else if(g_com.keys[map[i][j]] == "c" || g_com.keys[map[i][j]] == "C"){
					/*向左右检测*/
					for(var m = 0;m <= 9;m++){
						var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								m,cur_pos[1],map,
								my);
						if(is_ok != -1){
							all_paths.push([map[i][j],cur_pos[0],cur_pos[1],m,cur_pos[1]]);
						}
					}
					/*向上下检测*/
					for(var m = 0;m <= 8;m++){
						var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								cur_pos[0],m,map,
								my);
						if(is_ok != -1){
							all_paths.push([map[i][j],cur_pos[0],cur_pos[1],cur_pos[0],m]);
						}
					}
				}
				else if(g_com.keys[map[i][j]] == "X" || g_com.keys[map[i][j]] == "x"){
					for(var m = cur_pos[0] - 2;m <= cur_pos[0] + 2 && m <= 9;m++){
						for(var n = cur_pos[1] - 2;n <= cur_pos[1]+ 2 && n <= 8;n++){
							var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								m,n,map,
								my);
							if(is_ok != -1){
								all_paths.push([map[i][j],cur_pos[0],cur_pos[1],m,n]);
							}
						}
					}
				}
				else if(g_com.keys[map[i][j]] == "S" || g_com.keys[map[i][j]] == "s"){
					for(var m = cur_pos[0] - 1;m <= cur_pos[0] + 1 && m <= 9;m++){
						for(var n = cur_pos[1] - 1;n <= cur_pos[1]+ 1 && n <= 8;n++){
							var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								m,n,map,
								my);
							if(is_ok != -1){
								all_paths.push([map[i][j],cur_pos[0],cur_pos[1],m,n]);
							}
						}
					}
				}
				else if(g_com.keys[map[i][j]] == "J" || g_com.keys[map[i][j]] == "j"){
					for(var m = cur_pos[0] - 1;m <= cur_pos[0] + 1 && m <= 9;m++){
						for(var n = cur_pos[1] - 1;n <= cur_pos[1]+ 1 && n <= 8;n++){
							var is_ok = g_com.bylaw[g_com.keys[map[i][j]]](
								cur_pos[0],
								cur_pos[1],
								m,n,map,
								my);
							if(is_ok != -1){
								all_paths.push([map[i][j],cur_pos[0],cur_pos[1],m,n]);
							}
						}
					}
				}
			}
		}
	}
	return all_paths;
}

AI.getAlphaBeta = function (A, B, depth, map ,my) {
	if (depth == 0) {
		return {"value":AI.evaluate(map , my)}; //当搜索深度为0是时调用局面评价函数;
	}
	var moves = AI.getMoves(map , my ); //生成全部走法;
	moves.sort(AI.sort);
	for (var i=0; i < moves.length; i++) {
		//走这个走法;
		var move= moves[i];
//		cc.log(JSON.stringify(move));
		var key = move[0];
		var oldX= move[1];
		var oldY= move[2];
		var newX= move[3];
		var newY= move[4];
		var clearKey = map[ newX ][ newY ];
		map[ newX ][ newY ] = key;
		//走，赋新值，删除旧值
		map[ oldX ][ oldY ] = 0;
		g_com.mans[key].cur_pos = [newX,newY];
		if (clearKey=="j0"||clearKey=="J0"){
			//被吃老将
			g_com.mans[key].cur_pos = [oldX,oldY];
			map[ oldX ][ oldY ] = key;
			map[ newX ][ newY ] = clearKey;
			return {"key":key,"x":newX,"y":newY,"value":8888};
		}else {
			var val = -AI.getAlphaBeta(-B, -A, depth - 1, map , -my).value;
			//上面代表AI，这里倒置，-my，代表人的着法，然后再从上面开始执行
			//val = val || val.value;
			g_com.mans[key].cur_pos = [oldX,oldY];
			map[ oldX ][ oldY ] = key;
			map[ newX ][ newY ] = clearKey;
			
			if (val >= B) {
				//将这个走法记录到历史表中;
				var move_key = move.join("-");
				AI.setHistoryTable(g_com.ab_history,move_key,depth * depth);
				return {"key":key,"x":newX,"y":newY,"value":B};
			}
			if (val > A) {
				A = val; //设置最佳走法
				AI.setHistoryTable(g_com.ab_history,move_key,depth * depth);
				if (AI.treeDepth == depth)
					var rootKey={"key":key,"x":newX,"y":newY,"value":A};
			}
		}
	}

 	if (AI.treeDepth == depth) {
		//已经递归回根了
		if (!rootKey){
			//AI没有最佳走法，说明AI被将死了，返回false
			return false;
		}else{
			//这个就是最佳走法;
			return rootKey;
		}
	}
	return {"key":key,"x":newX,"y":newY,"value":A};
}

AI.sort = function(a,b){
	var key1 = a.join("-");
	var key2 = b.join("-");
	if(!!g_com.ab_history[key2] && !!g_com.ab_history[key1]){
		return g_com.ab_history[key2] - g_com.ab_history[key1];
	}
	return 0;
}

//评估棋局 取得棋盘双方棋子价值差
AI.evaluate = function (map,my){
	var val=0;
	for(var i = 0; i < map.length; i++){
		for(var n = 0; n < map[i].length; n++){
			var key = map[i][n];
			if (key){
				val += g_com.value[g_com.keys[key]][i][n] * g_com.mans[key].my;
			}
		}
	}
	val += Math.floor( Math.random() * 10);  //让AI走棋增加随机元素
	return val * my;
}

AI.setHistoryTable = function(map,move,value){
	map[move] = value;
}
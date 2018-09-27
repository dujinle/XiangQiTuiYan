AI = {};

AI.treeDepth = 4;

AI.getAlphaBeta = function (A, B, depth, map ,my) {
	if (depth == 0) {
		return {"value":AI.evaluate(map , my)}; //当搜索深度为0是时调用局面评价函数;
	}
	var moves = AI.getMoves(map , my ); //生成全部走法;

	for (var i=0; i < moves.length; i++) {
		//走这个走法;
		var move= moves[i];
		var key = move[4];
		var oldX= move[0];
		var oldY= move[1];
		var newX= move[2];
		var newY= move[3];
		var clearKey = map[ newY ][ newX ]||"";
		map[ newY ][ newX ] = key;    
		//走，赋新值，删除旧值
		delete map[ oldY ][ oldX ];
		play.mans[key].x = newX;
		play.mans[key].y = newY;
		if (clearKey=="j0"||clearKey=="J0") {
			//被吃老将
			play.mans[key].x = oldX;
			play.mans[key].y = oldY;
			map[ oldY ][ oldX ] = key;
			delete map[ newY ][ newX ];      //并不是真的走，所以这里要撤销
			if (clearKey){
				map[ newY ][ newX ] = clearKey;
			}
			return {"key":key,"x":newX,"y":newY,"value":8888};
		}else {
			var val = -AI.getAlphaBeta(-B, -A, depth - 1, map , -my).value;
			//上面代表AI，这里倒置，-my，代表人的着法，然后再从上面开始执行
			//val = val || val.value;
			play.mans[key]	.x = oldX;
			play.mans[key]	.y = oldY;
			map[ oldY ][ oldX ] = key;
			delete map[ newY ][ newX ];
			if (clearKey){
				map[ newY ][ newX ] = clearKey;
				//play.mans[ clearKey ].isShow = true;
			}
			if (val >= B) {
				//将这个走法记录到历史表中;
				//AI.setHistoryTable(txtMap,AI.treeDepth-depth+1,B,my);
				return {"key":key,"x":newX,"y":newY,"value":B};
			}
			if (val > A) {
				A = val; //设置最佳走法
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

//评估棋局 取得棋盘双方棋子价值差
AI.evaluate = function (map,my){
	var val=0;
	for(var i = 0; i < map.length; i++){
		for(var n = 0; n < map[i].length; n++){
			var key = map[i][n];
			if (key){
				val += play.mans[key].value[i][n] * play.mans[key].my;
			}
		}
	}
	val += Math.floor( Math.random() * 10);  //让AI走棋增加随机元素
	AI.number++;
	return val * my;
}
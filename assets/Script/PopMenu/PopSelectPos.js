cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
    },
    onLoad () {
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
			}
         }, this.node);
		 this.node.on("ButtonApi", this.PressFunc, this);
		 this.node.on('reParseFinish',this.EventFunc,this);
	},
	EventFunc(event){
		cc.log("press node:" + this.node.name);
		this.node.dispatchEvent(new cc.Event.EventCustom("itemPress", true));
	},
	PressFunc(event){
		var index = event.target.getComponent("ButtonApi").index;
		var ey = Math.floor(index / 3);
		var ex = index - ey * 3;
		var jy = 3 + ey;
		var jx = 6 + ex;
		if(this.data == null){return;}
		var jsq = 0;
		for(var i = 0;i < this.data.board.length;i++){
			if(this.data.board[i] == 16){
				jsq = i;
				break;
			}
		}
		var map = new Array(256);
		for(var i = 0;i < map.length;i++){map[i] = 0;}
		if(jsq == 0){return;}
		var xx = jx - gCommon.FILE_X(jsq);
		var yy = jy - gCommon.RANK_Y(jsq);
		cc.log(xx,yy,jx,jy,JSON.stringify(map));
		for (var x = gCommon.FILE_LEFT; x <= gCommon.FILE_RIGHT; x ++) {
			for (var y = gCommon.RANK_TOP; y <= gCommon.RANK_BOTTOM; y ++) {
				var sq = gCommon.COORD_XY(x,y);
				if(sq && this.data.board[sq] != 0){
					var tsq = gCommon.COORD_XY(x + xx,y + yy);
					map[tsq] = this.data.board[sq];
				}
			}
		}
		this.data.board = map;
		cc.log(xx,yy,jx,jy,JSON.stringify(map));
		this.node.emit('reParseFinish', {
			msg: 'Hello, this is Cocos Creator',
		});
	}
    // update (dt) {},
});

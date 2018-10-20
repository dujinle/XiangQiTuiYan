cc.Class({
    extends: cc.Component,

    properties: {
		rate:0,
		source_leng:0,
		loadProcess:cc.Node,
    },
    onLoad () {
		this.source_leng = 19;
		if(gCommon.LOAD_FINISH == false){
			this.loadProcess.getComponent("PopLoadProcess").play("数据加载中(0%)");
			this.load_res();
			this.schedule(this.load_update,0.5);
		}else{
			this.loadProcess.active = false;
		}
    },
	load_update(){
		cc.log("this.rate:" + this.rate);
		var scale = Math.floor((this.rate/this.source_leng ) * 100);
		this.loadProcess.getComponent("PopLoadProcess").setStatus("数据加载中(" + scale + "%)");
		if(this.rate >= this.source_leng){
			gCommon.LOAD_FINISH = true;
			this.unschedule(this.load_update);
			this.loadProcess.active = false;
		}
	},
	load_res(){
		var self = this;
		cc.loader.loadResDir("",cc.SpriteFrame,function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res :" + assets[i].name);
			}
		});
		cc.loader.loadResDir("prefab",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res prefab:" + assets[i].name);
			}
		});
	},
	button_tuiyan_cb(){
		this.loadProcess.active = true;
		this.loadProcess.getComponent("PopLoadProcess").setStatus("场景加载中");
		cc.director.preloadScene("TuiYanGameScene", function(){//预加载
			cc.director.loadScene("TuiYanGameScene");
		});
	},
	button_canju_cb(){
		cc.director.loadScene("CanJuGameScene");
	}
    // update (dt) {},
});

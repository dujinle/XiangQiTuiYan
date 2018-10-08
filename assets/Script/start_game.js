cc.Class({
    extends: cc.Component,

    properties: {
		rate:0,
		source_leng:0,
    },
    onLoad () {
		this.source_leng = 17;
		this.load_res();
        this.schedule(this.load_update,0.5);
    },
	load_update(){
		cc.log("this.rate:" + this.rate);
		if(this.rate >= this.source_leng){
			this.unschedule(this.load_update);
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
	button_main_cb(){
		cc.director.loadScene("MainScene");
	},
	button_canju_cb(){
		cc.director.loadScene("CanJuGameScene");
	}
    // update (dt) {},
});

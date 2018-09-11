cc.Class({
    extends: cc.Component,

    properties: {
		button:cc.Node,
		label:cc.Node,
		file_label:cc.Node,
		bg_sprite:cc.Node,
		file_path:null,
		callback:null,
    },
    onLoad () {
		var self = this;
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
                var target = self.bg_sprite;
                var local=target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (rect.contains(local)){
                    cc.log("ok touch in the region......");
                }else{
                    cc.log("touch remove from parent");
                    self.node.active = false;
                }
            }
        }, self.bg_sprite);
	},
	OnOpenFileUitls(){
		if (cc.sys.os == cc.sys.OS_ANDROID) {
			jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "OpenFileUtils", "()V");
		}else if(cc.sys.os == cc.sys.OS_IOS){
			jsb.reflection.callStaticMethod("NativeOcClass", "OpenFileUtils");
		}
	},
	update(){
		if(this.file_path == null || this.file_path == "null"){
			cc.log("get file_path");
			if (cc.sys.os == cc.sys.OS_ANDROID) {
				this.file_path = jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "getFilePath", "()Ljava/lang/String;");
			}else if(cc.sys.os == cc.sys.OS_IOS){
				this.file_path = jsb.reflection.callStaticMethod("NativeOcClass", "OpenFileUtils");
			}
			if(this.file_path != null && this.file_path != "null"){
				if (cc.sys.os == cc.sys.OS_ANDROID) {
					this.base64_data = jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "encodeBase64File", "(Ljava/lang/String;)Ljava/lang/String;",this.file_path);
				}else if(cc.sys.os == cc.sys.OS_IOS){
					this.base64_data = jsb.reflection.callStaticMethod("NativeOcClass", "encodeBase64File:",this.file_path);
				}
				//this.label.getComponent(cc.Label).string = this.base64_data
				this.node.active = false;
				var result = {"code": 0, 
						"message": "enjoy success", 
						"result": {
							"size": [476, 551], 
							"objs": [
								[["XIANGB: 99%"], 311.8445038795471, 370.2447557449341, 13.674749514088035, 69.40382444858551],
								[["CHER: 99%"], 155.58684039115906, 214.01815938949585, 66.44989801198244, 120.36199793219566], 
								[["SHIB: 99%"], 213.1919013261795, 265.07924795150757, 65.28922736644745, 119.86429142951965],
								[["CHEB: 99%"], 416.2226655483246, 473.01241993904114, 117.94909270107746, 172.05539241433144],
								[["CHER: 99%"], 311.6751525402069, 369.2397127151489, 169.35200649499893, 223.05956134200096],
								[["JIANGR: 99%"], 264.23558378219604, 317.0060739517212, 481.17300432920456, 537.3546739816666],
								[["ZUR: 99%"], 210.0168261528015, 265.6349949836731, 221.80618959665298, 276.41977751255035], 
								[["ZUB: 99%"], 208.8735272884369, 265.68237590789795, 431.08844870328903, 484.4948573708534], 
								[["PAOR: 99%"], 363.5732946395874, 423.59522247314453, 273.7534868121147, 327.5769252181053], 
								[["CHEB: 99%"], 105.47380298376083, 159.7362744808197, 118.04395727813244, 171.16293957829475],
								[["JIANGB: 99%"], 208.85304284095764, 263.35211396217346, 14.9237368311733, 66.77647633850574],
								[["XIANGB: 99%"], 104.21288877725601, 164.8116935491562, 12.23865425772965, 70.34261757135391],
								[["SHIB: 99%"], 263.1718394756317, 318.0392334461212, 119.31588484346867, 170.96826767921448]
							]
						}
					};
				if(this.callback != null){
					this.callback(result);
				}
			}
		}
	},
	install_cb(cb){
		this.callback = cb;
	}
});
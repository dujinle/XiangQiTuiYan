var gImage 		= null;
var gSelectFile = null;
var gBaseData 	= null;
function myCreateObjectURL(blob) {
	gSelectFile = blob;
	if (window.URL != undefined){
		return window['URL']['createObjectURL'](blob);
	}else{
		return window['webkitURL']['createObjectURL'](blob);
	}
}

function readImg64(cb){
	if(gSelectFile != null){
		var reader = new FileReader();
		reader.readAsDataURL(gSelectFile);
		reader.onload = function(e){
			util.httpPOST("http://192.168.1.107:8080/game_predict",{"data":this.result},cb);
		}
	}else{
		cb({"code":-1,"message":"没有找到文件"});
	}
}

cc.Class({
    extends: cc.Component,
    properties: {
		img: {
			default: null,
			type: cc.Node
		},
    },

    onLoad:function() {
		cc.log("webview onload");
		gImage = this.img;
		this.node.on('loadFinish',this.EventFunc,this);
		this.testQZ(result);
	},
	EventFunc(event){
		cc.log("press node:" + this.node.name);
		this.node.dispatchEvent(new cc.Event.EventCustom("itemPress", true));
	},
	testQZ(result){
		var map = new Array(256);
		var width = 0;
		var height = 0;
		//确定棋盘的最小面积 寻找max & min(x,y)
		var max_x = 0;
		var max_y = 0;
		var min_x = 1000;
		var min_y = 1000;
		for(var i = 0;i < 256;i++){map[i] = 0;}
		for(var i = 0;i < result.result.objs.length;i++){
			var item = result.result.objs[i];
			var x = (item[1] + item[2] ) / 2;
			var y = (item[3] + item[4] ) / 2;
			width = item[2] - item[1];
			height = item[4] - item[3];
			if(x > max_x){max_x = x;}
			if(min_x > x){min_x = x;}
			if(max_y < y){max_y = y;}
			if(min_y > y){min_y = y;}
		}
		//寻找最接近中心的棋子
		var center_x = (max_x + min_x) / 2;
		var center_y = (max_y + min_y) / 2;
		var near_dist = Math.exp(10);
		var near_item = null;
		for(var i = 0;i < result.result.objs.length;i++){
			var item = result.result.objs[i];
			var x = (item[1] + item[2] ) / 2;
			var y = (item[3] + item[4] ) / 2;
			var dist = Math.sqrt((x - center_x)*(x - center_x) + (y - center_y)*(y - center_y));
			if(dist <= near_dist){
				near_dist = dist;
				near_item = item;
			}
		}
		cc.log(near_dist,JSON.stringify(near_item),width,height);
		if(near_item == null){return;}
		var sq = gCommon.COORD_XY(7,7);
		map[sq] = gCommon.CovertCJTYMap[near_item[0][0].split(":").shift()];
		//开始放其他棋子围绕着中心点
		for(var i = 0;i < result.result.objs.length;i++){
			var item = result.result.objs[i];
			if(item == near_item){continue;}
			var px = (near_item[1] + near_item[2]) / 2;
			var py = (near_item[3] + near_item[4]) / 2;
			var x = (item[1] + item[2] ) / 2;
			var y = (item[3] + item[4] ) / 2;
			var xx = Math.round(Math.abs(px - x)/width) * (px > x ? 1:-1);
			var yy = Math.round(Math.abs(py - y)/height) * (py > y ? 1:-1);
			cc.log(Math.abs(px - x)/width,Math.abs(py - y)/height,xx,yy,item[0]);
			var sq = gCommon.COORD_XY(7 - xx,7 - yy);
			map[sq] = gCommon.CovertCJTYMap[item[0][0].split(":").shift()];
		}
		cc.log(JSON.stringify(map));
		this.data = {
			"board":map,
			"start":0
		};
		this.node.emit('loadFinish', {
			msg: 'Hello, this is Cocos Creator',
		});
	},
	onUpload: function (activate) {
		var fileInput = document.getElementById("fileInput");
		if (fileInput == null) {
			fileInput = document.createElement("input");
			fileInput.id = "fileInput";
			fileInput.type = "file";
			fileInput.accept = "image/*";
			fileInput.style.height = "0px";
			fileInput.style.display = "block";
			fileInput.style.overflow = "hidden";
			// fileInput.multiple = "multiple"; // 多选
			document.body.insertBefore(fileInput, document.body.firstChild);
			fileInput.addEventListener('change', this.tmpSelectFile, false);
		}
		setTimeout(function () { fileInput.click() }, 100);
	},
	tmpSelectFile:function(evt) {
		var file = evt.target.files[0];
		if(file){
			var url = myCreateObjectURL(file);
			cc.loader.load({url: url, type: 'png'}, function (err, texture) {
				var mylogo  = new cc.SpriteFrame(texture); 
				gImage.getComponent('cc.Sprite').spriteFrame = mylogo;
				evt.target.value = '';
			});
		}
	},
	//开始检测图片
	onRegImg:function(){
		var self = this;
		this.PWaitAnim = cc.instantiate(g_assets["PopWait"]);
		this.node.addChild(this.PWaitAnim);
		this.PWaitAnim.setPosition(this.node.convertToNodeSpaceAR(cc.v2(cc.winSize.width/2,cc.winSize.height/2)));
		this.PWaitAnim.getComponent("PopWait").play("等待图片识别中......");
		readImg64(function(res){
			self.PWaitAnim.destroy();
			
			cc.log(res);
		});
	}
});
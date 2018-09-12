var g_assets = {};
g_qizi_obj = {
	"兵1":{
		"type":"red",
		"num":5,
		"name":"兵",
		"target":"ZUR"
	},
	"车1":{
		"type":"red",
		"num":2,
		"name":"车",
		"target":"CHER"
	},
	"马1":{
		"type":"red",
		"num":2,
		"name":"马",
		"target":"MAR"
	},
	"炮1":{
		"type":"red",
		"num":2,
		"name":"炮",
		"target":"PAOR"
	},
	"相1":{
		"type":"red",
		"num":2,
		"name":"相",
		"target":"XIANGR"
	},
	"士1":{
		"type":"red",
		"num":2,
		"name":"士",
		"target":"SHIR"
	},
	"帅1":{
		"type":"red",
		"num":1,
		"name":"帅",
		"target":"JIANGR"
	},
	"兵2":{
		"type":"black",
		"num":5,
		"name":"兵",
		"target":"ZUB"
	},
	"车2":{
		"type":"black",
		"num":2,
		"name":"车",
		"target":"CHEB"
	},
	"马2":{
		"type":"black",
		"num":2,
		"name":"马",
		"target":"MAB"
		
	},
	"炮2":{
		"type":"black",
		"num":2,
		"name":"炮",
		"target":"PAOB"
	},
	"相2":{
		"type":"black",
		"num":2,
		"name":"相",
		"target":"XIANGB"
	},
	"士2":{
		"type":"black",
		"num":2,
		"name":"士",
		"target":"SHIB"
	},
	"帅2":{
		"type":"black",
		"num":1,
		"name":"帅",
		"target":"JIANGB"
	}
};

/*链接android 和 ios的桥梁函数*/
var bridge_android_ios = function(type,data){
	var g_root_node = cc.director.getScene().getChildByName("RootNode");
	var g_root_node_com = g_root_node.getComponent("root_node");
	/*回调文件选择结果函数*/
	if(type == "chooser"){
		g_root_node_com.chooser_cb(data);
	}
};
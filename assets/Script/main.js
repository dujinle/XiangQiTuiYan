// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
		bg_sprite:cc.Node,
		start_node:cc.Node,
		end_node:cc.Node,
		qipan:cc.Node,
		qizi_room:cc.Node,
		back_two_node:cc.Node,
		back_one_node:cc.Node,
		forward_node:cc.Node,
		forward_two_node:cc.Node,
		start_node:cc.Node,
    },

    onLoad () {
		this.start_flag = false;
		this.back_two_node.getComponent(cc.Button).interactable = false;
		this.back_one_node.getComponent(cc.Button).interactable = false;
		this.forward_node.getComponent(cc.Button).interactable = false;
		this.forward_two_node.getComponent(cc.Button).interactable = false;
	},

	get_pos_from_parent(node){
		if(node.parent != null){
			var p_pos = node.parent.getPosition();
			return cc.p(node.x + p_pos.x,node.y + p_pos.y);
		}else{
			return node.getPosition();
		}
	},
	back_two(){
		
	},
	back_one(){},
	forward_two(){},
	forward(){},
	game_start(){
		cc.log("game_start");
		if(this.start_flag == false){
			//开始游戏
			this.back_two_node.getComponent(cc.Button).interactable = true;
			this.back_one_node.getComponent(cc.Button).interactable = true;
			this.forward_node.getComponent(cc.Button).interactable = true;
			this.forward_two_node.getComponent(cc.Button).interactable = true;
			this.start_flag = true;
			this.start_node.getChildByName("start").active = false;
			this.start_node.getChildByName("stop").active = true;
			var qizi_room_com = this.qizi_room.getComponent("qizi_control");
			for(var i = 0 ;i < qizi_room_com.qizis.length;i++){
				var item = qizi_room_com.qizis[i];
				var item_com = item.getComponent("qizi_base");
				item_com.off_action();
			}
		}else{
			//停止游戏
			this.start_flag = false;
			this.back_two_node.getComponent(cc.Button).interactable = false;
			this.back_one_node.getComponent(cc.Button).interactable = false;
			this.forward_node.getComponent(cc.Button).interactable = false;
			this.forward_two_node.getComponent(cc.Button).interactable = false;
			this.start_node.getChildByName("start").active = true;
			this.start_node.getChildByName("stop").active = false;
		}
		
	}
    // update (dt) {},
});

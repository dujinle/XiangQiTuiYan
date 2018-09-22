cc.Class({
    extends: cc.Component,

    properties: {
		layout:cc.Node,
		qizis:{
			default:[],
			type:cc.Node,
		},
		from_sprite:cc.Node,
		end_sprite:cc.Node,
    },
    onLoad () {
		cc.log("onLoad " + this.node.name);
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		var g_root_node_com = g_root_node.getComponent("root_node");
		g_root_node_com.from_sprite = this.from_sprite;
		g_root_node_com.end_sprite = this.end_sprite;
		for(var i = 0;i < this.layout.children.length;i++){
			var item = this.layout.children[i];
			var sprite = item.getComponent(cc.Sprite);
			var sprite_name = sprite.spriteFrame.name;
			var qizi_obj = g_qizi_obj[sprite_name];
			cc.log(JSON.stringify(qizi_obj),item.getPosition().x,item.getPosition().y);

			for(var j = 0;j < qizi_obj.num;j++){
				var cnode = new cc.Node(qizi_obj.name + "-" + qizi_obj.type + "-" + j);
				var sp = cnode.addComponent(cc.Sprite);
				sp.spriteFrame = sprite.spriteFrame;
				
				var com = cnode.addComponent("qizi_base");
				com.my_name = qizi_obj.name;
				com.my_type = qizi_obj.type;
				com.target = qizi_obj.target;
				this.qizis.push(cnode);
				cnode.setPosition(item.getPosition());
			}
		}
		for(var i = 0;i < this.qizis.length;i++){
			var item = this.qizis[i];
			var item_pos = item.getPosition();
			var parent_pos = this.node.getPosition();
			this.node.addChild(item);
		}
	},
	get_qizi_node(target){
		for(var i = 0;i < this.qizis.length;i++){
			var item = this.qizis[i];
			var item_com = item.getComponent("qizi_base");
			if(item_com.target == target){
				return item;
			}
		}
		return null;
	}
});

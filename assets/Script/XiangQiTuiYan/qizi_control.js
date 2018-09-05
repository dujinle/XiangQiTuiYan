cc.Class({
    extends: cc.Component,

    properties: {
		layout:cc.Node,
		qizis:{
			default:[],
			type:cc.Node,
		},
    },
    onLoad () {
		cc.log("onLoad " + this.node.name);
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
				//棋子安装点击效果sprite
				var mask_node = new cc.Node("touch_sprite");
				var mask_sp = mask_node.addComponent(cc.Sprite);
				mask_sp.spriteFrame = g_assets["mask_png"];
				cc.log(g_assets["mask_png"]);
				mask_node.active = false;
				cnode.addChild(mask_node);
				var com = cnode.addComponent("qizi_base");
				com.my_name = qizi_obj.name;
				com.my_type = qizi_obj.type;
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
	}
});

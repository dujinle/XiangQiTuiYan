cc.Class({
	extends: cc.Component,

	properties: {
		my_name:null,
		my_type:null,
		my_x:-1,
		my_y:-1,
	},

	// LIFE-CYCLE CALLBACKS:
	onLoad () {
		var self = this;
		var yuandian = this.node.getPosition();
		this.prev_onmove();

		this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
			//cc.log("start move the node");
			var delta = event.touch.getDelta();
			self.calc_pos(delta);
		},this.node);
	},
	prev_onmove(){
		var self = this;
		var g_root_node = cc.director.getScene().getChildByName("RootNode");
		this.node.on(cc.Node.EventType.TOUCH_END, function () {
			var start = g_root_node.getComponent("root_node").start_node;
			var end = g_root_node.getComponent("root_node").end_node;
			var width = end.getPosition().x - start.getPosition().x + 50;
			var height = end.getPosition().y - start.getPosition().y + 50;
			var rect = cc.rect(start.getPosition().x -50, start.getPosition().y - 50,width,height);
			cc.log("width:" + width + " height:" + height);
			var my_pos = self.node.getPosition();
			var parent_pos = self.node.parent.getPosition();
			var local = cc.p(my_pos.x + parent_pos.x,my_pos.y + parent_pos.y);
			if (cc.rectContainsPoint(rect, local)){
				var g_root_node_com = g_root_node.getComponent("root_node")
				var is_have = g_root_node_com.is_have(self.node);
				if(is_have == false){
					g_root_node_com.add_node(self.node);
				}
				cc.log("ok touch in the region.....g_root_node_com." + g_root_node_com.select_node.length);
				var qipan_pos = g_root_node_com.calc_my_pos(self.node);
				self.my_x = qipan_pos.x;
				self.my_y = qipan_pos.y;
				if(self.my_x != -1 && self.my_y != -1){
					var g_root_pos = g_root_node_com.get_position(self.my_x,self.my_y);
					var x = g_root_pos.x - parent_pos.x;
					var y = g_root_pos.y - parent_pos.y;
					self.node.setPosition(cc.p(x,y));
				}
				cc.log("qipan pos:x" + self.my_x + " " + self.my_y);
			}else{
				var move = cc.moveTo(0.2,yuandian);
				self.node.runAction(move);
				var g_root_node_com = g_root_node.getComponent("root_node")
				var is_have = g_root_node_com.is_have(self.node);
				if(is_have == true){
					g_root_node_com.remove_node(self.node);
				}
				cc.log("touch remove from parent root_node_com." + g_root_node_com.select_node.length);
			}
			cc.log("touch end");
        }, this.node);
	},
	calc_pos(delta){
		var parent_pos = this.node.getPosition();
		//cc.log("parent_pos x:" + parent_pos.x + " y:" + parent_pos.y);
		var x = delta.x + parent_pos.x;
		var y = delta.y + parent_pos.y;
		//cc.log("x:" + x + " y:" + y);
		this.node.setPosition(cc.p(x,y));
		var parent_pos = this.node.parent.getPosition();
		//cc.log("x:" + (x+parent_pos.x) + " y:" + (y+parent_pos.y));
	},
	off_action(){
		this.node.off(cc.Node.EventType.TOUCH_MOVE);
		this.node.off(cc.Node.EventType.TOUCH_END);
	},
	start () {

	},

	// update (dt) {},
});

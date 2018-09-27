cc.Class({
    extends: cc.Component,

    properties: {
        my_name:null,
		my_type:null,
		target:null,
		start_pos:null,
		eat_node:null,
		yuandian:null,
		from_pos:null,
		to_pos:null,
    },

    onLoad () {
		this.yuandian = this.node.getPosition();
	}
});

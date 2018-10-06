cc.Class({
	extends: cc.Component,
	SetPressEvent(InOrOut){
		if(InOrOut == true){
			this.node.on("touchstart", this.EventFunc,this);
		}else{
			this.node.off("touchstart", this.EventFunc,this);
		}
	},
	EventFunc(event){
		cc.log("press node:" + this.node.name);
		this.node.dispatchEvent(new cc.Event.EventCustom("pressed", true));
	}
});

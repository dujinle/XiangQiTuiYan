cc.Class({
	extends: cc.Component,
	properties: {
		itemID:0,
		nameLabel:cc.Node,
		contentLabel:cc.Node,
		levelLabel:cc.Node,
		data:null,
    },
	onLoad(){
		this.nameLabel.getComponent(cc.Label).string = "";
		this.contentLabel.getComponent(cc.Label).string = "";
		this.levelLabel.getComponent(cc.Label).string = "";
		this.SetPressEvent(true);
	},
	SetPressEvent(InOrOut){
		if(InOrOut == true){
			this.node.on("touchstart", this.EventFunc,this);
		}else{
			this.node.off("touchstart", this.EventFunc,this);
		}
	},
	EventFunc(event){
		cc.log("press node:" + this.node.name);
		this.node.dispatchEvent(new cc.Event.EventCustom("itemPress", true));
	},
	setItem(itemID,data){
		//cc.log("item:" + itemID + " data:" + JSON.stringify(data));
		this.data = data;
		this.itemID = itemID;
		this.nameLabel.getComponent(cc.Label).string = data.name;
		this.contentLabel.getComponent(cc.Label).string = data.content;
		this.levelLabel.getComponent(cc.Label).string = this.itemID;
	}
});

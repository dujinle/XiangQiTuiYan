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

function readImg64(){
	if(gSelectFile != null){
		var reader = new FileReader();
		reader.readAsDataURL(gSelectFile);
		reader.onload = function(e){
			gBaseData = this.result;
		}
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
		readImg64();
	}
});
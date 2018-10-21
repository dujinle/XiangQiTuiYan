Base64 = {};
Base64.getBase64Image = function(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var dataURL = canvas.toDataURL("image/png");
	return dataURL
}
Base64.encode = function(url,cb) {
	var img = document.createElement('img');
	img.src = url;  //此处自己替换本地图片的地址
	img.onload =function() {
		var data = Base64.getBase64Image(img);
		cb(data);
	}
}
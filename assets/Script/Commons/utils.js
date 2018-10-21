var util = {}

//返回传递给他的任意对象的类
function isDjlClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}

//深度克隆
util.deepClone = function(obj){
    var result,oClass = isDjlClass(obj);
        //确定result的类型
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(key in obj){
        var copy=obj[key];
        if(isDjlClass(copy)=="Object"){
            result[key]=arguments.callee(copy);//递归调用
        }else if(isDjlClass(copy)=="Array"){
            result[key]=arguments.callee(copy);
        }else{
            result[key]=obj[key];
        }
    }
    return result;
}

util.httpGET = function(url,param,cb){
	var xhr = cc.loader.getXMLHttpRequest();
    if(param == null){
    	xhr.open("GET", url,false);
    }else{
    	xhr.open("GET", url + "?" + param,false);
    }
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            var result = JSON.parse(xhr.responseText);
            cb(result);
        }else{
			cb({"code":xhr.status,"message":xhr.message});
		}
    };
    xhr.send(null);
}

util.httpGETIMG = function(url,param,cb){
	var xhr = cc.loader.getXMLHttpRequest();
    if(param == null){
    	xhr.open("GET", url,false);
    }else{
    	xhr.open("GET", url + "?" + param,false);
    }
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            cb({"code":xhr.status,"data":xhr.responseText});
        }else{
			cb({"code":xhr.status,"message":xhr.message});
		}
    };
    xhr.send(null);
}

util.httpPOST = function(url,str,cb){
    var sendstr = JSON.stringify(str);
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4){
			if(xhr.status >= 200 && xhr.status <= 207){            
				var result = JSON.parse(xhr.responseText);
				cb(result);
			}else{
				cb({"code":xhr.status,"message":"服务器出错！"});
			}
		}
    };
    xhr.send(sendstr);
}
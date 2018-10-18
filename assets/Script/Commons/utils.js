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

util.get = function(url,param,pthis){
	var xhr = cc.loader.getXMLHttpRequest();
    if(param == null){
    	xhr.open("GET", url,false);
    }else{
    	xhr.open("GET", url + "?" + param,false);
    }
    pthis.debug_label.string = url + "?" + param;
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        pthis.debug_label.string = "onreadystatechange:" + xhr.readyState + " status:" + xhr.status;
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            pthis.debug_label.string = pthis.debug_label.string + "resp:" + xhr.responseText;
            var result = JSON.parse(xhr.responseText);
            pthis.callback(result);
        }
    };
    xhr.send(null);
}

util.post = function(url,str,cb){
    var sendstr = JSON.stringify(str);
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("POST", ServerLink);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {            
            var result = JSON.parse(xhr.responseText);
            if(result["act"]=="erro") {
                cb(result["msg"]);                
                return;
            }
            cb(result);
        }
    };
    xhr.send(sendstr);
}
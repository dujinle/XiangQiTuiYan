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
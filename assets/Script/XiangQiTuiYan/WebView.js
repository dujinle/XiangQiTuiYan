cc.Class({
    extends: cc.Component,
    properties: {
        webview: cc.WebView
    },

    onLoad: function () {
        var scheme = "TestKey";// 这里是与内部页面约定的关键字
        function jsCallback (url) {
            // 这里的返回值是内部页面的 url 数值，
            // 需要自行解析自己需要的数据
            var str = url.replace(scheme + '://', '');
            var data = JSON.stringify(str);// {a: 0, b: 1}
        }

        this.webview.setJavascriptInterfaceScheme(scheme);
        this.webview.setOnJSCallback(jsCallback);
    }
});

// 因此当你需要通过内部页面交互 WebView 时，
// 应当设置内部页面 url 为：TestKey://(后面你想要回调到 WebView 的数据) 
// WebView 内部页面代码
/*
<html>
<body>
    <dev>
        <input type="button" value="触发" onclick="onClick()"/>
    </dev>
</body>
<script>
    function onClick () {
        // 其中一个设置URL方案
        document.location = 'TestKey://{a: 0, b: 1}';
    }
</script>
</html>
*/
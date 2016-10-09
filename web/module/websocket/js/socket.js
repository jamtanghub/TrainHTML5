
var Socket = {
    socket : null,
    host : '',
    connect : function(host,options) {
        this.host = host;
        window.WebSocket = window.WebSocket;
        if (!window.WebSocket) {
            console.log('Error: WebSocket is not supported .');
            return;
        }
        this.socket = new WebSocket(host); // 创建连接并注册响应函数
        this.socket.onopen = function(){
            console.log("websocket is opened .");

            options.open&&options.open();
        };
        this.socket.onmessage = function(message) {
            console.log(message.data);

            options.message&&options.message(message);
        };
        this.socket.onclose = function(){
            console.log("websocket is closed .");
            Socket.socket = null; // 清理

            options.close&&options.close();
        };
    },
    send : function(message) {  // 发送消息方法
        if (this.socket) {
            this.socket.send(message);
            return true;
        }
        alert('请先建立连接');
        return false;
    },
    close :function () {
        if (this.socket) {
            this.socket.close();
            this.socket =  null;
        }
    }
};
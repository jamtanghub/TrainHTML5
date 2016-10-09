/**
 * Created by Tjin on 2016/10/9.
 */
(function () {

    var baseUrl =  window.location.protocol+"//"+window.location.host;

    var init = function () {
        /**
         * 开始聊天
         */
        $("#go-chat").click(function () {
            var url = baseUrl + "/train/login";
            var name = $("#name").val();
            $.post(url, {name: name}, function (re) {
                var re = eval("(" + re + ")");
                if (re.status) {
                    var host = window.location.host;
                    var add = "ws://" + host + "/train/chat";
                    Socket.connect(add, options);
                    process();
                }

            });
        });


        /**
         * 发送消息
         */
        $("#send").click(function () {
            var msg = $("#inp").val();

            if(msg==""){
                alert("你要说啥");
                return false;
            }

            Socket.send(msg);
            $("#inp").val("");
        });
        /**
         * 响应Enter键
         */
        $("#inp").keypress(function (e) {
            if(e.keyCode==13){
                $("#send").click();
            }
        });
    };



    var options = {
        /**
         * 处理消息
         * @param re
         */
        message: function (re) {
            var data = re.data;

            var msgObj = eval("(" + data + ")");

            var username = msgObj.username;

            if(username == "system"){
                username = "【系统消息】";
            }
            var message  = msgObj.message;
            var d = new Date();
            var now = d.getHours() + ":" + d.getMinutes()+ ":" + d.getSeconds();

            var tpl = '<div>' +
                '   <span style="color: #0000cc;font-weight: 700">'+username + '&nbsp;&nbsp;' + now +'</span>'+
                '   <div>&nbsp;&nbsp;&nbsp;&nbsp; '+message+'  </div>'+
                '</div>';


            $("#ginp").append(tpl);
        }
    };

    var process = function () {
        $("#login").addClass("hide");
        $("#chat").removeClass("hide");

    };




    $(function () {
        init();

        window.onunload = function () {
            Socket.close();
        }
    });

})();

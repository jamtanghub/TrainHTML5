package xyz.tangjin.train.h5.websocket;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Created by Tjin on 2016/10/9.
 */

//value为访问websocket的路径，configurator为websocket初始化配置器
@ServerEndpoint(value = "/chat",configurator=HttpConfigurator.class)
public class Chat {

    /**
     * 连接对象集合
     */
    private static final Set<Chat> connections = new CopyOnWriteArraySet<Chat>();

    /**
     * WebSocket Session
     */
    private Session session;
    private HttpSession httpSession;
    private String username = " anonymity ";


    /**
     * 打开连接
     * @param session
     */
    @OnOpen
    public void onOpen(Session session,EndpointConfig config) throws UnsupportedEncodingException {
        HttpSession httpSession= (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        if(httpSession!=null){
            this.httpSession = httpSession;
            this.session = session;
            this.username = httpSession.getAttribute("name").toString();
            connections.add(this);
            String msg = "{username:\""+"system"+"\",message:\"" + this.username +"加入了群聊"+"\"}";
            Chat.broadCast(msg);
        }
    }

    /**
     * 关闭连接
     */
    @OnClose
    public void onClose() {
        connections.remove(this);
        String msg = "{username:\""+"system"+"\",message:\""+"已经断开"+"\"}";
        Chat.broadCast(msg);
    }

    /**
     * 接收信息
     * @param message
     */
    @OnMessage
    public void onMessage(String message) {
        String msg = "{username:\""+username+"\",message:\""+message+"\"}";
        Chat.broadCast(msg);
    }

    /**
     * 错误信息响应
     *
     * @param throwable
     */
    @OnError
    public void onError(Throwable throwable) {
        System.out.println(throwable.getMessage());
    }

    /**
     * 发送或广播信息
     *
     * @param message
     */
    private static void broadCast(String message) {
        for (Chat chat : connections) {
            try {
                synchronized (chat) {
                    chat.session.getBasicRemote().sendText(message);
                }
            } catch (IOException e) {
                connections.remove(chat);
                try {
                    chat.session.close();
                } catch (IOException e1) {
                }

                Chat.broadCast("{username:\""+"system"+"\",message:\""+"已经断开"+"\"}");
            }
        }
    }

}

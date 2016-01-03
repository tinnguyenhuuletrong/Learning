package jwebview;

import android.content.Context;
import android.util.Log;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

import jockey.Jockey;
import jockey.JockeyCallback;
import jockey.JockeyHandler;
import jockey.JockeyImpl;

/**
 * Created by phuoc Hp on 1/1/2016.
 */
public class JWebview {

    private WebView webView;
    private Context context;
    private Jockey jockey;
    private HashMap<String, JUnityWebEventCallbackArg> dbEventCallback;
    private static IWebViewEventCallback eventcallbackHandler;

    public JWebview(WebView webview, Context context) {
        this.webView = webview;
        this.context = context;
        this.dbEventCallback = new HashMap<String, JUnityWebEventCallbackArg>();
        _Init();
    }

    public void loadUrl(String url) {
        webView.loadUrl(url);
    }

    private void _Init()
    {
        jockey = JockeyImpl.getDefault();

        jockey.configure(webView);

        jockey.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d("webViewClient", "page finished loading!");
            }
        });


        setJockeyEvents();

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsAlert(WebView view, String url, String message,
                                     JsResult result) {
                Toast.makeText(context, message, Toast.LENGTH_SHORT)
                        .show();
                result.confirm();
                return true;
            }
        });
    }

    public void setJockeyEvents() {
//        jockey.on("log", new JockeyHandler() {
//            @Override
//            public void doPerform(Map<Object, Object> payload) {
//                String value = "color=" + payload.get("color");
//                Log.d("jockey", value);
//            }
//        });


        jockey.on("toast", new JockeyHandler() {
            @Override
            protected void doPerform(Map<Object, Object> payload) {
                String value = payload.get("message").toString();
                Toast.makeText(context, value, Toast.LENGTH_SHORT)
                        .show();
            }
        });


    }

    public void send(String event, Object payload) {
        jockey.send(event, webView, payload);
    }

    public void send(String event, Object payload, JockeyCallback callback) {
        jockey.send(event, webView, payload, callback);
    }


    //--------------------------------------------------------------------------------------//
    //  Internal Class
    //--------------------------------------------------------------------------------------//
    static final public class JUnityWebEventCallbackArg{
        public String ObjectName;
        public String MethodName;
        public String Arg;

        public JUnityWebEventCallbackArg(String objectName, String methodName) {
            ObjectName = objectName;
            MethodName = methodName;
        }

        @Override
        public String toString() {
            return ObjectName + ":" + MethodName + ":" + Arg;
        }
    }

    public interface IWebViewEventCallback {
        public void OnEvent(String eventName, JUnityWebEventCallbackArg arg);
    }

    //--------------------------------------------------------------------------------------//
    //  Webview Custom Event Register
    //--------------------------------------------------------------------------------------//
    public static void setEventCallbackHandler(IWebViewEventCallback handler) {
        eventcallbackHandler = handler;
    }

    public void addEvent(final String eventName, final JUnityWebEventCallbackArg callbackArg) {
        if(this.dbEventCallback.containsKey(eventName))
            return;

        this.dbEventCallback.put(eventName, callbackArg);
        Log.i("Unity", "RegisterEvent " + eventName);
        //Register Jockey Event
        jockey.on(eventName, new JockeyHandler() {
            @Override
            protected void doPerform(Map<Object, Object> payload) {
                Gson gson = new Gson();
                String value = gson.toJson(payload);

                callbackArg.Arg = value;
                processCustomEvent(eventName, callbackArg);
            }
        });
    }

    private void processCustomEvent(String eventName, JUnityWebEventCallbackArg args)
    {
        if(eventcallbackHandler != null) {
            eventcallbackHandler.OnEvent(eventName, args);
        }
    }
}

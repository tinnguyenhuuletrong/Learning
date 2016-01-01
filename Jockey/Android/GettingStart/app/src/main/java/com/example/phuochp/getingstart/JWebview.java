package com.example.phuochp.getingstart;

import android.content.Context;
import android.util.Log;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.util.Map;

import webview.joy.com.jokey.Jockey;
import webview.joy.com.jokey.JockeyCallback;
import webview.joy.com.jokey.JockeyHandler;
import webview.joy.com.jokey.JockeyImpl;

/**
 * Created by phuoc Hp on 1/1/2016.
 */
public class JWebview {

    private WebView webView;
    private Context context;
    private Jockey jockey;

    public JWebview(WebView webview, Context context) {
        this.webView = webview;
        this.context = context;
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
        jockey.on("log", new JockeyHandler() {
            @Override
            public void doPerform(Map<Object, Object> payload) {
                String value = "color=" + payload.get("color");
                Log.d("jockey", value);
            }
        });


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
}

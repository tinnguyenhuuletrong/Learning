package com.example.phuochp.getingstart;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

import java.util.HashMap;

import jockey.JockeyCallback;
import jwebview.JWebview;

public class WebViewActivity extends Activity {

    private WebView webView;
    private JWebview jweb;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view);

        webView = (WebView) findViewById(R.id.webView);

        jweb = new JWebview(webView, this);

        jweb.loadUrl("file:///android_asset/index.html");

        test();
    }

    private void test() {
        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        Log.i("tag", "This'll run 3000 milliseconds later");

                        String hex = "FF0000";
                        HashMap<String, String> payload = new HashMap<String, String>();
                        payload.put("color", hex);

                        jweb.send("color-change", payload);
                    }
                },
                3000);

        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        Log.i("tag", "This'll run 6000 milliseconds later");

                        HashMap<String, String> payload = new HashMap<String, String>();
                        payload.put("feed", "http://www.google.com/doodles/doodles.xml");

                        jweb.send("show-image", payload, new JockeyCallback() {
                            public void call() {
                                Log.i("tag", "Show Image Complete");
                            }
                        });
                    }
                },
                6000);
    }
}

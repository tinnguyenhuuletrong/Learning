package jwebview; // 41 Post - Created by DimasTheDriver on Feb/21/2012 . Part of the 'Android: creating a WebView dialog' post. Available at: http://www.41post.com/?p=4673

import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.ActivityInfo;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.ContextThemeWrapper;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.AbsListView;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import java.util.Map;

public class WebViewDialogActivity extends Activity
{
    public  static WebViewDialogActivity Instance;

    //a WebView object to display a web page
    private WebView webView;
    private ImageView exitButton;
    private static JWebview jweb;
    private static Dialog dialog;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        setTheme(android.R.style.Theme_Translucent_NoTitleBar_Fullscreen);
        super.onCreate(savedInstanceState);
        Log.e("Unity", "[WebViewDialogActivity] onStart");
        Instance = this;

        if(dialog != null) {
            dialog.dismiss();
            dialog = null;
        }

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);

        StartDialog(this);

    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if(dialog != null)
                dialog.dismiss();
            this.finish();

            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(dialog != null)
            dialog.dismiss();
        Instance = null;
    }

    public void StartDialog(Context mContext)
    {
        if(dialog != null)
            return;

        AlertDialog.Builder alert = new AlertDialog.Builder(new ContextThemeWrapper(this, android.R.style.Theme_Translucent_NoTitleBar_Fullscreen));
        RelativeLayout myLayout = new RelativeLayout(this);

        myLayout.setBackgroundColor(android.graphics.Color.TRANSPARENT);

        initComponents();
        initWebView();

        //Layout Init For WebView
        RelativeLayout.LayoutParams webViewParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
        );
        //webViewParams.setMargins(20, 20, 20, 20);
        myLayout.addView(webView, webViewParams);

        //Button Layout Init
        RelativeLayout.LayoutParams buttonParam = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        buttonParam.addRule(RelativeLayout.ALIGN_TOP, 1);
        buttonParam.addRule(RelativeLayout.ALIGN_RIGHT, 1);

        int offset = 0;
        buttonParam.setMargins(offset, offset, offset, offset);
        myLayout.addView(exitButton, buttonParam);

        // Set alert content
        alert.setView(myLayout);

        dialog = alert.show();

        dialogSetup();

        Log.d("Unity", "[WebViewDialogActivity] Show Dialog Finish");
    }

    private void dialogSetup() {
        dialog.getWindow().setLayout(-1, -1);
        dialog.setOnKeyListener(new Dialog.OnKeyListener() {

            @Override
            public boolean onKey(DialogInterface arg0, int keyCode,
                                 KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    finish();
                    if(dialog != null)
                        dialog.dismiss();
                }
                return true;
            }
        });
    }

    private void initComponents() {
        exitButton = new ImageView(this);
        exitButton.setBackgroundResource(android.R.drawable.ic_notification_clear_all);
        exitButton.setId(2);

        webView = new WebView(this);
        webView.setId(1);

        final Activity self = this;

        exitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();

                self.finish();
            }
        });
    }


    private void initWebView() {
        String url = JWebHelper.CurrentURL;
        if(jweb != null)
            jweb.destroy();

        jweb = new JWebview(webView, this);
        jweb.loadUrl(url);

        //Event Register
        for(Map.Entry<String, JWebview.JUnityWebEventCallbackArg> entry : JWebHelper.WebEventDB.entrySet()) {
            String key = entry.getKey();
            JWebview.JUnityWebEventCallbackArg value = entry.getValue();
            jweb.addEvent(key, value);
        }
    }

    public JWebview getWebView() {
        return  jweb;
    }
}
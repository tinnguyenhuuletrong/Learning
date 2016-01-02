package webview.joy.com.jokey.joy; // 41 Post - Created by DimasTheDriver on Feb/21/2012 . Part of the 'Android: creating a WebView dialog' post. Available at: http://www.41post.com/?p=4673

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.Button;
import webview.joy.com.jokey.R;

public class WebViewDialogActivity extends Activity
{
    //a WebView object to display a web page
    private WebView webView;


    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        //Remove title bar
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);

        //Remove notification bar
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.main);

        String url = JWebHelper.CurrentURL;

        webView = (WebView) findViewById(R.id.webView);

        JWebview jweb = new JWebview(webView, this);

        jweb.loadUrl(url);
    }
}
package jwebview; // 41 Post - Created by DimasTheDriver on Feb/21/2012 . Part of the 'Android: creating a WebView dialog' post. Available at: http://www.41post.com/?p=4673

import android.app.Activity;
import android.content.res.Resources;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.ImageView;

import java.util.Map;

public class WebViewDialogActivity extends Activity
{
    public  static WebViewDialogActivity Instance;

    //a WebView object to display a web page
    private WebView webView;

    private ImageView exitButton;

    private JWebview jweb;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        Instance = this;

        //Remove title bar
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);

        //Remove notification bar
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.main);

        webView = (WebView) findViewById(R.id.webView);
        exitButton = (ImageView)findViewById(R.id.exit);
        final Activity self = this;

        //Exit button handler
        exitButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                self.finish();
            }
        });

        initWebView();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        Instance = null;
    }


    private void initWebView() {
        String url = JWebHelper.CurrentURL;
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
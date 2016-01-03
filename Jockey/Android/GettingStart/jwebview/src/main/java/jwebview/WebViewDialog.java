package jwebview;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.ImageView;

import java.util.Map;

/**
 * Created by phuoc Hp on 1/3/2016.
 */
public class WebViewDialog {

    //a WebView object to display a web page
    private static WebView webView;

    private static ImageView exitButton;

    private static JWebview jweb;

    public static void StartDialog(Context mContext)
    {
        AlertDialog.Builder builder;
        final AlertDialog alertDialog;

        LayoutInflater inflater = (LayoutInflater) mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View layout = inflater.inflate(R.layout.main, null);

        webView = (WebView) layout.findViewById(R.id.webView);
        exitButton = (ImageView) layout.findViewById(R.id.exit);

        initWebView(mContext);

        builder = new AlertDialog.Builder(mContext);
        builder.setView(layout);
        alertDialog = builder.create();

        //Exit button handler
        exitButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                alertDialog.dismiss();
            }
        });

        alertDialog.show();
    }

    private static void initWebView(Context mContext) {
        String url = JWebHelper.CurrentURL;
        jweb = new JWebview(webView, mContext);
        jweb.loadUrl(url);

        //Event Register
        for(Map.Entry<String, JWebview.JUnityWebEventCallbackArg> entry : JWebHelper.WebEventDB.entrySet()) {
            String key = entry.getKey();
            JWebview.JUnityWebEventCallbackArg value = entry.getValue();
            jweb.addEvent(key, value);
        }
    }

    public static JWebview getWebView() {
        return  jweb;
    }


}

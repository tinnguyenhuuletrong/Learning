package webview.joy.com.jokey.joy;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.util.Log;
import android.webkit.WebView;

/**
 * Created by phuoc Hp on 1/2/2016.
 */
public class JWebHelper {

    private static Context mContext;
    public  static  String CurrentURL;
    public static void SetContext(Context ctx) {
        mContext = ctx;
        Log.d("Unity", "Set Context " + mContext.toString() + " " + WhoAreYou());
    }

    public static void ShowWebViewPopup(String url){
        CurrentURL = url;
        Intent intent = new Intent(mContext, WebViewDialogActivity.class);
        mContext.startActivity(intent);
    }

    public static void TestCallUnity(String objectName, String method, String arg)
    {
        com.unity3d.player.UnityPlayer.UnitySendMessage(objectName, method, "[Java]" + arg);
    }

    public static String WhoAreYou()
    {
        return  "Hello";
    }
}

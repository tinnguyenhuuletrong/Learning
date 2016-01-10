package jwebview;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.HashMap;

/**
 * Created by phuoc Hp on 1/2/2016.
 */
public class JWebHelper implements JWebview.IWebViewEventCallback{

    private static Context mContext;
    public  static  String CurrentURL;
    public  static HashMap<String, JWebview.JUnityWebEventCallbackArg> WebEventDB = new HashMap<String, JWebview.JUnityWebEventCallbackArg>();
    public static boolean IsUnityMode = true;


    public static void SetContext(Context ctx) {
        mContext = ctx;
        Log.d("Unity", "Set Context " + mContext.toString() + " " + WhoAreYou());

        JWebview.setEventCallbackHandler(new JWebHelper());
    }

    public static void ShowWebViewPopup(String url){
        CurrentURL = url;

        Log.d("Unity", "Show Web View " + url);
        Intent intent = new Intent(mContext, WebViewDialogActivity.class);
        mContext.startActivity(intent);

    }

    public static  boolean ClearAllEvent() {
        WebEventDB.clear();
        return  true;
    }

    public  static  boolean RegisterEvent(String event, String callbackObjectName, String callbackMethod) {
        if(WebEventDB.containsKey(event))
            return false;

        JWebview.JUnityWebEventCallbackArg arg = new JWebview.JUnityWebEventCallbackArg(callbackObjectName, callbackMethod);
        WebEventDB.put(event, arg);

        return  true;

    }

    public static boolean SendEvent(String event, String args) {
        JWebview webview;

        if( WebViewDialogActivity.Instance == null || WebViewDialogActivity.Instance.getWebView() == null )
            return  false;
        webview = WebViewDialogActivity.Instance.getWebView();


        if(webview == null)
            return false;


        Gson gson = new Gson();
        Type type = new TypeToken<HashMap<String, String>>(){}.getType();
        Object arg = gson.fromJson(args, type);
        webview.send(event, arg);

        return  true;
    }

    public static String WhoAreYou()
    {
        return  "jwebview.JWebHelper";
    }


    //-------------------------------------------------------------------------------------------------------//
    //  Webview Event Handler
    //-------------------------------------------------------------------------------------------------------//
    public void OnEvent(String eventName, JWebview.JUnityWebEventCallbackArg arg)
    {
        try
        {
            Log.d("Unity", "[JWebHelper-"+ IsUnityMode +"] OnEvent " + eventName + ": " + arg);

            if(IsUnityMode)
                com.unity3d.player.UnityPlayer.UnitySendMessage(arg.ObjectName, arg.MethodName, arg.Arg);
        }
        catch (Exception ex){
            Log.e("Unity", ex.toString());
        }
    }
}

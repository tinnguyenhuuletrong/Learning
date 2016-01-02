using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

class JWebViewHelper
{

#if UNITY_IOS

#elif UNITY_ANDROID
    private static AndroidJavaObject mPlayerActivityContext;
    private static AndroidJavaClass mBridgeClass;
    private static bool mIsReady = false;
    public static void Init()
    {
        using (var actClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
        {
            mPlayerActivityContext = actClass.GetStatic<AndroidJavaObject>("currentActivity");
        }

        mBridgeClass = new AndroidJavaClass("webview.joy.com.jokey.joy.JWebHelper");
        Debug.Log(mPlayerActivityContext);
        mBridgeClass.CallStatic("SetContext", mPlayerActivityContext);

        mIsReady = true;

        Debug.Log("Test: " + mBridgeClass.CallStatic<string>("WhoAreYou"));
    }

    public static void ShowWebView(string url)
    {
        if (!mIsReady)
            throw new Exception("JWebViewHelper.Init must be call first");

        mBridgeClass.CallStatic("ShowWebViewPopup", url);
    }
#else
    public static void Init()
    {
        Debug.Log("[JWebView] Init");
    }

    public static void ShowWebView(string url)
    {
        Debug.Log("[JWebView] Show URL " + url);
    }
#endif
}

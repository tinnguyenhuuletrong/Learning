using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using UnityEngine;

class JWebViewHelper
{

#if UNITY_IOS

	public static void Init()
	{

	}

	[DllImport ("__Internal")]
	public static extern void ShowWebViewPopup(string url);

	[DllImport ("__Internal")]
	public static extern void RegisterEvent(string eventName, string objName, string methodName);

	[DllImport ("__Internal")]
	public static extern void SendEvent(string eventName, string jsonArg);

	[DllImport ("__Internal")]
	public static extern void ClearAllEvent();

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

        mBridgeClass = new AndroidJavaClass("jwebview.JWebHelper");
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
	
	public static void RegisterEvent(string eventName, string objName, string methodName)
	{
		if (!mIsReady)
            throw new Exception("JWebViewHelper.Init must be call first");

        mBridgeClass.CallStatic<bool>("RegisterEvent", eventName, objName, methodName);
	}
	
	public static void SendEvent(string eventName, string jsonArg)
	{
		if (!mIsReady)
            throw new Exception("JWebViewHelper.Init must be call first");

        mBridgeClass.CallStatic<bool>("SendEvent", eventName, jsonArg);
	}
	
	public static void ClearAllEvent()
	{
		if (!mIsReady)
            throw new Exception("JWebViewHelper.Init must be call first");

        mBridgeClass.CallStatic<bool>("ClearAllEvent");
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
	
	public static void RegisterEvent(string eventName, string objName, string methodName)
	{
		Debug.Log("[JWebView] RegisterEvent ");
	}
	
	public static void SendEvent(string eventName, string jsonArg)
	{
		Debug.Log("[JWebView] SendEvent ");
	}
	
	public static void ClearAllEvent()
	{
		Debug.Log("[JWebView] ClearAllEvent ");
	}
#endif
}

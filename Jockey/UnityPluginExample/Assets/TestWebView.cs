using UnityEngine;
using System.Collections;

public class TestWebView : MonoBehaviour
{
	string buttonText = "CallMe!";
	
	// Use this for initialization
	void Start () {
		DebugLogData("1");
	    JWebViewHelper.Init();
		
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void OnGUI()
    {
        if (GUI.Button(new Rect(0, 0, 400, 200), "Click!"))
        {
			JWebViewHelper.ClearAllEvent();
			JWebViewHelper.RegisterEvent("log", this.name, "DebugLogData");
            JWebViewHelper.ShowWebView("http://thankiem3d.vn/test-webview");
        }
		
	
    }
	
	void RenameButton(string newName)
	{
		buttonText = newName;
	}
	
	void DebugLogData(string content) 
	{
		Debug.LogError(content);
	}
}

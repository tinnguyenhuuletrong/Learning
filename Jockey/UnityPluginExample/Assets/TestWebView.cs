using UnityEngine;
using System.Collections;

public class TestWebView : MonoBehaviour
{
	string buttonText = "CallMe!";
	
	// Use this for initialization
	void Start () {
	    JWebViewHelper.Init();
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void OnGUI()
    {
        if (GUI.Button(new Rect(0, 0, 400, 200), "Click!"))
        {
            JWebViewHelper.ShowWebView("https://www.google.com/");
        }
		
		if (GUI.Button(new Rect(0, 400, 400, 200), buttonText))
        {
            JWebViewHelper.TestJavaCall(this.name, "RenameButton", "Rename");
        }
    }
	
	void RenameButton(string newName)
	{
		buttonText = newName;
	}
}

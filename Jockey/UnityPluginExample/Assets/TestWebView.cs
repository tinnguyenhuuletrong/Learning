using UnityEngine;
using System.Collections;

public class TestWebView : MonoBehaviour
{

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
            JWebViewHelper.ShowWebView("http://hero.jskill.com/");
        }
    }
}

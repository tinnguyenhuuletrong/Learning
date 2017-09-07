using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class VideoRecord : MonoBehaviour {
	public RawImage displayImg;

	private bool isRecording = false;
	private WebCamTexture webcamTexture;

	// Use this for initialization
	void Start () {
		WebCamDevice[] devices = WebCamTexture.devices;
		foreach(var cam in devices)
		{
			if(cam.isFrontFacing )
			{    
				webcamTexture = new WebCamTexture();
				webcamTexture.deviceName = cam.name; 
				displayImg.texture = webcamTexture;
			}
		}
		
	}
	
	// Update is called once per frame
	void Update () {
		if(!webcamTexture.isPlaying)
			return;

		float scaleY = webcamTexture.videoVerticallyMirrored ? -1.0f : 1.0f;
		displayImg.transform.localScale = new Vector3(1, scaleY , 1);
		displayImg.transform.rotation = Quaternion.AngleAxis(webcamTexture.videoRotationAngle, Vector3.back);
	}

	public void ActionBack() {
		UnityEngine.SceneManagement.SceneManager.LoadScene("Menu");
	}

	public void ActionToggle() {
		isRecording = !isRecording;

		if(isRecording)
        	webcamTexture.Play();
		else
			webcamTexture.Stop();
	}
	
}

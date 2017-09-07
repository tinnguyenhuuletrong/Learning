using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class AudioRecord : MonoBehaviour {
	bool isRecording = false;
    private AudioSource audioSource;
 
    //temporary audio vector we write to every second while recording is enabled..
    List<float> tempRecording = new List<float>();
 
    //list of recorded clips...
    List<float> recordedClips = new List<float>();

	public Text txtStatus;

	// Use this for initialization
	void Start () {
		audioSource = GetComponent<AudioSource>();
	}

	void StartRecord() {
        //set up recording to last a max of 1 seconds and loop over and over
        audioSource.clip = Microphone.Start(null, true, 1, 44100);
        audioSource.Play();
		//resize our temporary vector every second
        Invoke("ResizeRecording", 1);
	}

	void StopRecord() {
		//stop recording, get length, create a new array of samples
		int length = Microphone.GetPosition(null);
		
		Microphone.End(null);
		float[] clipData = new float[length];
		audioSource.clip.GetData(clipData, 0);

		//create a larger vector that will have enough space to hold our temporary
		//recording, and the last section of the current recording
		float[] fullClip = new float[clipData.Length + tempRecording.Count];
		for (int i = 0; i < fullClip.Length; i++)
		{
			//write data all recorded data to fullCLip vector
			if (i < tempRecording.Count)
				fullClip[i] = tempRecording[i];
			else
				fullClip[i] = clipData[i - tempRecording.Count];
		}
		
		recordedClips.Clear();
		recordedClips.AddRange(fullClip);

		audioSource.clip = AudioClip.Create("recorded samples", fullClip.Length, 1, 44100, false);
		audioSource.clip.SetData(fullClip, 0);
		audioSource.loop = true;    
	}

	void ResizeRecording()
    {
        if (isRecording)
        {
            //add the next second of recorded audio to temp vector
            int length = 44100;
            float[] clipData = new float[length];
            audioSource.clip.GetData(clipData, 0);
            tempRecording.AddRange(clipData);
            Invoke("ResizeRecording", 1);
        }
    }


	public void ActionToggle() {
		isRecording = !isRecording;
        Debug.Log(isRecording == true ? "Is Recording" : "Off");

		txtStatus.text = "Is Recording: " + isRecording;
		
		if (isRecording == false)
            {
                StopRecord();
            }
            else
            {
                //stop audio playback and start new recording...
                audioSource.Stop();
                tempRecording.Clear();
				recordedClips.Clear();
                Microphone.End(null);
                StartRecord();
            }
	}
	
	public void ActionPlayback() {
		SwitchClips();
	}

	public void ActionBack() {
		UnityEngine.SceneManagement.SceneManager.LoadScene("Menu");
	}

	void SwitchClips()
    {
        if (recordedClips.Count > 0)
        {
            audioSource.Stop();
            int length = recordedClips.Count;
            audioSource.clip = AudioClip.Create("recorded samples", length, 1, 44100, false);
            audioSource.clip.SetData(recordedClips.ToArray(), 0);
            audioSource.loop = false;
            audioSource.Play();
        }
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MidiObjectController : MonoBehaviour {

    public MidiJSON.MidiNoteEvent midiNoteEvent;
    public Vector3 velocity;
    public System.Action<MidiJSON.MidiNoteEvent> onPlayMessage;
    public System.Action<MidiJSON.MidiNoteEvent> onStopMessage;

    private int state = 0;


    public bool ManualUpdate() {
        
        this.transform.position += velocity * Time.deltaTime;

        if(state == 0 && this.transform.position.x < 0) {
            On();
            state = 1;
        } else if (state == 1 && this.transform.position.x <= -midiNoteEvent.duration)
		{
            Off();
            return false;
        }

        return true;
    }

    private void On() {
        if (onPlayMessage != null)
            onPlayMessage(midiNoteEvent);
    }

	private void Off()
	{
		if (onStopMessage != null)
			onStopMessage(midiNoteEvent);
		GameObject.Destroy(this.gameObject);
	}
}

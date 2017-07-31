using AudioSynthesis.Sequencer;
using AudioSynthesis.Synthesis;
using AudioSynthesis.Bank;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityMidi;

[RequireComponent(typeof(AudioSource))]
public class MidiNoteLoader : MonoBehaviour {
    [SerializeField] string MidiName = "";
    [SerializeField] StreamingAssetResouce bankSource;

	[SerializeField] int channel = 1;
	[SerializeField] int sampleRate = 44100;
	[SerializeField] int bufferSize = 1024;
	[SerializeField] float playSpeed = 1.0f;
    [SerializeField] GameObject NotePrefab = null;

    MidiJSON.MidiJson midiJson;

    PatchBank bank;
    MidiInputSequencer sequencer;
    Synthesizer synthesizer;
    AudioSource audioSource;

	int bufferHead;
	float[] currentBuffer;

    private List<MidiObjectController> notes = new List<MidiObjectController>();

    private void Awake()
    {
        synthesizer = new Synthesizer(sampleRate, channel, bufferSize, 1);
        sequencer = new MidiInputSequencer(synthesizer);
        LoadBank(new PatchBank(bankSource));

    }

	public void LoadBank(PatchBank bank)
	{
		this.bank = bank;
		synthesizer.UnloadBank();
		synthesizer.LoadBank(bank);
	}

    // Use this for initialization
    IEnumerator Start () {
        Debug.Log("Start...");
        audioSource = GetComponent<AudioSource>();

        yield return LoadFile(MidiName);

        foreach (var item in midiJson.tracks)
        {
            yield return VisualTrack(item, Vector3.right * 5, Random.ColorHSV(0.5f, 1.0f));
        }

        audioSource.Play();

        yield break;
	}


    IEnumerator VisualTrack(MidiJSON.MidiTrack track, Vector3 beginPos, Color color) {
        Debug.Log("Visual Track: " + track.id);

        Vector3 dir = Vector3.right;
        float timeScaleUnit = 5.0f;
        float moveSpeed = 5.0f * playSpeed;

        foreach (var item in track.notes)
        {
            Vector3 pos = beginPos + item.time * timeScaleUnit * dir;
            pos.y = item.midi - 60.0f;
            var go = Instantiate(NotePrefab, pos, Quaternion.identity);

            item.duration *= timeScaleUnit;
            item.channel = track.channelNumber;

			// layout
			Vector3 size = Vector3.one;
            size.x = item.duration;
            go.transform.localScale = size;
            go.name = item.name;

            // Controller
            MidiObjectController controller = go.GetComponent<MidiObjectController>();
            controller.midiNoteEvent = item;
            controller.velocity = Vector3.right * -1 * moveSpeed;
            controller.onPlayMessage = OnPlayNote;
            controller.onStopMessage = OnPlayNoteOff;

            go.GetComponentInChildren<MeshRenderer>().material.color = color;

            notes.Add(controller);
        }

        yield break;
    }

    private IEnumerator LoadFile(string path) {
        string output = string.Empty;
        var loader = Resources.LoadAsync("midi-json/" + path);
        yield return loader;

        TextAsset txt = loader.asset as TextAsset;

        if(txt != null) {
            output = txt.text;
            midiJson = JsonUtility.FromJson<MidiJSON.MidiJson>(output);
        }
    }
	

    private void OnPlayNote(MidiJSON.MidiNoteEvent note) {
        Debug.Log("On: " + note.name);

        // Note On
        MidiMessage msg = new MidiMessage((byte)note.channel, (byte)AudioSynthesis.Midi.MidiEventTypeEnum.NoteOn, (byte)note.midi, (byte)(note.velocity * 100));
        sequencer.AddMidiEvent(msg);
    }

	private void OnPlayNoteOff(MidiJSON.MidiNoteEvent note)
	{
		Debug.Log("Off: " + note.name);

		// Note Off
        MidiMessage msg = new MidiMessage((byte)note.channel, (byte)AudioSynthesis.Midi.MidiEventTypeEnum.NoteOn, (byte)note.midi, 0);
		sequencer.AddMidiEvent(msg);
	}

    void OnAudioFilterRead(float[] data, int channel)
	{
        lock (sequencer.Synth)
        {
            Debug.Assert(this.channel == channel);
            int count = 0;
            while (count < data.Length)
            {
                if (currentBuffer == null || bufferHead >= currentBuffer.Length)
                {
                    synthesizer.GetNext();
                    currentBuffer = synthesizer.WorkingBuffer;
                    bufferHead = 0;
                }
                var length = Mathf.Min(currentBuffer.Length - bufferHead, data.Length - count);
                System.Array.Copy(currentBuffer, bufferHead, data, count, length);
                bufferHead += length;
                count += length;
            }
        }
            
	}
}

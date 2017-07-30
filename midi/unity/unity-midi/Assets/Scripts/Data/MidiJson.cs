using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace MidiJSON {

	[System.Serializable]
	public class MidiJson
	{
		public float startTime;
		public float duration;
		public MidiHeader header;
        public List<MidiTrack> tracks;
	}

	[System.Serializable]
	public class MidiHeader
	{
		public string name;
		public uint PPQ;
		public uint bmp;
		public uint[] timeSignature;
	}

	[System.Serializable]
	public class MidiTrack
	{
        public float startTime;
		public float duration;
		public uint length;
		public uint id;
        public uint instrumentNumber;
        public uint channelNumber;
        public bool isPercussion;
        public string instrument;
        public string instrumentFamily;
        public List<MidiNoteEvent> notes;
        public Dictionary<string, MidiControlEvent> controlChanges;
	}

	[System.Serializable]
	public class MidiNoteEvent
	{
		public string name;
		public uint midi;
        public float time;
        public float velocity;
        public float duration;
        public uint channel;
	}

	[System.Serializable]
	public class MidiControlEvent
	{
		public uint number;
		public float time;
		public float value;
	}
}


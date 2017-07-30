﻿using UnityEngine;
using System.IO;
using AudioSynthesis;

namespace UnityMidi
{
    [System.Serializable]
    public class StreamingAssetResouce : IResource
    {
        [SerializeField] string streamingAssetPath;

        public bool ReadAllowed()
        {
            return true;
        }

        public bool WriteAllowed()
        {
            return false;
        }

        public bool DeleteAllowed()
        {
            return false;
        }

        public string GetName()
        {
            return Path.GetFileName(streamingAssetPath);
        }

        public Stream OpenResourceForRead()
        {
            return File.OpenRead(Path.Combine(Application.streamingAssetsPath, streamingAssetPath));
        }

        public Stream OpenResourceForWrite()
        {
            throw new System.NotImplementedException();
        }

        public void DeleteResource()
        {
            throw new System.NotImplementedException();
        }
    }
}

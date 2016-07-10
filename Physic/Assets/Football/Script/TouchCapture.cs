using System;
using System.Collections.Generic;
using UnityEngine;

class TouchCapture
{
    private float DELTA_SNAPSHOT = 0.01f;

    public class TouchSnapShoot
    {
        public Vector3 ScreenPos;
        public Vector2 RelativePos;
        public Vector3 WordPos;
        public float Time;

        public TouchSnapShoot(Vector3 screenPos, float time)
        {
            ScreenPos = screenPos;
            RelativePos.x = screenPos.x / Screen.width;
            RelativePos.y = screenPos.y / Screen.height;

            WordPos = TouchCapture.MainCamera.ScreenToWorldPoint(new Vector3(ScreenPos.x, ScreenPos.y, 5));
            Time = time;
        }
    }

    private static TouchCapture sInstance;
    public static TouchCapture Instance
    {
        get
        {
            if (sInstance == null)
                sInstance = new TouchCapture();
            return sInstance;
        }
    }

    public List<TouchSnapShoot> Data = new List<TouchSnapShoot>();
    private float lastUpdate;
    public static Camera MainCamera;

    public void OnTouchBegin()
    {
        Data.Clear();
        Data.Add(new TouchSnapShoot(Input.mousePosition, Time.time));
        lastUpdate = Time.timeSinceLevelLoad;
    }

    public void OnTouchEnd()
    {
        Data.Add(new TouchSnapShoot(Input.mousePosition, Time.time));
    }

    public void OnTouchUpdate()
    {
        float now = Time.timeSinceLevelLoad;

        if (now - lastUpdate > DELTA_SNAPSHOT)
        {
            lastUpdate = now;
            Data.Add(new TouchSnapShoot(Input.mousePosition, Time.time));
        }
    }
}

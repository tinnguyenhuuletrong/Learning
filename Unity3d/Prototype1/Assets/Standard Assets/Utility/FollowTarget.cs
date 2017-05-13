using System;
using UnityEngine;



public class FollowTarget : MonoBehaviour
{
    public Transform target;
    public Vector3 offset = new Vector3(0f, 7.5f, 0f);
    public float speed = 10.0f;

    public Rect CameraBound;

    private Vector3 currentVelocity;

    private void Start()
    {
        CameraBound = new Rect();

        var vertExtent = Camera.main.GetComponent<Camera>().orthographicSize;
        var horzExtent = vertExtent * Screen.width / Screen.height;

        // Calculations assume map is position at the origin
        CameraBound.size = new Vector2(horzExtent * 2, vertExtent * 2);

    }

    private void LateUpdate()
    {
        Vector3 currentPos = transform.position;
        Vector3 targetPos = target.position + offset;
        transform.position = Vector3.SmoothDamp(currentPos, targetPos, ref currentVelocity, Time.smoothDeltaTime, speed);

        CameraBound.position = transform.position;
    }


}


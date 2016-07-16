using UnityEngine;
using System.Collections;

public class BallController : MonoBehaviour {

    private Vector3 lastFramePosition;
    private Rigidbody mRigidbody;
   

    // Use this for initialization
    void Start () {
        lastFramePosition = transform.position;
        mRigidbody = gameObject.GetComponent<Rigidbody>();
    }
	
	// Update is called once per frame
	void Update () {
        Debug.DrawLine(lastFramePosition, transform.position, Color.red, 5);
        lastFramePosition = transform.position;


        if (mRigidbody.IsSleeping())
        {
            GameObject.Destroy(this.gameObject);
        }
    }


}

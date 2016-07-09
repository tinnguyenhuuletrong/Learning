using UnityEngine;using System.Collections;public class BallShoot : MonoBehaviour {    public GameObject BallPrefab;    public float InitForceStrength = 1.0f;
    public GameObject Crusor2d;

    private Vector3 startPos;
    private float startTime;

    // Use this for initialization
    void Start () {		}    void OnMouseDown()
    {
        startTime = Time.time;
        startPos = Input.mousePosition;
        startPos.z = transform.position.z - Camera.main.transform.position.z;
        startPos = Camera.main.ScreenToWorldPoint(startPos);
    }

    void OnMouseUp()
    {
        var endPos = Input.mousePosition;
        endPos.z = transform.position.z - Camera.main.transform.position.z;
        endPos = Camera.main.ScreenToWorldPoint(endPos);

        var force = endPos - startPos;
        force.z = force.magnitude;
        force /= (Time.time - startTime);
        SpawnPrefab(force);
    }

    private void SpawnPrefab(Vector3 force)
    {
        GameObject ball = (GameObject)GameObject.Instantiate(BallPrefab, transform.position, Quaternion.identity);
        ball.GetComponent<Rigidbody>().AddForce(force * InitForceStrength, ForceMode.Impulse);
    }

    // Update is called once per frame
    void Update ()
    {        if (TouchBegin())        {            OnMouseDown();        }
        else if (TouchEnd())
        {
            OnMouseUp();
        }


        UpdateCrusor();
    }

    private void UpdateCrusor()
    {
        Crusor2d.transform.position = Input.mousePosition;
    }

    private static bool TouchEnd()
    {
        return Input.GetMouseButtonUp(0);
    }

    private static bool TouchBegin()
    {
        return Input.GetMouseButtonDown(0);
    }
}
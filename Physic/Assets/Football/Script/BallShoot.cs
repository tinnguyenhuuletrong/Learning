using UnityEngine;using System.Collections;public class BallShoot : MonoBehaviour {    public GameObject BallPrefab;    public float InitForceStrength = 1.0f;
    public GameObject Crusor2d;

    private bool hasTouchBegin = false;

    // Use this for initialization
    void Start () {
        TouchCapture.MainCamera = Camera.main;    }    void OnMouseDown()
    {
        hasTouchBegin = true;
        TouchCapture.Instance.OnTouchBegin();
    }

    void OnMouseUp()
    {

        hasTouchBegin = false;
        TouchCapture.Instance.OnTouchEnd();

        var FirstTouchData = TouchCapture.Instance.Data[0];
        var startPos = FirstTouchData.WordPos;
        
        var EndTouchData = TouchCapture.Instance.Data[TouchCapture.Instance.Data.Count - 1];
        var endPos = EndTouchData.WordPos;

        var force = endPos - startPos;
        force.z = force.magnitude;
        force /= (EndTouchData.Time - FirstTouchData.Time);

        Debug.DrawLine(startPos, endPos, Color.red, 10);

        SpawnPrefab(force);
    }

    private void OnDrawGizmos()
    {
        foreach (var item in TouchCapture.Instance.Data)
        {
            Gizmos.DrawWireSphere(item.WordPos, 1);
        }
    }

    private void SpawnPrefab(Vector3 force)
    {
        Vector3 begin = transform.position;
        begin.y = 2;
        GameObject ball = (GameObject)GameObject.Instantiate(BallPrefab, begin, Quaternion.identity);
        ball.GetComponent<Rigidbody>().AddForce(force * InitForceStrength, ForceMode.Impulse);
    }

    // Update is called once per frame
    void Update ()
    {        if (IsTouchBegin())        {            OnMouseDown();        }
        else if (IsTouchEnd())
        {
            OnMouseUp();
        } else if(hasTouchBegin)
        {
            TouchCapture.Instance.OnTouchUpdate();
        }


        UpdateCrusor();
    }

    private void UpdateCrusor()
    {
        Crusor2d.transform.position =Input.mousePosition;
    }

    private static bool IsTouchEnd()
    {
        return Input.GetMouseButtonUp(0);
    }

    private static bool IsTouchBegin()
    {
        return Input.GetMouseButtonDown(0);
    }
}
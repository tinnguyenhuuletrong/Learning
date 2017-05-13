using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CircleController : MonoBehaviour {

    [SerializeField]
    private GameObject Circle;

    private Color currentColor;
    private float currentScale;
    private SpriteRenderer spriteRenderer;


    public Color color;
    public float size = 1.0f;

	// Use this for initialization
	void Start () {
        spriteRenderer = Circle.GetComponent<SpriteRenderer>();
        spriteRenderer.color = color;
        transform.localScale = Vector3.one * size;
        currentScale = size;
        currentColor = color;
	}

    // Update is called once per frame
    void Update()
    {

        if (!Mathf.Approximately(currentScale, size))
        {
            transform.localScale = Vector3.one * size;
            currentScale = size;
        }

        if (color != currentColor)
        {
            currentColor = color;
            spriteRenderer.color = color;
        }

    }

    public void SetAsMC() {
        gameObject.layer = LayerMask.NameToLayer("MC");
    }

    public void DestroyMe() {
        StartCoroutine(_ScaleDownToZeroAndDestroy());
    }

    IEnumerator _ScaleDownToZeroAndDestroy() {

        float duration = 0.25f;
        float t = 0;
        float beginScale = currentScale;

        while (t < duration)
        {
            t += Time.deltaTime;
            float progress = t / duration;

            size = Mathf.Lerp(beginScale, 0, progress);
            color.a = currentScale;

            yield return 0;
        }

        Destroy(gameObject);
        yield break;
    }

}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BackgroundColorChange : MonoBehaviour {

    public Color target;
    public float duration;

    private Color currentColor;
    private Camera gameCamera;
    private float progress;

	// Use this for initialization
	void Start () {
        gameCamera = GetComponent<Camera>();
        target = RandomColor();
        StartCoroutine(AutoChange());
	}

    Color RandomColor() {
        return Random.ColorHSV(0f, 0.3f, 0f, 0.3f, 0.0f, 0.3f);
    }
	

    IEnumerator AutoChange() {

        while(true) {
            yield return StartChange();
            target = RandomColor();
        }

    }

    IEnumerator StartChange() {
        progress = 0;

        currentColor = gameCamera.backgroundColor;
        while (progress < duration)
        {
            progress += Time.deltaTime;

            Color tmp = Color.Lerp(currentColor, target, progress);

            gameCamera.backgroundColor = tmp;

            yield return 0;
        }

        yield break;

    }
}

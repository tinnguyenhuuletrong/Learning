using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AreaController : MonoBehaviour {

    public float size;

	private IEnumerator coroutine;

	// Use this for initialization
	void Start () {
        gameObject.SetActive(false);
        transform.localScale = Vector3.one * size;
	}
	
    public void SyncPosition(Vector3 pos) {
        gameObject.transform.position = pos;
    }

    public bool OverlapCircle(CircleController tmp) {

        CircleCollider2D myCollider =  this.GetComponent<CircleCollider2D>();
        ContactFilter2D filter = new ContactFilter2D();
        filter.layerMask = LayerMask.GetMask("Character");

        Collider2D[] res = new Collider2D[5];
        int count = myCollider.OverlapCollider(filter, res);

        for (int i = 0; i < count; i++)
        {
            if (res[i].gameObject == tmp.gameObject)
                return true;
        }
        return false;
    }

    public void BeginScaleDown(float maxSize, float duration, Action onComplete) {
        gameObject.SetActive(true);

        if (coroutine != null)
            StopCoroutine(coroutine);

        coroutine = InternalScaleDown(maxSize * 2, duration, onComplete);
        StartCoroutine(coroutine);
    }

    public void StopScaleDown() {
        gameObject.SetActive(false);
		if (coroutine != null)
			StopCoroutine(coroutine);
    }

    IEnumerator InternalScaleDown(float maxSize, float duration, Action onComplete) {

        transform.localScale = Vector3.one * maxSize;
        size = maxSize;

        float t = 0;

        while(t <= duration) {

            t += Time.deltaTime;
            float dt = t / duration;

            size = Mathf.Lerp(maxSize, 0, dt);
            transform.localScale = Vector3.one * size;

			yield return 0;
        }

        transform.localScale = Vector3.zero;

		size = 0;
        if(onComplete != null) onComplete();

		gameObject.SetActive(false);

		yield break;
    }

}

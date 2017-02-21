using JUnityGameFramework;
using UnityEngine;

public class CollectItemParams {
	public string type;
}

public class Collectable : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void OnTriggerEnter2D(Collider2D other) {
        GameStateExample1 gameState = JInstanceManager.Get(typeof(GameStateExample1)) as GameStateExample1;
		JGameAction action = gameState.CreateAction("Collect");
		CollectItemParams tmp = new CollectItemParams();
		tmp.type = "coin";
		action.Params = tmp;

		gameState.AddAction(action);
		gameObject.SetActive(false);
    }
}

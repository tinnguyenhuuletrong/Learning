using JUnityGameFramework;
using UnityStandardAssets._2D;
using UnityEngine;

public class GameManagerExample1 : MonoBehaviour {

	private GameStateExample1 mGameState;

	public GameObject MC;

	public Vector3 DebugPos;
	public bool IsOnGround;

	// Use this for initialization
	void Start () {

		if(MC == null){
			GameObject[] tmp = GameObject.FindGameObjectsWithTag("Player");
			if(tmp.Length <= 0)
				return;	
			MC = tmp[0];
		}

		mGameState = new GameStateExample1();
		mGameState.RegisterReducer(new MCExample1Reducer(MC.GetComponent<Rigidbody2D>()));

		// Dependency Register
		JInstanceManager.Register(typeof(GameStateExample1), mGameState);
        JInstanceManager.Register(typeof(PlatformerCharacter2D), MC.GetComponent<PlatformerCharacter2D>());
       

	}
	
	// Update is called once per frame
	void FixedUpdate () {
		if(!MC) 
			return;
		
		this._SyncMC();

		mGameState.Update();
	}

	void LateUpdate() {
		// Debug
		DebugPos = mGameState.MCPosition;
		IsOnGround = mGameState.IsOnGround;
	}


	void _SyncMC() {
		PlatformerCharacter2D ins = JInstanceManager.Get(typeof(PlatformerCharacter2D)) as PlatformerCharacter2D;
		if(!ins)
			return;

		JGameAction action = mGameState.CreateAction("SyncMC");
		action.Params["isGround"] = ins.IsOnGround() ? "True" : "False";

		mGameState.AddAction(action);
	}
}

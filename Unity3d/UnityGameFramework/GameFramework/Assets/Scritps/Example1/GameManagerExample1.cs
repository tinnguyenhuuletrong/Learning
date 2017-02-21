using JUnityGameFramework;
using UnityStandardAssets._2D;
using UnityEngine;

public class MCStateParams {
	public bool isGround;
}

public class GameManagerExample1 : MonoBehaviour {

	private GameStateExample1 mGameState;

	public GameObject MC;

	public Vector3 DebugPos;
	public bool DebugIsOnGround;
	public int DebugCoin;

	private MCStateParams mcParam = new MCStateParams();

	// Use this for initialization
	void Start () {

		if(MC == null){
			GameObject[] tmp = GameObject.FindGameObjectsWithTag("Player");
			if(tmp.Length <= 0)
				return;	
			MC = tmp[0];
		}

		mGameState = new GameStateExample1();

		// Reducer
		mGameState.RegisterReducer(new MCExample1Reducer(MC.GetComponent<Rigidbody2D>()));

		// Middleware for checking game restart
		mGameState.RegisterMiddleware(new Example1GameResetMiddleware());

		// Dependency Register
		JInstanceManager.Register(typeof(GameStateExample1), mGameState);
        JInstanceManager.Register(typeof(PlatformerCharacter2D), MC.GetComponent<PlatformerCharacter2D>());
       
		mGameState.RegisterEvent(0, (obj) => {
			UnityEngine.SceneManagement.SceneManager.LoadScene(0);
		});
	}

	void Destroy() {
		JInstanceManager.Register(typeof(GameStateExample1), null);
        JInstanceManager.Register(typeof(PlatformerCharacter2D), null);
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
		DebugIsOnGround = mGameState.IsOnGround;
		DebugCoin = mGameState.Coin;
	}

	void _SyncMC() {
		PlatformerCharacter2D ins = JInstanceManager.Get(typeof(PlatformerCharacter2D)) as PlatformerCharacter2D;
		if(!ins)
			return;

		JGameAction action = mGameState.CreateAction("SyncMC");
		mcParam.isGround = ins.IsOnGround();
		action.Params = mcParam;

		mGameState.AddAction(action);
	}
}

using JUnityGameFramework;
using UnityEngine;

public class MCExample1Reducer : JGameLogicReducerBase {
    public Rigidbody2D MC { get; set; }

    public MCExample1Reducer(Rigidbody2D mc) {
        MC = mc;
    }
	
    public override bool OnAction(JGameAction action, JGameLogicStateBase currentState) {
        GameStateExample1 state = (GameStateExample1)currentState;
		
		switch(action.Name) {
			case "GameOver":
			{
				state.OnGameOver();
				return true;
			}
			case "SyncMC": 
			{
				if(!MC)
					return false;

				MCStateParams param = action.Params as MCStateParams;

				state.MCPosition = MC.gameObject.transform.position;
				state.IsOnGround = param.isGround;
				
				return true;
			}
		}

		return false;
	}


}
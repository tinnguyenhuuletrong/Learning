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
			case "SyncMC": 
			{
				if(!MC)
					return false;
				state.MCPosition = MC.gameObject.transform.position;
				state.IsOnGround = action.GetParamAsBool("isGround");
				
				return true;
			}
		}

		return false;
	}


}
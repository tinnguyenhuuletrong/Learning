using JUnityGameFramework;
using UnityEngine;

public class Example1GameResetMiddleware : JGameLogicMiddleware {

    public override bool PostStateHook(JGameLogicStateBase currentState) {

        GameStateExample1 state = currentState as GameStateExample1;
        if(!state.IsOnGround && state.MCPosition.y < -5) {

            JGameAction action = state.CreateAction("GameOver");
            state.AddAction(action);

            return false;
        }

        return true;
    }
}